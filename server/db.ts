import 'dotenv/config';

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Seleccionar la URL correcta según el entorno
const isDevelopment = process.env.NODE_ENV !== 'production';
const databaseUrl = isDevelopment 
  ? process.env.DATABASE_URL_DEV 
  : process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    isDevelopment 
      ? "❌ DATABASE_URL_DEV no está configurada para desarrollo"
      : "❌ DATABASE_URL no está configurada para producción"
  );
}

console.log(`🔌 Conectando a base de datos: ${isDevelopment ? 'DESARROLLO' : 'PRODUCCIÓN'}`);
console.log(`📍 URL: ${databaseUrl.substring(0, 50)}...`);

const sql = neon(databaseUrl);
export const db = drizzle(sql);
