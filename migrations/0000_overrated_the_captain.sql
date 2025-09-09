CREATE TABLE "accommodations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"travel_id" varchar NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"location" text NOT NULL,
	"check_in" timestamp NOT NULL,
	"check_out" timestamp NOT NULL,
	"room_type" text NOT NULL,
	"price" text,
	"confirmation_number" text,
	"policies" text,
	"notes" text,
	"thumbnail" text,
	"attachments" text[]
);
--> statement-breakpoint
CREATE TABLE "activities" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"travel_id" varchar NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"provider" text,
	"date" timestamp NOT NULL,
	"start_time" text,
	"end_time" text,
	"confirmation_number" text,
	"conditions" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "cruises" (
	"id" text PRIMARY KEY NOT NULL,
	"travel_id" text NOT NULL,
	"cruise_line" text NOT NULL,
	"confirmation_number" text,
	"departure_date" timestamp NOT NULL,
	"departure_port" text NOT NULL,
	"arrival_date" timestamp NOT NULL,
	"arrival_port" text NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "flights" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"travel_id" varchar NOT NULL,
	"airline" text NOT NULL,
	"flight_number" text NOT NULL,
	"departure_city" text NOT NULL,
	"arrival_city" text NOT NULL,
	"departure_date" timestamp NOT NULL,
	"arrival_date" timestamp NOT NULL,
	"departure_terminal" text,
	"arrival_terminal" text,
	"class" text NOT NULL,
	"reservation_number" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "insurances" (
	"id" text PRIMARY KEY NOT NULL,
	"travel_id" text NOT NULL,
	"provider" text NOT NULL,
	"policy_number" text NOT NULL,
	"policy_type" text NOT NULL,
	"emergency_number" text,
	"effective_date" timestamp NOT NULL,
	"important_info" text,
	"policy_description" text,
	"attachments" text[],
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" text PRIMARY KEY NOT NULL,
	"travel_id" text NOT NULL,
	"title" text NOT NULL,
	"note_date" timestamp NOT NULL,
	"content" text NOT NULL,
	"visible_to_travelers" boolean DEFAULT true NOT NULL,
	"attachments" text[]
);
--> statement-breakpoint
CREATE TABLE "transports" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"travel_id" varchar NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"provider" text,
	"contact_name" text,
	"contact_number" text,
	"pickup_date" timestamp NOT NULL,
	"pickup_location" text NOT NULL,
	"end_date" timestamp,
	"dropoff_location" text,
	"confirmation_number" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "travels" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"client_name" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"travelers" integer NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"cover_image" text,
	"public_token" text,
	"public_token_expiry" timestamp,
	"client_id" varchar,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"role" text DEFAULT 'agent',
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "cruises" ADD CONSTRAINT "cruises_travel_id_travels_id_fk" FOREIGN KEY ("travel_id") REFERENCES "public"."travels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insurances" ADD CONSTRAINT "insurances_travel_id_travels_id_fk" FOREIGN KEY ("travel_id") REFERENCES "public"."travels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_travel_id_travels_id_fk" FOREIGN KEY ("travel_id") REFERENCES "public"."travels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "travels" ADD CONSTRAINT "travels_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;