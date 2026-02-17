# 🚀 Guía de Configuración para Replit

## 📋 Configuración Inicial

### 1. Variables de Entorno (Secrets)

En Replit, ve a la pestaña "Secrets" (🔐) y agrega:

```bash
# Base de datos de DESARROLLO (para pruebas)
DATABASE_URL_DEV=postgresql://usuario:contraseña@host/database_dev

# Base de datos de PRODUCCIÓN (datos reales)
DATABASE_URL=postgresql://usuario:contraseña@host/database_prod

# Secreto para sesiones (genera uno único)
SESSION_SECRET=tu-secreto-muy-aleatorio-aqui

# API Keys (si las usas)
AERODATABOX_API_KEY=tu-api-key
```

**⚠️ IMPORTANTE:** 
- `DATABASE_URL_DEV` y `DATABASE_URL` **DEBEN** ser bases de datos diferentes
- Nunca uses la misma DB para desarrollo y producción

### 2. Primer Inicio

```bash
# 1. Instalar dependencias
npm install

# 2. Aplicar migraciones a la base de datos de desarrollo
npm run migrate

# 3. Iniciar el servidor
npm run dev
```

## 🔄 Flujo de Trabajo Diario

### Desarrollo Normal
```bash
# Simplemente presiona el botón "Run" en Replit
# O ejecuta:
npm run dev
```

### Cambios en la Base de Datos

#### Opción 1: Modo Rápido (Desarrollo)
```bash
# 1. Edita shared/schema.ts
# 2. Aplica cambios a DATABASE_URL_DEV
npm run db:push
```

#### Opción 2: Modo Seguro (Producción)
```bash
# 1. Edita shared/schema.ts
# 2. Genera migración
drizzle-kit generate

# 3. Revisa el archivo SQL en migrations/
# 4. Aplica a producción
npm run migrate:production
```

## 🌐 Publicación (Deploy)

### Publicar en Replit Deployments

1. **Haz commit de tus cambios**
   ```bash
   git add .
   git commit -m "Descripción de cambios"
   git push
   ```

2. **Click en "Deploy"** en Replit

3. **Si hay cambios en el esquema de la DB:**
   ```bash
   # En la consola de Replit Deployment:
   npm run migrate:production
   ```

## 🛠️ Scripts Disponibles

```bash
npm run dev              # Modo desarrollo (usa DATABASE_URL_DEV)
npm run build            # Compilar para producción
npm run start            # Ejecutar en producción
npm run db:push          # Sincronizar schema a DB desarrollo
npm run migrate          # Aplicar migraciones a desarrollo
npm run migrate:production  # Aplicar migraciones a producción (CON PROTECCIÓN)
npm run check            # Verificar tipos TypeScript
```

## 🔍 Verificación del Entorno

Para verificar que todo está configurado correctamente:

```bash
# Debería mostrar "DESARROLLO"
npm run dev
# Verifica en la consola: "🔌 Conectando a base de datos: DESARROLLO"
```

## ⚠️ Errores Comunes

### Error: "DATABASE_URL_DEV is not configured"
**Solución:** Agrega `DATABASE_URL_DEV` en Replit Secrets

### Error: "Port 5000 already in use"
**Solución:** Replit automáticamente maneja esto. Si persiste, reinicia el Repl.

### Los datos desaparecen al publicar
**Causa:** Estás usando `db:push` en producción
**Solución:** Usa `migrate:production` en su lugar

## 📁 Estructura de Archivos

```
plannealo/
├── client/          # Frontend React
├── server/          # Backend Express
├── shared/          # Código compartido (schema, tipos)
├── migrations/      # Archivos de migración SQL
├── uploads/         # Archivos subidos (ignorado en git)
└── .replit         # Configuración de Replit
```

## 🔐 Seguridad

- ✅ `.env` está en `.gitignore`
- ✅ Usa Replit Secrets para variables sensibles
- ✅ DATABASE_URL_DEV y DATABASE_URL son diferentes
- ✅ Migraciones protegidas contra operaciones destructivas

## 🆘 Soporte

Si encuentras problemas:
1. Revisa [DATABASE_SAFETY_GUIDE.md](./DATABASE_SAFETY_GUIDE.md)
2. Revisa [GUIA_PUBLICACION_SEGURA.md](./GUIA_PUBLICACION_SEGURA.md)
3. Verifica que todas las variables de entorno estén configuradas
4. Revisa los logs en la consola de Replit
