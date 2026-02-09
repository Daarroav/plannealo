import { db } from '../server/db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function updateRoles() {
  await db.update(users).set({ role: 'master' }).where(eq(users.username, 'administrador@artendigital.mx'));
  await db.update(users).set({ role: 'admin' }).where(eq(users.username, 'vendedor@artendigital.mx'));
  await db.update(users).set({ role: 'traveler' }).where(eq(users.username, 'daniel@artendigital.mx'));
  console.log('Roles actualizados');
  process.exit(0);
}

updateRoles();
