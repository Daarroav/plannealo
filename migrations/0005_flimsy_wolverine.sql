CREATE TABLE "airports" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"country" text NOT NULL,
	"city" text NOT NULL,
	"state" text,
	"airport_name" text NOT NULL,
	"iata_code" text,
	"icao_code" text,
	"latitude" text,
	"longitude" text,
	"timezones" json NOT NULL,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE "flights" ADD COLUMN "departure_timezone" text;--> statement-breakpoint
ALTER TABLE "flights" ADD COLUMN "arrival_timezone" text;--> statement-breakpoint
ALTER TABLE "airports" ADD CONSTRAINT "airports_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accommodations" ADD CONSTRAINT "accommodations_travel_id_travels_id_fk" FOREIGN KEY ("travel_id") REFERENCES "public"."travels"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_travel_id_travels_id_fk" FOREIGN KEY ("travel_id") REFERENCES "public"."travels"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flights" ADD CONSTRAINT "flights_travel_id_travels_id_fk" FOREIGN KEY ("travel_id") REFERENCES "public"."travels"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transports" ADD CONSTRAINT "transports_travel_id_travels_id_fk" FOREIGN KEY ("travel_id") REFERENCES "public"."travels"("id") ON DELETE restrict ON UPDATE no action;