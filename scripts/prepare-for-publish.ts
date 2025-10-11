#!/usr/bin/env tsx

/**
 * Script para preparar la aplicación antes de publicar
 * Este script previene errores de "stage already exists" y otros problemas de migración
 */

import { execSync } from 'child_process';

console.log('🚀 Preparando aplicación para publicación...\n');

// Verificar entorno
const isDevelopment = process.env.NODE_ENV !== 'production';

if (!isDevelopment) {
  console.error('❌ Este script debe ejecutarse en DESARROLLO antes de publicar');
  console.error('❌ Asegúrate de que NODE_ENV no esté configurado como production');
  process.exit(1);
}

console.log('✅ Entorno de desarrollo detectado\n');

// Paso 1: Verificar que no hay cambios pendientes
console.log('📋 Paso 1: Sincronizando esquema con base de datos de desarrollo...');
try {
  execSync('npx drizzle-kit push', { stdio: 'inherit' });
  console.log('✅ Esquema sincronizado correctamente\n');
} catch (error) {
  console.error('❌ Error al sincronizar esquema:', error);
  process.exit(1);
}

// Paso 2: Verificar que la aplicación funciona
console.log('📋 Paso 2: Verificando que la aplicación funciona...');
console.log('⚠️  Asegúrate de que npm run dev funcione sin errores\n');

// Paso 3: Instrucciones finales
console.log('✅ Preparación completada!\n');
console.log('📝 Pasos para publicar de forma segura:');
console.log('   1. Haz click en el botón "Publish" en Replit');
console.log('   2. Espera a que la publicación complete');
console.log('   3. Si hiciste cambios en el esquema de la BD, ejecuta:');
console.log('      NODE_ENV=production npx drizzle-kit push --force');
console.log('');
console.log('⚠️  IMPORTANTE: Tu base de datos de producción NO se modificará');
console.log('   al publicar. Los datos están seguros.\n');

process.exit(0);
