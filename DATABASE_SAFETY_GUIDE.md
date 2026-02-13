# 🛡️ Guía de Seguridad para Base de Datos

## ⚠️ REGLA DE ORO: NUNCA BORRAR DATOS DE PRODUCCIÓN

## Bases de Datos del Proyecto

### Desarrollo
- Variable: `DATABASE_URL_DEV`
- Uso: Pruebas, desarrollo, experimentos
- Comando: `npm run dev` se conecta automáticamente a desarrollo

### Producción
- Variable: `DATABASE_URL`
- Uso: Datos reales de viajeros
- ⚠️ **PROTEGER A TODA COSTA**

## 📋 Proceso Seguro para Cambios en la Base de Datos

### 1. Desarrollo y Pruebas

```bash
# 1. Haz cambios en shared/schema.ts
# 2. Aplica cambios en desarrollo con push
npm run db:push
# 3. Prueba que todo funciona
npm run dev
```

### 2. Aplicar a Producción

```bash
# IMPORTANTE: El script migrate:production tiene protección incorporada
# que detecta y cancela operaciones peligrosas automáticamente

npm run migrate:production
```

Este comando:
- ✅ Revisa todas las migraciones
- ✅ Detecta operaciones peligrosas (DROP, DELETE, TRUNCATE)
- ✅ Cancela automáticamente si encuentra riesgos
- ✅ Solo aplica cambios seguros

### 3. Scripts Disponibles

```json
{
  "db:push": "Solo para DESARROLLO - Puede ser destructivo",
  "migrate": "Aplica migraciones a desarrollo",
  "migrate:production": "Aplica migraciones a producción (CON PROTECCIÓN)",
  "migrate:check": "Verifica estado de migraciones"
}
```

## ❌ Operaciones Peligrosas (Bloqueadas Automáticamente)

El script de migración **detecta y bloquea**:
- `DROP TABLE` - Elimina tablas completas
- `DELETE FROM ... (sin WHERE)` - Borra todos los registros
- `TRUNCATE` - Vacía tablas
- `ON DELETE CASCADE` (en nuevas migraciones) - Borrado en cascada
- `DROP COLUMN` - Advertencia de pérdida de datos

## ✅ Operaciones Seguras

- `CREATE TABLE` - Crear nuevas tablas
- `ALTER TABLE ... ADD COLUMN` - Agregar columnas
- `CREATE INDEX` - Crear índices
- `ALTER TABLE ... ADD CONSTRAINT` - Agregar restricciones

## 🔄 Al Republicar la Aplicación en Replit

1. **Los datos NO se borran automáticamente** al republicar
2. **Las migraciones NO se ejecutan automáticamente** en producción
3. Debes ejecutar `npm run migrate:production` manualmente si hay cambios en el esquema

## 🚨 Si Cometiste un Error

1. **NO ENTRES EN PÁNICO**
2. Contacta al soporte de Replit para ver si hay backups
3. Usa los checkpoints de Replit para revertir cambios

## 📝 Checklist Antes de Cada Cambio

- [ ] ¿Hice un backup reciente?
- [ ] ¿Probé los cambios en desarrollo primero?
- [ ] ¿Revisé las migraciones generadas?
- [ ] ¿Estoy usando `migrate:production` en vez de `db:push`?
- [ ] ¿Entiendo qué va a cambiar en la base de datos?

## 🔗 Recursos Adicionales

- Documentación Drizzle: https://orm.drizzle.team/docs/migrations
- Guía Neon + Drizzle: https://neon.com/docs/guides/drizzle-migrations

---

**Última actualización:** Octubre 2025
