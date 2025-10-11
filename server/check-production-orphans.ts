
import { neon } from '@neondatabase/serverless';

async function checkProductionOrphans() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL (producción) no está configurada');
  }

  console.log('🔍 Verificando registros huérfanos en PRODUCCIÓN...\n');
  console.log(`📍 Database: ${databaseUrl.substring(0, 50)}...\n`);

  const sql = neon(databaseUrl);

  try {
    // Verificar cada tabla
    const tables = ['accommodations', 'activities', 'flights', 'transports', 'cruises', 'insurances', 'notes'];
    let totalOrphans = 0;

    for (const table of tables) {
      // Usar consultas SQL seguras sin interpolación de nombres de tabla
      const query = `
        SELECT COUNT(*) as count 
        FROM ${table} 
        WHERE travel_id NOT IN (SELECT id FROM travels)
      `;
      
      const result = await sql(query);
      const count = parseInt(result[0].count);
      
      if (count > 0) {
        console.log(`❌ ${table}: ${count} registros huérfanos`);
        
        // Mostrar algunos ejemplos
        const examplesQuery = `
          SELECT id, travel_id 
          FROM ${table} 
          WHERE travel_id NOT IN (SELECT id FROM travels)
          LIMIT 5
        `;
        
        const examples = await sql(examplesQuery);
        
        console.log('   Ejemplos:');
        examples.forEach(ex => {
          console.log(`   - ID: ${ex.id}, travel_id: ${ex.travel_id}`);
        });
        console.log('');
      } else {
        console.log(`✅ ${table}: Sin huérfanos`);
      }
      
      totalOrphans += count;
    }

    console.log(`\n📊 TOTAL: ${totalOrphans} registros huérfanos en PRODUCCIÓN\n`);

    if (totalOrphans > 0) {
      console.log('⚠️  ACCIÓN REQUERIDA:');
      console.log('   Debes eliminar estos registros MANUALMENTE desde la consola de Neon');
      console.log('   o usar un cliente PostgreSQL para conectarte a producción.\n');
      console.log('🔧 SQL para limpiar (EJECUTAR EN PRODUCCIÓN):');
      console.log('');
      tables.forEach(table => {
        console.log(`DELETE FROM ${table} WHERE travel_id NOT IN (SELECT id FROM travels);`);
      });
      console.log('');
    } else {
      console.log('✅ No hay huérfanos. Puedes aplicar la migración.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

checkProductionOrphans();
