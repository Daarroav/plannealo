ALTER TABLE "accommodations" ADD COLUMN "attachments" text[];--> statement-breakpoint
ALTER TABLE "travels" ADD COLUMN "public_token" text;--> statement-breakpoint
ALTER TABLE "travels" ADD COLUMN "public_token_expiry" timestamp;--> statement-breakpoint
ALTER TABLE "travels" ADD COLUMN "client_id" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "travels" ADD CONSTRAINT "travels_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;