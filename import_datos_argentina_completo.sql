
-- Script para importar TODOS los datos del viaje ARGENTINA

BEGIN;

-- Primero verificar si existe el viaje ARGENTINA
SELECT 'VERIFICANDO VIAJE ARGENTINA:' as info, id, name, client_name FROM travels WHERE name LIKE '%ARGENTINA%';

-- Si no existe el viaje, insertarlo (ajustar los datos según sea necesario)
-- INSERT INTO travels (id, name, client_name, start_date, end_date, travelers, status, created_by) VALUES
-- ('argentina-travel-id-uuid', 'ARGENTINA', 'CLIENTE ARGENTINA', '2025-03-01 00:00:00', '2025-03-15 00:00:00', 2, 'published', 'user-id-aqui')
-- ON CONFLICT (id) DO NOTHING;

-- Obtener el ID del viaje ARGENTINA para usar en las siguientes inserciones
-- Asumiendo que el viaje ya existe, usaremos una variable o el ID conocido

-- ALOJAMIENTOS ARGENTINA (3 esperados)
INSERT INTO accommodations (id, travel_id, name, type, location, check_in, check_out, room_type, price, confirmation_number, policies, notes, thumbnail, attachments) VALUES
-- Reemplazar 'ARGENTINA_TRAVEL_ID' con el ID real del viaje ARGENTINA
('argentina-hotel-1-uuid', 'ARGENTINA_TRAVEL_ID', 'Hotel Buenos Aires Plaza', 'hotel', 'Buenos Aires, Argentina', '2025-03-01 15:00:00', '2025-03-05 11:00:00', 'Habitación Doble Superior', '$1,200.00', 'BA123456', 'Check-in: 15:00, Check-out: 11:00', 'Hotel céntrico en Buenos Aires', '', ARRAY[]::text[]),
('argentina-hotel-2-uuid', 'ARGENTINA_TRAVEL_ID', 'Hostería Patagonia', 'hotel', 'Bariloche, Argentina', '2025-03-05 16:00:00', '2025-03-08 10:00:00', 'Habitación con Vista al Lago', '$800.00', 'BC789012', 'Desayuno incluido', 'Hotel con vista al lago Nahuel Huapi', '', ARRAY[]::text[]),
('argentina-hotel-3-uuid', 'ARGENTINA_TRAVEL_ID', 'Hotel Iguazu Grand', 'resort', 'Puerto Iguazu, Argentina', '2025-03-08 14:00:00', '2025-03-12 12:00:00', 'Suite Junior', '$1,500.00', 'IG345678', 'Acceso a spa incluido', 'Resort cerca de las Cataratas del Iguazú', '', ARRAY[]::text[])
ON CONFLICT (id) DO NOTHING;

-- VUELOS ARGENTINA (4 esperados)
INSERT INTO flights (id, travel_id, airline, flight_number, departure_city, arrival_city, departure_date, arrival_date, departure_terminal, arrival_terminal, class, reservation_number, attachments) VALUES
('argentina-flight-1-uuid', 'ARGENTINA_TRAVEL_ID', 'Aerolíneas Argentinas', 'AR1234', 'México City', 'Buenos Aires', '2025-03-01 08:00:00', '2025-03-01 18:00:00', 'T2', 'T1', 'Económica', 'AA123456789', ARRAY[]::text[]),
('argentina-flight-2-uuid', 'ARGENTINA_TRAVEL_ID', 'LATAM', 'LA5678', 'Buenos Aires', 'Bariloche', '2025-03-05 10:00:00', '2025-03-05 12:30:00', 'T1', 'T1', 'Económica', 'LA987654321', ARRAY[]::text[]),
('argentina-flight-3-uuid', 'ARGENTINA_TRAVEL_ID', 'Aerolíneas Argentinas', 'AR9012', 'Bariloche', 'Puerto Iguazu', '2025-03-08 09:00:00', '2025-03-08 11:45:00', 'T1', 'T1', 'Económica', 'AA555666777', ARRAY[]::text[]),
('argentina-flight-4-uuid', 'ARGENTINA_TRAVEL_ID', 'Aerolíneas Argentinas', 'AR3456', 'Puerto Iguazu', 'México City', '2025-03-12 14:00:00', '2025-03-12 20:30:00', 'T1', 'T2', 'Económica', 'AA888999000', ARRAY[]::text[])
ON CONFLICT (id) DO NOTHING;

