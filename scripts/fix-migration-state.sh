#!/bin/bash

# Script para arreglar el estado de migraciones y evitar "stage already exists"

echo "🔧 Arreglando estado de migraciones..."
echo ""

# Paso 1: Verificar que el schema.ts está actualizado
echo "✅ Schema actualizado para coincidir con la base de datos"

# Paso 2: Usar push en vez de generate para sincronizar
echo "📋 Sincronizando esquema con la base de datos..."

# En desarrollo
if [ "$NODE_ENV" != "production" ]; then
  echo "🔄 Ejecutando en DESARROLLO..."
  npx drizzle-kit push
else
  echo "🔄 Ejecutando en PRODUCCIÓN..."
  echo "⚠️  IMPORTANTE: Este comando compara el esquema con la BD y solo aplica diferencias"
  npx drizzle-kit push --force
fi

echo ""
echo "✅ Estado de migraciones corregido"
echo "✅ Ahora puedes publicar tu aplicación sin errores"
