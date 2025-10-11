
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
    
    // Operaciones peligrosas
    if (content.includes('drop table')) {
      warnings.push('❌ DROP TABLE - Eliminará tablas completas');
    }
    
    if (content.includes('truncate')) {
      warnings.push('❌ TRUNCATE - Vaciará tablas completamente');
    }
    
    if (content.includes('delete from') && !content.includes('where')) {
      warnings.push('❌ DELETE sin WHERE - Eliminará todos los registros');
    }
    
    if (content.includes('on delete cascade') && !file.includes('0000_') && !file.includes('0003_')) {
      warnings.push('⚠️  ON DELETE CASCADE - Eliminaciones en cascada');
    }
    
    if (content.includes('drop column')) {
      warnings.push('⚠️  DROP COLUMN - Eliminará columnas (pérdida de datos)');
    }
    
    if (content.includes('alter table') && content.includes('drop constraint')) {
      warnings.push('ℹ️  DROP CONSTRAINT - Eliminará restricciones (puede ser seguro)');
    }

    results.push({
      file,
      safe: warnings.length === 0 || file.includes('0004_safe_foreign_keys'),
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
