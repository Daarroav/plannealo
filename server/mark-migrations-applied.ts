
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

async function markMigrationsAsApplied() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set for production environment');
  }

  console.log('🔧 Marcando migraciones antiguas como aplicadas en PRODUCCIÓN...\n');

  const sql = neon(databaseUrl);

  try {
    // 1. Crear el schema y tabla de migraciones de Drizzle si no existe
    console.log('1️⃣ Creando tabla de migraciones de Drizzle...');
    await sql`CREATE SCHEMA IF NOT EXISTS drizzle;`;
    await sql`
      CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
        id SERIAL PRIMARY KEY,
        hash text NOT NULL,
        created_at bigint
      );
    `;
    console.log('✅ Tabla de migraciones creada\n');

    // 2. Leer los archivos SQL para obtener sus hashes
    const migrationsToMark = [
      '0000_overrated_the_captain.sql',
      '0001_hot_medusa.sql', 
      '0002_late_proudstar.sql',
      '0004_safe_foreign_keys.sql',
      '0005_add_timezone_columns.sql'
    ];

    console.log('2️⃣ Calculando hashes de las migraciones...');
    
    for (const filename of migrationsToMark) {
      const filePath = path.join('./migrations', filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      const hash = crypto.createHash('sha256').update(content).digest('hex');
      
      // Verificar si ya está marcada
      const existing = await sql`
        SELECT * FROM drizzle.__drizzle_migrations WHERE hash = ${hash};
      `;

      if (existing.length > 0) {
        console.log(`⏭️  ${filename} - Ya estaba marcada como aplicada`);
      } else {
        // Marcar como aplicada
        await sql`
          INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
          VALUES (${hash}, ${Date.now()});
        `;
        console.log(`✅ ${filename} - Marcada como aplicada`);
      }
    }

    console.log('\n✅ Migraciones antiguas marcadas como aplicadas');
    console.log('💡 Ahora puedes ejecutar: NODE_ENV=production tsx server/migrate.ts');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }

  process.exit(0);
}

markMigrationsAsApplied();
