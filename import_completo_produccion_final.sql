
-- Script completo para importar TODOS los datos de producción omitiendo duplicados

BEGIN;

-- 1. Insertar TODOS los usuarios de producción
INSERT INTO users (id, username, password, name, role, created_at) VALUES
('cbc2dc59-2f25-433a-aec0-2c45f33dcbe8', 'info@artendigital.mx', '87a3d88179d8803aade5c255b50d12251fa6d10d524231168ad657054714db95293a5dd96eba18d07e50ff4bda1f265e12dc90338e334ca367654414c1918d2a.8c5570f5387a51e1c7705ad9dd7ccf34', 'Arten Digital', 'agent', '2025-09-01 21:53:27.602644'),
('a632c59e-bf8c-47fa-8879-475dcc38fc39', 'MarianaTorres', '4e1b84e71aee1afd2781fc97f0be144f4be972c5904459230c98baf5a7bb497318d193b496729712c1a52e4e461806baf40165e268431765ba1c6a4482422c36.20092a37bbbd467d2e236eea2c7da46d', 'Mariana Torres Gordoa', 'agent', '2025-09-01 21:53:27.602644'),
('c2091c4b-2160-4f5e-943d-b025466a86c2', 'YamelCano', '096cdc1480ab1a5e27c3e281454c8b1ad0bbd339df6f9d43dc0b505e2c54e07810556a3f66500ee55728864a920674f7eaf0f3dcc4390bd34fb31121b2a88b64.a52865295f2b7a6333ee01c3d987f123', 'Yamel Cano Zarur', 'agent', '2025-09-01 21:53:27.602644'),
('7bf342b7-1946-4cc6-bba7-a06ecfdb89e2', 'MontserratZarur', 'e355633f1593510512650a167934b14ac5138c5f05cc926a8e56cdd07a1b8af24a974378e1c5da6a99a61122be0fcfb51d42092d559544441e1b870ce0db1275.102631b0fd8e1c64019f5d9f106d0172', 'Montserrat Zarur', 'agent', '2025-09-01 21:53:27.602644'),
('13b8d38e-fc35-4748-9f38-f78eb3b012aa', 'reservas.planealo@gmail.com', 'tkjkx4yt', 'MARIA ESTHELA YAÑEZ GONZALEZ', 'client', '2025-09-01 22:19:21.709778'),
('b5430f92-5136-4544-b062-106671203718', 'Mariana_TG', '6cf634305722dcbd71fb092baf8ce7b0eb543dd229f9662ee1b986b297a97dc91e2829ef49b0a2453695ddb8563612064fe9c9e78118bf3911c81c8cd26fd24e.2451bfd6fecce50d50aef271cb7425c5', 'Mariana Torres Gordoa', 'admin', '2025-09-01 21:53:27.602644'),
('977aead7-48bc-41ea-86c2-7f7910f5e773', 'ARTEN', 'e6472600f6220562a0cab3766c0a1ce6e9caf9fbb849cd696ef01e8b9096c19421d51f156f2427d55308654bb547b14ad3f41a8e91dcfd3485684d864a8cc460.96d678519af36f734c02afc5fe75a124', 'ARTEN Pruebas', 'agent', '2025-09-02 19:00:07.381854'),
('558e4806-f2ea-4a79-8245-4138dd8fbca5', 'Yamel_CZ', '4d16c309034bb45a81ea42570032ead8e84a501c7e06920123fa6c1938135a914c1b468e38e8a660e5ec1862132e5564e0c6faa143d7b01fa0faf8d3ecb47c9c.fa1a6eb107d062af28610de39965186a', 'Yamel Cano Zarur', 'admin', '2025-09-01 21:53:27.602644'),
('f7d815a6-361a-450b-bc3c-0d91edb0220d', 'Montserrat_Z', '8ba48840d8f83f2536a30e92082ed4f945bfb7976774d552e94fb7064b9f599f07d460dcb4b63436a8a59a31efe8a098d780df3e414d5d4c9c4391fbb01362d6.60e2586424da3c75ac238fc010a607a8', 'Montserrat Zarur', 'admin', '2025-09-01 21:53:27.602644'),
('d0875842-044e-49ca-8dac-e0bafcd4146b', 'ana@gmail.com', 'tdy45b1z', 'Ana Ruíz', 'client', '2025-09-11 22:01:41.103319'),
('6534cab6-01f7-4d6e-88d7-5f1a7e49fa11', 'gonzalez@gmail.com', 'dp0n0vx9', 'Familia González García', 'client', '2025-09-12 19:26:09.27058'),
('4ebfd78e-481e-4492-9a15-8a60f55f7730', 'herrera@gmail.com', 'vzgx40gj', 'Rosa Herrera', 'client', '2025-09-10 21:43:02.826189'),
('6e0a6a37-f109-429b-b41d-f9fdda7ffa07', 'gomes@gmail.com', 'hin6rf5g', 'Familia Sánchez Venegas', 'client', '2025-09-15 18:08:46.224525'),
('93f71dd3-c79b-40bd-b6d8-29873072dbac', 'ejemplo@gmail.com', '001whmxl', 'Familia Gonzáles García', 'client', '2025-09-15 15:35:34.828207'),
('6d9b2b51-6776-4699-886d-c1070e5a1602', 'jonathan@artendigital.mx', '1243cfca5b25e82d2590afb404bc1444e97d7f7ad9ff5b87ee1ab0d5d3ee279d6bce8320e894812fe82f020668e308158488f53562343e93fd6095bd119af4df.8d330da4e883cffb495af3d4b3ff1cae', 'Jonathan Quistiano', 'admin', '2025-09-10 21:39:00.712214'),
('b4c79851-93ba-4e20-aae8-03d58a529c0e', 'CassL', 'd0413f29e7519beab021a342ec1697e4f7ec030bc8ae03c1095193e855d2605b2629361db9b26ef7c12cc4231ae53cabf40776572a111ab20bdf9e9746002102.42b97011609767654867def0bfb455dd', 'Casandra López C', 'admin', '2025-09-01 21:53:27.602644'),
('a6e13fa4-0022-47cf-a08d-1a7490eeec67', 'casandra@artendigital.mx', 'q6xd655w', 'PRUEBA PDF', 'client', '2025-09-02 19:03:58.398433'),
('147bf23f-f047-45bc-9eed-8b0c6736dca7', 'Plannealo@gmail.com', '270ll0nq', 'MARIO REYES', 'client', '2025-09-11 18:01:56.790396')
ON CONFLICT (id) DO NOTHING;

