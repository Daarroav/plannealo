# 🚀 Guía para Publicar tu Aplicación de Forma Segura

## ❓ ¿Por Qué se Borran los Datos al Republicar?

**Respuesta corta:** Los datos **NO deberían borrarse** al republicar. Si te está pasando, probablemente estás usando el comando equivocado.

## 🔍 Causa Común del Problema

El comando `npm run db:push` (que usa `drizzle-kit push`) es **destructivo** y puede:
- Borrar columnas que ya no existen en el esquema
- Recrear tablas
- Eliminar datos sin advertencia

**Este comando SOLO debe usarse en desarrollo, NUNCA en producción.**

## ✅ Proceso Correcto para Publicar

### Paso 1: Desarrollo Local
```bash
# Trabaja en tu Replit normalmente
npm run dev

# Si haces cambios en el esquema (shared/schema.ts):
npm run db:push  # Solo afecta DATABASE_URL_DEV
```

### Paso 2: Antes de Publicar
```bash
# Verifica que no haya migraciones peligrosas
npm run migrate:production

# Si todo está OK, procede a publicar
```

### Paso 3: Publicar en Replit
1. Click en el botón "Publish" en Replit
2. Replit despliega tu código
3. **Los datos de producción permanecen intactos** ✅

### Paso 4: Después de Publicar (Solo si hay cambios en el esquema)
Si hiciste cambios en la base de datos, ejecuta manualmente:
```bash
NODE_ENV=production npm run migrate:production
```

## 🛡️ Sistema de Protección Incorporado

Tu aplicación ya tiene protección:

1. **Separación de bases de datos:**
   - Desarrollo: `DATABASE_URL_DEV`
   - Producción: `DATABASE_URL`

2. **Script de migración protegido** (`migrate:production`):
   - ✅ Detecta operaciones peligrosas
   - ✅ Bloquea cambios destructivos
   - ✅ Requiere confirmación manual

3. **Migraciones versionadas:**
   - Cada cambio queda registrado
   - Historial completo en `/migrations`
   - Rastreable en Git

## ⚠️ Señales de Alerta

Detente inmediatamente si ves:
- ❌ "DROP TABLE" en las migraciones
- ❌ "TRUNCATE" en las migraciones
- ❌ "DELETE FROM" sin WHERE
- ❌ Mensajes de error al publicar

## 🔄 Qué Pasa al Republicar

### Lo que SÍ se actualiza:
- ✅ Código de la aplicación
- ✅ Dependencias (package.json)
- ✅ Archivos estáticos

### Lo que NO cambia:
- ✅ Base de datos de producción (DATABASE_URL)
- ✅ Variables de entorno secretas
- ✅ Archivos en Object Storage

## 📋 Checklist Pre-Publicación

Antes de hacer click en "Publish":

- [ ] ¿Probé todos los cambios en desarrollo?
- [ ] ¿Revisé que no haya errores en consola?
- [ ] ¿Los cambios del esquema están aplicados en desarrollo?
- [ ] ¿Ejecuté `npm run migrate:production` para verificar migraciones?
- [ ] ¿Tengo un backup reciente? (usa los checkpoints de Replit)

## 🆘 Si Ya Perdiste Datos

1. **NO hagas más cambios**
2. Usa Replit Checkpoints para volver a una versión anterior:
   - Ve al panel de Checkpoints
   - Busca el checkpoint antes de la publicación
   - Restaura código Y base de datos

3. Si no hay checkpoints:
   - Contacta soporte de Replit
   - Neon Database puede tener backups automáticos

## 💡 Mejores Prácticas

### ✅ Hacer
- Usa `npm run migrate:production` para cambios de esquema
- Mantén desarrollo y producción separados
- Haz backups regulares (checkpoints)
- Prueba todo en desarrollo primero

### ❌ NO Hacer
- NO uses `npm run db:push` en producción
- NO modifiques DATABASE_URL en producción sin backup
- NO borres archivos de migración ya aplicados
- NO hagas cambios directos en la BD de producción

## 🔗 Comandos Rápidos

```bash
# Ver estado de las migraciones
npm run migrate:check

# Aplicar migraciones de forma segura
npm run migrate:production

# Solo desarrollo (NUNCA en producción)
npm run db:push
```

---

**Recuerda:** La publicación en Replit es segura. Los problemas vienen de ejecutar comandos equivocados, no del proceso de publicación en sí.
