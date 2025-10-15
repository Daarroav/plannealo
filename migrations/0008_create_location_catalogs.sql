
-- Crear tabla de países
CREATE TABLE IF NOT EXISTS "countries" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL UNIQUE,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de estados
CREATE TABLE IF NOT EXISTS "states" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "country_id" varchar NOT NULL REFERENCES "countries"("id") ON DELETE CASCADE,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("name", "country_id")
);

-- Crear tabla de ciudades
CREATE TABLE IF NOT EXISTS "cities" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "state_id" varchar REFERENCES "states"("id") ON DELETE CASCADE,
  "country_id" varchar NOT NULL REFERENCES "countries"("id") ON DELETE CASCADE,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("name", "state_id", "country_id")
);

-- Crear índices para mejorar búsquedas
CREATE INDEX IF NOT EXISTS "idx_states_country" ON "states"("country_id");
CREATE INDEX IF NOT EXISTS "idx_cities_state" ON "cities"("state_id");
CREATE INDEX IF NOT EXISTS "idx_cities_country" ON "cities"("country_id");

-- Actualizar tabla de aeropuertos para usar referencias
ALTER TABLE "airports" ADD COLUMN IF NOT EXISTS "country_id" varchar REFERENCES "countries"("id");
ALTER TABLE "airports" ADD COLUMN IF NOT EXISTS "state_id" varchar REFERENCES "states"("id");
ALTER TABLE "airports" ADD COLUMN IF NOT EXISTS "city_id" varchar REFERENCES "cities"("id");