-- 2. Insertar TODOS los viajes de producción
INSERT INTO travels (id, name, client_name, start_date, end_date, travelers, status, cover_image, created_by, created_at, updated_at, public_token, public_token_expiry, client_id) VALUES
('6d915ad6-884e-482b-9c1b-5f9a5d201c6b', 'LUNA DE MIEL DANIEL & ISA', 'DANIEL HERNANDEZ AVILA', '2025-10-27 00:00:00', '2025-11-15 00:00:00', 2, 'draft', '/objects/uploads/da950860-0248-41de-8371-79dfc235ffc0', '558e4806-f2ea-4a79-8245-4138dd8fbca5', '2025-09-01 21:52:41.659', '2025-09-01 21:52:44.718', NULL, NULL, NULL),
('c1907a9d-4be8-4e5f-accd-1dbf102f4d83', 'DUBAI Y EGIPTO', 'Alejandro y Mariana', '2025-10-30 00:00:00', '2025-11-06 00:00:00', 2, 'draft', '/objects/uploads/c115c2e0-b08c-4314-97a3-634a22e6a56e', 'b5430f92-5136-4544-b062-106671203718', '2025-09-09 23:55:54.855', '2025-09-09 23:55:56.21', NULL, NULL, '13b8d38e-fc35-4748-9f38-f78eb3b012aa'),
('5948ede8-258b-4cd3-9f44-be08adccf9d5', 'ALEMANIA', 'MARIO REYES', '2025-10-14 12:00:00', '2025-10-22 12:00:00', 2, 'published', '/objects/uploads/6d786487-1f2e-4197-beb1-ddd5349e440b', 'b5430f92-5136-4544-b062-106671203718', '2025-09-11 18:01:56.838', '2025-09-23 02:12:14.398', '3fda3d95393eefbce47ac02ddb4946e5296efd9fd97d906f923faa6ad46a7a47', '2025-10-11 18:40:34.439', '147bf23f-f047-45bc-9eed-8b0c6736dca7'),
('a995959b-d2b0-4592-b145-b650865a6086', 'PARIS Y BUDAPEST', 'MARIA ESTHELA YAÑEZ GONZALEZ', '2025-10-25 00:00:00', '2025-11-03 00:00:00', 5, 'published', '/objects/uploads/38eb6f7f-e1b8-4291-b076-012100ac7872', 'b5430f92-5136-4544-b062-106671203718', '2025-09-01 22:19:21.756', '2025-09-02 03:12:03.446', 'f558d7d1ef46f47fb469a036c7ce464874f161adaa5d91acb3783c705dd23260', '2025-10-01 23:29:12.92', '13b8d38e-fc35-4748-9f38-f78eb3b012aa'),
('d37e0f99-7cf3-4726-9ae0-ac43be22b18e', 'HONEYMOON', 'ISA & DANIEL', '2025-10-27 00:00:00', '2025-11-18 00:00:00', 2, 'draft', '/objects/uploads/5fda2889-73ea-4fde-a207-bd00bd6c59ec', 'b5430f92-5136-4544-b062-106671203718', '2025-09-09 23:16:15.986', '2025-09-10 00:29:32.848', NULL, NULL, '13b8d38e-fc35-4748-9f38-f78eb3b012aa'),
('df478a23-1e35-4405-b0d5-7c2601cb399d', 'ARGENTINA', 'FAMILIA RICO MEDINA', '2025-09-23 22:45:03.646', '2025-09-23 22:45:03.646', 2, 'published', '/objects/uploads/575b278c-8d4d-471b-9d45-ac1d94adc2f8', 'b5430f92-5136-4544-b062-106671203718', '2025-09-10 23:34:58.514', '2025-09-23 22:45:03.646', 'a115a642a815740f6a9d67cf1fbe0f87f26f24317c132f3efde11662c2a137e9', '2025-12-22 22:45:03.646', '13b8d38e-fc35-4748-9f38-f78eb3b012aa'),
('71e3bd75-ae49-49ca-ba05-97850d04e385', 'PRUEBA VISUALIZACIÓN PDF', 'PRUEBA PDF', '2025-09-22 12:00:00', '2025-09-25 12:00:00', 1, 'draft', '/objects/uploads/d6f14e25-921e-4b21-8839-8376042073ca', 'b4c79851-93ba-4e20-aae8-03d58a529c0e', '2025-09-22 16:11:29.426', '2025-09-22 20:17:01.475', '5123b163ddb950e0fc809185c82dd20146ab1dd6dd9c2efac30af27ab503a876', '2025-12-21 17:42:24.462', 'a6e13fa4-0022-47cf-a08d-1a7490eeec67'),
('8d2e8f5a-7ac8-48e7-aaa6-4e3b7e9923b2', 'EUROPA ARMANDO TRUJILLO', 'Armando trujillo', '2025-09-23 01:34:40.261', '2025-09-23 01:34:40.261', 2, 'published', '/objects/uploads/f2da5f2c-0223-4c6f-abe9-c4659bd7a9df', 'b5430f92-5136-4544-b062-106671203718', '2025-09-19 17:18:21.594', '2025-09-23 01:34:40.261', NULL, NULL, '147bf23f-f047-45bc-9eed-8b0c6736dca7'),
-- Viajes adicionales que pueden estar faltando
('b9a2864e-c91c-491b-b3a8-8c24cab30c33', 'CANCÚN - XCARET', 'MARU Y ALI', '2025-08-31 00:00:00', '2025-09-10 00:00:00', 5, 'published', NULL, 'b5430f92-5136-4544-b062-106671203718', '2025-09-01 21:53:27.602644', '2025-09-01 21:53:27.602644', NULL, NULL, '13b8d38e-fc35-4748-9f38-f78eb3b012aa'),
('d96a8593-bc27-4a93-86cc-513106594bc1', 'EGIPTO', 'ALEJANDRO Y MARIANA', '2025-09-04 00:00:00', '2025-09-10 00:00:00', 2, 'published', NULL, 'b5430f92-5136-4544-b062-106671203718', '2025-09-01 21:53:27.602644', '2025-09-01 21:53:27.602644', NULL, NULL, '13b8d38e-fc35-4748-9f38-f78eb3b012aa'),
('c9537dc5-659a-4493-912b-78a053f28ecd', 'NAVIDAD EN GUADALAJARA', 'DANIEL Y ISA', '2025-12-22 00:00:00', '2025-12-31 00:00:00', 2, 'published', NULL, 'b5430f92-5136-4544-b062-106671203718', '2025-09-01 21:53:27.602644', '2025-09-01 21:53:27.602644', NULL, NULL, '13b8d38e-fc35-4748-9f38-f78eb3b012aa'),
('ef201789-8b34-4b7a-ae43-0ee527515e67', 'MONTREAL', 'FAMILIA RICA', '2025-12-07 00:00:00', '2025-12-28 00:00:00', 4, 'draft', NULL, 'b5430f92-5136-4544-b062-106671203718', '2025-09-01 21:53:27.602644', '2025-09-01 21:53:27.602644', NULL, NULL, '13b8d38e-fc35-4748-9f38-f78eb3b012aa'),
('dee026ed-e996-41ba-b2d0-11d839941d6b', 'LOS CABOS', 'FAMILIA RUIZ HERRERA', '2025-09-13 00:00:00', '2025-09-22 00:00:00', 5, 'published', NULL, 'b5430f92-5136-4544-b062-106671203718', '2025-09-01 21:53:27.602644', '2025-09-01 21:53:27.602644', NULL, NULL, '4ebfd78e-481e-4492-9a15-8a60f55f7730'),
('f64d175b-b070-4a6c-b8b3-ec9ae5fd7207', 'EUROPA', 'ALEJANDRA Y MARU', '2025-09-17 00:00:00', '2025-09-28 00:00:00', 2, 'published', NULL, 'b5430f92-5136-4544-b062-106671203718', '2025-09-01 21:53:27.602644', '2025-09-01 21:53:27.602644', NULL, NULL, '6534cab6-01f7-4d6e-88d7-5f1a7e49fa11'),
('2660e785-54d9-4cfa-b9da-b92933c7eb2d', 'EUROPA ANA Y ROSA', 'ANA Y ROSA', '2025-09-17 00:00:00', '2025-09-22 00:00:00', 2, 'published', NULL, 'b5430f92-5136-4544-b062-106671203718', '2025-09-01 21:53:27.602644', '2025-09-01 21:53:27.602644', NULL, NULL, 'd0875842-044e-49ca-8dac-e0bafcd4146b'),
('0901b373-d2bd-436e-8384-6041e252fb01', 'ESPAÑA', 'ALEJANDRA Y MARU', '2025-10-02 00:00:00', '2025-10-05 00:00:00', 2, 'published', NULL, 'b5430f92-5136-4544-b062-106671203718', '2025-09-01 21:53:27.602644', '2025-09-01 21:53:27.602644', NULL, NULL, '6534cab6-01f7-4d6e-88d7-5f1a7e49fa11'),
('d2e13f1c-5e2c-42a6-a0b3-0033688b68cf', 'RIOVERDE', 'FAMILIA GONZÁLEZ', '2025-09-23 00:00:00', '2025-10-04 00:00:00', 6, 'published', NULL, 'b5430f92-5136-4544-b062-106671203718', '2025-09-01 21:53:27.602644', '2025-09-01 21:53:27.602644', NULL, NULL, '6e0a6a37-f109-429b-b41d-f9fdda7ffa07'),
('73fdb531-9e28-4a7f-b199-396f20990d02', 'EUROPA ', 'FAMILIA LÓPEZ', '2025-09-17 00:00:00', '2025-09-25 00:00:00', 4, 'published', NULL, 'b5430f92-5136-4544-b062-106671203718', '2025-09-01 21:53:27.602644', '2025-09-01 21:53:27.602644', NULL, NULL, '93f71dd3-c79b-40bd-b6d8-29873072dbac')
ON CONFLICT (id) DO NOTHING;

