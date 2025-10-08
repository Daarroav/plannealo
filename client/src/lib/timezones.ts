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
