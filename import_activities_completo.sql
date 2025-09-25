
-- Script para importar TODAS las actividades de datos_produccion.sql
-- Maneja conflictos omitiendo duplicados para preservar información existente

BEGIN;

-- Insertar TODAS las actividades del respaldo de producción
INSERT INTO activities (id, travel_id, name, type, provider, date, start_time, end_time, confirmation_number, conditions, notes, contact_name, contact_phone, place_start, place_end, attachments) VALUES
-- Actividades existentes en el respaldo
('afee4eb7-94d4-4c9f-a9c8-e96d6ab8ea0d', 'b9a2864e-c91c-491b-b3a8-8c24cab30c33', 'Spa Cenotes', 'spa', 'Xcaret', '2025-09-02 15:50:00', '09:50', '10:00', '658822', '', 'Contacto: Andrés - Tel: 4598326269
Ubicación inicio: Hotel
Ubicación fin: Hotel', NULL, NULL, NULL, NULL, NULL),
('7ec19d30-deca-4f2b-9563-41a6a72eb51d', 'b9a2864e-c91c-491b-b3a8-8c24cab30c33', 'Cena en Xe''Ha''', 'evento', 'Xcaret México', '2025-09-07 15:00:00', '09:00', '11:00', 'ACTE2986', '', 'Contacto: Fernanda Bueno - Tel: 98757245
Ubicación inicio: No aplica
Ubicación fin: No aplica', NULL, NULL, NULL, NULL, NULL),
('c17dfc8e-caea-4147-989b-21dcc2481a40', 'b9a2864e-c91c-491b-b3a8-8c24cab30c33', 'Cenotes de Playa del Carmen', 'tour', 'Xcaret', '2025-09-03 13:00:00', '07:00', '05:00', 'ACT238563480', 'No incluye políticas de cancelación.', 'Contacto: Fernanda Bueno - Tel: 2324976008
Ubicación inicio: Lobby hotel
Ubicación fin: Libby Hotel
Protector solar biodegradable.', NULL, NULL, NULL, NULL, NULL),
('9e5b386c-07d7-45b0-9913-050c5897b39c', 'd96a8593-bc27-4a93-86cc-513106594bc1', 'Piramides de Giza de Keops, Kefrén y Micerinos', 'excursion', 'ToursNilo', '2025-09-06 12:00:00', '06:00', '23:59', 'ACT983157', 'Espacio para las condiciones y términos.', 'Contacto: Jorge N. - Tel: 9862751667
Ubicación inicio: Lobby del hotel
Ubicación fin: Lobby del hotel
Espacio para notas adicionales.', NULL, NULL, NULL, NULL, NULL),
('d5f32bed-9f5b-4fe0-9239-b9349e8a9d24', 'd96a8593-bc27-4a93-86cc-513106594bc1', 'Pirámide Escalonada de Zoser', 'excursion', 'TourNilo', '2025-09-08 12:00:00', '06:00', '23:59', 'ACT922623', 'Espacio para condiciones y términos.', 'Contacto: Jorge N. - Tel: 34542186
Ubicación inicio: Hotel
Ubicación fin: Hotel
Espacio para notas adicionales.', NULL, NULL, NULL, NULL, NULL),
('fa30488c-9af8-4af6-8391-73826d429b8b', 'a995959b-d2b0-4592-b145-b650865a6086', 'VISITA GUIADA POR EL PARLAMENTO DE BUDAPEST EN ESPAÑOL', 'tour', 'Paseando Por Europa (Budapest)', '2025-11-01 15:45:00', '09:45', '11:00', 'A33255123', '', '- Tel: +34 644 45 08 26
Ubicación inicio: Plaza Kossuth Lajos tér.', NULL, NULL, NULL, NULL, NULL),
('4857e448-7f4c-4b34-81a3-d9af37b5105f', 'd37e0f99-7cf3-4726-9ae0-ac43be22b18e', 'Monte Fuji, lago Ashi y Kamakura - Tour en español', 'excursion', 'Amigo Tours Japan', '2025-11-16 13:00:00', '07:00', '18:30', '288956218', '', '- Tel: 81120587697
Ubicación inicio: Centro comercial Ginza Inz 2.', NULL, NULL, NULL, NULL, NULL),
('43c6eb41-8153-4573-9ee0-0670a713428f', 'd37e0f99-7cf3-4726-9ae0-ac43be22b18e', 'Nara y Uji - Tour con comida', 'excursion', 'DOA JAOAN/Japan Panoramic Tours', '2025-11-11 13:50:00', '07:50', '16:00', '286587', '', '- Tel: 03-6279-2977
Ubicación inicio: 31 Nishi-Sanno Cho.', NULL, NULL, NULL, NULL, NULL),
('9dbf42e9-3734-461e-b285-bdc6612af5a3', 'a995959b-d2b0-4592-b145-b650865a6086', 'TOUR PRIVADO BUDAPEST', 'tour', 'Csabatoth', '2025-10-31 16:30:00', '10:30', '14:30', 'A33255119', '', '- Tel: 0036307295840
Ubicación inicio: HOTEL BARCELO', NULL, NULL, NULL, NULL, NULL),
('996ee1f5-7cbf-4451-ac94-a1886f33da66', 'a995959b-d2b0-4592-b145-b650865a6086', 'VERSALLES', 'recorrido', 'Chateau de Versailles', '2025-10-28 16:30:00', '10:30', '14:00', '', '', 'Ubicación inicio: PALACIO DE VERSALLES', NULL, NULL, NULL, NULL, NULL),
('ac9ba7d8-c927-49ad-ab70-8b0736abd834', 'a995959b-d2b0-4592-b145-b650865a6086', 'PASEO EN BARCO POR EL DANUBIO AL ANOCHECER', 'paseo', 'Legenda Sightseeing Boats', '2025-10-31 22:40:00', '16:40', '17:40', '210268', '', '- Tel: (+36) 1 317 22 03
Ubicación inicio: Vigadó tér 7.
Durante el paseo en barco navegaremos por el Danubio desde el Puente Petőfi hasta el primer puente de Isla Margarita, recorriendo Budapest en su totalidad.

Pasaremos por debajo de los puentes más grandiosos de la ciudad: el Puente de las Cadenas, el Puente de Isabel y el Puente de la Libertad y disfrutaremos de las vistas de ambas orillas, conociendo los principales edificios de Buda y de Pest.

Algunos de los edificios mejor iluminados son el Parlamento de Budapest, el Hotel Gellert, el Castillo de Buda, el Bastión de los Pescadores y la Iglesia Matías.

Durante todo el recorrido disfrutaréis de los comentarios de una audioguía en español. También se incluye una bebida a elegir entre champán, vino, cerveza, refresco o agua.

Incluido
-Paseo en barco de 1 hora.
-Audioguía individual con comentarios en español.
-Bebida a elegir entre champán, vino, cerveza, refrescos o agua.
-Wifi gratuito.', NULL, NULL, NULL, NULL, NULL),
('e3d6b844-6d05-4c6e-9d2d-06fadac07cb4', 'c9537dc5-659a-4493-912b-78a053f28ecd', 'Recorrido por Guachimontones', 'excursion', 'Experiencias Guadalajara', '2025-12-26 15:00:00', '09:00', '15:00', 'ACT6565', '', 'Contacto: Karla - Tel: 34542186
Ubicación inicio: Hotel
Ubicación fin: Hotel', NULL, NULL, NULL, NULL, NULL),
('44f05274-bda7-4c14-9eda-37a17db0be92', 'c9537dc5-659a-4493-912b-78a053f28ecd', 'Cena Navideña en el ex convento del Carmen', 'restaurante', 'Experiencias Guadalajara', '2025-12-25 03:00:00', '21:00', '02:00', 'ACT7874', '', 'Contacto: Karla - Tel: 34542186
Ubicación inicio: Hotel
Ubicación fin: Hotel', NULL, NULL, NULL, NULL, NULL),
('a49e239c-6552-4824-ae56-9e8e7d5cdbf5', 'a995959b-d2b0-4592-b145-b650865a6086', 'PASEO PANORAMICO POR EL RIO SENA CON CENA', 'paseo', 'Paris en scène', '2025-10-28 01:15:00', '19:15', '21:00', '836046', '', '- Tel: +330141419070
Ubicación inicio: Île aux Cygnes, 75015 Paris, France', NULL, NULL, NULL, NULL, NULL),
('855eb73a-44d8-463e-87b2-b31469e3abea', 'd37e0f99-7cf3-4726-9ae0-ac43be22b18e', 'Visita guiada por Osaka y su Castillo - Tour en español', 'tour', 'BenzaitenTours', '2025-11-08 17:00:00', '11:00', '17:00', 'A31211381', '', '- Tel: +8108062497750
Ubicación inicio: Estación Morinomiya, salida 3-B', NULL, NULL, NULL, NULL, NULL),
('28c3d3cd-5d2c-4a70-8b24-7560598697e9', 'c9537dc5-659a-4493-912b-78a053f28ecd', 'Escapada a Tlaquepaque', 'recorrido', 'Experiencias Guadalajara', '2025-12-23 16:00:00', '10:00', '18:00', 'ACT789652', 'Este es un ejemplo para señalar las condiciones y términos se visualiza de forma diferente en el itinerario final.', 'Ubicación inicio: No deja la información 
Ubicación inicio: Hotel
Ubicación fin: Hotel
Contacto: Karla - Tel: 34542186
Ubicación inicio: Lobby del hotel
Ubicación fin: Lobby del hotel', NULL, NULL, NULL, NULL, NULL),
('a586eae4-180a-4071-9ecc-6620e82920df', 'c1907a9d-4be8-4e5f-accd-1dbf102f4d83', 'Entradas al Museo del Futuro', 'otro', 'Priohub', '2025-10-31 16:30:00', '10:30', '12:30', '175253924226147', 'Les recomendamos llegar al menos con 30 minutos de antelación.', 'Ubicación inicio: Sheikh Zayed Rd - Trade Centre - Trade Centre 2 - Dubai
Ubicación inicio: Sheikh Zayed Rd - Trade Centre - Trade Centre 2 - Dubai - Emiratos Árabes Unidos.', NULL, NULL, NULL, NULL, NULL),
('418228ce-3879-439e-beeb-e483ab35d71c', 'd37e0f99-7cf3-4726-9ae0-ac43be22b18e', 'Tour privado por Ubud y el centro de Bali - Tour privado en español', 'tour', 'Bali Viaje', '2025-10-31 14:30:00', '08:30', '18:30', 'A31207306', '', '- Tel: +6282144156108
Ubicación inicio: RECOGIDA EN HOTEL
Ubicación fin: TERMINA EN HOTEL', NULL, NULL, NULL, NULL, NULL),
('691ea5d3-67ef-453c-a36b-5e15733a4d36', 'd37e0f99-7cf3-4726-9ae0-ac43be22b18e', 'Tour de Kioto al completo con entradas - Tour en español', 'tour', 'Amigo Tours Japan', '2025-11-10 13:00:00', '07:00', '18:00', '288955490', '', '- Tel: 81120587697
Ubicación inicio: Hotel Keihan Kyoto.', NULL, NULL, NULL, NULL, NULL),
('91f2ff37-99dd-4b44-b3f0-3460e6178d48', 'c1907a9d-4be8-4e5f-accd-1dbf102f4d83', 'Entradas al Burj Khalifa', 'otro', 'Burj Khalifa (Emaar)', '2025-11-01 00:30:00', '18:30', '20:30', 'ATT-8825079', 'Les recomendamos llegar 30 minutos antes de la hora seleccionada.', 'Ubicación inicio: centro comercial Dubai Mall (entrada por la Fashion Avenue).', NULL, NULL, NULL, NULL, NULL),
('3247b306-b399-472d-900d-fc87f8daf07e', 'd37e0f99-7cf3-4726-9ae0-ac43be22b18e', 'Tour de Tokio al completo - Tour con comida', 'tour', 'Amigo Tours Japan GK', '2025-11-14 14:00:00', '08:00', '18:00', '288955997', '', '- Tel: 81120587697
Ubicación inicio: Plaza Hachiko.', NULL, NULL, NULL, NULL, NULL),
('2e89d7ef-2e9e-4798-8f1a-55d115d498cd', 'c1907a9d-4be8-4e5f-accd-1dbf102f4d83', 'Tour de Dubái + Desert Safari', 'tour', 'OceanAir Travels', '2025-11-01 14:00:00', '08:00', '21:00', 'A32145959', '', 'Ubicación inicio: Rove Downtown Hotel', NULL, NULL, NULL, NULL, NULL),
('f495db58-5453-4471-87a4-1963133bb55d', 'c1907a9d-4be8-4e5f-accd-1dbf102f4d83', 'Entradas Jardín de Mariposas', 'otro', '', '2025-11-02 15:00:00', '09:00', '11:00', '27005471', 'HORA DE INICIO PLENAMENTE INDICATIVA, LOS JARDINES ABREN DESDE LAS 9AM', 'Ubicación inicio: Jardín de las mariposas', NULL, NULL, NULL, NULL, NULL),
('8991f013-d2f2-49c2-aea8-0c33b73c4b3e', 'c1907a9d-4be8-4e5f-accd-1dbf102f4d83', 'Entrada al Dubai Frame', 'otro', 'Be My Guest', '2025-11-03 15:00:00', '09:00', '21:00', 'KLGTZWK', 'LA HORA DE INICIO Y FINALIZACIÓN SON MERAMENTE INDICATIVAS, son las horas a las que abre y cierra el lugar.', '- Tel: +65 9873 0052
Ubicación inicio: Dubai Frame, situado en el Zabeel Park.', NULL, NULL, NULL, NULL, NULL),
('7b8710d3-9423-43b7-a916-0e181bfdcc8a', 'c1907a9d-4be8-4e5f-accd-1dbf102f4d83', 'Entradas Ferrari World Abu Dhabi', 'otro', '', '2025-11-04 18:00:00', '12:00', '21:00', '22507150676', '', 'Contacto: Ferrari World
Ubicación inicio: Ferrari World', NULL, NULL, NULL, NULL, NULL),
('b0103d61-913b-424a-ab8a-ece4f06a5d30', 'c1907a9d-4be8-4e5f-accd-1dbf102f4d83', 'Grand Mosque, Royal Palace, and Etihad Tower', 'tour', 'OceanAir Travels', '2025-11-05 15:45:00', '09:45', '16:00', 'GYG7VLGBMXQ8', '', 'Contacto: OceanAir Travels - Tel: +97143582500
Ubicación inicio: Staybridge Suites Abu Dhabi - Yas Island by IHG', NULL, NULL, NULL, NULL, NULL),
('4c040027-1bab-4ab8-be19-cfb65101209b', 'c9537dc5-659a-4493-912b-78a053f28ecd', 'Concierto Candleligth', 'teatro', 'Experiencias Guadalajara', '2025-12-28 02:00:00', '20:00', '22:00', 'ACT4525', '', 'Ubicación inicio: hh
Ubicación inicio: Lobby del hotel
Contacto: Karla - Tel: 34542186
Ubicación inicio: Hotel
Ubicación fin: Hotel




khfkfjkf


kjgkjfv


dgsgsgfs


sgfhdfhdh', NULL, NULL, NULL, NULL, NULL),
('dd0fbc8c-a8a0-43f7-a686-a82f5e10109a', 'ef201789-8b34-4b7a-ae43-0ee527515e67', 'Snowboard en Mont-Tremblant', 'otro', 'Xperience Montreal', '2025-12-22 15:00:00', '09:00', '13:00', 'ACT145E', 'Las solicitudes de cambio de fecha estarán sujetas a disponibilidad y a la tarifa vigente al momento de la modificación.', 'Contacto: Alberto - Tel: 9999578620
Ubicación inicio: Lobby del hotel
Ubicación fin: Lobby del hotel
Llegadas anticipadas o salidas tardías están sujetas a disponibilidad y pueden generar cargos adicionales.', NULL, NULL, NULL, NULL, NULL),
('900f51e7-3624-4445-a2bf-7e4230ac4e6e', 'dee026ed-e996-41ba-b2d0-11d839941d6b', 'Atardecer Tacos & Tequila en playa', 'actividad', 'Sun Rider Tour', '2025-09-15 01:00:00', '19:00', '22:00', 'FGH23659752', 'Estas reservas no permiten cambios ni devoluciones.

En casos excepcionales (ej. desastres naturales, emergencias sanitarias internacionales, restricciones de viaje gubernamentales), el hotel podrá ofrecer reprogramación o crédito para una futura estancia, sin cargos adicionales.', 'Las tarifas no incluyen impuestos municipales, ecológicos o turísticos que se pagan directamente en el hotel.', 'Juan H.', '9999578620', 'Lobby del hotel', 'Lobby del hotel', NULL),
('bdf738d9-169f-492e-9489-11e3ec3e95fa', 'dee026ed-e996-41ba-b2d0-11d839941d6b', 'Snorkel con almuerzo en velero', 'actividad', 'SunRider Tours', '2025-09-15 13:00:00', '07:00', '11:30', 'ACT98217', 'La empresa no se hace responsable de personas que no utilicen chalecos salva vidas.', 'Utilizar protector solar ecológico y biodegradable.', 'Juan H.', '9999578620', 'Hotel', 'Hotel', NULL),
('3ae69fee-771c-4cf2-ab31-f8694e856e07', 'dee026ed-e996-41ba-b2d0-11d839941d6b', 'Cena de despedida + antro', 'actividad', 'Hotel', '2025-09-21 02:00:00', '20:00', '23:00', '164623147846', 'Tiempo de tolerancia 10 min.', 'Posteriormente pasar al antro, con derecho a barra libre hasta la 1:00 am', 'Karla', '34542186', 'Hotel', 'Hotel', NULL),
('0ece8f4f-c0ff-43c8-a23c-7b02f0862952', 'f64d175b-b070-4a6c-b8b3-ec9ae5fd7207', 'Tour privado por Roma', 'actividad', 'Rome Bites Tours', '2025-09-22 19:00:00', '13:00', '15:00', 'A31162566', '', 'El día de la actividad, deben acudir al cruce entre la piazza di Spagna y la via di San Sebastianello,
junto a la tienda de Versace. Les recomendamos llegar con 10 minutos de antelación.', 'Rome Bites Tours', ' (+39) 3492210982', 'Plaza de España', '', NULL),
('dfa95707-6a2c-44e7-9ad5-bc9d18f4bfb2', 'f64d175b-b070-4a6c-b8b3-ec9ae5fd7207', 'Audiencia con el papa León XIV - Audiencia papal', 'actividad', 'Tourismotion Roma', '2025-09-24 13:10:00', '07:10', '12:00', 'A28764995', '', 'ESTAR 15 MINUTOS ANTES EN EL PUNTO INDICADO', 'Tourismotion Roma', '(WHATSAPP) +39 0692926678', 'Via della Conciliazione, 48 (frente a la tienda Domus Artis)', '', NULL),
('eb3620e9-928c-44d6-a3e5-d0f42f27a576', 'f64d175b-b070-4a6c-b8b3-ec9ae5fd7207', 'MUSEOS DEL VATICANO', 'actividad', '', '2025-09-24 18:30:00', '12:30', '15:00', '2L133GLM70NZSS1TV', '', '', 'Coordinador', '+39 06 6988 3145', 'Entrada del museo del vaticano', '', NULL),
('67627dfc-ef06-4274-b0b0-c61517920688', 'f64d175b-b070-4a6c-b8b3-ec9ae5fd7207', 'Coliseo Romano / Foro palatino y Arena de gladiadores', 'actividad', '', '2025-09-23 16:35:00', '10:35', '12:00', 'GYGWZBLWM9VF', '', 'Nos vemos en Largo Gaetana Agnesi, la plaza ubicada en la terraza sobre la estación de metro del
Coliseo. Busca a nuestros coordinadores, quienes visten camisetas moradas y ondean la bandera
de Crown Tours.
Hora: Por favor, llega al punto de encuentro 30 minutos antes de la hora elegida para no perder
tu franja horaria.', 'Coordinador', 'whatsapp solo en ingles +49 151 23457858', 'L.go Gaetana Agnesi, 00184 Roma RM, Italy', '', NULL),
('cc70f387-730e-42c0-941c-732b6a513880', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'FREE TOUR BERLÍN', 'tour', 'CULTURE AND TOURING SL', '2025-10-19 16:00:00', '10:00', '13:30', 'A33834300', 'El free tour comenzará a la hora indicada en el siguiente punto de Berlín: la Pariser Platz, frente a la Academia de las Artes. Recomendamos estar en el punto de encuentro al menos 15 minutos antes del inicio del tour.', 'Contacto: whatsapp - Tel: (+34) 644234146
Ubicación inicio: Pariser Platz.', '', '', 'Pariser Platz.', '', ARRAY['/uploads/activities/attachments-1758593086962-165409512.pdf']),
('531469c1-41f6-4f63-b04d-850820f7e973', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'FREE TOUR HAMBURGO', 'tour', 'Hamburgo A Pie', '2025-10-16 17:15:00', '11:15', '13:15', 'A33834299', 'Quedaremos en la Plaza del Ayuntamiento de Hamburgo, en la entrada principal del edificio del Ayuntamiento (Rathausmarkt 1, 20095 Hamburg, Alemania) 
LLEGAR CON 15 MINUTOS DE ANTICIPACIÓN', '- Tel: +4915204719263
Ubicación inicio: Plaza del Ayuntamiento (Rathausmarkt).', '', '', 'Plaza del Ayuntamiento (Rathausmarkt).', '', ARRAY['/uploads/activities/attachments-1758593074991-799891605.pdf']),
('808f7b7c-7dcd-4258-8f6d-1b20135c06f2', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'FREE TOUR MUNICH', 'tour', 'Todo Tours Munich', '2025-10-21 16:45:00', '10:45', '13:00', 'C731-T1068-250911-135', 'El día de la actividad, deberan acudir a la hora indicada a la plaza Marienplatz de Múnich. Su guía los estará esperando con un paraguas azul de Todo Tours frente a la Columna de María. Recomendamos llegar con 10 minutos de antelación.', '- Tel: +34623062291
Ubicación inicio: Marienplatz (frente a la Columna de María).', '', '', 'Marienplatz (frente a la Columna de María)', '', ARRAY['/uploads/activities/attachments-1758593149100-199909513.pdf']),
('e12f871e-c8f8-4622-b13a-f285412f77dc', '0901b373-d2bd-436e-8384-6041e252fb01', 'Palacio Real + Catedral de la Almudena', 'actividad', 'Todo Tours', '2025-10-03 20:30:00', '14:30', '16:00', 'C731-T1068- 250605-138', 'ESTE VOUCHER INCLUYE SOLAMENTE 2 BOLETOS PARA ALEJANDRA Y MARU.', 'El punto de encuentro es en la salida de la estación de metro de Ópera (esta parada pertenece a la
línea 2, la de color rojo; la línea 5, la verde; y el ramal de Ópera a Príncipe Pío). Les pedimos que
acudáis al punto de encuentro con 10 minutos de antelación. Encontraran al guía con un paraguas
azul de Todo Tours.', 'Todo Tours', '0034623062291', 'Parada de Metro Ópera.', '', NULL),
('629da6c4-8b08-4d42-b819-9369f7131868', '0901b373-d2bd-436e-8384-6041e252fb01', 'Museo del Prado', 'actividad', '', '2025-10-03 23:45:00', '17:45', '19:00', 'GYGX7NXVHVVK', '', '', '', '', 'C. de Ruiz de Alarcón, 23, 28014 Madrid', 'C. de Ruiz de Alarcón, 23, 28014 Madrid', NULL),
('6fde56b9-e1d0-4196-be65-07db8f7e77dd', '0901b373-d2bd-436e-8384-6041e252fb01', 'Excursión a Toledo y Segovia', 'excursion', 'Amigo Tour España', '2025-10-04 13:45:00', '07:45', '18:45', 'C. de Ruiz de Alarcón, 23, 28014 Madrid', 'El punto de salida es la estación de metro de Las Ventas (línea 2, la de color rojo) saliendo en la salida de la calle Julio Camba. Es imprescindible llegar con 15 minutos de antelación.', 'A la hora indicada nos encontraremos en el centro de Madrid, desde donde partiremos en autobús
hasta Toledo y Segovia. ¡Descubriremos por qué han sido declaradas Patrimonio de la Humanidad
por la Unesco!
Realizaremos la primera parada en Toledo, conocida como la Ciudad de las Tres Culturas por
conservar importantes huellas de la historia de las tres religiones monoteístas que habitaron la zona
durante siglos.
Disfrutaremos del patrimonio arquitectónico, artístico y urbano milenario de la ciudad mientras
recorremos sus estrechas callejuelas, plazas y jardines. Pasaremos junto a la Catedral de Toledo,
una de las muestras más destacadas del gótico español, y el Monasterio de San Juan de los
Reyes, el lugar elegido por los Reyes Católicos para ser enterrados. Antes de partir rumbo a
Segovia, admiraremos algunas de las vistas panorámicas más impresionantes de Toledo desde
el Puente de San Martín y el Mirador del Valle.
La siguiente parada tendrá lugar en Segovia. Por supuesto, veremos el Acueducto, uno de los
monumentos mejor conservados de los que dejaron los romanos en la península Ibérica.
Contemplaremos la Catedral de Segovia, conocida popularmente como "la Dama de las
Catedrales" por la sorprendente belleza de su estilo gótico con influencias renacentistas.
Recorreremos también el barrio de las Canonjías hasta llegar al famoso Alcázar, uno de los monumentos más visitados de España, desde donde podremos admirar parte del trazado de
murallas que rodeaban a Segovia en época medieval.
Finalmente, tras un total de 11 horas de excursión, estaremos de nuevo en la capital española.', 'Amigo Tour España', '(+34) 91 129 34 83', 'Parada de metro Las Ventas. Salida Calle Julio Camba', '', NULL),
('0e125dc8-af24-4afb-a34d-12560cf774bd', '0901b373-d2bd-436e-8384-6041e252fb01', 'Tour Bernabéu', 'actividad', '', '2025-10-03 16:30:00', '10:30', '12:00', 'GYGMX4Z95Z2V', 'El acceso al Tour Bernabéu se encuentra en la Avenida Concha Espina.
El día de la visita, dirígete a la entrada y muestra una copia electrónica o impresa de este ticket.
Hora: Debes llegar al punto de encuentro 5 minutos antes de la hora de entrada para no perder
tu franja horaria', '', 'Estadio bernabéu', '+49 30 837 91488', 'Av. de Concha Espina, 6, Chamartín, 28036 Madrid, Spain', 'Av. de Concha Espina, 6, Chamartín, 28036 Madrid, Spain', ARRAY['/uploads/activities/attachments-1757963746279-762507675.pdf']),
('17aee3c6-2499-4903-82f2-4c978702e806', 'd2e13f1c-5e2c-42a6-a0b3-0033688b68cf', 'Puente de Dios - Nado', 'actividad', 'ExperienciasSLP', '2025-09-23 16:00:00', '10:00', '15:00', 'FGH23659752', '', 'Posterior a esta actividad acudir al autobus para continuar viaje.', 'Coordinador', '9999578620', 'Centro de entrada a cascada', 'Centro de entrada a cascada', ARRAY['/uploads/activities/attachments-1757964227355-388926966.docx']),
('678b4dcc-1499-4f9a-a0d7-95d840791944', '73fdb531-9e28-4a7f-b199-396f20990d02', 'Visita al Coliseo Romano', 'actividad', '', '2025-09-20 12:00:00', '06:00', '11:00', '1458754', 'Condiciones y términos...
Exclusiones Generales

No se cubrirán accidentes derivados de:

Participación en deportes extremos o de riesgo (a menos que estén expresamente contratados como cobertura adicional).

Consumo de alcohol o drogas.

Actos intencionales o autolesiones.

Guerras, disturbios o desastres naturales (excepto si se incluye cobertura especial).

Duración y Ámbito de Cobertura

La póliza es válida únicamente durante las fechas del viaje contratadas y fuera del país de residencia habitual.

La cobertura inicia al momento de salir del país de residencia y finaliza con el regreso al mismo.', 'Documentación y requisitos

✅ Identificación oficial vigente (INE o pasaporte).

✅ Comprobante de reservación (hotel, vuelos, traslados).

✅ Seguro de viaje / seguro médico (recomendado).

✅ Método de pago: tarjeta y efectivo (pesos mexicanos).', 'No aplica', '4598326269 (only whats)', 'Lobby del hotel', 'Fuente', ARRAY[]::text[]),
('1f7273d3-b9d6-4548-93c7-136d959c96be', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'FREE TOUR COLONIA', 'tour', 'The Walkings Tours', '2025-10-15 16:30:00', '10:30', '13:00', 'C731-T1253-250911-30', 'El tour comenzará a la hora indicada desde el siguiente punto de la ciudad alemana de Colonia: frente a la Estación Central de Colonia, Alemania (Köln Hauptbahnhof), en la escalinata de la lateral izquierda de la catedral de Colonia.

Para ser identificado, el guía llevará un paraguas de color blanco y verde. Se ruega puntualidad.

Tener en cuenta que, al finalizar el recorrido, sólo se admitirán propinas en efectivo.', '- Tel: +4915772431884
Ubicación inicio: Estación Central de Colonia, Alemania.', '', '', 'Estación Central de Colonia, Alemania.', '', ARRAY['/uploads/activities/attachments-1758593024392-442539064.pdf']),
('cd2d22a5-0d73-4264-bb03-177d6abf5c72', '71e3bd75-ae49-49ca-ba05-97850d04e385', 'Prueba PDF restaurante', 'restaurante', 'Hotel', '2025-09-26 00:00:00', '18:00', '20:00', '1458754', 'Prueba para adjuntar PDF.', 'Prueba para adjuntar PDF.', 'Karla', '4598326269', 'Hotel', 'Hotel', ARRAY['/uploads/activities/attachments-1758664128771-147380441.pdf','/uploads/activities/attachments-1758664128771-400689379.pdf','/uploads/activities/attachments-1758664128772-666153182.pdf']),
('032eb6c2-85bc-4b71-9290-a85467365758', '8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2', 'Entrada Vaticano: museos y capilla sixtina', 'actividad', '', '2025-10-17 21:30:00', '15:30', '18:30', 'GYG48Y6MAV4V', '', '', '', '', '00120, Vatican City', '', ARRAY['/uploads/activities/attachments-1758584803013-239686233.pdf']),
('fe83e5d1-f958-42b8-a7e0-ade6b5ea7b60', '8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2', 'ticket de entrada a la Galería de la Academia y al David', 'actividad', '', '2025-10-19 16:55:00', '10:55', '13:00', 'GYG2Q92LLKH5', '', '', '', '', 'Via Ricasoli, 39, 50122 Firenze FI, Italy', '', ARRAY['/uploads/activities/attachments-1758584817336-34682491.pdf']),
('469c8483-adb6-4b22-a029-3e9bdab12978', '71e3bd75-ae49-49ca-ba05-97850d04e385', 'Tour de prueba', 'tour', 'Experiencias Guadalajara', '2025-09-25 16:00:00', '10:00', '17:00', 'FGH23659752', 'Aquí se incluyen las condiciones y términos (políticas).', 'Aquí se incluye las notas adicionales. ESTA ES UNA PRUEBA PARA ADJUNTAR DOCUMENTOS EN UNA ACTIVIDAD.', 'No aplica', '9999578620', 'Av. de Concha Espina, 6, Chamartín, 28036 Madrid, Spain', 'Av. de Concha Espina, 6, Chamartín, 28036 Madrid, Spain', ARRAY['/uploads/activities/attachments-1758663943242-952448937.pdf']),
('9af2209f-205a-4637-88f9-6eecd088440a', '71e3bd75-ae49-49ca-ba05-97850d04e385', 'PRUEBA1', 'actividad', 'PRUEBA1', '2025-09-29 16:00:00', '10:00', '15:00', '1458754', 'PRUEBA1', 'PRUEBA1', 'PRUEBA1', '9999578620', 'Hotel', 'Hotel', ARRAY['/uploads/activities/attachments-1758663950790-964631616.pdf']),
('fdf272ba-52cf-4cd8-a44f-8ca7f733dc55', '71e3bd75-ae49-49ca-ba05-97850d04e385', 'Buceo con delfines', 'actividad', 'Experiencias QWE', '2025-09-23 16:00:00', '10:00', '11:00', 'FGH23659752', 'Prueba.', 'Prueba.', 'Karla', '4598326269', 'Hotel', 'Hotel', ARRAY['/uploads/activities/attachments-1758663954574-735299435.jpg'])

ON CONFLICT (id) DO NOTHING;

COMMIT;

-- Verificar cuántas actividades se han importado
SELECT 
    'ACTIVIDADES IMPORTADAS' as resultado,
    COUNT(*) as total_actividades
FROM activities;

-- Mostrar resumen por viaje
SELECT 
    t.name as viaje,
    COUNT(a.id) as actividades_count
FROM travels t
LEFT JOIN activities a ON t.id = a.travel_id
GROUP BY t.id, t.name
ORDER BY actividades_count DESC;
