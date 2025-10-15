
-- Crear tabla de aeropuertos
CREATE TABLE IF NOT EXISTS "airports" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "country" text NOT NULL,
  "city" text NOT NULL,
  "state" text,
  "airport_name" text NOT NULL,
  "iata_code" text,
  "icao_code" text,
  "created_by" varchar NOT NULL,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Agregar foreign key
ALTER TABLE "airports" ADD CONSTRAINT "airports_created_by_users_id_fk" 
  FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS "airports_country_idx" ON "airports"("country");
CREATE INDEX IF NOT EXISTS "airports_city_idx" ON "airports"("city");
CREATE INDEX IF NOT EXISTS "airports_iata_code_idx" ON "airports"("iata_code");
CREATE INDEX IF NOT EXISTS "airports_icao_code_idx" ON "airports"("icao_code");
