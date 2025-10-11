
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

async function cleanOrphanRecords() {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const databaseUrl = isDevelopment 
    ? process.env.DATABASE_URL_DEV 
    : process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  console.log(`🔍 Buscando registros huérfanos en ${isDevelopment ? 'DESARROLLO' : 'PRODUCCIÓN'}...\n`);

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  try {
    // Buscar huérfanos en accommodations
    const orphanAccommodations = await sql`
      SELECT a.id, a.travel_id, a.name 
      FROM accommodations a 
      WHERE a.travel_id NOT IN (SELECT id FROM travels)
    `;

    // Buscar huérfanos en activities
    const orphanActivities = await sql`
      SELECT a.id, a.travel_id, a.name 
      FROM activities a 
      WHERE a.travel_id NOT IN (SELECT id FROM travels)
    `;

    // Buscar huérfanos en flights
    const orphanFlights = await sql`
      SELECT f.id, f.travel_id, f.flight_number 
      FROM flights f 
      WHERE f.travel_id NOT IN (SELECT id FROM travels)
    `;

    // Buscar huérfanos en transports
    const orphanTransports = await sql`
      SELECT t.id, t.travel_id, t.type 
      FROM transports t 
      WHERE t.travel_id NOT IN (SELECT id FROM travels)
    `;

    // Buscar huérfanos en cruises
    const orphanCruises = await sql`
      SELECT c.id, c.travel_id, c.cruise_line 
      FROM cruises c 
      WHERE c.travel_id NOT IN (SELECT id FROM travels)
    `;

    // Buscar huérfanos en insurances
    const orphanInsurances = await sql`
      SELECT i.id, i.travel_id, i.provider 
      FROM insurances i 
      WHERE i.travel_id NOT IN (SELECT id FROM travels)
    `;

    // Buscar huérfanos en notes
    const orphanNotes = await sql`
      SELECT n.id, n.travel_id, n.title 
      FROM notes n 
      WHERE n.travel_id NOT IN (SELECT id FROM travels)
    `;

    // Mostrar resultados
    console.log('📊 RESULTADOS:\n');
    console.log(`❌ Accommodations huérfanos: ${orphanAccommodations.length}`);
    if (orphanAccommodations.length > 0) {
      console.log('   ', orphanAccommodations.map(a => `ID: ${a.id} | Travel: ${a.travel_id} | Name: ${a.name}`).join('\n    '));
    }

    console.log(`❌ Activities huérfanos: ${orphanActivities.length}`);
    if (orphanActivities.length > 0) {
      console.log('   ', orphanActivities.map(a => `ID: ${a.id} | Travel: ${a.travel_id} | Name: ${a.name}`).join('\n    '));
    }

    console.log(`❌ Flights huérfanos: ${orphanFlights.length}`);
    if (orphanFlights.length > 0) {
      console.log('   ', orphanFlights.map(f => `ID: ${f.id} | Travel: ${f.travel_id} | Flight: ${f.flight_number}`).join('\n    '));
    }

    console.log(`❌ Transports huérfanos: ${orphanTransports.length}`);
    if (orphanTransports.length > 0) {
      console.log('   ', orphanTransports.map(t => `ID: ${t.id} | Travel: ${t.travel_id} | Type: ${t.type}`).join('\n    '));
    }

    console.log(`❌ Cruises huérfanos: ${orphanCruises.length}`);
    if (orphanCruises.length > 0) {
      console.log('   ', orphanCruises.map(c => `ID: ${c.id} | Travel: ${c.travel_id} | Line: ${c.cruise_line}`).join('\n    '));
    }

    console.log(`❌ Insurances huérfanos: ${orphanInsurances.length}`);
    if (orphanInsurances.length > 0) {
      console.log('   ', orphanInsurances.map(i => `ID: ${i.id} | Travel: ${i.travel_id} | Provider: ${i.provider}`).join('\n    '));
    }

    console.log(`❌ Notes huérfanos: ${orphanNotes.length}`);
    if (orphanNotes.length > 0) {
      console.log('   ', orphanNotes.map(n => `ID: ${n.id} | Travel: ${n.travel_id} | Title: ${n.title}`).join('\n    '));
    }

    const totalOrphans = orphanAccommodations.length + orphanActivities.length + 
                        orphanFlights.length + orphanTransports.length +
                        orphanCruises.length + orphanInsurances.length + orphanNotes.length;

    if (totalOrphans === 0) {
      console.log('\n✅ No se encontraron registros huérfanos');
      console.log('✅ Puedes aplicar la migración 0004 de forma segura');
      process.exit(0);
    }

    console.log(`\n⚠️  TOTAL DE REGISTROS HUÉRFANOS: ${totalOrphans}`);
    console.log('\n🔧 Para limpiarlos, ejecuta:');
    console.log('   NODE_ENV=development tsx server/clean-orphans.ts --delete');
    console.log('\n⚠️  ADVERTENCIA: Esta acción eliminará estos registros de forma permanente');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Si se pasa --delete, eliminar los huérfanos
if (process.argv.includes('--delete')) {
  (async () => {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const databaseUrl = isDevelopment 
      ? process.env.DATABASE_URL_DEV 
      : process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not set');
    }

    console.log('🗑️  ELIMINANDO REGISTROS HUÉRFANOS...\n');

    const sql = neon(databaseUrl);

    try {
      const result1 = await sql`DELETE FROM accommodations WHERE travel_id NOT IN (SELECT id FROM travels)`;
      console.log(`✅ Eliminados ${result1.length} accommodations huérfanos`);

      const result2 = await sql`DELETE FROM activities WHERE travel_id NOT IN (SELECT id FROM travels)`;
      console.log(`✅ Eliminados ${result2.length} activities huérfanos`);

      const result3 = await sql`DELETE FROM flights WHERE travel_id NOT IN (SELECT id FROM travels)`;
      console.log(`✅ Eliminados ${result3.length} flights huérfanos`);

      const result4 = await sql`DELETE FROM transports WHERE travel_id NOT IN (SELECT id FROM travels)`;
      console.log(`✅ Eliminados ${result4.length} transports huérfanos`);

      const result5 = await sql`DELETE FROM cruises WHERE travel_id NOT IN (SELECT id FROM travels)`;
      console.log(`✅ Eliminados ${result5.length} cruises huérfanos`);

      const result6 = await sql`DELETE FROM insurances WHERE travel_id NOT IN (SELECT id FROM travels)`;
      console.log(`✅ Eliminados ${result6.length} insurances huérfanos`);

      const result7 = await sql`DELETE FROM notes WHERE travel_id NOT IN (SELECT id FROM travels)`;
      console.log(`✅ Eliminados ${result7.length} notes huérfanos`);

      console.log('\n✅ Limpieza completada');
      console.log('✅ Ahora puedes aplicar la migración 0004 de forma segura');
      
    } catch (error) {
      console.error('❌ Error eliminando huérfanos:', error);
      process.exit(1);
    }
    
    process.exit(0);
  })();
} else {
  cleanOrphanRecords();
}
