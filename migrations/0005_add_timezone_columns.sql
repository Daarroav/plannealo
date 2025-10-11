
-- Agregar columnas de zona horaria a la tabla flights
ALTER TABLE "flights" ADD COLUMN IF NOT EXISTS "departure_timezone" text;
ALTER TABLE "flights" ADD COLUMN IF NOT EXISTS "arrival_timezone" text;
