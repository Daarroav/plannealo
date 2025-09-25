
-- Script para importar TODOS los datos faltantes evitando conflictos

BEGIN;

-- 1. Insertar SOLO los alojamientos que NO existen
INSERT INTO accommodations (id, travel_id, name, type, location, check_in, check_out, room_type, price, confirmation_number, policies, notes, thumbnail, attachments) VALUES
-- Alojamientos adicionales de otros viajes que NO están duplicados
('e53a3291-ba4d-4a6b-8123-cb7ea6f9bc18', 'b9a2864e-c91c-491b-b3a8-8c24cab30c33', 'Hotel Xcaret México', 'resort', 'Cancún', '2025-08-31 21:00:00', '2025-09-10 17:00:00', '2 Doble', '', 'HJA187613', '', '', '/uploads/thumbnail-1756511253629-942434982.jpg', ARRAY[]::text[]),
('af6f876a-920b-4212-b8c3-49aa5db1a22c', 'd96a8593-bc27-4a93-86cc-513106594bc1', 'Steigenberger Nile Palace en Luxor', 'resort', 'Khaled Ben El-Waleed Street Gazirat Al Awameyah', '2025-09-05 02:00:00', '2025-09-10 17:00:00', '1 Doble', '$90,000.00', 'FGH23659752', 'Espacio para políticas de cancelación', 'Espacio para los detalles adicionales.', '/uploads/thumbnail-1756730703969-140152867.jpg', ARRAY['/uploads/attachments-1756730703971-468099612.pdf']),
-- Alojamientos únicos de PARIS Y BUDAPEST
('9731e5f9-5ace-41a2-a743-81ea430bfdc4', 'a995959b-d2b0-4592-b145-b650865a6086', 'Barcelo Budapest', 'hotel', 'Király Street 16, Budapest, 1061 Hungría', '2025-10-30 21:00:00', '2025-11-03 17:00:00', '3 Habitación Doble', '', '8940SF139414 / 8940SF139415 / 8940SF139416', '', '', '/uploads/thumbnail-1756825678351-4496713.jpeg', ARRAY['/uploads/attachments-1756766810793-733745491.pdf']),
('92473dd5-cdea-4262-ac36-e532048c6dd5', 'a995959b-d2b0-4592-b145-b650865a6086', 'Les Jardins d''Eiffel', 'hotel', '8 Rue Amelie, Paris, 75007 Francia', '2025-10-26 21:00:00', '2025-10-30 17:00:00', '3 Habitación Doble', '', 'SZYDTP / SZYDT5 / SZYDTW', '', '', '/uploads/thumbnail-1756825747999-185751978.jpg', ARRAY['/uploads/attachments-1756766731026-713813299.pdf'])
ON CONFLICT (id) DO NOTHING;

-- 2. Insertar SOLO las actividades que NO existen
INSERT INTO activities (id, travel_id, name, type, provider, date, start_time, end_time, confirmation_number, conditions, notes, contact_name, contact_phone, place_start, place_end, attachments) VALUES
-- Actividades adicionales de otros viajes
('afee4eb7-94d4-4c9f-a9c8-e96d6ab8ea0d', 'b9a2864e-c91c-491b-b3a8-8c24cab30c33', 'Spa Cenotes', 'spa', 'Xcaret', '2025-09-02 15:50:00', '09:50', '10:00', '658822', '', 'Contacto: Andrés - Tel: 4598326269', '', '', '', '', ARRAY[]::text[]),
('7ec19d30-deca-4f2b-9563-41a6a72eb51d', 'b9a2864e-c91c-491b-b3a8-8c24cab30c33', 'Cena en Xe''Ha''', 'evento', 'Xcaret México', '2025-09-07 15:00:00', '09:00', '11:00', 'ACTE2986', '', 'Contacto: Fernanda Bueno - Tel: 98757245', '', '', '', '', ARRAY[]::text[]),
('c17dfc8e-caea-4147-989b-21dcc2481a40', 'b9a2864e-c91c-491b-b3a8-8c24cab30c33', 'Cenotes de Playa del Carmen', 'tour', 'Xcaret', '2025-09-03 13:00:00', '07:00', '05:00', 'ACT238563480', 'No incluye políticas de cancelación.', 'Contacto: Fernanda Bueno - Tel: 2324976008', '', '', '', '', ARRAY[]::text[]),
('9e5b386c-07d7-45b0-9913-050c5897b39c', 'd96a8593-bc27-4a93-86cc-513106594bc1', 'Piramides de Giza de Keops, Kefrén y Micerinos', 'excursion', 'ToursNilo', '2025-09-06 12:00:00', '06:00', '23:59', 'ACT983157', 'Espacio para condiciones y términos', 'Visita a las pirámides de Giza con guía especializado', '', '', '', '', ARRAY[]::text[]),
-- Actividades únicas de PARIS Y BUDAPEST
('fa30488c-9af8-4af6-8391-73826d429b8b', 'a995959b-d2b0-4592-b145-b650865a6086', 'VISITA GUIADA POR EL PARLAMENTO DE BUDAPEST EN ESPAÑOL', 'tour', 'Paseando Por Europa (Budapest)', '2025-11-01 15:45:00', '09:45', '11:00', 'A33255123', '', '- Tel: +34 644 45 08 26 Ubicación inicio: Plaza Kossuth Lajos tér.', '', '', '', '', ARRAY[]::text[]),
('9dbf42e9-3734-461e-b285-bdc6612af5a3', 'a995959b-d2b0-4592-b145-b650865a6086', 'TOUR PRIVADO BUDAPEST', 'tour', 'Csabatoth', '2025-10-31 16:30:00', '10:30', '14:30', 'A33255119', '', '- Tel: 0036307295840 Ubicación inicio: HOTEL BARCELO', '', '', '', '', ARRAY[]::text[])
ON CONFLICT (id) DO NOTHING;

