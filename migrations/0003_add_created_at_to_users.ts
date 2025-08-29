import { sql } from "drizzle-orm";

export async function up(db) {
  await db.run(sql`
    ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
  `);
}

export async function down(db) {
  await db.run(sql`
    ALTER TABLE users 
    DROP COLUMN IF EXISTS created_at;
  `);
}
