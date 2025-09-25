
-- Add foreign key constraints for better data integrity
ALTER TABLE "accommodations" ADD CONSTRAINT "accommodations_travel_id_travels_id_fk" FOREIGN KEY ("travel_id") REFERENCES "travels"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "activities" ADD CONSTRAINT "activities_travel_id_travels_id_fk" FOREIGN KEY ("travel_id") REFERENCES "travels"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "flights" ADD CONSTRAINT "flights_travel_id_travels_id_fk" FOREIGN KEY ("travel_id") REFERENCES "travels"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "transports" ADD CONSTRAINT "transports_travel_id_travels_id_fk" FOREIGN KEY ("travel_id") REFERENCES "travels"("id") ON DELETE cascade ON UPDATE no action;
