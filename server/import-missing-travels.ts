
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import { eq } from 'drizzle-orm';
import { travels, accommodations, activities, flights, transports, cruises, insurances, notes } from '../shared/schema';

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

  // Identificar viajes faltantes
  const missingTravelIds = Array.from(backupTravelIds).filter(id => !currentTravelIds.has(id));

  if (missingTravelIds.length === 0) {
    console.log('✅ No hay viajes faltantes. La base de datos está actualizada.');
    process.exit(0);
  }

  console.log(`🔍 Viajes faltantes encontrados: ${missingTravelIds.length}\n`);
  console.log('📋 IDs de viajes faltantes:');
  missingTravelIds.forEach((id, index) => {
    console.log(`   ${index + 1}. ${id}`);
  });

  console.log('\n⚠️  IMPORTANTE: Se importarán estos viajes con toda su información relacionada');
  console.log('⚠️  Presiona Ctrl+C para cancelar o espera 5 segundos para continuar...\n');

  await new Promise(resolve => setTimeout(resolve, 5000));

  // Función helper para parsear líneas TSV del backup
  function parseTSVLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inBraces = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '{') {
        inBraces = true;
        current += char;
      } else if (char === '}') {
        inBraces = false;
        current += char;
      } else if (char === '\t' && !inBraces) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    if (current) {
      values.push(current);
    }
    
    return values.map(v => v === '\\N' ? null : v);
  }

  // Función para convertir arrays de PostgreSQL
  function parsePostgresArray(str: string | null): string[] {
    if (!str || str === '\\N' || str === '{}') return [];
    return str.replace(/^{|}$/g, '').split(',').filter(Boolean);
  }

  // Importar viajes
  console.log('🚀 Iniciando importación de viajes...\n');

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
      status: values[6] as 'draft' | 'published',
      coverImage: values[7],
      createdBy: values[8],
      createdAt: values[9] ? new Date(values[9]) : new Date(),
      updatedAt: values[10] ? new Date(values[10]) : new Date(),
      publicToken: values[11],
      publicTokenExpiry: values[12] ? new Date(values[12]) : null,
      clientId: values[13]
    };

    try {
      await db.insert(travels).values(travelData);
      console.log(`✅ Viaje importado: ${travelData.name} (${travelData.id})`);

      // Importar datos relacionados
      let relatedCount = 0;

      // Accommodations
      const accomMatches = backupContent.match(/COPY public\.accommodations.*?FROM stdin;([\s\S]*?)\\\.$/m);
      if (accomMatches) {
        const accomLines = accomMatches[1].trim().split('\n').filter(line => {
          const lineValues = parseTSVLine(line);
          return lineValues[1] === travelId;
        });

        for (const accomLine of accomLines) {
          const av = parseTSVLine(accomLine);
          await db.insert(accommodations).values({
            id: av[0],
            travelId: av[1],
            name: av[2],
            type: av[3],
            location: av[4],
            checkIn: new Date(av[5]),
            checkOut: new Date(av[6]),
            roomType: av[7],
            price: av[8],
            confirmationNumber: av[9],
            policies: av[10],
            notes: av[11],
            thumbnail: av[12],
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
          const av = parseTSVLine(actLine);
          await db.insert(activities).values({
            id: av[0],
            travelId: av[1],
            name: av[2],
            type: av[3],
            provider: av[4],
            date: new Date(av[5]),
            startTime: av[6],
            endTime: av[7],
            confirmationNumber: av[8],
            conditions: av[9],
            notes: av[10],
            contactName: av[11],
            contactPhone: av[12],
            placeStart: av[13],
            placeEnd: av[14],
            attachments: parsePostgresArray(av[15])
          });
          relatedCount++;
        }
      }

      // Flights
      const flightMatches = backupContent.match(/COPY public\.flights.*?FROM stdin;([\s\S]*?)\\\.$/m);
      if (flightMatches) {
        const flightLines = flightMatches[1].trim().split('\n').filter(line => {
          const lineValues = parseTSVLine(line);
          return lineValues[1] === travelId;
        });

        for (const flightLine of flightLines) {
          const fv = parseTSVLine(flightLine);
          await db.insert(flights).values({
            id: fv[0],
            travelId: fv[1],
            airline: fv[2],
            flightNumber: fv[3],
            departureCity: fv[4],
            arrivalCity: fv[5],
            departureDate: new Date(fv[6]),
            arrivalDate: new Date(fv[7]),
            departureTerminal: fv[8],
            arrivalTerminal: fv[9],
            class: fv[10],
            reservationNumber: fv[11],
            attachments: parsePostgresArray(fv[12]),
            departureTimezone: fv[13],
            arrivalTimezone: fv[14]
          });
          relatedCount++;
        }
      }

      // Transports
      const transMatches = backupContent.match(/COPY public\.transports.*?FROM stdin;([\s\S]*?)\\\.$/m);
      if (transMatches) {
        const transLines = transMatches[1].trim().split('\n').filter(line => {
          const lineValues = parseTSVLine(line);
          return lineValues[1] === travelId;
        });

        for (const transLine of transLines) {
          const tv = parseTSVLine(transLine);
          await db.insert(transports).values({
            id: tv[0],
            travelId: tv[1],
            type: tv[2],
            name: tv[3],
            provider: tv[4],
            contactName: tv[5],
            contactNumber: tv[6],
            pickupDate: new Date(tv[7]),
            pickupLocation: tv[8],
            endDate: tv[9] ? new Date(tv[9]) : null,
            dropoffLocation: tv[10],
            confirmationNumber: tv[11],
            notes: tv[12],
            attachments: parsePostgresArray(tv[13])
          });
          relatedCount++;
        }
      }

      // Cruises
      const cruiseMatches = backupContent.match(/COPY public\.cruises.*?FROM stdin;([\s\S]*?)\\\.$/m);
      if (cruiseMatches) {
        const cruiseLines = cruiseMatches[1].trim().split('\n').filter(line => {
          const lineValues = parseTSVLine(line);
          return lineValues[1] === travelId;
        });

        for (const cruiseLine of cruiseLines) {
          const cv = parseTSVLine(cruiseLine);
          await db.insert(cruises).values({
            id: cv[0],
            travelId: cv[1],
            cruiseLine: cv[2],
            confirmationNumber: cv[3],
            departureDate: new Date(cv[4]),
            departurePort: cv[5],
            arrivalDate: new Date(cv[6]),
            arrivalPort: cv[7],
            notes: cv[8],
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
            emergencyNumber: iv[5],
            effectiveDate: new Date(iv[6]),
            importantInfo: iv[7],
            policyDescription: iv[8],
            notes: iv[9],
            attachments: parsePostgresArray(iv[10])
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
      console.error(`❌ Error importando viaje ${travelData.name}:`, error);
    }
  }

  console.log('\n✅ Importación completada exitosamente');
  process.exit(0);
}

importMissingTravels().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