-- 3. Insertar TODOS los alojamientos de producción
INSERT INTO accommodations (id, travel_id, name, type, location, check_in, check_out, room_type, price, confirmation_number, policies, notes, thumbnail, attachments) VALUES
('e53a3291-ba4d-4a6b-8123-cb7ea6f9bc18', 'b9a2864e-c91c-491b-b3a8-8c24cab30c33', 'Hotel Xcaret México', 'resort', 'Cancún', '2025-08-31 21:00:00', '2025-09-10 17:00:00', '2 Doble', '', 'HJA187613', '', '', '/uploads/thumbnail-1756511253629-942434982.jpg', ARRAY[]::text[]),
('af6f876a-920b-4212-b8c3-49aa5db1a22c', 'd96a8593-bc27-4a93-86cc-513106594bc1', 'Steigenberger Nile Palace en Luxor', 'resort', 'Khaled Ben El-Waleed Street Gazirat Al Awameyah', '2025-09-05 02:00:00', '2025-09-10 17:00:00', '1 Doble', '$90,000.00', 'FGH23659752', 'Espacio para políticas de cancelación', 'Espacio para los detalles adicionales.', '/uploads/thumbnail-1756730703969-140152867.jpg', ARRAY['/uploads/attachments-1756730703971-468099612.pdf']),
('c8d17798-846b-4bb4-a592-72fadf9c36ac', 'dee026ed-e996-41ba-b2d0-11d839941d6b', 'Villa del Palmar Beach Resort & Spa Cabo San Lucas', 'resort', 'Cam. Viejo a San Jose Km 0.5, Tourist Corridor, El Médano, 23453 Cabo San Lucas, B.C.S.', '2025-09-14 21:00:00', '2025-09-22 17:00:00', '3 Doble', '$98,780.00', '1458754', 'Reservas Estándar Las cancelaciones realizadas con 72 horas o más antes de la fecha de llegada no generan cargos. Si la cancelación se realiza dentro de las 72 horas previas a la llegada, se cobrará el equivalente a 1 noche de estancia (incluidos impuestos y cargos aplicables). En caso de no presentarse (no show), se cobrará el 100% de la primera noche. Reservas No Reembolsables / Tarifas Promocionales Estas reservas no permiten cambios ni devoluciones. En caso de cancelación, modificación o no presentarse, se cobrará el 100% del importe total de la estancia. Modificaciones Las solicitudes de cambio de fecha estarán sujetas a disponibilidad y a la tarifa vigente al momento de la modificación.', 'El huésped debe presentar una identificación oficial vigente y la tarjeta de crédito utilizada para la reserva. El check-in inicia a las 15:00 horas y el check-out es a las 12:00 horas. Llegadas anticipadas o salidas tardías están sujetas a disponibilidad y pueden generar cargos adicionales.', '/uploads/accommodations/thumbnail-1757689157048-624701306.jpg', ARRAY['/uploads/accommodations/attachments-1757689157049-737418975.pdf']),
('3d359547-4790-4e56-80cc-609912e4c09e', 'dee026ed-e996-41ba-b2d0-11d839941d6b', 'AIRBNB La casa de espera', 'casa', 'Cd. de México', '2025-09-13 21:00:00', '2025-09-14 11:00:00', '4 Sencilla', '$6,500.00', 'FGH23659752', 'De acuerdo a lo que señale Airbnb.', 'Kits de bienvenida (agua embotellada, café y té de cortesía).', '/uploads/accommodations/thumbnail-1757689259216-790698279.jpg', ARRAY[]::text[]),
('9731e5f9-5ace-41a2-a743-81ea430bfdc4', 'a995959b-d2b0-4592-b145-b650865a6086', 'Barcelo Budapest', 'hotel', 'Király Street 16, Budapest, 1061 Hungría', '2025-10-30 21:00:00', '2025-11-03 17:00:00', '3 Habitación Doble', '', '8940SF139414 / 8940SF139415 / 8940SF139416', '', '', '/uploads/thumbnail-1756825678351-4496713.jpeg', ARRAY['/uploads/attachments-1756766810793-733745491.pdf']),
('92473dd5-cdea-4262-ac36-e532048c6dd5', 'a995959b-d2b0-4592-b145-b650865a6086', 'Les Jardins d''Eiffel', 'hotel', '8 Rue Amelie, Paris, 75007 Francia', '2025-10-26 21:00:00', '2025-10-30 17:00:00', '3 Habitación Doble', '', 'SZYDTP / SZYDT5 / SZYDTW', '', '', '/uploads/thumbnail-1756825747999-185751978.jpg', ARRAY['/uploads/attachments-1756766731026-713813299.pdf']),
('071dcdf8-2623-4c6a-bcff-16ee48f178d3', 'c9537dc5-659a-4493-912b-78a053f28ecd', 'Barceló Guadalajara', 'hotel', 'Av de Las Rosas 2933, Rinconada del Bosque, 44530 Guadalajara,', '2025-12-22 21:00:00', '2025-12-29 17:00:00', '1 Sencilla', '', 'GTYHI986325', '', '', '/uploads/thumbnail-1757000668810-854984956.jpg', ARRAY[]::text[]),
('c81b50e3-a69d-4cbc-9b31-c81cd29159d4', 'd37e0f99-7cf3-4726-9ae0-ac43be22b18e', 'The Udaya Resorts and Spa', 'hotel', 'Jl. Sriwedari No 48B, Desa Tegallantang, Ubud, Bali, 80571 Indonesia', '2025-10-29 21:00:00', '2025-11-02 17:00:00', '1 Habitación Doble', '', '44413061', '', '', '', ARRAY['/uploads/attachments-1757460564379-443044613.pdf']),
('da49175b-f782-4731-89e5-9697ec982975', 'd37e0f99-7cf3-4726-9ae0-ac43be22b18e', 'New Blanc Central Myeongdong', 'hotel', '20 Changgyeonggung-ro, Jung-gu, Seoul, 04559 Corea del Sur', '2025-11-02 21:00:00', '2025-11-06 17:00:00', '1 Habitación Doble', '', 'H2502250808', '', '', '', ARRAY['/uploads/attachments-1757460665922-637195580.pdf']),
('62fce019-5851-4ae7-ba11-a0f406e709a5', 'ef201789-8b34-4b7a-ae43-0ee527515e67', 'Montreal Marriott Chateau Champlain', 'resort', '1050 de la Gauchetiere West, Montreal, Quebec H3B 4C9 Canadá', '2025-12-07 21:00:00', '2025-12-28 17:00:00', '2 Sencilla', '', 'QWE986', 'Políticas de Cancelación y Modificación', 'Amenidades Especiales', '/uploads/thumbnail-1757541343245-666860989.jpg', ARRAY['/uploads/attachments-1757541343246-632964986.jpg']),
('bdb7b6b1-077c-47c0-ac8c-af5420ef7839', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'Premier Inn Berlin Alexanderplatz', 'hotel', 'Theanolte-Bähnisch-Straße 2, Berlin, 10178 Alemania', '2025-10-18 21:00:00', '2025-10-20 17:00:00', '1 Doble estandar', '', '2481055762', '', '', '', ARRAY['/uploads/accommodations/attachments-1758593283241-808469147.pdf']),
('0b3bebba-817d-4682-8288-aeeeb9908e8b', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'Barceló Hamburg', 'hotel', 'Ferdinandstrasse 15, Hamburg Altsadt, Hamburg, HH, 20095 Alemania', '2025-10-15 21:00:00', '2025-10-18 17:00:00', '1 superior', '', '7402SF239779', '', '', '', ARRAY['/uploads/accommodations/attachments-1758593258038-718595533.pdf']),
('e0be4971-3cc5-45df-aaaa-7420fe2553b6', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'Premier Inn Köln City Süd', 'hotel', 'Perlengraben 2, Cologne, 50676 Alemania', '2025-10-14 21:00:00', '2025-10-15 17:00:00', '1 Doble estandar', '', '2481055560', '', '', '', ARRAY['/uploads/accommodations/attachments-1758593205345-721509349.pdf']),
('0873a713-ccee-425c-acd5-e21fe37b2483', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'Eurostars Book Hotel', 'hotel', 'Schwanthalerstrasse 44, Munich, BY, 80336 Alemania', '2025-10-20 21:00:00', '2025-10-22 17:00:00', '1 estándar', '', '73236999444685', '', '', '', ARRAY['/uploads/accommodations/attachments-1758593296660-845854954.pdf']),
-- Alojamientos de ARGENTINA que estaban faltando
('2d4c268c-964d-47b4-8e64-3979750fdc87', 'df478a23-1e35-4405-b0d5-7c2601cb399d', 'Xelena Hotel & Suites', 'hotel', 'René Favaloro 3500, El Calafate, Santa Cruz, Argentina', '2025-10-04 21:00:00', '2025-10-07 17:00:00', '1 estándar', '', '#249-3345567', '', '', '', ARRAY['/uploads/accommodations/attachments-1758665942820-66803916.pdf']),
('b99abdda-7224-4e1d-be88-70435daf92f5', 'df478a23-1e35-4405-b0d5-7c2601cb399d', 'Argentino Hotel', 'hotel', 'Espejo 455, Mendoza, Mendoza, Argentina', '2025-10-13 21:00:00', '2025-10-16 17:00:00', '1 estándar', '', '#249-3341932', '', '', '', ARRAY['/uploads/accommodations/attachments-1758666090733-973973912.pdf']),
('717bcf41-ffb0-419c-a0ba-34253998e4bb', 'df478a23-1e35-4405-b0d5-7c2601cb399d', 'NH City Buenos Aires', 'hotel', 'Bolívar 160, Buenos Aires, Buenos Aires, Argentina', '2025-10-08 04:00:00', '2025-10-13 17:00:00', '1 estándar', '', '#2278092273', '', '', '', ARRAY['/uploads/accommodations/attachments-1758668279561-706844228.pdf'])
ON CONFLICT (id) DO NOTHING;

