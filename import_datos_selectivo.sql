
-- Script de importación selectiva de datos de producción

-- Primero, limpiar datos existentes si es necesario
-- TRUNCATE TABLE notes CASCADE;
-- TRUNCATE TABLE transports CASCADE;
-- TRUNCATE TABLE flights CASCADE;
-- TRUNCATE TABLE activities CASCADE;
-- TRUNCATE TABLE accommodations CASCADE;
-- TRUNCATE TABLE travels CASCADE;
-- TRUNCATE TABLE users CASCADE;

-- 1. Insertar usuarios
INSERT INTO users (id, username, password, name, role, created_at) VALUES
('cbc2dc59-2f25-433a-aec0-2c45f33dcbe8', 'info@artendigital.mx', '87a3d88179d8803aade5c255b50d12251fa6d10d524231168ad657054714db95293a5dd96eba18d07e50ff4bda1f265e12dc90338e334ca367654414c1918d2a.8c5570f5387a51e1c7705ad9dd7ccf34', 'Arten Digital', 'agent', '2025-09-01 21:53:27.602644'),
('a632c59e-bf8c-47fa-8879-475dcc38fc39', 'MarianaTorres', '4e1b84e71aee1afd2781fc97f0be144f4be972c5904459230c98baf5a7bb497318d193b496729712c1a52e4e461806baf40165e268431765ba1c6a4482422c36.20092a37bbbd467d2e236eea2c7da46d', 'Mariana Torres Gordoa', 'agent', '2025-09-01 21:53:27.602644'),
('b5430f92-5136-4544-b062-106671203718', 'Mariana_TG', '6cf634305722dcbd71fb092baf8ce7b0eb543dd229f9662ee1b986b297a97dc91e2829ef49b0a2453695ddb8563612064fe9c9e78118bf3911c81c8cd26fd24e.2451bfd6fecce50d50aef271cb7425c5', 'Mariana Torres Gordoa', 'admin', '2025-09-01 21:53:27.602644'),
('13b8d38e-fc35-4748-9f38-f78eb3b012aa', 'reservas.planealo@gmail.com', 'tkjkx4yt', 'MARIA ESTHELA YAÑEZ GONZALEZ', 'client', '2025-09-01 22:19:21.709778')
ON CONFLICT (id) DO NOTHING;

-- 2. Insertar viajes principales
INSERT INTO travels (id, name, client_name, start_date, end_date, travelers, status, cover_image, created_by, created_at, updated_at, public_token, public_token_expiry, client_id) VALUES
('a995959b-d2b0-4592-b145-b650865a6086', 'PARIS Y BUDAPEST', 'MARIA ESTHELA YAÑEZ GONZALEZ', '2025-10-25 00:00:00', '2025-11-03 00:00:00', 5, 'published', '/objects/uploads/38eb6f7f-e1b8-4291-b076-012100ac7872', 'b5430f92-5136-4544-b062-106671203718', '2025-09-01 22:19:21.756', '2025-09-02 03:12:03.446', 'f558d7d1ef46f47fb469a036c7ce464874f161adaa5d91acb3783c705dd23260', '2025-10-01 23:29:12.92', '13b8d38e-fc35-4748-9f38-f78eb3b012aa'),
('5948ede8-258b-4cd3-9f44-be08adccf9d5', 'ALEMANIA', 'MARIO REYES', '2025-10-14 12:00:00', '2025-10-22 12:00:00', 2, 'published', '/objects/uploads/6d786487-1f2e-4197-beb1-ddd5349e440b', 'b5430f92-5136-4544-b062-106671203718', '2025-09-11 18:01:56.838', '2025-09-23 02:12:14.398', '3fda3d95393eefbce47ac02ddb4946e5296efd9fd97d906f923faa6ad46a7a47', '2025-10-11 18:40:34.439', '13b8d38e-fc35-4748-9f38-f78eb3b012aa')
ON CONFLICT (id) DO NOTHING;

-- 3. Insertar alojamientos (solo algunos ejemplos)
INSERT INTO accommodations (id, travel_id, name, type, location, check_in, check_out, room_type, price, confirmation_number, policies, notes, thumbnail, attachments) VALUES
('9731e5f9-5ace-41a2-a743-81ea430bfdc4', 'a995959b-d2b0-4592-b145-b650865a6086', 'Barcelo Budapest', 'hotel', 'Király Street 16, Budapest, 1061 Hungría', '2025-10-30 21:00:00', '2025-11-03 17:00:00', '3 Habitación Doble', '', '8940SF139414 / 8940SF139415 / 8940SF139416', '', '', '/uploads/thumbnail-1756825678351-4496713.jpeg', ARRAY['/uploads/attachments-1756766810793-733745491.pdf']),
('92473dd5-cdea-4262-ac36-e532048c6dd5', 'a995959b-d2b0-4592-b145-b650865a6086', 'Les Jardins d''Eiffel', 'hotel', '8 Rue Amelie, Paris, 75007 Francia', '2025-10-26 21:00:00', '2025-10-30 17:00:00', '3 Habitación Doble', '', 'SZYDTP / SZYDT5 / SZYDTW', '', '', '/uploads/thumbnail-1756825747999-185751978.jpg', ARRAY['/uploads/attachments-1756766731026-713813299.pdf'])
ON CONFLICT (id) DO NOTHING;

