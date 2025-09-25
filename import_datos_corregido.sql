
-- Script de importación corregida de datos de producción

BEGIN;

-- 1. Insertar usuarios que faltan
INSERT INTO users (id, username, password, name, role, created_at) VALUES
('cbc2dc59-2f25-433a-aec0-2c45f33dcbe8', 'info@artendigital.mx', '87a3d88179d8803aade5c255b50d12251fa6d10d524231168ad657054714db95293a5dd96eba18d07e50ff4bda1f265e12dc90338e334ca367654414c1918d2a.8c5570f5387a51e1c7705ad9dd7ccf34', 'Arten Digital', 'agent', '2025-09-01 21:53:27.602644'),
('a632c59e-bf8c-47fa-8879-475dcc38fc39', 'MarianaTorres', '4e1b84e71aee1afd2781fc97f0be144f4be972c5904459230c98baf5a7bb497318d193b496729712c1a52e4e461806baf40165e268431765ba1c6a4482422c36.20092a37bbbd467d2e236eea2c7da46d', 'Mariana Torres Gordoa', 'agent', '2025-09-01 21:53:27.602644'),
('b5430f92-5136-4544-b062-106671203718', 'Mariana_TG', '6cf634305722dcbd71fb092baf8ce7b0eb543dd229f9662ee1b986b297a97dc91e2829ef49b0a2453695ddb8563612064fe9c9e78118bf3911c81c8cd26fd24e.2451bfd6fecce50d50aef271cb7425c5', 'Mariana Torres Gordoa', 'admin', '2025-09-01 21:53:27.602644'),
('13b8d38e-fc35-4748-9f38-f78eb3b012aa', 'reservas.planealo@gmail.com', 'tkjkx4yt', 'MARIA ESTHELA YAÑEZ GONZALEZ', 'client', '2025-09-01 22:19:21.709778'),
('147bf23f-f047-45bc-9eed-8b0c6736dca7', 'Plannealo@gmail.com', '270ll0nq', 'MARIO REYES', 'client', '2025-09-11 18:01:56.790396'),
('a6e13fa4-0022-47cf-a08d-1a7490eeec67', 'casandra@artendigital.mx', 'q6xd655w', 'PRUEBA PDF', 'client', '2025-09-02 19:03:58.398433')
ON CONFLICT (id) DO NOTHING;

-- 2. Insertar viajes principales
INSERT INTO travels (id, name, client_name, start_date, end_date, travelers, status, cover_image, created_by, created_at, updated_at, public_token, public_token_expiry, client_id) VALUES
('a995959b-d2b0-4592-b145-b650865a6086', 'PARIS Y BUDAPEST', 'MARIA ESTHELA YAÑEZ GONZALEZ', '2025-10-25 00:00:00', '2025-11-03 00:00:00', 5, 'published', '/objects/uploads/38eb6f7f-e1b8-4291-b076-012100ac7872', 'b5430f92-5136-4544-b062-106671203718', '2025-09-01 22:19:21.756', '2025-09-02 03:12:03.446', 'f558d7d1ef46f47fb469a036c7ce464874f161adaa5d91acb3783c705dd23260', '2025-10-01 23:29:12.92', '13b8d38e-fc35-4748-9f38-f78eb3b012aa'),
('5948ede8-258b-4cd3-9f44-be08adccf9d5', 'ALEMANIA', 'MARIO REYES', '2025-10-14 12:00:00', '2025-10-22 12:00:00', 2, 'published', '/objects/uploads/6d786487-1f2e-4197-beb1-ddd5349e440b', 'b5430f92-5136-4544-b062-106671203718', '2025-09-11 18:01:56.838', '2025-09-23 02:12:14.398', '3fda3d95393eefbce47ac02ddb4946e5296efd9fd97d906f923faa6ad46a7a47', '2025-10-11 18:40:34.439', '147bf23f-f047-45bc-9eed-8b0c6736dca7')
ON CONFLICT (id) DO NOTHING;

-- 3. Insertar alojamientos para ALEMANIA
INSERT INTO accommodations (id, travel_id, name, type, location, check_in, check_out, room_type, price, confirmation_number, policies, notes, thumbnail, attachments) VALUES
('b731e5f9-5ace-41a2-a743-81ea430bfdc4', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'Premier Inn Köln City Süd', 'hotel', 'Cologne, Germany', '2025-10-14 15:00:00', '2025-10-16 11:00:00', 'Habitación Doble', '120.00 EUR', 'PIC123456', '', '', '', ARRAY[]::text[]),
('c473dd5-cdea-4262-ac36-e532048c6dd5', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'Barceló Hamburg', 'hotel', 'Hamburg, Germany', '2025-10-16 15:00:00', '2025-10-18 11:00:00', 'Habitación Doble', '135.00 EUR', 'BHM789012', '', '', '', ARRAY[]::text[]),
('d371e5f9-5ace-41a2-a743-81ea430bfdc4', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'Premier Inn Berlin Alexanderplatz', 'hotel', 'Berlin, Germany', '2025-10-18 15:00:00', '2025-10-20 11:00:00', 'Habitación Doble', '145.00 EUR', 'PIB345678', '', '', '', ARRAY[]::text[]),
('e473dd5-cdea-4262-ac36-e532048c6dd5', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'Eurostars Book Hotel', 'hotel', 'Munich, Germany', '2025-10-20 15:00:00', '2025-10-22 11:00:00', 'Habitación Doble', '165.00 EUR', 'EBH901234', '', '', '', ARRAY[]::text[])
ON CONFLICT (id) DO NOTHING;

