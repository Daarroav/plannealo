
-- Script de importación completa de usuarios y datos relacionados

-- 1. Primero, insertar TODOS los usuarios necesarios
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
ON CONFLICT (id) DO UPDATE SET 
    username = EXCLUDED.username,
    password = EXCLUDED.password,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    created_at = EXCLUDED.created_at;

-- 2. Ahora insertar los viajes con las referencias correctas
INSERT INTO travels (id, name, client_name, start_date, end_date, travelers, status, cover_image, created_by, created_at, updated_at, public_token, public_token_expiry, client_id) VALUES
('a995959b-d2b0-4592-b145-b650865a6086', 'PARIS Y BUDAPEST', 'MARIA ESTHELA YAÑEZ GONZALEZ', '2025-10-25 00:00:00', '2025-11-03 00:00:00', 5, 'published', '/objects/uploads/38eb6f7f-e1b8-4291-b076-012100ac7872', 'b5430f92-5136-4544-b062-106671203718', '2025-09-01 22:19:21.756', '2025-09-02 03:12:03.446', 'f558d7d1ef46f47fb469a036c7ce464874f161adaa5d91acb3783c705dd23260', '2025-10-01 23:29:12.92', '13b8d38e-fc35-4748-9f38-f78eb3b012aa'),
('5948ede8-258b-4cd3-9f44-be08adccf9d5', 'ALEMANIA', 'MARIO REYES', '2025-10-14 12:00:00', '2025-10-22 12:00:00', 2, 'published', '/objects/uploads/6d786487-1f2e-4197-beb1-ddd5349e440b', 'b5430f92-5136-4544-b062-106671203718', '2025-09-11 18:01:56.838', '2025-09-23 02:12:14.398', '3fda3d95393eefbce47ac02ddb4946e5296efd9fd97d906f923faa6ad46a7a47', '2025-10-11 18:40:34.439', '147bf23f-f047-45bc-9eed-8b0c6736dca7'),
('c1907a9d-4be8-4e5f-accd-1dbf102f4d83', 'DUBAI Y EGIPTO', 'Alejandro y Mariana', '2025-10-30 00:00:00', '2025-11-06 00:00:00', 2, 'draft', '/objects/uploads/c115c2e0-b08c-4314-97a3-634a22e6a56e', 'b5430f92-5136-4544-b062-106671203718', '2025-09-09 23:55:54.855', '2025-09-09 23:55:56.21', NULL, NULL, '13b8d38e-fc35-4748-9f38-f78eb3b012aa')
ON CONFLICT (id) DO NOTHING;

COMMIT;
