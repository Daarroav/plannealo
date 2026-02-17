import 'dotenv/config';

import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

// Use DATABASE_URL_DEV in development, DATABASE_URL in production
const isDevelopment = process.env.NODE_ENV !== 'production';
const databaseUrl = isDevelopment 
  ? process.env.DATABASE_URL_DEV 
  : process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    isDevelopment 
      ? "DATABASE_URL_DEV is not configured for development"
      : "DATABASE_URL is not configured for production"
  );
}

console.log(`🔌 Conectando a base de datos: ${isDevelopment ? 'DESARROLLO' : 'PRODUCCIÓN'}`);


const pool = new pg.Pool({
  connectionString: databaseUrl,
});

export const db = drizzle(pool);