-- 4. Insertar vuelos
INSERT INTO flights (id, travel_id, airline, flight_number, departure_city, arrival_city, departure_date, arrival_date, departure_terminal, arrival_terminal, class, reservation_number, attachments) VALUES
('a552b563-945d-4e2f-8c2a-0b51701e0685', 'a995959b-d2b0-4592-b145-b650865a6086', 'AMERICAN AIRLINES', 'AA 48', 'Dallas/Fort Worth (DFW)', 'Paris Charles de Gaulle (CDG)', '2025-10-25 23:50:00', '2025-10-26 15:05:00', '', '', 'economica', 'LSIHXJ', ARRAY[]::text[]),
('c8a1c133-a72c-4b71-a725-e60e9717b5fc', 'a995959b-d2b0-4592-b145-b650865a6086', 'AMERICAN AIRLINES', 'AA 1440', 'San Luis Potosi-Ponciano Arriaga (SLP)', 'Dallas/Fort Worth (DFW)', '2025-10-25 17:59:00', '2025-10-25 21:14:00', '', '', 'economica', 'JBPNMK', ARRAY[]::text[])
ON CONFLICT (id) DO NOTHING;

-- 5. Insertar actividades
INSERT INTO activities (id, travel_id, name, type, provider, date, start_time, end_time, confirmation_number, conditions, notes, contact_name, contact_phone, place_start, place_end, attachments) VALUES
('fa30488c-9af8-4af6-8391-73826d429b8b', 'a995959b-d2b0-4592-b145-b650865a6086', 'VISITA GUIADA POR EL PARLAMENTO DE BUDAPEST EN ESPAÑOL', 'tour', 'Paseando Por Europa (Budapest)', '2025-11-01 15:45:00', '09:45', '11:00', 'A33255123', '', '- Tel: +34 644 45 08 26 Ubicación inicio: Plaza Kossuth Lajos tér.', NULL, NULL, NULL, NULL, ARRAY[]::text[]),
('9dbf42e9-3734-461e-b285-bdc6612af5a3', 'a995959b-d2b0-4592-b145-b650865a6086', 'TOUR PRIVADO BUDAPEST', 'tour', 'Csabatoth', '2025-10-31 16:30:00', '10:30', '14:30', 'A33255119', '', '- Tel: 0036307295840 Ubicación inicio: HOTEL BARCELO', NULL, NULL, NULL, NULL, ARRAY[]::text[])
ON CONFLICT (id) DO NOTHING;

-- 6. Insertar transportes
INSERT INTO transports (id, travel_id, type, name, provider, contact_name, contact_number, pickup_date, pickup_location, end_date, dropoff_location, confirmation_number, notes, attachments) VALUES
('efffcfff-4bd0-45eb-965f-69936d4d888c', 'a995959b-d2b0-4592-b145-b650865a6086', 'traslado_privado', 'AEROPUERTO-BUDAPEST', 'Budapest Private Transfers', NULL, '+36709322948', '2025-10-30 20:55:00', 'AEROPUERTO', '2025-10-30 21:30:00', 'HOTEL BARCELO', 'T2619814', NULL, ARRAY[]::text[]),
('5186ec2f-4999-44af-a053-865d8ebe6abe', 'a995959b-d2b0-4592-b145-b650865a6086', 'traslado_privado', 'AEROPUERTO-PARIS', 'Move In Paris', NULL, '0033662920505', '2025-10-26 15:05:00', 'AEROPUERTO', '2025-10-26 16:00:00', 'HOTEL LES JARDINS', 'T2619811', NULL, ARRAY[]::text[])
ON CONFLICT (id) DO NOTHING;

-- 7. Insertar notas
INSERT INTO notes (id, travel_id, title, note_date, content, visible_to_travelers, attachments) VALUES
('e466108e-d801-46d6-b8ff-e8d653fa6e4c', 'a995959b-d2b0-4592-b145-b650865a6086', 'IMPRESCINDIBLES PARIS', '2025-10-26 00:00:00', '1. Torre Eiffel – Sube al mirador o disfruta de un picnic en el Campo de Marte. 2. Arco del Triunfo y Campos Elíseos – Pasea por la avenida más famosa.', true, ARRAY[]::text[]),
('86360f27-7dce-43e0-a7c3-a0eb62a6377f', 'a995959b-d2b0-4592-b145-b650865a6086', 'IMPRESCINDIBLES BUDAPEST', '2025-10-31 00:00:00', '1. Bastión de los Pescadores (Halászbástya) – Vistas panorámicas espectaculares del Danubio y el Parlamento.', true, ARRAY[]::text[])
ON CONFLICT (id) DO NOTHING;
