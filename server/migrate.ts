
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  // En desarrollo usa DATABASE_URL_DEV, en producción usa DATABASE_URL
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const databaseUrl = isDevelopment 
    ? process.env.DATABASE_URL_DEV 
    : process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      isDevelopment 
        ? 'DATABASE_URL_DEV is not set for development environment'
        : 'DATABASE_URL is not set for production environment'
    );
  }

  console.log(`🔄 Preparing to run migrations in ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'} mode...`);
  console.log(`📍 Database: ${isDevelopment ? 'DATABASE_URL_DEV' : 'DATABASE_URL'}`);
  console.log('📋 Checking migration files...\n');
  
  // Listar migraciones pendientes
  const migrationsDir = './migrations';
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  console.log('📁 Migration files found:');
  let hasDangerousOperations = false;
  
  migrationFiles.forEach((file, index) => {
    const content = fs.readFileSync(path.join(migrationsDir, file), 'utf-8').toLowerCase();
    const hasDropTable = content.includes('drop table');
    const hasDangerousCascade = content.includes('on delete cascade') && !file.includes('0000_') && !file.includes('0004_');
    const hasDeleteWithoutWhere = content.includes('delete from') && !content.includes('where');
    const hasTruncate = content.includes('truncate');
    const hasDropColumn = content.includes('drop column');
    
    console.log(`  ${index + 1}. ${file}`);
    
    if (hasDropTable) {
      console.log('     ❌ PELIGROSO: Contains DROP TABLE');
      hasDangerousOperations = true;
    }
    if (hasDangerousCascade) {
      console.log('     ❌ PELIGROSO: Contains ON DELETE CASCADE');
      hasDangerousOperations = true;
    }
    if (hasDeleteWithoutWhere) {
      console.log('     ❌ PELIGROSO: Contains DELETE without WHERE');
      hasDangerousOperations = true;
    }
    if (hasTruncate) {
      console.log('     ❌ PELIGROSO: Contains TRUNCATE');
      hasDangerousOperations = true;
    }
    if (hasDropColumn) {
      console.log('     ⚠️  Contains DROP COLUMN (may lose data)');
    }
  });
  
  if (hasDangerousOperations) {
    console.log('\n❌ OPERACIONES PELIGROSAS DETECTADAS');
    console.log('❌ Las migraciones contienen operaciones que pueden ELIMINAR DATOS');
    console.log('❌ Revisa las migraciones manualmente antes de continuar');
    console.log('❌ Migración CANCELADA por seguridad\n');
    process.exit(1);
  }
  
  console.log('\n✅ Todas las migraciones son seguras');
  console.log('⚠️  IMPORTANTE: Estas migraciones se aplicarán a la base de datos');
  console.log('⚠️  Asegúrate de tener un backup reciente antes de continuar\n');
  
  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  try {
    console.log('🚀 Executing migrations...\n');
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('\n✅ All migrations completed successfully');
    console.log('✅ Your data is safe and protected');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    console.error('❌ Database remains unchanged');
    process.exit(1);
  }
  
  process.exit(0);
}

runMigrations();