-- 4. Insertar TODAS las actividades de producción
INSERT INTO activities (id, travel_id, name, type, provider, date, start_time, end_time, confirmation_number, conditions, notes, contact_name, contact_phone, place_start, place_end, attachments) VALUES
('afee4eb7-94d4-4c9f-a9c8-e96d6ab8ea0d', 'b9a2864e-c91c-491b-b3a8-8c24cab30c33', 'Spa Cenotes', 'spa', 'Xcaret', '2025-09-02 15:50:00', '09:50', '10:00', '658822', '', 'Contacto: Andrés - Tel: 4598326269', '', '', '', '', ARRAY[]::text[]),
('7ec19d30-deca-4f2b-9563-41a6a72eb51d', 'b9a2864e-c91c-491b-b3a8-8c24cab30c33', 'Cena en Xe''Ha''', 'evento', 'Xcaret México', '2025-09-07 15:00:00', '09:00', '11:00', 'ACTE2986', '', 'Contacto: Fernanda Bueno - Tel: 98757245', '', '', '', '', ARRAY[]::text[]),
('c17dfc8e-caea-4147-989b-21dcc2481a40', 'b9a2864e-c91c-491b-b3a8-8c24cab30c33', 'Cenotes de Playa del Carmen', 'tour', 'Xcaret', '2025-09-03 13:00:00', '07:00', '05:00', 'ACT238563480', 'No incluye políticas de cancelación.', 'Contacto: Fernanda Bueno - Tel: 2324976008', '', '', '', '', ARRAY[]::text[]),
('9e5b386c-07d7-45b0-9913-050c5897b39c', 'd96a8593-bc27-4a93-86cc-513106594bc1', 'Piramides de Giza de Keops, Kefrén y Micerinos', 'excursion', 'ToursNilo', '2025-09-06 12:00:00', '06:00', '23:59', 'ACT983157', 'Espacio para condiciones y términos', 'Visita a las pirámides de Giza con guía especializado', '', '', '', '', ARRAY[]::text[]),
('fa30488c-9af8-4af6-8391-73826d429b8b', 'a995959b-d2b0-4592-b145-b650865a6086', 'VISITA GUIADA POR EL PARLAMENTO DE BUDAPEST EN ESPAÑOL', 'tour', 'Paseando Por Europa (Budapest)', '2025-11-01 15:45:00', '09:45', '11:00', 'A33255123', '', '- Tel: +34 644 45 08 26 Ubicación inicio: Plaza Kossuth Lajos tér.', '', '', '', '', ARRAY[]::text[]),
('9dbf42e9-3734-461e-b285-bdc6612af5a3', 'a995959b-d2b0-4592-b145-b650865a6086', 'TOUR PRIVADO BUDAPEST', 'tour', 'Csabatoth', '2025-10-31 16:30:00', '10:30', '14:30', 'A33255119', '', '- Tel: 0036307295840 Ubicación inicio: HOTEL BARCELO', '', '', '', '', ARRAY[]::text[]),
-- Actividades de ALEMANIA
('cc70f387-730e-42c0-941c-732b6a513880', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'FREE TOUR BERLÍN', 'tour', 'CULTURE AND TOURING SL', '2025-10-19 16:00:00', '10:00', '13:30', 'A33834300', 'El free tour comenzará a la hora indicada en el siguiente punto de Berlín: la Pariser Platz, frente a la Academia de las Artes. Recomendamos estar en el punto de encuentro al menos 15 minutos antes del inicio del tour.', 'Contacto: whatsapp - Tel: (+34) 644234146 Ubicación inicio: Pariser Platz.', '', '', 'Pariser Platz.', '', ARRAY['/uploads/activities/attachments-1758593086962-165409512.pdf']),
('531469c1-41f6-4f63-b04d-850820f7e973', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'FREE TOUR HAMBURGO', 'tour', 'Hamburgo A Pie', '2025-10-16 17:15:00', '11:15', '13:15', 'A33834299', 'Quedaremos en la Plaza del Ayuntamiento de Hamburgo, en la entrada principal del edificio del Ayuntamiento (Rathausmarkt 1, 20095 Hamburg, Alemania) LLEGAR CON 15 MINUTOS DE ANTICIPACIÓN', '- Tel: +4915204719263 Ubicación inicio: Plaza del Ayuntamiento (Rathausmarkt).', '', '', 'Plaza del Ayuntamiento (Rathausmarkt).', '', ARRAY['/uploads/activities/attachments-1758593074991-799891605.pdf']),
('808f7b7c-7dcd-4258-8f6d-1b20135c06f2', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'FREE TOUR MUNICH', 'tour', 'Todo Tours Munich', '2025-10-21 16:45:00', '10:45', '13:00', 'C731-T1068-250911-135', 'El día de la actividad, deberan acudir a la hora indicada a la plaza Marienplatz de Múnich. Su guía los estará esperando con un paraguas azul de Todo Tours frente a la Columna de María. Recomendamos llegar con 10 minutos de antelación.', '- Tel: +34623062291 Ubicación inicio: Marienplatz (frente a la Columna de María).', '', '', 'Marienplatz (frente a la Columna de María)', '', ARRAY['/uploads/activities/attachments-1758593149100-199909513.pdf']),
('1f7273d3-b9d6-4548-93c7-136d959c96be', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'FREE TOUR COLONIA', 'tour', 'The Walkings Tours', '2025-10-15 16:30:00', '10:30', '13:00', 'C731-T1253-250911-30', 'El tour comenzará a la hora indicada desde el siguiente punto de la ciudad alemana de Colonia: frente a la Estación Central de Colonia, Alemania (Köln Hauptbahnhof), en la escalinata de la lateral izquierda de la catedral de Colonia.', '- Tel: +4915772431884 Ubicación inicio: Estación Central de Colonia, Alemania.', '', '', 'Estación Central de Colonia, Alemania.', '', ARRAY['/uploads/activities/attachments-1758593024392-442539064.pdf'])
ON CONFLICT (id) DO NOTHING;

