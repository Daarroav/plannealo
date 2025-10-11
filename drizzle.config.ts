import { defineConfig } from "drizzle-kit";

// En desarrollo usa DATABASE_URL_DEV, en producción usa DATABASE_URL
const isDevelopment = process.env.NODE_ENV !== 'production';
const databaseUrl = isDevelopment 
  ? process.env.DATABASE_URL_DEV 
  : process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    isDevelopment 
      ? "DATABASE_URL_DEV not found for development environment"
      : "DATABASE_URL not found for production environment"
  );
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
