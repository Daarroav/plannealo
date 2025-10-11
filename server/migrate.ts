
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  console.log('🔄 Preparing to run migrations...');
  console.log('📋 Checking migration files...\n');
  
  // Listar migraciones pendientes
  const migrationsDir = './migrations';
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  console.log('📁 Migration files found:');
  migrationFiles.forEach((file, index) => {
    const content = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    const hasDropTable = content.toLowerCase().includes('drop table');
    const hasCascade = content.toLowerCase().includes('cascade');
    const hasDelete = content.toLowerCase().includes('delete from');
    const hasTruncate = content.toLowerCase().includes('truncate');
    
    console.log(`  ${index + 1}. ${file}`);
    
    if (hasDropTable) console.log('     ⚠️  Contains DROP TABLE');
    if (hasCascade && !file.includes('0004_safe_foreign_keys')) console.log('     ⚠️  Contains CASCADE operations');
    if (hasDelete) console.log('     ⚠️  Contains DELETE operations');
    if (hasTruncate) console.log('     ⚠️  Contains TRUNCATE operations');
  });
  
  console.log('\n⚠️  IMPORTANTE: Estas migraciones se aplicarán a la base de datos');
  console.log('⚠️  Asegúrate de tener un backup reciente antes de continuar\n');
  
  const sql = neon(process.env.DATABASE_URL);
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
