import { sql } from 'drizzle-orm';

export async function up(db) {
  // Agregar la columna client_id como referencia a la tabla users
  await db.run(sql`
    ALTER TABLE travels 
    ADD COLUMN client_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL;
    ADD COLUMN IF NOT EXISTS public_token TEXT,
    ADD COLUMN IF NOT EXISTS public_token_expiry TIMESTAMP;
  `);
}

export async function down(db) {
  // Eliminar la restricción de clave foránea y luego la columna
  await db.run(sql`
    ALTER TABLE travels
    DROP CONSTRAINT IF EXISTS fk_client,
    DROP COLUMN IF EXISTS client_id;
    DROP COLUMN IF EXISTS public_token;
    DROP COLUMN IF EXISTS public_token_expiry;
  `);
}
