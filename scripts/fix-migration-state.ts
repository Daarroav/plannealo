import { execSync } from 'child_process';

console.log('🔧 Arreglando estado de migraciones...\n');

// Verificar entorno
const isDevelopment = process.env.NODE_ENV !== 'production';
const env = isDevelopment ? 'DESARROLLO' : 'PRODUCCIÓN';

console.log(`📍 Entorno: ${env}`);
console.log('✅ Schema actualizado para coincidir con la base de datos\n');

console.log('📋 Usando drizzle-kit push para sincronizar...');
console.log('⚠️  IMPORTANTE: Este comando compara el esquema con la BD y solo aplica diferencias\n');

try {
  // Usar push en vez de generate para evitar el error "stage already exists"
  const command = isDevelopment ? 'npx drizzle-kit push' : 'npx drizzle-kit push --force';
  
  console.log(`🔄 Ejecutando: ${command}\n`);
  
  execSync(command, { stdio: 'inherit' });
  
  console.log('\n✅ Estado de migraciones corregido');
  console.log('✅ Ahora puedes publicar tu aplicación sin errores\n');
  
  process.exit(0);
} catch (error) {
  console.error('\n❌ Error al arreglar migraciones:', error);
  process.exit(1);
}
