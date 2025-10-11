
-- Eliminar las foreign keys con CASCADE
ALTER TABLE "accommodations" DROP CONSTRAINT IF EXISTS "accommodations_travel_id_travels_id_fk";
ALTER TABLE "activities" DROP CONSTRAINT IF EXISTS "activities_travel_id_travels_id_fk";
ALTER TABLE "flights" DROP CONSTRAINT IF EXISTS "flights_travel_id_travels_id_fk";
ALTER TABLE "transports" DROP CONSTRAINT IF EXISTS "transports_travel_id_travels_id_fk";

-- Recrearlas con RESTRICT (más seguro)
ALTER TABLE "accommodations" ADD CONSTRAINT "accommodations_travel_id_travels_id_fk" 
  FOREIGN KEY ("travel_id") REFERENCES "travels"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

ALTER TABLE "activities" ADD CONSTRAINT "activities_travel_id_travels_id_fk" 
  FOREIGN KEY ("travel_id") REFERENCES "travels"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

ALTER TABLE "flights" ADD CONSTRAINT "flights_travel_id_travels_id_fk" 
  FOREIGN KEY ("travel_id") REFERENCES "travels"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

ALTER TABLE "transports" ADD CONSTRAINT "transports_travel_id_travels_id_fk" 
  FOREIGN KEY ("travel_id") REFERENCES "travels"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