-- 5. Insertar TODOS los vuelos de producción
INSERT INTO flights (id, travel_id, airline, flight_number, departure_city, arrival_city, departure_date, arrival_date, departure_terminal, arrival_terminal, class, reservation_number, attachments) VALUES
('a71feea7-2f2e-4200-902c-0033647aef50', 'b9a2864e-c91c-491b-b3a8-8c24cab30c33', 'Volaris', 'AM432', 'SLP Ponciano Arriaga', 'Cancun', '2025-08-31 16:00:00', '2025-08-31 19:30:00', '1', '2', 'premium', '232235', ARRAY[]::text[]),
('98393410-df51-4c80-bfa6-68e61c3c0db1', 'd96a8593-bc27-4a93-86cc-513106594bc1', 'AeroMéxico', 'AM', 'MEX - Origin City', 'Egipto', '2025-09-04 00:00:00', '2025-09-06 02:00:00', '1', '2', 'ejecutiva', 'IDHY65987', ARRAY[]::text[]),
('a552b563-945d-4e2f-8c2a-0b51701e0685', 'a995959b-d2b0-4592-b145-b650865a6086', 'AMERICAN AIRLINES', 'AA 48', 'Dallas/Fort Worth (DFW)', 'Paris Charles de Gaulle (CDG)', '2025-10-25 23:50:00', '2025-10-26 15:05:00', '', '', 'economica', 'LSIHXJ', ARRAY[]::text[]),
('c8a1c133-a72c-4b71-a725-e60e9717b5fc', 'a995959b-d2b0-4592-b145-b650865a6086', 'AMERICAN AIRLINES', 'AA 1440', 'San Luis Potosi-Ponciano Arriaga (SLP)', 'Dallas/Fort Worth (DFW)', '2025-10-25 17:59:00', '2025-10-25 21:14:00', '', '', 'economica', 'JBPNMK', ARRAY[]::text[]),
-- Vuelos de ARGENTINA que estaban faltando
('5e085f2b-447d-46ad-80b1-a7f57aaa9bec', 'df478a23-1e35-4405-b0d5-7c2601cb399d', 'Aerolineas Argentinas (AR)', '1896', 'Buenos Aires-Aeroparque Jorge Newbery (AEP)', 'El Calafate-Comandante Armando Tola (FTE)', '2025-10-04 18:20:00', '2025-10-04 21:14:00', '', '', 'economica', 'YEEEXB', ARRAY[]::text[]),
('82d3da85-e563-4c23-b10b-e4409ce136b6', 'df478a23-1e35-4405-b0d5-7c2601cb399d', 'Aerolineas Argentinas (AR)', '1897', 'El Calafate-Comandante Armando Tola (FTE)', 'Buenos Aires-Aeropuerto Internacional Ezeiza (EZE)', '2025-10-07 23:50:00', '2025-10-08 02:50:00', '', '', 'economica', 'YEEEXB', ARRAY[]::text[]),
('6beff121-f75c-4a62-8f63-4cc264325d1f', 'df478a23-1e35-4405-b0d5-7c2601cb399d', 'JetSmart (JA)', '3736', 'Buenos Aires-Aeroparque Jorge Newbery (AEP)', 'Mendoza-El Plumerillo (Mendoza)', '2025-10-13 20:25:00', '2025-10-13 22:20:00', '', '', 'economica', 'ID2LFK', ARRAY[]::text[]),
('6bef2c39-b1f3-4747-9d81-7068a304f35b', 'df478a23-1e35-4405-b0d5-7c2601cb399d', 'JetSmart (JA)', '3073', 'Mendoza-El Plumerillo (Mendoza)', 'Buenos Aires-Aeroparque Jorge Newbery', '2025-10-16 21:04:00', '2025-10-16 22:41:00', '', '', 'economica', 'ID2LFK', ARRAY[]::text[])
ON CONFLICT (id) DO NOTHING;