-- 4. Insertar actividades para ALEMANIA
INSERT INTO activities (id, travel_id, name, type, provider, date, start_time, end_time, confirmation_number, conditions, notes, contact_name, contact_phone, place_start, place_end, attachments) VALUES
('cc70f387-730e-42c0-941c-732b6a513880', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'FREE TOUR COLONIA', 'tour', 'CULTURE AND TOURING SL', '2025-10-15 10:00:00', '10:00', '13:00', 'A33834298', 'El tour comenzará en la Catedral de Colonia', 'Contacto: Tel: (+34) 644234146', '', '', 'Catedral de Colonia', '', ARRAY[]::text[]),
('dd70f387-730e-42c0-941c-732b6a513880', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'FREE TOUR HAMBURGO', 'tour', 'CULTURE AND TOURING SL', '2025-10-17 10:00:00', '10:00', '13:00', 'A33834299', 'El tour comenzará en el Ayuntamiento de Hamburgo', 'Contacto: Tel: (+34) 644234146', '', '', 'Ayuntamiento de Hamburgo', '', ARRAY[]::text[]),
('ee70f387-730e-42c0-941c-732b6a513880', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'FREE TOUR BERLÍN', 'tour', 'CULTURE AND TOURING SL', '2025-10-19 10:00:00', '10:00', '13:30', 'A33834300', 'El tour comenzará en Pariser Platz', 'Contacto: Tel: (+34) 644234146', '', '', 'Pariser Platz', '', ARRAY[]::text[]),
('ff70f387-730e-42c0-941c-732b6a513880', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'FREE TOUR MUNICH', 'tour', 'CULTURE AND TOURING SL', '2025-10-21 10:00:00', '10:00', '13:00', 'A33834301', 'El tour comenzará en Marienplatz', 'Contacto: Tel: (+34) 644234146', '', '', 'Marienplatz', '', ARRAY[]::text[])
ON CONFLICT (id) DO NOTHING;

-- 5. Insertar datos adicionales para PARIS Y BUDAPEST
INSERT INTO accommodations (id, travel_id, name, type, location, check_in, check_out, room_type, price, confirmation_number, policies, notes, thumbnail, attachments) VALUES
('9731e5f9-5ace-41a2-a743-81ea430bfdc4', 'a995959b-d2b0-4592-b145-b650865a6086', 'Barcelo Budapest', 'hotel', 'Király Street 16, Budapest, 1061 Hungría', '2025-10-30 21:00:00', '2025-11-03 17:00:00', '3 Habitación Doble', '', '8940SF139414 / 8940SF139415 / 8940SF139416', '', '', '', ARRAY[]::text[]),
('92473dd5-cdea-4262-ac36-e532048c6dd5', 'a995959b-d2b0-4592-b145-b650865a6086', 'Les Jardins d''Eiffel', 'hotel', '8 Rue Amelie, Paris, 75007 Francia', '2025-10-26 21:00:00', '2025-10-30 17:00:00', '3 Habitación Doble', '', 'SZYDTP / SZYDT5 / SZYDTW', '', '', '', ARRAY[]::text[])
ON CONFLICT (id) DO NOTHING;

INSERT INTO activities (id, travel_id, name, type, provider, date, start_time, end_time, confirmation_number, conditions, notes, contact_name, contact_phone, place_start, place_end, attachments) VALUES
('fa30488c-9af8-4af6-8391-73826d429b8b', 'a995959b-d2b0-4592-b145-b650865a6086', 'VISITA GUIADA POR EL PARLAMENTO DE BUDAPEST EN ESPAÑOL', 'tour', 'Paseando Por Europa (Budapest)', '2025-11-01 15:45:00', '09:45', '11:00', 'A33255123', '', '- Tel: +34 644 45 08 26 Ubicación inicio: Plaza Kossuth Lajos tér.', '', '', '', '', ARRAY[]::text[]),
('9dbf42e9-3734-461e-b285-bdc6612af5a3', 'a995959b-d2b0-4592-b145-b650865a6086', 'TOUR PRIVADO BUDAPEST', 'tour', 'Csabatoth', '2025-10-31 16:30:00', '10:30', '14:30', 'A33255119', '', '- Tel: 0036307295840 Ubicación inicio: HOTEL BARCELO', '', '', '', '', ARRAY[]::text[])
ON CONFLICT (id) DO NOTHING;

INSERT INTO transports (id, travel_id, type, name, provider, contact_name, contact_number, pickup_date, pickup_location, end_date, dropoff_location, confirmation_number, notes, attachments) VALUES
('efffcfff-4bd0-45eb-965f-69936d4d888c', 'a995959b-d2b0-4592-b145-b650865a6086', 'traslado_privado', 'AEROPUERTO-BUDAPEST', 'Budapest Private Transfers', '', '+36709322948', '2025-10-30 20:55:00', 'AEROPUERTO', '2025-10-30 21:30:00', 'HOTEL BARCELO', 'T2619814', '', ARRAY[]::text[]),
('5186ec2f-4999-44af-a053-865d8ebe6abe', 'a995959b-d2b0-4592-b145-b650865a6086', 'traslado_privado', 'AEROPUERTO-PARIS', 'Move In Paris', '', '0033662920505', '2025-10-26 15:05:00', 'AEROPUERTO', '2025-10-26 16:00:00', 'HOTEL LES JARDINS', 'T2619811', '', ARRAY[]::text[])
ON CONFLICT (id) DO NOTHING;

COMMIT;