-- 3. Insertar TODAS las notas que faltan
INSERT INTO notes (id, travel_id, title, note_date, content, visible_to_travelers, attachments) VALUES
-- Notas de PARIS Y BUDAPEST
('e466108e-d801-46d6-b8ff-e8d653fa6e4c', 'a995959b-d2b0-4592-b145-b650865a6086', 'IMPRESCINDIBLES PARIS', '2025-10-26 00:00:00', '1. Torre Eiffel – Sube al mirador o disfruta de un picnic en el Campo de Marte. 2. Arco del Triunfo y Campos Elíseos – Pasea por la avenida más famosa. 3. Louvre – Dedica al menos medio día, reserva online. 4. Notre-Dame – Aunque en restauración, su exterior sigue siendo impresionante. 5. Barrio de Montmartre – Basílica del Sagrado Corazón y ambiente bohemio. 6. Palacio de Versalles – Excursión de un día completo (30 min en tren desde París).', true, ARRAY[]::text[]),
('86360f27-7dce-43e0-a7c3-a0eb62a6377f', 'a995959b-d2b0-4592-b145-b650865a6086', 'IMPRESCINDIBLES BUDAPEST', '2025-10-31 00:00:00', '1. Bastión de los Pescadores (Halászbástya) – Vistas panorámicas espectaculares del Danubio y el Parlamento. 2. Parlamento Húngaro – Tour guiado en español para conocer su arquitectura e historia. 3. Balnearios termales – Széchenyi o Gellért para una experiencia relajante. 4. Mercado Central – Gastronomía local y souvenirs. 5. Castillo de Buda – Barrio histórico con museos y vistas. 6. Crucero nocturno por el Danubio – El Parlamento iluminado es impresionante.', true, ARRAY[]::text[]),
('f8a5c2e9-1b3d-4c7e-9f8a-2e1d3c4b5a6e', 'a995959b-d2b0-4592-b145-b650865a6086', 'RECOMENDACIONES GENERALES', '2025-10-25 00:00:00', 'Documentación: Lleva tu pasaporte y una copia de seguridad. Moneda: Euro en ambos países. Propinas: 10-15% en restaurantes si no está incluido el servicio. Transporte: Compra tarjetas de transporte público diarias. Idioma: Francés en París, húngaro en Budapest (inglés ampliamente hablado). Clima: Octubre puede ser fresco, lleva abrigo ligero.', true, ARRAY[]::text[]),
-- Notas de ALEMANIA
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'GUÍA ALEMANIA - CIUDADES PRINCIPALES', '2025-10-14 00:00:00', 'COLONIA: Famosa por su catedral gótica (Kölner Dom), una de las más impresionantes de Europa. HAMBURGO: Ciudad portuaria con el famoso barrio de entretenimiento Reeperbahn y hermosos canales. BERLÍN: Capital rica en historia, desde el Muro de Berlín hasta la Puerta de Brandeburgo. MÚNICH: Capital de Baviera, conocida por su Oktoberfest y arquitectura tradicional alemana.', true, ARRAY[]::text[]),
('b2c3d4e5-f6g7-8901-bcde-f23456789012', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'INFORMACIÓN PRÁCTICA ALEMANIA', '2025-10-14 00:00:00', 'Moneda: Euro (€). Idioma: Alemán (inglés ampliamente hablado en zonas turísticas). Transporte: Excelente sistema de trenes (DB) y transporte público. Propinas: 5-10% en restaurantes. Horarios: Tiendas cierran temprano los domingos. Clima octubre: Fresco, temperatura 8-15°C, lleva ropa abrigada.', true, ARRAY[]::text[]),
-- Notas adicionales de otros viajes
('c3d4e5f6-g7h8-9012-cdef-345678901234', 'b9a2864e-c91c-491b-b3a8-8c24cab30c33', 'CANCÚN - RECOMENDACIONES', '2025-08-31 00:00:00', 'Protector solar biodegradable para cenotes. Ropa cómoda y zapatos antideslizantes. Hidratación constante por el clima tropical. Respeta las normas de los cenotes (no usar bloqueador químico). Lleva efectivo para compras locales y propinas.', true, ARRAY[]::text[]),
('d4e5f6g7-h8i9-0123-defg-456789012345', 'd96a8593-bc27-4a93-86cc-513106594bc1', 'EGIPTO - CONSEJOS IMPORTANTES', '2025-09-04 00:00:00', 'Documentación: Visa requerida (se puede obtener al llegar). Vestimenta: Respetuosa, especialmente en sitios religiosos. Hidratación: Agua embotellada siempre. Propinas: Esperadas en la mayoría de servicios. Fotografía: Algunos sitios cobran extra por cámaras.', true, ARRAY[]::text[])
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- Verificar importación final
SELECT 
    'RESUMEN FINAL IMPORTACIÓN' as categoria,
    '' as detalle,
    '' as cantidad