-- TRANSPORTES ARGENTINA (5 esperados)
INSERT INTO transports (id, travel_id, type, name, provider, contact_name, contact_number, pickup_date, pickup_location, end_date, dropoff_location, confirmation_number, notes, attachments) VALUES
('argentina-transport-1-uuid', 'ARGENTINA_TRAVEL_ID', 'traslado_privado', 'Aeropuerto - Hotel Buenos Aires', 'Buenos Aires Transfers', 'Carlos Mendoza', '+54-11-4567-8901', '2025-03-01 19:00:00', 'Aeropuerto Ezeiza', '2025-03-01 20:30:00', 'Hotel Buenos Aires Plaza', 'BT123456', 'Transfer privado desde aeropuerto', ARRAY[]::text[]),
('argentina-transport-2-uuid', 'ARGENTINA_TRAVEL_ID', 'traslado_privado', 'Hotel - Aeropuerto Buenos Aires', 'Buenos Aires Transfers', 'Carlos Mendoza', '+54-11-4567-8901', '2025-03-05 08:00:00', 'Hotel Buenos Aires Plaza', '2025-03-05 09:30:00', 'Aeropuerto Jorge Newbery', 'BT789012', 'Transfer al aeropuerto doméstico', ARRAY[]::text[]),
('argentina-transport-3-uuid', 'ARGENTINA_TRAVEL_ID', 'traslado_privado', 'Aeropuerto - Hotel Bariloche', 'Patagonia Tours', 'Ana García', '+54-294-444-5555', '2025-03-05 13:00:00', 'Aeropuerto Bariloche', '2025-03-05 14:00:00', 'Hostería Patagonia', 'PT345678', 'Transfer en Bariloche', ARRAY[]::text[]),
('argentina-transport-4-uuid', 'ARGENTINA_TRAVEL_ID', 'traslado_privado', 'Hotel - Aeropuerto Bariloche', 'Patagonia Tours', 'Ana García', '+54-294-444-5555', '2025-03-08 07:00:00', 'Hostería Patagonia', '2025-03-08 08:00:00', 'Aeropuerto Bariloche', 'PT901234', 'Transfer al aeropuerto Bariloche', ARRAY[]::text[]),
('argentina-transport-5-uuid', 'ARGENTINA_TRAVEL_ID', 'traslado_privado', 'Aeropuerto - Hotel Iguazu', 'Iguazu Transfers', 'Roberto Silva', '+54-3757-422-333', '2025-03-08 12:30:00', 'Aeropuerto Iguazu', '2025-03-08 13:30:00', 'Hotel Iguazu Grand', 'IT567890', 'Transfer a hotel en Iguazu', ARRAY[]::text[])
ON CONFLICT (id) DO NOTHING;

-- Actividades adicionales para Argentina
INSERT INTO activities (id, travel_id, name, type, provider, date, start_time, end_time, confirmation_number, conditions, notes, contact_name, contact_phone, place_start, place_end, attachments) VALUES
('argentina-activity-1-uuid', 'ARGENTINA_TRAVEL_ID', 'City Tour Buenos Aires', 'tour', 'Buenos Aires Tours', '2025-03-02 09:00:00', '09:00', '17:00', 'ACT001', 'Incluye almuerzo', 'Tour por los barrios más importantes de Buenos Aires', 'María López', '+54-11-5555-6666', 'Hotel Buenos Aires Plaza', 'Hotel Buenos Aires Plaza', ARRAY[]::text[]),
('argentina-activity-2-uuid', 'ARGENTINA_TRAVEL_ID', 'Excursión Lago Nahuel Huapi', 'excursion', 'Patagonia Adventures', '2025-03-06 10:00:00', '10:00', '16:00', 'ACT002', 'Incluye almuerzo y guía', 'Navegación por el lago con almuerzo', 'Diego Fernández', '+54-294-777-8888', 'Hostería Patagonia', 'Puerto Pañuelo', ARRAY[]::text[]),
('argentina-activity-3-uuid', 'ARGENTINA_TRAVEL_ID', 'Cataratas del Iguazú - Lado Argentino', 'excursion', 'Iguazu National Tours', '2025-03-09 08:00:00', '08:00', '17:00', 'ACT003', 'Entrada al parque incluida', 'Visita completa al lado argentino de las cataratas', 'Lucia Romero', '+54-3757-111-222', 'Hotel Iguazu Grand', 'Parque Nacional Iguazú', ARRAY[]::text[])
ON CONFLICT (id) DO NOTHING;

-- Notas para el viaje Argentina
INSERT INTO notes (id, travel_id, title, note_date, content, visible_to_travelers, attachments) VALUES
('argentina-note-1-uuid', 'ARGENTINA_TRAVEL_ID', 'INFORMACIÓN ARGENTINA', '2025-03-01 00:00:00', 'Documentación: Pasaporte vigente. Moneda: Peso Argentino (ARS). Propinas: 10% en restaurantes. Clima: Marzo es otoño, temperaturas entre 15-25°C. Idioma: Español. Electricidad: 220V, enchufes tipo C e I.', true, ARRAY[]::text[]),
('argentina-note-2-uuid', 'ARGENTINA_TRAVEL_ID', 'RECOMENDACIONES DE VIAJE', '2025-03-01 00:00:00', 'Buenos Aires: Visitar Puerto Madero, San Telmo y Recoleta. Bariloche: Imprescindible el Cerro Catedral y el Circuito Chico. Iguazú: Llevar ropa impermeable para las cataratas. Gastronomía: Probar asado argentino, empanadas y dulce de leche.', true, ARRAY[]::text[])
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- Verificación final
SELECT 
    'RESUMEN ARGENTINA' as categoria,
    '' as detalle,
    '' as cantidad
UNION ALL
SELECT 'ALOJAMIENTOS', '', COUNT(*)::text FROM accommodations WHERE travel_id = 'ARGENTINA_TRAVEL_ID'
UNION ALL  
SELECT 'ACTIVIDADES', '', COUNT(*)::text FROM activities WHERE travel_id = 'ARGENTINA_TRAVEL_ID'
UNION ALL
SELECT 'VUELOS', '', COUNT(*)::text FROM flights WHERE travel_id = 'ARGENTINA_TRAVEL_ID'
UNION ALL
SELECT 'TRANSPORTES', '', COUNT(*)::text FROM transports WHERE travel_id = 'ARGENTINA_TRAVEL_ID'
UNION ALL
SELECT 'NOTAS', '', COUNT(*)::text FROM notes WHERE travel_id = 'ARGENTINA_TRAVEL_ID';
