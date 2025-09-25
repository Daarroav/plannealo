
-- Script para importar TODOS los alojamientos del respaldo de producción
-- Maneja conflictos y errores para maximizar la importación de datos

BEGIN;

-- Función temporal para manejar errores en arrays
DO $$ 
BEGIN
    -- Crear función temporal si no existe
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'safe_array_cast') THEN
        CREATE OR REPLACE FUNCTION safe_array_cast(input_text text)
        RETURNS text[] AS '
        BEGIN
            IF input_text IS NULL OR input_text = '''' THEN
                RETURN ARRAY[]::text[];
            END IF;
            
            -- Si ya es un array válido, convertir
            IF input_text LIKE ''{%}'' THEN
                RETURN input_text::text[];
            END IF;
            
            -- Si es un string simple, crear array con un elemento
            RETURN ARRAY[input_text];
        EXCEPTION
            WHEN OTHERS THEN
                RETURN ARRAY[]::text[];
        END;
        ' LANGUAGE plpgsql;
    END IF;
END $$;

-- Insertar TODOS los alojamientos de producción con manejo de errores
DO $$
DECLARE
    rec RECORD;
    error_count INTEGER := 0;
    success_count INTEGER := 0;
BEGIN
    -- Iterar sobre cada alojamiento del respaldo
    FOR rec IN 
        SELECT 
            'e53a3291-ba4d-4a6b-8123-cb7ea6f9bc18' as id, 'b9a2864e-c91c-491b-b3a8-8c24cab30c33' as travel_id, 'Hotel Xcaret México' as name, 'resort' as type, 'Cancún ' as location, '2025-08-31 21:00:00'::timestamp as check_in, '2025-09-10 17:00:00'::timestamp as check_out, '2 Doble' as room_type, '' as price, 'HJA187613' as confirmation_number, '' as policies, '' as notes, '/uploads/thumbnail-1756511253629-942434982.jpg' as thumbnail, NULL as attachments
        UNION ALL SELECT 'af6f876a-920b-4212-b8c3-49aa5db1a22c', 'd96a8593-bc27-4a93-86cc-513106594bc1', 'Steigenberger Nile Palace en Luxor', 'resort', 'Khaled Ben El-Waleed Street Gazirat Al Awameyah', '2025-09-05 02:00:00'::timestamp, '2025-09-10 17:00:00'::timestamp, '1 Doble', '$90,000.00', 'FGH23659752', 'Espacio para políticas de cancelación', 'Espacio para los detalles adicionales.', '/uploads/thumbnail-1756730703969-140152867.jpg', '{/uploads/attachments-1756730703971-468099612.pdf}'
        UNION ALL SELECT 'c8d17798-846b-4bb4-a592-72fadf9c36ac', 'dee026ed-e996-41ba-b2d0-11d839941d6b', 'Villa del Palmar Beach Resort & Spa Cabo San Lucas', 'resort', 'Cam. Viejo a San Jose Km 0.5, Tourist Corridor, El Médano, 23453 Cabo San Lucas, B.C.S.', '2025-09-14 21:00:00'::timestamp, '2025-09-22 17:00:00'::timestamp, '3 Doble', '$98,780.00', '1458754', 'Reservas Estándar\r\n\r\nLas cancelaciones realizadas con 72 horas o más antes de la fecha de llegada no generan cargos.\r\n\r\nSi la cancelación se realiza dentro de las 72 horas previas a la llegada, se cobrará el equivalente a 1 noche de estancia (incluidos impuestos y cargos aplicables).\r\n\r\nEn caso de no presentarse (no show), se cobrará el 100% de la primera noche.\r\n\r\nReservas No Reembolsables / Tarifas Promocionales\r\n\r\nEstas reservas no permiten cambios ni devoluciones.\r\n\r\nEn caso de cancelación, modificación o no presentarse, se cobrará el 100% del importe total de la estancia.\r\n\r\nModificaciones\r\n\r\nLas solicitudes de cambio de fecha estarán sujetas a disponibilidad y a la tarifa vigente al momento de la modificación.', 'El huésped debe presentar una identificación oficial vigente y la tarjeta de crédito utilizada para la reserva.\r\n\r\nEl check-in inicia a las 15:00 horas y el check-out es a las 12:00 horas.\r\n\r\nLlegadas anticipadas o salidas tardías están sujetas a disponibilidad y pueden generar cargos adicionales.', '/uploads/accommodations/thumbnail-1757689157048-624701306.jpg', '{/uploads/accommodations/attachments-1757689157049-737418975.pdf}'
        UNION ALL SELECT '3d359547-4790-4e56-80cc-609912e4c09e', 'dee026ed-e996-41ba-b2d0-11d839941d6b', 'AIRBNB La casa de espera', 'casa', 'Cd. de México', '2025-09-13 21:00:00'::timestamp, '2025-09-14 11:00:00'::timestamp, '4 Sencilla', '$6,500.00', 'FGH23659752', 'De acuerdo a lo que señale Airbnb.', 'Kits de bienvenida (agua embotellada, café y té de cortesía).', '/uploads/accommodations/thumbnail-1757689259216-790698279.jpg', '{}'
        UNION ALL SELECT '9731e5f9-5ace-41a2-a743-81ea430bfdc4', 'a995959b-d2b0-4592-b145-b650865a6086', 'Barcelo Budapest', 'hotel', 'Király Street 16, Budapest, 1061 Hungría', '2025-10-30 21:00:00'::timestamp, '2025-11-03 17:00:00'::timestamp, '3 Habitación Doble', '', '8940SF139414 / 8940SF139415 / 8940SF139416', '', '', '/uploads/thumbnail-1756825678351-4496713.jpeg', '{/uploads/attachments-1756766810793-733745491.pdf}'
        UNION ALL SELECT '92473dd5-cdea-4262-ac36-e532048c6dd5', 'a995959b-d2b0-4592-b145-b650865a6086', 'Les Jardins d''Eiffel', 'hotel', ' 8 Rue Amelie, Paris, 75007 Francia', '2025-10-26 21:00:00'::timestamp, '2025-10-30 17:00:00'::timestamp, '3 Habitación Doble', '', 'SZYDTP / SZYDT5 / SZYDTW', '', '', '/uploads/thumbnail-1756825747999-185751978.jpg', '{/uploads/attachments-1756766731026-713813299.pdf}'
        UNION ALL SELECT '071dcdf8-2623-4c6a-bcff-16ee48f178d3', 'c9537dc5-659a-4493-912b-78a053f28ecd', 'Barceló Guadalajara', 'hotel', 'Av de Las Rosas 2933, Rinconada del Bosque, 44530 Guadalajara,', '2025-12-22 21:00:00'::timestamp, '2025-12-29 17:00:00'::timestamp, '1 Sencilla', '', 'GTYHI986325', '', '', '/uploads/thumbnail-1757000668810-854984956.jpg', '{}'
        UNION ALL SELECT 'c81b50e3-a69d-4cbc-9b31-c81cd29159d4', 'd37e0f99-7cf3-4726-9ae0-ac43be22b18e', 'The Udaya Resorts and Spa', 'hotel', 'Jl. Sriwedari No 48B, Desa Tegallantang, Ubud, Bali, 80571 Indonesia', '2025-10-29 21:00:00'::timestamp, '2025-11-02 17:00:00'::timestamp, '1 Habitación Doble', '', '44413061', '', '', NULL, '{/uploads/attachments-1757460564379-443044613.pdf}'
        UNION ALL SELECT 'da49175b-f782-4731-89e5-9697ec982975', 'd37e0f99-7cf3-4726-9ae0-ac43be22b18e', 'New Blanc Central Myeongdong', 'hotel', '20 Changgyeonggung-ro, Jung-gu, Seoul, 04559 Corea del Sur', '2025-11-02 21:00:00'::timestamp, '2025-11-06 17:00:00'::timestamp, '1 Habitación Doble', '', 'H2502250808', '', '', NULL, '{/uploads/attachments-1757460665922-637195580.pdf}'
        UNION ALL SELECT '62fce019-5851-4ae7-ba11-a0f406e709a5', 'ef201789-8b34-4b7a-ae43-0ee527515e67', 'Montreal Marriott Chateau Champlain', 'resort', '1050 de la Gauchetiere West, Montreal, Quebec H3B 4C9 Canadá', '2025-12-07 21:00:00'::timestamp, '2025-12-28 17:00:00'::timestamp, '2 Sencilla', '', 'QWE986', 'Políticas de Cancelación y Modificación\r\n\r\nReservas Estándar\r\n\r\nLas cancelaciones realizadas con 72 horas o más antes de la fecha de llegada no generan cargos.\r\n\r\nSi la cancelación se realiza dentro de las 72 horas previas a la llegada, se cobrará el equivalente a 1 noche de estancia (incluidos impuestos y cargos aplicables).\r\n\r\nEn caso de no presentarse (no show), se cobrará el 100% de la primera noche.\r\n\r\nReservas No Reembolsables / Tarifas Promocionales\r\n\r\nEstas reservas no permiten cambios ni devoluciones.\r\n\r\nEn caso de cancelación, modificación o no presentarse, se cobrará el 100% del importe total de la estancia.\r\n\r\nReservas con Pago Anticipado\r\n\r\nAlgunas tarifas requieren pago completo al momento de la reserva.\r\n\r\nDicho pago no es reembolsable.\r\n\r\nEstancias Prolongadas o Grupos (5 habitaciones o más)\r\n\r\nLas cancelaciones deben hacerse con mínimo 14 días de anticipación.\r\n\r\nCancelaciones fuera de ese plazo tendrán un cargo del 50% de la estancia total.\r\n\r\nSalidas Anticipadas\r\n\r\nSi el huésped decide salir antes de la fecha confirmada, se aplicará un cargo equivalente a una noche adicional más las noches ya utilizadas.\r\n\r\nModificaciones\r\n\r\nLas solicitudes de cambio de fecha estarán sujetas a disponibilidad y a la tarifa vigente al momento de la modificación.\r\n\r\nFuerza Mayor\r\n\r\nEn casos excepcionales (ej. desastres naturales, emergencias sanitarias internacionales, restricciones de viaje gubernamentales), el hotel podrá ofrecer reprogramación o crédito para una futura estancia, sin cargos adicionales.', 'Amenidades Especiales\r\n\r\nHabitaciones con vista al mar o a la ciudad (sujeto a disponibilidad).\r\n\r\nKits de bienvenida (agua embotellada, café y té de cortesía).\r\n\r\nProductos de baño premium y batas de cortesía.\r\n\r\nAcceso gratuito al spa en determinados horarios.\r\n\r\nServicio de transporte a puntos turísticos locales (en horarios establecidos).', '/uploads/thumbnail-1757541343245-666860989.jpg', '{/uploads/attachments-1757541343246-632964986.jpg}'
        UNION ALL SELECT 'bdb7b6b1-077c-47c0-ac8c-af5420ef7839', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'Premier Inn Berlin Alexanderplatz', 'hotel', 'Theanolte-Bähnisch-Straße 2, Berlin, 10178 Alemania', '2025-10-18 21:00:00'::timestamp, '2025-10-20 17:00:00'::timestamp, '1 Doble estandar', '', '2481055762', '', '', '', '{/uploads/accommodations/attachments-1758593283241-808469147.pdf}'
        UNION ALL SELECT '0b3bebba-817d-4682-8288-aeeeb9908e8b', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'Barceló Hamburg', 'hotel', 'Ferdinandstrasse 15, Hamburg Altsadt, Hamburg, HH, 20095 Alemania', '2025-10-15 21:00:00'::timestamp, '2025-10-18 17:00:00'::timestamp, '1 superior', '', '7402SF239779', '', '', '', '{/uploads/accommodations/attachments-1758593258038-718595533.pdf}'
        UNION ALL SELECT 'e0be4971-3cc5-45df-aaaa-7420fe2553b6', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'Premier Inn Köln City Süd', 'hotel', 'Perlengraben 2, Cologne, 50676 Alemania', '2025-10-14 21:00:00'::timestamp, '2025-10-15 17:00:00'::timestamp, '1 Doble estandar', '', '2481055560', '', '', '', '{/uploads/accommodations/attachments-1758593205345-721509349.pdf}'
        UNION ALL SELECT '0873a713-ccee-425c-acd5-e21fe37b2483', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'Eurostars Book Hotel', 'hotel', 'Schwanthalerstrasse 44, Munich, BY, 80336 Alemania', '2025-10-20 21:00:00'::timestamp, '2025-10-22 17:00:00'::timestamp, '1 estándar', '', '73236999444685', '', '', '', '{/uploads/accommodations/attachments-1758593296660-845854954.pdf}'
        UNION ALL SELECT '3d338741-a0a0-4287-8f96-dcdb7b5266fc', '2660e785-54d9-4cfa-b9da-b92933c7eb2d', 'Catalonia Berlin Mitte', 'hotel', 'Köpenicker Str. 80-82, Berlin, BE, 10179 Alemania', '2025-09-19 03:30:00'::timestamp, '2025-09-22 18:00:00'::timestamp, '1 Doble', 'MXN $40,714', '407884186 - 407884187', 'Cancelaciones y cambios\r\nComprendemos que a veces los planes cambian. Por lo tanto, no cobramos cargos por cambios ni cancelaciones.\r\nCuando la propiedad cobre dichos cargos conforme a sus políticas, se te transferirá el costo. Catalonia Berlin Mitte\r\ncobra los siguientes cargos por cancelaciones y cambios:\r\nCancelación gratuita hasta el 17 sept. 2025, 00:01 (hora local de la propiedad)\r\nNo hay cargos por cancelaciones efectuadas antes de las 00:01 (hora local de la propiedad) del 17 de septiembre de\r\n2025.\r\nLas cancelaciones o los cambios efectuados después de las 00:01 (hora local de la propiedad) del 17 de septiembre\r\nde 2025 o las personas que no se presenten al check-in están sujetos a un cargo de la propiedad equivalente a la\r\ntarifa de la primera noche, más impuestos y cargos.\r\nEn caso de realizar una reservación conjunta de varias habitaciones o unidades, se aplicarán los cargos de la\r\npropiedad para cada habitación que se cambie o cancele.\r\nPrecios y pago\r\nCARGOS DE LA PROPIEDAD: El precio NO incluye cargos por servicios de la propiedad, servicios opcionales (ej.,\r\nconsumos del minibar o llamadas telefónicas) ni cargos reglamentarios. La propiedad cobrará estos costos y cargos\r\nadicionales al momento de hacer el check-out.\r\nPAGO: Al momento de la compra, se cargará el costo total a tu tarjeta de crédito. Los precios y la disponibilidad de las\r\nhabitaciones o unidades se garantizan hasta que se reciba la totalidad del pago.\r\nCargos por huéspedes y capacidad de las habitaciones\r\nLa tarifa base es para 2 huéspedes.\r\nEste hotel considera como adultos a los huéspedes de cualquier edad.\r\nNo se garantiza disponibilidad de hospedaje en la misma propiedad para huéspedes adicionales.\r\nConfirmación de la habitación\r\nAlgunas propiedades solicitan esperar hasta los 7 días anteriores al check-in para enviar los nombres de los\r\nhuéspedes. En tal caso, tu habitación o unidad está reservada; sin embargo, tu nombre no figura todavía en los\r\narchivos de la propiedad.\r\n', 'Check-in\r\nHora de inicio de check-in: 15:00\r\nHora de finalización de check-in: 00:00\r\nLa edad mínima para hacer el check-in es: 18\r\nSi piensas llegar tarde, comunícate directamente a la propiedad para obtener información sobre su política de checkin posterior al horario previsto.\r\nCheck-out\r\nHora del check-out: 12:00\r\n', '/uploads/accommodations/thumbnail-1757706485273-759909122.jpg', '{/uploads/accommodations/attachments-1757706485274-775836896.pdf}'
        UNION ALL SELECT '7a271fc6-35f3-4804-8b62-ad35eb646f8a', 'f64d175b-b070-4a6c-b8b3-ec9ae5fd7207', 'Catalonia Berlin Mitte', 'hotel', 'Köpenicker Str. 80-82, Berlin, BE, 10179 Alemania', '2025-09-19 03:30:00'::timestamp, '2025-09-22 18:00:00'::timestamp, '2 Sencilla', '40714', '407884186 - 407884187', 'Check-in\r\nHora de inicio de check-in: 15:00\r\nHora de finalización de check-in: 00:00\r\nLa edad mínima para hacer el check-in es: 18\r\nSi piensas llegar tarde, comunícate directamente a la propiedad para obtener información sobre su política de checkin posterior al horario previsto.\r\nCheck-out\r\nHora del check-out: 12:00\r\n\r\nCancelaciones y cambios\r\nComprendemos que a veces los planes cambian. Por lo tanto, no cobramos cargos por cambios ni cancelaciones.\r\nCuando la propiedad cobre dichos cargos conforme a sus políticas, se te transferirá el costo. Catalonia Berlin Mitte\r\ncobra los siguientes cargos por cancelaciones y cambios:\r\nCancelación gratuita hasta el 17 sept. 2025, 00:01 (hora local de la propiedad)\r\nNo hay cargos por cancelaciones efectuadas antes de las 00:01 (hora local de la propiedad) del 17 de septiembre de\r\n2025.\r\nLas cancelaciones o los cambios efectuados después de las 00:01 (hora local de la propiedad) del 17 de septiembre\r\nde 2025 o las personas que no se presenten al check-in están sujetos a un cargo de la propiedad equivalente a la\r\ntarifa de la primera noche, más impuestos y cargos.\r\nEn caso de realizar una reservación conjunta de varias habitaciones o unidades, se aplicarán los cargos de la\r\npropiedad para cada habitación que se cambie o cancele.\r\n\r\n\r\n', 'Se cobrará un impuesto local o municipal del 8.025 %.\r\nIncluimos todos los cargos de los cuales nos informó la propiedad.\r\n', '/uploads/accommodations/thumbnail-1757803677038-15844210.png', '{/uploads/accommodations/attachments-1757803677047-870962673.pdf}'
        UNION ALL SELECT '767ad756-69d1-47ca-8669-f35c9de06ee9', 'd2e13f1c-5e2c-42a6-a0b3-0033688b68cf', 'María Dolores Río verde', 'hotel', 'Rioverde 568', '2025-09-23 22:30:00'::timestamp, '2025-10-04 17:00:00'::timestamp, '2 Doble', '12000', '164623147846', '', '', '/uploads/accommodations/thumbnail-1757964399706-692550820.jpeg', '{/uploads/accommodations/attachments-1757964399706-619344550.jpg}'
        UNION ALL SELECT 'f5aa18c2-51e0-4dbd-8609-82c0d71ee763', 'f64d175b-b070-4a6c-b8b3-ec9ae5fd7207', 'Gioberti Hotel', 'hotel', 'Via Gioberti, 20 Rome, 00185, Italy', '2025-09-22 18:00:00'::timestamp, '2025-09-25 18:00:00'::timestamp, '2 Sencilla', '', '2154117172 - 2154117176', 'Check-in\r\nHora de inicio de check-in: 14:00\r\nHora de finalización de check-in: 00:30\r\nLa edad mínima para hacer el check-in es: 18', 'Si piensas llegar tarde, comunícate directamente a la propiedad para obtener información sobre su política de checkin posterior al horario previsto.', '/uploads/accommodations/thumbnail-1757804346243-862802071.png', '{/uploads/accommodations/attachments-1757804346243-660467176.pdf}'
        UNION ALL SELECT '42519b8b-3bfa-4200-8fd0-ac05322ce17f', 'f64d175b-b070-4a6c-b8b3-ec9ae5fd7207', 'AIRBNB', 'casa', 'No aplica', '2025-09-25 21:00:00'::timestamp, '2025-09-28 18:00:00'::timestamp, '1 Sencilla', '', 'gestionada por el cliente', '', '', NULL, '{}'
        UNION ALL SELECT 'a9750f47-8243-42fe-ba54-b41ba36597b1', '0901b373-d2bd-436e-8384-6041e252fb01', 'Hotel Riu Plaza España', 'hotel', 'Gran Vía 84, Madrid, Madrid, España', '2025-10-02 21:00:00'::timestamp, '2025-10-05 18:00:00'::timestamp, '2 Sencilla', '30000', '33808260 - 33808261', 'Puede aplicarse un recargo por cada persona adicional, según la política del alojamiento.\r\nA tu llegada, pueden pedirte un documento de identidad oficial con foto y una tarjeta de crédito o débito, o\r\nun depósito en efectivo, para cubrir los gastos imprevistos.\r\nNo se garantizan las solicitudes especiales, que están sujetas a disponibilidad en el momento de la\r\nllegada y pueden suponer un recargo adicional.\r\nEste alojamiento acepta tarjetas de crédito, tarjetas de débito y efectivo.\r\nEste alojamiento se reserva el derecho a efectuar una autorización de la tarjeta de crédito del huésped\r\nprevia a la llegada.\r\nTransacciones sin efectivo disponibles\r\nEste alojamiento utiliza energía eólica.\r\nEntre los elementos de seguridad de este alojamiento, se incluyen los siguientes: extintor, sistema de\r\nseguridad, botiquín de primeros auxilios, barreras de seguridad en las ventanas y iluminación exterior.\r\nEl alojamiento afirma que sigue las medidas de limpieza y desinfección de Covid-19 Protocolo Sanitario\r\n(RIU).\r\nLas normas culturales y las políticas para huéspedes pueden variar según el país y el alojamiento, que es\r\nel que dicta las políticas que aquí se muestran.\r\n', 'Desayuno tipo bufé: 30 EUR por adulto y 10 EUR por menor (precio aproximado)\r\nAparcamiento en las inmediaciones: 32.5 EUR por noche (ubicado a 1448 m)\r\n', '/uploads/accommodations/thumbnail-1757960733098-448481867.jpeg', '{}'
        UNION ALL SELECT '2457bcc4-3da2-4d96-99ea-1b3b7aeeee3d', '73fdb531-9e28-4a7f-b199-396f20990d02', 'Catalonia Berlin Mitte', 'hotel', 'Köpenicker Str. 80-82, Berlin, BE, 10179 Alemania', '2025-09-19 03:30:00'::timestamp, '2025-09-22 18:00:00'::timestamp, '2 Doble', '20000', '407884186 - 407884187', 'Hora de inicio de check-in: 15:00\r\nHora de finalización de check-in: 00:00\r\nLa edad mínima para hacer el check-in es: 18\r\nSi piensas llegar tarde, comunícate directamente a la propiedad para obtener información sobre su política de checkin posterior al horario previsto.\r\nCheck-out\r\nHora del check-out: 12:00\r\n', 'argos a pagar en la propiedad\r\nDeberás pagar los siguientes cargos en la propiedad, que podrían incluir los impuestos aplicables:\r\nSe cobrará un impuesto local o municipal del 8.025 %.\r\nIncluimos todos los cargos de los cuales nos informó la propiedad.\r\nEl precio NO incluye cargos por servicios de la propiedad, servicios opcionales (ej., consumos del minibar o llamadas\r\ntelefónicas) ni cargos reg', '/uploads/accommodations/thumbnail-1757971426257-198448405.jpeg', '{/uploads/accommodations/attachments-1757971426258-364262096.pdf}'
        UNION ALL SELECT 'ac9707d7-972b-47d1-abd8-747581258c94', '73fdb531-9e28-4a7f-b199-396f20990d02', 'Gioberti Hotel', 'hotel', 'Via Gioberti, 20 Rome, 00185, Italy', '2025-09-22 18:00:00'::timestamp, '2025-09-25 18:00:00'::timestamp, '1 Sencilla', '', '2154117176', 'DÓNDE COMER / PROBAR\r\nPasta e Vino Osteria (cocina romana tradicional, cerca del Coliseo).\r\nRoscioli (pasta y productos gourmet, cerca de Campo de'' Fiori).\r\nArmando al Pantheon (cocina romana auténtica).\r\nTonnarello (Trastevere, famoso por pasta fresca).\r\nGiolitti (gelato clásico cerca del Panteón).\r\nLa Prosciutteria (tablas de embutidos y vino).', '', '', '{}'
        UNION ALL SELECT 'd35ffcf6-de44-47ac-bceb-fda7d7e9a9b2', '8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2', 'Royal Ariston', 'hotel', 'Kardinala Stepnica 31b, Dubrovnik, Dubrovnik-Neretva, Croacia', '2025-10-24 22:00:00'::timestamp, '2025-09-27 17:00:00'::timestamp, '1 Habitación Doble', '', '266-2889362', '', '', NULL, '{/uploads/accommodations/attachments-1758588525068-938704263.pdf}'
        UNION ALL SELECT 'ea6f7491-70a3-43f3-b9cf-32954f73c0f5', '8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2', 'AC Hotel Venezia', 'hotel', 'Rio Tera Sant''Andrea 466 Venezia, Italia', '2025-10-20 21:00:00'::timestamp, '2025-09-21 17:00:00'::timestamp, '1 Habitación Doble', '', '', '', '', NULL, '{}'
        UNION ALL SELECT '5c87b65a-ab3b-4bfe-93a0-6be0beb2ce35', '8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2', 'AC Hotel Firenze', 'hotel', 'Via Luciano Bausi, 5 Florencia, Italia', '2025-10-18 21:00:00'::timestamp, '2025-09-20 17:00:00'::timestamp, '1 Habitación Doble', '', '', '', '', NULL, '{}'
        UNION ALL SELECT '5ba5cbac-0b08-44da-9325-c1189c8c05d9', '8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2', 'Residence Inn by Marriott Sarajevo', 'hotel', 'Skenderija 43 Sarajevo, Bosnia-Herzegovina', '2025-10-27 21:00:00'::timestamp, '2025-10-29 17:00:00'::timestamp, '1 Habitación Doble', '', '', '', '', NULL, '{}'
        UNION ALL SELECT '840032d4-8023-474b-b3cb-a3f53ae40d66', '8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2', 'AC Hotel Clodio Roma', 'hotel', 'Via di Santa Lucia 10 Rome, Italia', '2025-10-15 21:00:00'::timestamp, '2025-10-18 17:00:00'::timestamp, '1 Habitación Doble', '', '', '', '', NULL, '{}'
        UNION ALL SELECT '125523ea-f0a4-4521-a153-c0449626344e', '8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2', 'AC Hotel Split', 'hotel', 'Domovinskog Rata 61A Split, Croacia', '2025-10-21 21:00:00'::timestamp, '2025-10-24 17:00:00'::timestamp, '1 Habitación Doble', '', '', '', '', NULL, '{}'
        UNION ALL SELECT '1dd92dc2-1e50-40fc-8f00-0e64b55da3b3', '71e3bd75-ae49-49ca-ba05-97850d04e385', 'Prueba de Hotel', 'hotel', 'Cancún', '2025-09-29 21:00:00'::timestamp, '2025-10-03 17:00:00'::timestamp, '1 Sencilla', '20000', 'Pruebaa155', 'PRUEBA', 'PRUEBA', '', '{/uploads/accommodations/attachments-1758642952768-871712180.pdf,/uploads/accommodations/attachments-1758642952768-874431346.jpg}'
        UNION ALL SELECT '2d4c268c-964d-47b4-8e64-3979750fdc87', 'df478a23-1e35-4405-b0d5-7c2601cb399d', 'Xelena Hotel & Suites', 'hotel', 'René Favaloro 3500, El Calafate, Santa Cruz, Argentina', '2025-10-04 21:00:00'::timestamp, '2025-10-07 17:00:00'::timestamp, '1 estándar', '', '#249-3345567', '', '', NULL, '{/uploads/accommodations/attachments-1758665942820-66803916.pdf}'
        UNION ALL SELECT 'b99abdda-7224-4e1d-be88-70435daf92f5', 'df478a23-1e35-4405-b0d5-7c2601cb399d', 'Argentino Hotel', 'hotel', 'Espejo 455, Mendoza, Mendoza, Argentina', '2025-10-13 21:00:00'::timestamp, '2025-10-16 17:00:00'::timestamp, '1 estándar', '', '#249-3341932', '', '', NULL, '{/uploads/accommodations/attachments-1758666090733-973973912.pdf}'
        UNION ALL SELECT '717bcf41-ffb0-419c-a0ba-34253998e4bb', 'df478a23-1e35-4405-b0d5-7c2601cb399d', 'NH City Buenos Aires', 'hotel', 'Bolívar 160, Buenos Aires, Buenos Aires, Argentina', '2025-10-08 04:00:00'::timestamp, '2025-10-13 17:00:00'::timestamp, '1 estándar', '', '#2278092273', '', '', '', '{/uploads/accommodations/attachments-1758668279561-706844228.pdf}'
    
    LOOP
        BEGIN
            -- Intentar insertar cada registro individualmente
            INSERT INTO accommodations (
                id, travel_id, name, type, location, check_in, check_out, 
                room_type, price, confirmation_number, policies, notes, 
                thumbnail, attachments
            ) VALUES (
                rec.id,
                rec.travel_id,
                rec.name,
                rec.type,
                rec.location,
                rec.check_in,
                rec.check_out,
                rec.room_type,
                COALESCE(rec.price, ''),
                COALESCE(rec.confirmation_number, ''),
                COALESCE(rec.policies, ''),
                COALESCE(rec.notes, ''),
                rec.thumbnail,
                CASE 
                    WHEN rec.attachments IS NULL THEN ARRAY[]::text[]
                    WHEN rec.attachments = '{}' THEN ARRAY[]::text[]
                    ELSE safe_array_cast(rec.attachments)
                END
            ) ON CONFLICT (id) DO UPDATE SET
                travel_id = EXCLUDED.travel_id,
                name = EXCLUDED.name,
                type = EXCLUDED.type,
                location = EXCLUDED.location,
                check_in = EXCLUDED.check_in,
                check_out = EXCLUDED.check_out,
                room_type = EXCLUDED.room_type,
                price = EXCLUDED.price,
                confirmation_number = EXCLUDED.confirmation_number,
                policies = EXCLUDED.policies,
                notes = EXCLUDED.notes,
                thumbnail = EXCLUDED.thumbnail,
                attachments = EXCLUDED.attachments;
                
            success_count := success_count + 1;
            
        EXCEPTION
            WHEN OTHERS THEN
                -- Registrar el error pero continuar
                error_count := error_count + 1;
                RAISE NOTICE 'Error al insertar alojamiento %: %', rec.id, SQLERRM;
        END;
    END LOOP;
    
    -- Mostrar resumen
    RAISE NOTICE 'Importación completada: % éxitos, % errores', success_count, error_count;
END $$;

-- Limpiar función temporal
DROP FUNCTION IF EXISTS safe_array_cast(text);

-- Verificar resultados
SELECT 
    'RESUMEN DE IMPORTACIÓN' as categoria,
    '' as detalle,
    COUNT(*)::text as cantidad
FROM accommodations
UNION ALL
SELECT 
    'ALOJAMIENTOS POR VIAJE',
    t.name,
    COUNT(a.id)::text
FROM travels t
LEFT JOIN accommodations a ON t.id = a.travel_id
GROUP BY t.id, t.name
ORDER BY categoria, detalle;

COMMIT;
