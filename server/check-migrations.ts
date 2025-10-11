
import fs from 'fs';
import path from 'path';

interface MigrationCheck {
  file: string;
  safe: boolean;
  warnings: string[];
}

function checkMigrations() {
  const migrationsDir = './migrations';
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  console.log('🔍 Verificando seguridad de migraciones...\n');

  const results: MigrationCheck[] = [];

  migrationFiles.forEach(file => {
    const content = fs.readFileSync(path.join(migrationsDir, file), 'utf-8').toLowerCase();
    const warnings: string[] = [];
    
    // Operaciones CRÍTICAS - Eliminan datos permanentemente
    if (content.includes('drop table') && !content.includes('if exists')) {
      warnings.push('❌ CRÍTICO: DROP TABLE - Eliminará tablas completas');
    }
    
    if (content.includes('truncate')) {
      warnings.push('❌ CRÍTICO: TRUNCATE - Vaciará tablas completamente');
    }
    
    if (content.includes('delete from') && !content.includes('where')) {
      warnings.push('❌ CRÍTICO: DELETE sin WHERE - Eliminará todos los registros');
    }
    
    // ON DELETE CASCADE es peligroso excepto en migraciones iniciales y la 0004 que lo corrige
    if (content.includes('on delete cascade') && !file.includes('0000_') && !file.includes('0004_')) {
      warnings.push('❌ PELIGROSO: ON DELETE CASCADE - Eliminaciones automáticas en cascada');
    }
    
    if (content.includes('drop column')) {
      warnings.push('⚠️  DROP COLUMN - Pérdida permanente de datos en esa columna');
    }
    
    // Estas son operaciones seguras cuando se hacen correctamente
    if (content.includes('alter table') && content.includes('drop constraint') && file.includes('0004_')) {
      warnings.push('✅ DROP CONSTRAINT (seguro) - Elimina restricciones CASCADE peligrosas');
    }

    // Una migración es segura solo si no tiene warnings críticos o peligrosos
    const criticalWarnings = warnings.filter(w => w.includes('CRÍTICO') || w.includes('PELIGROSO'));
    
    results.push({
      file,
      safe: criticalWarnings.length === 0,
      warnings
    });
  });

  // Mostrar resultados
  results.forEach(result => {
    const icon = result.safe ? '✅' : '⚠️';
    console.log(`${icon} ${result.file}`);
    
    if (result.warnings.length > 0) {
      result.warnings.forEach(warning => {
        console.log(`   ${warning}`);
      });
    }
    console.log();
  });

  // Resumen
  const safeCount = results.filter(r => r.safe).length;
  const totalCount = results.length;
  
  console.log('━'.repeat(50));
  console.log(`📊 Resumen: ${safeCount}/${totalCount} migraciones seguras`);
  
  if (safeCount === totalCount) {
    console.log('✅ Todas las migraciones son seguras para producción');
  } else {
    console.log('⚠️  Algunas migraciones requieren revisión manual');
    console.log('⚠️  Haz un backup antes de aplicarlas en producción');
  }
}

checkMigrations();