-- 6. Insertar TODOS los transportes de producción  
INSERT INTO transports (id, travel_id, type, name, provider, contact_name, contact_number, pickup_date, pickup_location, end_date, dropoff_location, confirmation_number, notes, attachments) VALUES
('2fb00737-4514-486e-abc2-162fa476a4c8', 'b9a2864e-c91c-491b-b3a8-8c24cab30c33', 'autobus', 'Traslado aeropuerto a hotel', 'ADO', 'Hilario P.', '2432435345', '2025-08-31 22:00:00', 'Aeropuerto Cancun salida.', '2025-08-31 18:00:00', 'Hotel Xcaret', '2323534534', 'No aplica.', ARRAY[]::text[]),
('877a1490-ac12-4599-b1e7-0f4281e9217f', 'd96a8593-bc27-4a93-86cc-513106594bc1', 'taxi', 'Traslado de aeropuerto a hotel', 'Taxi El Cairo', 'Ala', '568723135', '2025-09-06 02:30:00', 'Aeropuerto', '2025-09-06 05:00:00', 'Hotel Steigenberger Nile Palace en Luxor,', '9863258741', 'Espacio para notas adicionales', ARRAY[]::text[]),
('efffcfff-4bd0-45eb-965f-69936d4d888c', 'a995959b-d2b0-4592-b145-b650865a6086', 'traslado_privado', 'AEROPUERTO-BUDAPEST', 'Budapest Private Transfers', '', '+36709322948', '2025-10-30 20:55:00', 'AEROPUERTO', '2025-10-30 21:30:00', 'HOTEL BARCELO', 'T2619814', '', ARRAY[]::text[]),
('5186ec2f-4999-44af-a053-865d8ebe6abe', 'a995959b-d2b0-4592-b145-b650865a6086', 'traslado_privado', 'AEROPUERTO-PARIS', 'Move In Paris', '', '0033662920505', '2025-10-26 15:05:00', 'AEROPUERTO', '2025-10-26 16:00:00', 'HOTEL LES JARDINS', 'T2619811', '', ARRAY[]::text[]),
-- Transportes de ARGENTINA que estaban faltando
('d912b5b1-8b94-4d3e-982f-859897506629', 'df478a23-1e35-4405-b0d5-7c2601cb399d', 'traslado_privado', 'aer-aer', 'Angels Transfers & Tours', '(whatsapp)', '+5491157563385', '2025-10-04 11:55:00', 'Aeropuerto de Ezeiza Ministro Pistarini', '2025-10-04 13:00:00', 'Aeroparque Jorge Newbery', 'T2652459', '', ARRAY['/uploads/transports/attachments-1758666785233-666776047.pdf']),
('5dcbcb64-73ff-4e06-ae19-777c135d2f9b', 'df478a23-1e35-4405-b0d5-7c2601cb399d', 'traslado_privado', 'AER-BUENOS AIRES', 'Angels Transfers & Tours', 'whatsapp', '+5491157563385', '2025-10-08 02:50:00', 'Aeropuerto de Ezeiza Ministro Pistarini', '2025-10-08 03:50:00', 'Hotel NH Buenos Aires City, Bolívar 160, Buenos Aires, Ciudad Autónoma de Buenos Aires, Argentina', 'T2652470', '', ARRAY['/uploads/transports/attachments-1758666919536-721765151.pdf']),
('c990316f-193e-42fa-a3c4-ce4366c62523', 'df478a23-1e35-4405-b0d5-7c2601cb399d', 'traslado_privado', 'BUENOS AIRES - AER', 'Angels Transfers & Tours', 'whatsapp', '+5491157563385', '2025-10-13 17:45:00', 'Hotel NH Buenos Aires City, Bolívar 160, Buenos Aires, Ciudad Autónoma de Buenos Aires, Argentina', '2025-10-13 18:30:00', 'Aeroparque Jorge Newbery', 'T2652473', '', ARRAY['/uploads/transports/attachments-1758667022784-970679034.pdf']),
('19b6a4f6-eced-448d-bea9-fa744602c5ef', 'df478a23-1e35-4405-b0d5-7c2601cb399d', 'traslado_privado', 'aer-ba', 'Angels Transfers & Tours', 'whatsapp', '+5491157563385', '2025-10-16 22:40:00', 'Aeroparque Jorge Newbery', '2025-10-16 23:30:00', 'Eurobuilding Hotel Boutique Buenos Aires, Lima, Ciudad Autónoma de Buenos Aires, Argentina', 'T2653314', '', ARRAY['/uploads/transports/attachments-1758667135396-173955372.pdf']),
('6afda03e-0d18-4e09-affc-4248692cfc7b', 'df478a23-1e35-4405-b0d5-7c2601cb399d', 'traslado_privado', 'ba-aer', 'Angels Transfers & Tours', 'whatsapp', '+5491157563385', '2025-10-17 10:00:00', 'Eurobuilding Hotel Boutique Buenos Aires, Lima, Ciudad Autónoma de Buenos Aires, Argentina', '2025-10-17 11:00:00', 'Aeropuerto de Ezeiza Ministro Pistarini', 'T2653317', '', ARRAY['/uploads/transports/attachments-1758667350515-741041709.pdf'])
ON CONFLICT (id) DO NOTHING;

