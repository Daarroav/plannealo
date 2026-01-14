// Zona horaria fija para toda la aplicación
export const MEXICO_TIMEZONE = 'America/Mexico_City';

// Mapeo de códigos IATA de aeropuertos a zonas horarias IANA
// Basado en los aeropuertos más comunes del mundo
export const AIRPORT_TIMEZONES: Record<string, string> = {
  // América del Norte
  'JFK': 'America/New_York',
  'LGA': 'America/New_York',
  'EWR': 'America/New_York',
  'LAX': 'America/Los_Angeles',
  'SFO': 'America/Los_Angeles',
  'ORD': 'America/Chicago',
  'DFW': 'America/Chicago',
  'IAH': 'America/Chicago',
  'DEN': 'America/Denver',
  'PHX': 'America/Phoenix',
  'ATL': 'America/New_York',
  'MIA': 'America/New_York',
  'BOS': 'America/New_York',
  'SEA': 'America/Los_Angeles',
  'LAS': 'America/Los_Angeles',
  
  // México
  'MEX': 'America/Mexico_City',
  'GDL': 'America/Mexico_City',
  'MTY': 'America/Mexico_City',
  'CUN': 'America/Cancun',
  'TIJ': 'America/Tijuana',
  'PVR': 'America/Mexico_City',
  'SJD': 'America/Mazatlan',
  
  // Europa
  'LHR': 'Europe/London',
  'CDG': 'Europe/Paris',
  'AMS': 'Europe/Amsterdam',
  'FRA': 'Europe/Berlin',
  'MAD': 'Europe/Madrid',
  'BCN': 'Europe/Madrid',
  'FCO': 'Europe/Rome',
  'IST': 'Europe/Istanbul',
  'VIE': 'Europe/Vienna',
  'ZRH': 'Europe/Zurich',
  'MUC': 'Europe/Berlin',
  'LIS': 'Europe/Lisbon',
  'ATH': 'Europe/Athens',
  'CPH': 'Europe/Copenhagen',
  'SVO': 'Europe/Moscow',
  
  // Asia
  'NRT': 'Asia/Tokyo',
  'HND': 'Asia/Tokyo',
  'PEK': 'Asia/Shanghai',
  'PVG': 'Asia/Shanghai',
  'HKG': 'Asia/Hong_Kong',
  'SIN': 'Asia/Singapore',
  'ICN': 'Asia/Seoul',
  'BKK': 'Asia/Bangkok',
  'DEL': 'Asia/Kolkata',
  'BOM': 'Asia/Kolkata',
  'DXB': 'Asia/Dubai',
  'DOH': 'Asia/Qatar',
  'KUL': 'Asia/Kuala_Lumpur',
  'MNL': 'Asia/Manila',
  'TPE': 'Asia/Taipei',
  
  // Oceanía
  'SYD': 'Australia/Sydney',
  'MEL': 'Australia/Melbourne',
  'AKL': 'Pacific/Auckland',
  'BNE': 'Australia/Brisbane',
  
  // América del Sur
  'GRU': 'America/Sao_Paulo',
  'GIG': 'America/Sao_Paulo',
  'EZE': 'America/Argentina/Buenos_Aires',
  'SCL': 'America/Santiago',
  'BOG': 'America/Bogota',
  'LIM': 'America/Lima',
  
  // Canadá
  'YYZ': 'America/Toronto',
  'YVR': 'America/Vancouver',
  'YUL': 'America/Montreal',
};

/**
 * Extrae el código IATA de una cadena de ciudad
 * Por ejemplo: "NRT - Tokyo" -> "NRT"
 */
export function extractIataCode(cityString: string): string | null {
  if (!cityString) return null;
  
  // Buscar patrón: 3 letras mayúsculas seguidas de espacio y guion
  const match = cityString.match(/^([A-Z]{3})\s*-/);
  if (match) {
    return match[1];
  }
  
  // Si la cadena es solo 3 letras, asumimos que es el código
  if (/^[A-Z]{3}$/.test(cityString.trim())) {
    return cityString.trim();
  }
  
  return null;
}

/**
 * Obtiene la zona horaria para un código IATA
 * Si no se encuentra, devuelve una zona horaria por defecto
 */
