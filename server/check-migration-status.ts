
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

async function checkMigrationStatus() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set for production environment');
  }

  console.log('🔍 Verificando estado de migraciones en PRODUCCIÓN...\n');
  console.log(`📍 Database: ${databaseUrl.substring(0, 50)}...\n`);

  const sql = neon(databaseUrl);

  try {
    // Verificar si existe la tabla de migraciones de Drizzle
    const migrationTableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'drizzle' 
        AND table_name = '__drizzle_migrations'
      );
    `;

    if (!migrationTableExists[0].exists) {
      console.log('❌ La tabla drizzle.__drizzle_migrations NO existe');
      console.log('💡 Esto significa que Drizzle nunca ha ejecutado migraciones en esta base de datos\n');
      
      console.log('🔧 SOLUCIÓN:');
      console.log('   Necesitas marcar las migraciones existentes como aplicadas manualmente:\n');
      console.log('   1. Ejecuta este SQL en la consola de Neon:');
      console.log('      CREATE SCHEMA IF NOT EXISTS drizzle;');
      console.log('      CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (');
      console.log('        id SERIAL PRIMARY KEY,');
      console.log('        hash text NOT NULL,');
      console.log('        created_at bigint');
      console.log('      );\n');
      console.log('   2. Luego marca las migraciones 0000, 0001, 0002 como aplicadas');
      return;
    }

    // Listar migraciones aplicadas
    const appliedMigrations = await sql`
      SELECT * FROM drizzle.__drizzle_migrations ORDER BY id;
    `;

    if (appliedMigrations.length === 0) {
      console.log('⚠️  La tabla de migraciones existe pero está VACÍA');
      console.log('💡 Las tablas fueron creadas manualmente, no por Drizzle\n');
    } else {
      console.log('✅ Migraciones aplicadas:');
      appliedMigrations.forEach((m: any) => {
        console.log(`   - ID: ${m.id}, Hash: ${m.hash}, Fecha: ${new Date(Number(m.created_at)).toISOString()}`);
      });
    }

    // Verificar qué tablas existen
    console.log('\n📊 Tablas existentes en la base de datos:');
    const tables = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    tables.forEach((t: any) => {
      console.log(`   - ${t.table_name}`);
    });

  } catch (error) {
    console.error('\n❌ Error:', error);
  }

  process.exit(0);
}

checkMigrationStatus();