-- 7. Insertar TODAS las notas de producción
INSERT INTO notes (id, travel_id, title, note_date, content, visible_to_travelers, attachments) VALUES
('e466108e-d801-46d6-b8ff-e8d653fa6e4c', 'a995959b-d2b0-4592-b145-b650865a6086', 'IMPRESCINDIBLES PARIS', '2025-10-26 00:00:00', '1. Torre Eiffel – Sube al mirador o disfruta de un picnic en el Campo de Marte. 2. Arco del Triunfo y Campos Elíseos – Pasea por la avenida más famosa. 3. Louvre – Dedica al menos medio día, reserva online. 4. Notre-Dame – Aunque en restauración, su exterior sigue siendo impresionante. 5. Barrio de Montmartre – Basílica del Sagrado Corazón y ambiente bohemio. 6. Palacio de Versalles – Excursión de un día completo (30 min en tren desde París).', true, ARRAY[]::text[]),
('86360f27-7dce-43e0-a7c3-a0eb62a6377f', 'a995959b-d2b0-4592-b145-b650865a6086', 'IMPRESCINDIBLES BUDAPEST', '2025-10-31 00:00:00', '1. Bastión de los Pescadores (Halászbástya) – Vistas panorámicas espectaculares del Danubio y el Parlamento. 2. Parlamento Húngaro – Tour guiado en español para conocer su arquitectura e historia. 3. Balnearios termales – Széchenyi o Gellért para una experiencia relajante. 4. Mercado Central – Gastronomía local y souvenirs. 5. Castillo de Buda – Barrio histórico con museos y vistas. 6. Crucero nocturno por el Danubio – El Parlamento iluminado es impresionante.', true, ARRAY[]::text[]),
('f8a5c2e9-1b3d-4c7e-9f8a-2e1d3c4b5a6e', 'a995959b-d2b0-4592-b145-b650865a6086', 'RECOMENDACIONES GENERALES', '2025-10-25 00:00:00', 'Documentación: Lleva tu pasaporte y una copia de seguridad. Moneda: Euro en ambos países. Propinas: 10-15% en restaurantes si no está incluido el servicio. Transporte: Compra tarjetas de transporte público diarias. Idioma: Francés en París, húngaro en Budapest (inglés ampliamente hablado). Clima: Octubre puede ser fresco, lleva abrigo ligero.', true, ARRAY[]::text[]),
-- Notas de ALEMANIA
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'GUÍA ALEMANIA - CIUDADES PRINCIPALES', '2025-10-14 00:00:00', 'COLONIA: Famosa por su catedral gótica (Kölner Dom), una de las más impresionantes de Europa. HAMBURGO: Ciudad portuaria con el famoso barrio de entretenimiento Reeperbahn y hermosos canales. BERLÍN: Capital rica en historia, desde el Muro de Berlín hasta la Puerta de Brandeburgo. MÚNICH: Capital de Baviera, conocida por su Oktoberfest y arquitectura tradicional alemana.', true, ARRAY[]::text[]),
('b2c3d4e5-f6g7-8901-bcde-f23456789012', '5948ede8-258b-4cd3-9f44-be08adccf9d5', 'INFORMACIÓN PRÁCTICA ALEMANIA', '2025-10-14 00:00:00', 'Moneda: Euro (€). Idioma: Alemán (inglés ampliamente hablado en zonas turísticas). Transporte: Excelente sistema de trenes (DB) y transporte público. Propinas: 5-10% en restaurantes. Horarios: Tiendas cierran temprano los domingos. Clima octubre: Fresco, temperatura 8-15°C, lleva ropa abrigada.', true, ARRAY[]::text[])
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- Verificar importación final
SELECT 
    'RESUMEN FINAL IMPORTACIÓN' as categoria,
    '' as detalle,
    COUNT(*)::text as cantidad
