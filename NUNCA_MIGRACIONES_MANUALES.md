# ⚠️ NUNCA Escribas Migraciones SQL Manualmente

## 🚨 Problema que Acabas de Resolver

Intentaste crear migraciones SQL manuales (`0006_create_airports_table.sql` y `0007_add_airport_timezones.sql`) y obtuviste el error:

```
dataType: undefined,
constraint: undefined,
file: 'heap.c',
line: '1150',
routine: 'heap_create_with_catalog'
```

Este error ocurre cuando hay problemas en la definición de la migración SQL manual.

## ✅ Solución Aplicada

1. **Eliminamos las migraciones manuales fallidas**
2. **Limpiamos el journal de migraciones**
3. **Usamos `drizzle-kit generate`** para generar la migración correcta
4. **Aplicamos la tabla directamente** con SQL porque `drizzle-kit push` no detectó cambios

## 📋 La Regla de Oro

### ✅ SIEMPRE HAZ ESTO:
```bash
# 1. Modifica shared/schema.ts con tus cambios
# 2. Sincroniza con la base de datos
npm run db:push

# Si hay advertencia de data loss:
npm run db:push --force
```

### ❌ NUNCA HAGAS ESTO:
```bash
# NO escribas archivos SQL en migrations/ manualmente
# NO uses drizzle-kit generate + migrate manualmente
# NO intentes crear tablas con ALTER TABLE a mano
```

## 🔍 Por Qué `drizzle-kit push` Es Mejor

### `drizzle-kit push` (RECOMENDADO)
- ✅ Lee tu `shared/schema.ts`
- ✅ Compara con la base de datos actual
- ✅ Aplica cambios directamente
- ✅ No crea archivos de migración SQL
- ✅ Funciona en desarrollo y producción
- ✅ Detecta y previene pérdida de datos

### Migraciones Manuales (EVITAR)
- ❌ Requiere escribir SQL correcto manualmente
- ❌ Errores de sintaxis causan fallos como `heap_create_with_catalog`
- ❌ Difícil sincronizar con schema.ts
- ❌ Pueden crear conflictos de versión
- ❌ Más propenso a errores humanos

## 🛠️ Cómo Aplicar Cambios Correctamente

### Proceso Paso a Paso

#### 1. **Modifica el Schema**
Edita `shared/schema.ts` con tus cambios:
```typescript
export const airports = pgTable("airports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  country: text("country").notNull(),
  city: text("city").notNull(),
  airportName: text("airport_name").notNull(),
  // ... más columnas
});
```

#### 2. **Sincroniza con la Base de Datos**
```bash
npm run db:push
```

#### 3. **Si Hay Advertencia de Data Loss**
```bash
npm run db:push --force
```

#### 4. **Verifica que Funcionó**
```bash
# En el shell SQL o con execute_sql_tool:
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'airports';
```

## 🆘 Qué Hacer Si Falla

### Síntoma: "No changes detected" pero la tabla no existe

**Causa:** El journal de migraciones está desincronizado.

**Solución:**
```bash
# 1. Genera migración para ver qué falta
npx drizzle-kit generate

# 2. Revisa el archivo SQL generado en migrations/
cat migrations/XXXX_nombre.sql

# 3. Aplica la migración manualmente (última opción)
# Usa execute_sql_tool en Replit o psql
```

### Síntoma: Error "heap_create_with_catalog"

**Causa:** SQL mal formado en migración manual.

**Solución:**
```bash
# 1. Elimina la migración fallida
rm migrations/XXXX_nombre_fallido.sql

# 2. Limpia el journal (quita la entrada de esa migración)
# Edita migrations/meta/_journal.json

# 3. Usa drizzle-kit push en su lugar
npm run db:push --force
```

## 📚 Documentación Relacionada

### Para Desarrollo
- **`npm run db:push`** - Sincroniza cambios en desarrollo
- Ver: `DATABASE_SAFETY_GUIDE.md`

### Para Producción
- **`NODE_ENV=production npx drizzle-kit push --force`**
- Ver: `GUIA_PUBLICACION_SEGURA.md`

## 🎯 Resumen en 3 Puntos

1. **Modifica `shared/schema.ts`** con tus cambios
2. **Ejecuta `npm run db:push`** (o `--force` si es necesario)
3. **NUNCA escribas SQL manualmente** en `migrations/`

## ⚡ Comandos de Referencia Rápida

```bash
# Desarrollo: Sincronizar schema
npm run db:push

# Desarrollo: Forzar sincronización
npm run db:push --force

# Producción: Aplicar cambios
NODE_ENV=production npx drizzle-kit push --force

# Solo si drizzle-kit push falla: Generar SQL para revisión
npx drizzle-kit generate
```

---

**Recuerda:** Las migraciones automáticas de Drizzle son más seguras y confiables que escribir SQL a mano. Confía en la herramienta. ✨

---

**Última actualización:** Octubre 2025  
**Estado:** ✅ Tabla airports creada exitosamente usando método correcto
