
-- Eliminar las foreign keys con CASCADE
ALTER TABLE "accommodations" DROP CONSTRAINT IF EXISTS "accommodations_travel_id_travels_id_fk";
ALTER TABLE "activities" DROP CONSTRAINT IF EXISTS "activities_travel_id_travels_id_fk";
ALTER TABLE "flights" DROP CONSTRAINT IF EXISTS "flights_travel_id_travels_id_fk";
ALTER TABLE "transports" DROP CONSTRAINT IF EXISTS "transports_travel_id_travels_id_fk";

-- Recrearlas con RESTRICT pero SIN VALIDAR datos existentes (NOT VALID)
ALTER TABLE "accommodations" ADD CONSTRAINT "accommodations_travel_id_travels_id_fk" 
  FOREIGN KEY ("travel_id") REFERENCES "travels"("id") ON DELETE RESTRICT ON UPDATE NO ACTION NOT VALID;

ALTER TABLE "activities" ADD CONSTRAINT "activities_travel_id_travels_id_fk" 
  FOREIGN KEY ("travel_id") REFERENCES "travels"("id") ON DELETE RESTRICT ON UPDATE NO ACTION NOT VALID;

ALTER TABLE "flights" ADD CONSTRAINT "flights_travel_id_travels_id_fk" 
  FOREIGN KEY ("travel_id") REFERENCES "travels"("id") ON DELETE RESTRICT ON UPDATE NO ACTION NOT VALID;

ALTER TABLE "transports" ADD CONSTRAINT "transports_travel_id_travels_id_fk" 
  FOREIGN KEY ("travel_id") REFERENCES "travels"("id") ON DELETE RESTRICT ON UPDATE NO ACTION NOT VALID;