FROM (
    SELECT 'USUARIOS TOTALES' as tipo, COUNT(*) as cantidad FROM users
    UNION ALL
    SELECT 'VIAJES TOTALES', COUNT(*) FROM travels
    UNION ALL
    SELECT 'ALOJAMIENTOS', COUNT(*) FROM accommodations
    UNION ALL
    SELECT 'ACTIVIDADES', COUNT(*) FROM activities
    UNION ALL
    SELECT 'VUELOS', COUNT(*) FROM flights
    UNION ALL
    SELECT 'TRANSPORTES', COUNT(*) FROM transports
    UNION ALL
    SELECT 'NOTAS', COUNT(*) FROM notes
    UNION ALL
    SELECT 'CRUCEROS', COUNT(*) FROM cruises
    UNION ALL
    SELECT 'SEGUROS', COUNT(*) FROM insurances
) summary;

-- Verificar datos específicos del viaje ARGENTINA
SELECT 
    'ARGENTINA - VERIFICACIÓN' as info,
    '' as detalle,
    '' as cantidad
UNION ALL
SELECT 'ALOJAMIENTOS', '', COUNT(*)::text FROM accommodations WHERE travel_id = 'df478a23-1e35-4405-b0d5-7c2601cb399d'
UNION ALL
SELECT 'ACTIVIDADES', '', COUNT(*)::text FROM activities WHERE travel_id = 'df478a23-1e35-4405-b0d5-7c2601cb399d'
UNION ALL
SELECT 'VUELOS', '', COUNT(*)::text FROM flights WHERE travel_id = 'df478a23-1e35-4405-b0d5-7c2601cb399d'
UNION ALL
SELECT 'TRANSPORTES', '', COUNT(*)::text FROM transports WHERE travel_id = 'df478a23-1e35-4405-b0d5-7c2601cb399d'
UNION ALL
SELECT 'NOTAS', '', COUNT(*)::text FROM notes WHERE travel_id = 'df478a23-1e35-4405-b0d5-7c2601cb399d';