export function getTimezoneForAirport(iataCode: string | null, defaultTz = 'UTC'): string {
  if (!iataCode) return defaultTz;
  return AIRPORT_TIMEZONES[iataCode.toUpperCase()] || defaultTz;
}

/**
 * Obtiene el offset UTC en minutos para una zona horaria específica en una fecha dada
 * Retorna un número positivo para zonas adelantadas (ej: +540 para GMT+9)
 * y negativo para zonas atrasadas (ej: -300 para GMT-5)
 */
export function getTimezoneOffset(timezone: string, date: Date = new Date()): number {
  try {
    // Crear un formateador para la zona horaria específica
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'short'
    });
    
    // Obtener la hora UTC
    const utcDate = new Date(date.toISOString());
    
    // Obtener componentes de la fecha en la zona horaria especificada
    const parts = formatter.formatToParts(date);
    const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
    const month = parseInt(parts.find(p => p.type === 'month')?.value || '1') - 1;
    const day = parseInt(parts.find(p => p.type === 'day')?.value || '1');
    const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
    const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
    const second = parseInt(parts.find(p => p.type === 'second')?.value || '0');
    
    // Crear fecha local en esa zona horaria
    const localDate = new Date(year, month, day, hour, minute, second);
    
    // Calcular diferencia en minutos
    // Offset positivo significa que la zona local está adelantada respecto a UTC
    const offsetMinutes = Math.round((localDate.getTime() - utcDate.getTime()) / (1000 * 60));
    
    return offsetMinutes;
  } catch (error) {
    console.warn(`Could not determine offset for timezone ${timezone}:`, error);
    return 0; // Default to UTC
  }
}

/**
 * Convierte una fecha UTC a componentes de fecha/hora en zona México
 * Retorna { dateStr: 'YYYY-MM-DD', timeStr: 'HH:mm' }
 */
export function utcToMexicoComponents(utcDateString: string): { dateStr: string; timeStr: string } {
  const date = new Date(utcDateString);
  
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: MEXICO_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  const parts = formatter.formatToParts(date);
  const year = parts.find(p => p.type === 'year')?.value || '2025';
  const month = parts.find(p => p.type === 'month')?.value || '01';
  const day = parts.find(p => p.type === 'day')?.value || '01';
  const hour = parts.find(p => p.type === 'hour')?.value || '00';
  const minute = parts.find(p => p.type === 'minute')?.value || '00';
  
  return {
    dateStr: `${year}-${month}-${day}`,
    timeStr: `${hour}:${minute}`
  };
}

/**
 * Convierte componentes de fecha/hora de México a UTC ISO string
 * Input: dateStr 'YYYY-MM-DD', timeStr 'HH:mm'
 * Output: ISO string en UTC
 */
export function mexicoComponentsToUTC(dateStr: string, timeStr: string = '00:00'): string {
  // El problema es que new Date(year, month, day, ...) usa la zona horaria del sistema (ej: Japón)
  // Para evitar desplazamientos, forzamos la interpretación en la zona horaria deseada
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);

  // Creamos una fecha que represente ese momento exacto como si fuera UTC inicialmente
  // y luego le restamos el offset de la zona horaria objetivo (México)
  
  // Para simplificar y ser exactos: 
  // 1. Construimos una cadena ISO parcial
  const isoStr = `${dateStr}T${timeStr}:00.000`;
  
  // 2. Usamos Intl.DateTimeFormat para encontrar el offset de Mexico City en ese momento
  const date = new Date(isoStr + 'Z'); // Asumimos UTC temporalmente
  
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: MEXICO_TIMEZONE,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  });
  
  const parts = formatter.formatToParts(date);
  const p = (type: string) => parts.find(part => part.type === type)?.value;
  const formattedStr = `${p('year')}-${p('month')}-${p('day')}T${p('hour')}:${p('minute')}:${p('second')}.000Z`;
  
  const d1 = new Date(isoStr + 'Z');
  const d2 = new Date(formattedStr);
  const offsetMs = d1.getTime() - d2.getTime();
  
  const finalDate = new Date(d1.getTime() + offsetMs);
  return finalDate.toISOString();
}
