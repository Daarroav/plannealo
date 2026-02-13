
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import { eq } from 'drizzle-orm';
import { travels, accommodations, activities, flights, transports, cruises, insurances, notes } from '../shared/schema';
import readline from 'readline';

// Función para parsear líneas TSV - maneja tabs literales y escapes
function parseTSVLine(line: string): string[] {
  // Primero separar por tabs reales
  const parts = line.split('\t');
  const values: string[] = [];
  
  for (const part of parts) {
    let processed = part;
    
    // Procesar escapes
    processed = processed.replace(/\\n/g, '\n');
    processed = processed.replace(/\\r/g, '\r');
    processed = processed.replace(/\\\\/g, '\\');
    
    values.push(processed);
  }
  
  return values;
}

// Función para parsear arrays de PostgreSQL
function parsePostgresArray(str: string | null): string[] | null {
  if (!str || str === '\\N') return null;
  if (str === '{}') return [];
  
  const cleaned = str.slice(1, -1);
  if (!cleaned) return [];
  
  return cleaned.split(',');
}

// Función para crear interfaz readline
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

// Función para preguntar al usuario
function askQuestion(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function importToProduction() {
  // FORZAR CONEXIÓN A PRODUCCIÓN
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('❌ DATABASE_URL (PRODUCCIÓN) no está configurado');
  }

  console.log('🔄 Conectando a base de datos: PRODUCCIÓN\n');
  console.log(`📍 URL: ${databaseUrl.substring(0, 50)}...\n`);

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  const targetTravelId = '2efd12ff-c881-4f52-ba33-f1693ddd122e';
  
  // Leer el archivo de backup
  const backupContent = fs.readFileSync('backup_produccion_10_10_2025_06_40.sql', 'utf-8');

  // Verificar si el viaje ya existe en producción
  const existingTravel = await db.select().from(travels).where(eq(travels.id, targetTravelId));
  
  if (existingTravel.length > 0) {
    console.log('⚠️  El viaje LUNA DE MIEL ya existe en la base de datos de PRODUCCIÓN');
    console.log('❌ No se realizará ninguna importación para evitar duplicados\n');
    process.exit(0);
  }

  // Extraer datos del viaje del backup
  const travelMatches = backupContent.match(/COPY public\.travels.*?FROM stdin;([\s\S]*?)\\\.$/m);
  if (!travelMatches) {
    console.error('❌ No se encontraron viajes en el backup');
    process.exit(1);
  }

  const travelLines = travelMatches[1].trim().split('\n');
  const travelLine = travelLines.find(line => line.startsWith(targetTravelId));
  
  if (!travelLine) {
    console.error('❌ No se encontró el viaje LUNA DE MIEL en el backup');
    process.exit(1);
  }

  const values = parseTSVLine(travelLine);
  const travelData = {
    id: values[0],
    name: values[1],
    clientName: values[2],
    startDate: new Date(values[3]),
    endDate: new Date(values[4]),
    travelers: parseInt(values[5]),
    status: values[6],
    coverImage: values[7] === '\\N' ? null : values[7],
    createdBy: values[8],
    createdAt: new Date(values[9]),
    updatedAt: new Date(values[10]),
    publicToken: values[11] === '\\N' ? null : values[11],
    publicTokenExpiry: values[12] === '\\N' ? null : new Date(values[12]),
    clientId: values[13] === '\\N' ? null : values[13]
  };

  // Contar registros relacionados
  let relatedCounts = {
    accommodations: 0,
    activities: 0,
    flights: 0,
    transports: 0,
    cruises: 0,
    insurances: 0,
    notes: 0
  };

  // Contar todos los tipos de registros relacionados
  const accMatches = backupContent.match(/COPY public\.accommodations.*?FROM stdin;([\s\S]*?)\\\.$/m);
  if (accMatches) {
    const lines = accMatches[1].trim().split('\n').filter(line => line.trim());
    relatedCounts.accommodations = lines.filter(line => {
      const lineValues = parseTSVLine(line);
      return lineValues[1] === targetTravelId;
    }).length;
  }

  const actMatches = backupContent.match(/COPY public\.activities.*?FROM stdin;([\s\S]*?)\\\.$/m);
  if (actMatches) {
    const lines = actMatches[1].trim().split('\n').filter(line => line.trim());
    relatedCounts.activities = lines.filter(line => {
      const lineValues = parseTSVLine(line);
      return lineValues[1] === targetTravelId;
    }).length;
  }

  const fliMatches = backupContent.match(/COPY public\.flights.*?FROM stdin;([\s\S]*?)\\\.$/m);
  if (fliMatches) {
    const lines = fliMatches[1].trim().split('\n').filter(line => line.trim());
    relatedCounts.flights = lines.filter(line => {
      const lineValues = parseTSVLine(line);
      return lineValues[1] === targetTravelId;
    }).length;
  }

  const traMatches = backupContent.match(/COPY public\.transports.*?FROM stdin;([\s\S]*?)\\\.$/m);
  if (traMatches) {
    const lines = traMatches[1].trim().split('\n').filter(line => line.trim());
    relatedCounts.transports = lines.filter(line => {
      const lineValues = parseTSVLine(line);
      return lineValues[1] === targetTravelId;
    }).length;
  }

  const cruMatches = backupContent.match(/COPY public\.cruises.*?FROM stdin;([\s\S]*?)\\\.$/m);
  if (cruMatches) {
    const lines = cruMatches[1].trim().split('\n').filter(line => line.trim());
    relatedCounts.cruises = lines.filter(line => {
      const lineValues = parseTSVLine(line);
      return lineValues[1] === targetTravelId;
    }).length;
  }

  const insMatches = backupContent.match(/COPY public\.insurances.*?FROM stdin;([\s\S]*?)\\\.$/m);
  if (insMatches) {
    const lines = insMatches[1].trim().split('\n').filter(line => line.trim());
    relatedCounts.insurances = lines.filter(line => {
      const lineValues = parseTSVLine(line);
      return lineValues[1] === targetTravelId;
    }).length;
  }

  const noteMatches = backupContent.match(/COPY public\.notes.*?FROM stdin;([\s\S]*?)\\\.$/m);
  if (noteMatches) {
    const lines = noteMatches[1].trim().split('\n').filter(line => line.trim());
    relatedCounts.notes = lines.filter(line => {
      const lineValues = parseTSVLine(line);
      return lineValues[1] === targetTravelId;
    }).length;
  }

  // DEBUG: Mostrar detalles del conteo
  console.log('\n🔍 DEBUG - Conteo de registros:');
  console.log(`   Accommodations encontrados: ${relatedCounts.accommodations}`);
  console.log(`   Activities encontrados: ${relatedCounts.activities}`);
  console.log(`   Flights encontrados: ${relatedCounts.flights}`);
  console.log(`   Transports encontrados: ${relatedCounts.transports}`);
  console.log(`   Cruises encontrados: ${relatedCounts.cruises}`);
  console.log(`   Insurances encontrados: ${relatedCounts.insurances}`);
  console.log(`   Notes encontrados: ${relatedCounts.notes}`);

  // DEBUG EXTRA: Mostrar las primeras líneas de cada sección
  console.log('\n🔍 DEBUG EXTRA - Primeras líneas de cada tabla:');
  
  if (actMatches) {
    const allActivityLines = actMatches[1].trim().split('\n');
    console.log(`\n📋 ACTIVITIES (total líneas: ${allActivityLines.length}):`);
    allActivityLines.slice(0, 5).forEach((line, i) => {
      const vals = parseTSVLine(line);
      console.log(`   ${i + 1}. ID: ${vals[0]}, Travel ID: ${vals[1]}, Name: ${vals[2]}`);
    });
    console.log(`   Buscando travel_id: ${targetTravelId}`);
  }

  if (cruMatches) {
    const allCruiseLines = cruMatches[1].trim().split('\n');
    console.log(`\n🚢 CRUISES (total líneas: ${allCruiseLines.length}):`);
    allCruiseLines.slice(0, 5).forEach((line, i) => {
      const vals = parseTSVLine(line);
      console.log(`   ${i + 1}. ID: ${vals[0]}, Travel ID: ${vals[1]}, Cruise Line: ${vals[2]}`);
    });
    console.log(`   Buscando travel_id: ${targetTravelId}`);
  }

  if (insMatches) {
    const allInsuranceLines = insMatches[1].trim().split('\n');
    console.log(`\n🛡️ INSURANCES (total líneas: ${allInsuranceLines.length}):`);
    allInsuranceLines.slice(0, 5).forEach((line, i) => {
      const vals = parseTSVLine(line);
      console.log(`   ${i + 1}. ID: ${vals[0]}, Travel ID: ${vals[1]}, Provider: ${vals[2]}`);
    });
    console.log(`   Buscando travel_id: ${targetTravelId}`);
  }

  // Mostrar preview detallado
  console.log('━'.repeat(80));
  console.log('📋 PREVIEW DE DATOS A IMPORTAR A PRODUCCIÓN');
  console.log('━'.repeat(80));
  console.log();
  console.log(`VIAJE: ${travelData.name}`);
  console.log(`   ID: ${travelData.id}`);
  console.log(`   Viajero: ${travelData.clientName}`);
  console.log(`   Fechas: ${travelData.startDate.toLocaleDateString()} - ${travelData.endDate.toLocaleDateString()}`);
  console.log(`   Viajeros: ${travelData.travelers}`);
  console.log(`   Estado: ${travelData.status}`);
  console.log(`   Creado por: ${travelData.createdBy}`);
  console.log();
  console.log(`   📊 Registros relacionados que se importarán:`);
  if (relatedCounts.accommodations > 0) console.log(`      • ${relatedCounts.accommodations} alojamiento(s)`);
  if (relatedCounts.activities > 0) console.log(`      • ${relatedCounts.activities} actividad(es)`);
  if (relatedCounts.flights > 0) console.log(`      • ${relatedCounts.flights} vuelo(s)`);
  if (relatedCounts.transports > 0) console.log(`      • ${relatedCounts.transports} transporte(s)`);
  if (relatedCounts.cruises > 0) console.log(`      • ${relatedCounts.cruises} crucero(s)`);
  if (relatedCounts.insurances > 0) console.log(`      • ${relatedCounts.insurances} seguro(s)`);
  if (relatedCounts.notes > 0) console.log(`      • ${relatedCounts.notes} nota(s)`);
  
  const totalRelated = Object.values(relatedCounts).reduce((sum, val) => sum + val, 0);
  console.log(`      ───────────────────────────`);
  console.log(`      Total: ${totalRelated} registros relacionados`);
  console.log();
  console.log('━'.repeat(80));
  console.log();
  console.log(`⚠️  IMPORTANTE:`);
  console.log(`   • Base de datos destino: PRODUCCIÓN`);
  console.log(`   • Esta operación NO eliminará ni sobrescribirá datos existentes`);
  console.log(`   • Solo se AGREGARÁN los registros mostrados arriba`);
  console.log(`   • Se importará 1 viaje con ${totalRelated} registros relacionados`);
  console.log();

  // Solicitar confirmación manual
  const rl = createReadlineInterface();
  
  const confirmation = await askQuestion(
    rl, 
    '¿Deseas continuar con la importación a PRODUCCIÓN? (escribe "SI" para confirmar): '
  );

  if (confirmation.trim().toUpperCase() !== 'SI') {
    console.log('\n❌ Importación cancelada por el usuario');
    rl.close();
    process.exit(0);
  }

  console.log('\n🚀 Iniciando importación a PRODUCCIÓN...\n');
  rl.close();

  try {
    // Insertar viaje
    await db.insert(travels).values(travelData);
    console.log(`✅ Viaje importado: ${travelData.name} (${targetTravelId})`);

    let relatedCount = 0;

    // Accommodations
    if (accMatches) {
      const accLines = accMatches[1].trim().split('\n').filter(line => {
        const lineValues = parseTSVLine(line);
        return lineValues[1] === targetTravelId;
      });

      for (const accLine of accLines) {
        const av = parseTSVLine(accLine);
        await db.insert(accommodations).values({
          id: av[0],
          travelId: av[1],
          name: av[2],
          type: av[3],
          location: av[4],
          checkIn: new Date(av[5]),
          checkOut: new Date(av[6]),
          roomType: av[7],
          price: av[8] === '\\N' ? null : av[8],
          confirmationNumber: av[9] === '\\N' ? null : av[9],
          policies: av[10] === '\\N' ? null : av[10],
          notes: av[11] === '\\N' ? null : av[11],
          thumbnail: av[12] === '\\N' ? null : av[12],
          attachments: parsePostgresArray(av[13])
        });
        relatedCount++;
      }
    }

    // Activities
    if (actMatches) {
      const actLines = actMatches[1].trim().split('\n').filter(line => {
        const lineValues = parseTSVLine(line);
        return lineValues[1] === targetTravelId;
      });

      for (const actLine of actLines) {
        const acv = parseTSVLine(actLine);
        await db.insert(activities).values({
          id: acv[0],
          travelId: acv[1],
          name: acv[2],
          type: acv[3],
          provider: acv[4] === '\\N' ? null : acv[4],
          date: new Date(acv[5]),
          startTime: acv[6] === '\\N' ? null : acv[6],
          endTime: acv[7] === '\\N' ? null : acv[7],
          confirmationNumber: acv[8] === '\\N' ? null : acv[8],
          conditions: acv[9] === '\\N' ? null : acv[9],
          notes: acv[10] === '\\N' ? null : acv[10],
          contactName: acv[11] === '\\N' ? null : acv[11],
          contactPhone: acv[12] === '\\N' ? null : acv[12],
          placeStart: acv[13] === '\\N' ? null : acv[13],
          placeEnd: acv[14] === '\\N' ? null : acv[14],
          attachments: parsePostgresArray(acv[15])
        });
        relatedCount++;
      }
    }

    // Flights
    if (fliMatches) {
      const fliLines = fliMatches[1].trim().split('\n').filter(line => {
        const lineValues = parseTSVLine(line);
        return lineValues[1] === targetTravelId;
      });

      for (const fliLine of fliLines) {
        const fv = parseTSVLine(fliLine);
        await db.insert(flights).values({
          id: fv[0],
          travelId: fv[1],
          airline: fv[2],
          flightNumber: fv[3],
          departureCity: fv[4],
          arrivalCity: fv[5],
          departureDate: new Date(fv[6]),
          arrivalDate: new Date(fv[7]),
          departureTerminal: fv[8] === '\\N' ? null : fv[8],
          arrivalTerminal: fv[9] === '\\N' ? null : fv[9],
          class: fv[10],
          reservationNumber: fv[11],
          attachments: parsePostgresArray(fv[12]),
          departureTimezone: fv[13] === '\\N' ? null : fv[13],
          arrivalTimezone: fv[14] === '\\N' ? null : fv[14]
        });
        relatedCount++;
      }
    }

    // Transports
    if (traMatches) {
      const traLines = traMatches[1].trim().split('\n').filter(line => {
        const lineValues = parseTSVLine(line);
        return lineValues[1] === targetTravelId;
      });

      for (const traLine of traLines) {
        const tv = parseTSVLine(traLine);
        await db.insert(transports).values({
          id: tv[0],
          travelId: tv[1],
          type: tv[2],
          name: tv[3],
          provider: tv[4] === '\\N' ? null : tv[4],
          contactName: tv[5] === '\\N' ? null : tv[5],
          contactNumber: tv[6] === '\\N' ? null : tv[6],
          pickupDate: new Date(tv[7]),
          pickupLocation: tv[8],
          endDate: tv[9] === '\\N' ? null : new Date(tv[9]),
          dropoffLocation: tv[10] === '\\N' ? null : tv[10],
          confirmationNumber: tv[11] === '\\N' ? null : tv[11],
          notes: tv[12] === '\\N' ? null : tv[12],
          attachments: parsePostgresArray(tv[13])
        });
        relatedCount++;
      }
    }

    // Cruises
    if (cruMatches) {
      const cruLines = cruMatches[1].trim().split('\n').filter(line => {
        const lineValues = parseTSVLine(line);
        return lineValues[1] === targetTravelId;
      });

      for (const cruLine of cruLines) {
        const cv = parseTSVLine(cruLine);
        await db.insert(cruises).values({
          id: cv[0],
          travelId: cv[1],
          cruiseLine: cv[2],
          confirmationNumber: cv[3] === '\\N' ? null : cv[3],
          departureDate: new Date(cv[4]),
          departurePort: cv[5],
          arrivalDate: new Date(cv[6]),
          arrivalPort: cv[7],
          notes: cv[8] === '\\N' ? null : cv[8],
          attachments: parsePostgresArray(cv[9])
        });
        relatedCount++;
      }
    }

    // Insurances
    if (insMatches) {
      const insLines = insMatches[1].trim().split('\n').filter(line => {
        const lineValues = parseTSVLine(line);
        return lineValues[1] === targetTravelId;
      });

      for (const insLine of insLines) {
        const iv = parseTSVLine(insLine);
        await db.insert(insurances).values({
          id: iv[0],
          travelId: iv[1],
          provider: iv[2],
          policyNumber: iv[3],
          policyType: iv[4],
          emergencyNumber: iv[5] === '\\N' ? null : iv[5],
          effectiveDate: new Date(iv[6]),
          importantInfo: iv[7] === '\\N' ? null : iv[7],
          policyDescription: iv[8] === '\\N' ? null : iv[8],
          attachments: parsePostgresArray(iv[9]),
          notes: iv[10] === '\\N' ? null : iv[10]
        });
        relatedCount++;
      }
    }

    // Notes
    if (noteMatches) {
      const noteLines = noteMatches[1].trim().split('\n').filter(line => {
        const lineValues = parseTSVLine(line);
        return lineValues[1] === targetTravelId;
      });

      for (const noteLine of noteLines) {
        const nv = parseTSVLine(noteLine);
        await db.insert(notes).values({
          id: nv[0],
          travelId: nv[1],
          title: nv[2],
          noteDate: new Date(nv[3]),
          content: nv[4],
          visibleToTravelers: nv[5] === 't',
          attachments: parsePostgresArray(nv[6])
        });
        relatedCount++;
      }
    }

    console.log(`   → ${relatedCount} registros relacionados importados\n`);
    console.log('\n✅ Importación a PRODUCCIÓN completada exitosamente');
    
  } catch (error) {
    console.error(`❌ Error importando a PRODUCCIÓN:`, error);
    process.exit(1);
  }

  process.exit(0);
}

importToProduction().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
