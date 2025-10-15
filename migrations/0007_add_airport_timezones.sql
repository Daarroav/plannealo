
-- Agregar columnas faltantes a la tabla airports
ALTER TABLE "airports" ADD COLUMN IF NOT EXISTS "latitude" text;
ALTER TABLE "airports" ADD COLUMN IF NOT EXISTS "longitude" text;
ALTER TABLE "airports" ADD COLUMN IF NOT EXISTS "timezones" json NOT NULL DEFAULT '[]';

-- Actualizar registros existentes con zona horaria por defecto
UPDATE "airports" SET "timezones" = '[{"name":"Zona horaria (1 enero - 31 diciembre)","timezone":"UTC","startDate":"01-01","endDate":"12-31"}]'::json WHERE "timezones" = '[]'::json;