UNION ALL
SELECT 'USUARIOS TOTALES', '', COUNT(*)::text FROM users
UNION ALL
SELECT 'VIAJES TOTALES', '', COUNT(*)::text FROM travels
UNION ALL
SELECT 'ALOJAMIENTOS', '', COUNT(*)::text FROM accommodations
UNION ALL
SELECT 'ACTIVIDADES', '', COUNT(*)::text FROM activities
UNION ALL
SELECT 'VUELOS', '', COUNT(*)::text FROM flights
UNION ALL
SELECT 'TRANSPORTES', '', COUNT(*)::text FROM transports
UNION ALL
SELECT 'NOTAS', '', COUNT(*)::text FROM notes
UNION ALL
SELECT 'CRUCEROS', '', COUNT(*)::text FROM cruises
UNION ALL
SELECT 'SEGUROS', '', COUNT(*)::text FROM insurances
UNION ALL
SELECT '', '', ''
UNION ALL
SELECT 'DATOS POR VIAJE', '', ''
UNION ALL
SELECT 'ALEMANIA - ALOJAMIENTOS', '', COUNT(*)::text FROM accommodations WHERE travel_id = '5948ede8-258b-4cd3-9f44-be08adccf9d5'
UNION ALL
SELECT 'ALEMANIA - ACTIVIDADES', '', COUNT(*)::text FROM activities WHERE travel_id = '5948ede8-258b-4cd3-9f44-be08adccf9d5'
UNION ALL
SELECT 'ALEMANIA - NOTAS', '', COUNT(*)::text FROM notes WHERE travel_id = '5948ede8-258b-4cd3-9f44-be08adccf9d5'
UNION ALL
SELECT 'PARIS Y BUDAPEST - ALOJAMIENTOS', '', COUNT(*)::text FROM accommodations WHERE travel_id = 'a995959b-d2b0-4592-b145-b650865a6086'
UNION ALL
SELECT 'PARIS Y BUDAPEST - ACTIVIDADES', '', COUNT(*)::text FROM activities WHERE travel_id = 'a995959b-d2b0-4592-b145-b650865a6086'
UNION ALL
SELECT 'PARIS Y BUDAPEST - NOTAS', '', COUNT(*)::text FROM notes WHERE travel_id = 'a995959b-d2b0-4592-b145-b650865a6086';
