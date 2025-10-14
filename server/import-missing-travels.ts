
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import { eq } from 'drizzle-orm';
import { travels, accommodations, activities, flights, transports, cruises, insurances, notes } from '../shared/schema';
import readline from 'readline';

// Función para parsear líneas TSV que pueden contener tabs dentro de campos
function parseTSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inEscape = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '\\' && line[i + 1] === 't' && !inEscape) {
      values.push(current);
      current = '';
      i++; // Skip the 't'
    } else if (char === '\\' && line[i + 1] === 'n') {
      current += '\n';
      i++;
    } else if (char === '\\' && line[i + 1] === '\\') {
      current += '\\';
      i++;
    } else {
      current += char;
    }
  }
  
  if (current) {
    values.push(current);
  }
  
  return values;
}

// Función para parsear arrays de PostgreSQL
function parsePostgresArray(str: string | null): string[] | null {
  if (!str || str === '\\N') return null;
  if (str === '{}') return [];
  
  // Remove outer braces and split by comma
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

async function importMissingTravels() {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const databaseUrl = isDevelopment 
    ? process.env.DATABASE_URL_DEV 
    : process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL not set');
  }

  console.log(`🔄 Conectando a base de datos: ${isDevelopment ? 'DESARROLLO' : 'PRODUCCIÓN'}\n`);

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  // Leer el archivo de backup
  const backupContent = fs.readFileSync('backup_produccion_10_10_2025_06_40.sql', 'utf-8');

  // Extraer IDs de viajes del backup
  const travelMatches = backupContent.match(/COPY public\.travels.*?FROM stdin;([\s\S]*?)\\\.$/m);
  if (!travelMatches) {
    console.error('❌ No se encontraron viajes en el backup');
    process.exit(1);
  }

  const travelLines = travelMatches[1].trim().split('\n');
  const backupTravelIds = new Set(travelLines.map(line => line.split('\t')[0]));

  console.log(`📦 Viajes en el backup: ${backupTravelIds.size}`);

  // Obtener IDs de viajes actuales
  const currentTravels = await db.select({ id: travels.id }).from(travels);
  const currentTravelIds = new Set(currentTravels.map(t => t.id));

  console.log(`💾 Viajes en base de datos actual: ${currentTravelIds.size}\n`);

  // Encontrar viajes faltantes
  const missingTravelIds = Array.from(backupTravelIds).filter(id => !currentTravelIds.has(id));

  if (missingTravelIds.length === 0) {
    console.log('✅ No hay viajes faltantes. Todas las bases de datos están sincronizadas.');
    process.exit(0);
  }

  console.log(`🔍 Viajes faltantes encontrados: ${missingTravelIds.length}\n`);

  // Preparar datos para preview
  const travelDataToImport: any[] = [];

  for (const travelId of missingTravelIds) {
    const travelLine = travelLines.find(line => line.startsWith(travelId));
    if (!travelLine) continue;

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

    // Contar accommodations
    const accMatches = backupContent.match(/COPY public\.accommodations.*?FROM stdin;([\s\S]*?)\\\.$/m);
    if (accMatches) {
      relatedCounts.accommodations = accMatches[1].trim().split('\n').filter(line => {
        const lineValues = parseTSVLine(line);
        return lineValues[1] === travelId;
      }).length;
    }

    // Contar activities
    const actMatches = backupContent.match(/COPY public\.activities.*?FROM stdin;([\s\S]*?)\\\.$/m);
    if (actMatches) {
      relatedCounts.activities = actMatches[1].trim().split('\n').filter(line => {
        const lineValues = parseTSVLine(line);
        return lineValues[1] === travelId;
      }).length;
    }

    // Contar flights
    const fliMatches = backupContent.match(/COPY public\.flights.*?FROM stdin;([\s\S]*?)\\\.$/m);
    if (fliMatches) {
      relatedCounts.flights = fliMatches[1].trim().split('\n').filter(line => {
        const lineValues = parseTSVLine(line);
        return lineValues[1] === travelId;
      }).length;
    }

    // Contar transports
    const traMatches = backupContent.match(/COPY public\.transports.*?FROM stdin;([\s\S]*?)\\\.$/m);
    if (traMatches) {
      relatedCounts.transports = traMatches[1].trim().split('\n').filter(line => {
        const lineValues = parseTSVLine(line);
        return lineValues[1] === travelId;
      }).length;
    }

    // Contar cruises
    const cruMatches = backupContent.match(/COPY public\.cruises.*?FROM stdin;([\s\S]*?)\\\.$/m);
    if (cruMatches) {
      relatedCounts.cruises = cruMatches[1].trim().split('\n').filter(line => {
        const lineValues = parseTSVLine(line);
        return lineValues[1] === travelId;
      }).length;
    }

    // Contar insurances
    const insMatches = backupContent.match(/COPY public\.insurances.*?FROM stdin;([\s\S]*?)\\\.$/m);
    if (insMatches) {
      relatedCounts.insurances = insMatches[1].trim().split('\n').filter(line => {
        const lineValues = parseTSVLine(line);
        return lineValues[1] === travelId;
      }).length;
    }

    // Contar notes
    const noteMatches = backupContent.match(/COPY public\.notes.*?FROM stdin;([\s\S]*?)\\\.$/m);
    if (noteMatches) {
      relatedCounts.notes = noteMatches[1].trim().split('\n').filter(line => {
        const lineValues = parseTSVLine(line);
        return lineValues[1] === travelId;
      }).length;
    }

    travelDataToImport.push({
      travel: travelData,
      related: relatedCounts
    });
  }

  // Mostrar preview detallado
  console.log('━'.repeat(80));
  console.log('📋 PREVIEW DE DATOS A IMPORTAR');
  console.log('━'.repeat(80));
  console.log();

  travelDataToImport.forEach((item, index) => {
    const { travel, related } = item;
    console.log(`${index + 1}. VIAJE: ${travel.name}`);
    console.log(`   ID: ${travel.id}`);
    console.log(`   Cliente: ${travel.clientName}`);
    console.log(`   Fechas: ${travel.startDate.toLocaleDateString()} - ${travel.endDate.toLocaleDateString()}`);
    console.log(`   Viajeros: ${travel.travelers}`);
    console.log(`   Estado: ${travel.status}`);
    console.log(`   Creado por: ${travel.createdBy}`);
    console.log();
    console.log(`   📊 Registros relacionados que se importarán:`);
    if (related.accommodations > 0) console.log(`      • ${related.accommodations} alojamiento(s)`);
    if (related.activities > 0) console.log(`      • ${related.activities} actividad(es)`);
    if (related.flights > 0) console.log(`      • ${related.flights} vuelo(s)`);
    if (related.transports > 0) console.log(`      • ${related.transports} transporte(s)`);
    if (related.cruises > 0) console.log(`      • ${related.cruises} crucero(s)`);
    if (related.insurances > 0) console.log(`      • ${related.insurances} seguro(s)`);
    if (related.notes > 0) console.log(`      • ${related.notes} nota(s)`);
    
    const totalRelated = Object.values(related).reduce((sum, val) => sum + val, 0);
    console.log(`      ───────────────────────────`);
    console.log(`      Total: ${totalRelated} registros relacionados`);
    console.log();
  });

  console.log('━'.repeat(80));
  console.log();
  console.log(`⚠️  IMPORTANTE:`);
  console.log(`   • Se importarán ${travelDataToImport.length} viaje(s) con toda su información relacionada`);
  console.log(`   • Base de datos destino: ${isDevelopment ? 'DESARROLLO' : 'PRODUCCIÓN'}`);
  console.log(`   • Esta operación NO eliminará ni sobrescribirá datos existentes`);
  console.log(`   • Solo se AGREGARÁN los registros mostrados arriba`);
  console.log();

  // Solicitar confirmación manual
  const rl = createReadlineInterface();
  
  const confirmation = await askQuestion(
    rl, 
    '¿Deseas continuar con la importación? (escribe "SI" para confirmar): '
  );

  if (confirmation.trim().toUpperCase() !== 'SI') {
    console.log('\n❌ Importación cancelada por el usuario');
    rl.close();
    process.exit(0);
  }

  console.log('\n🚀 Iniciando importación de viajes...\n');
  rl.close();

  // Proceder con la importación
  for (const item of travelDataToImport) {
    const { travel } = item;
    const travelId = travel.id;

    try {
      // Insertar viaje
      await db.insert(travels).values(travel);
      console.log(`✅ Viaje importado: ${travel.name} (${travelId})`);

      let relatedCount = 0;

      // Accommodations
      const accMatches = backupContent.match(/COPY public\.accommodations.*?FROM stdin;([\s\S]*?)\\\.$/m);
      if (accMatches) {
        const accLines = accMatches[1].trim().split('\n').filter(line => {
          const lineValues = parseTSVLine(line);
          return lineValues[1] === travelId;
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
      const actMatches = backupContent.match(/COPY public\.activities.*?FROM stdin;([\s\S]*?)\\\.$/m);
      if (actMatches) {
        const actLines = actMatches[1].trim().split('\n').filter(line => {
          const lineValues = parseTSVLine(line);
          return lineValues[1] === travelId;
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
      const fliMatches = backupContent.match(/COPY public\.flights.*?FROM stdin;([\s\S]*?)\\\.$/m);
      if (fliMatches) {
        const fliLines = fliMatches[1].trim().split('\n').filter(line => {
          const lineValues = parseTSVLine(line);
          return lineValues[1] === travelId;
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
      const traMatches = backupContent.match(/COPY public\.transports.*?FROM stdin;([\s\S]*?)\\\.$/m);
      if (traMatches) {
        const traLines = traMatches[1].trim().split('\n').filter(line => {
          const lineValues = parseTSVLine(line);
          return lineValues[1] === travelId;
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
      const cruMatches = backupContent.match(/COPY public\.cruises.*?FROM stdin;([\s\S]*?)\\\.$/m);
      if (cruMatches) {
        const cruLines = cruMatches[1].trim().split('\n').filter(line => {
          const lineValues = parseTSVLine(line);
          return lineValues[1] === travelId;
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
      const insMatches = backupContent.match(/COPY public\.insurances.*?FROM stdin;([\s\S]*?)\\\.$/m);
      if (insMatches) {
        const insLines = insMatches[1].trim().split('\n').filter(line => {
          const lineValues = parseTSVLine(line);
          return lineValues[1] === travelId;
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
      const noteMatches = backupContent.match(/COPY public\.notes.*?FROM stdin;([\s\S]*?)\\\.$/m);
      if (noteMatches) {
        const noteLines = noteMatches[1].trim().split('\n').filter(line => {
          const lineValues = parseTSVLine(line);
          return lineValues[1] === travelId;
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

    } catch (error) {
      console.error(`❌ Error importando viaje ${travel.name}:`, error);
    }
  }

  console.log('\n✅ Importación completada exitosamente');
  process.exit(0);
}

importMissingTravels().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
