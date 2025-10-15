// Catálogo completo de zonas horarias organizadas por región
export interface TimezoneOption {
  label: string;
  value: string;  // IANA timezone identifier
  offset: string; // GMT offset for display
}

export interface TimezoneRegion {
  region: string;
  timezones: TimezoneOption[];
}

export const TIMEZONE_CATALOG: TimezoneRegion[] = [
  {
    region: "América - México",
    timezones: [
      { label: "Ciudad de México (GMT-6)", value: "America/Mexico_City", offset: "GMT-6" },
      { label: "Cancún (GMT-5)", value: "America/Cancun", offset: "GMT-5" },
      { label: "Tijuana (GMT-8)", value: "America/Tijuana", offset: "GMT-8" },
      { label: "Chihuahua (GMT-7)", value: "America/Chihuahua", offset: "GMT-7" },
      { label: "Hermosillo (GMT-7)", value: "America/Hermosillo", offset: "GMT-7" },
      { label: "Mazatlán (GMT-7)", value: "America/Mazatlan", offset: "GMT-7" },
      { label: "Monterrey (GMT-6)", value: "America/Monterrey", offset: "GMT-6" },
    ]
  },
  {
    region: "América - Estados Unidos",
    timezones: [
      { label: "Nueva York (GMT-5)", value: "America/New_York", offset: "GMT-5" },
      { label: "Chicago (GMT-6)", value: "America/Chicago", offset: "GMT-6" },
      { label: "Denver (GMT-7)", value: "America/Denver", offset: "GMT-7" },
      { label: "Los Ángeles (GMT-8)", value: "America/Los_Angeles", offset: "GMT-8" },
      { label: "Phoenix (GMT-7)", value: "America/Phoenix", offset: "GMT-7" },
      { label: "Anchorage (GMT-9)", value: "America/Anchorage", offset: "GMT-9" },
      { label: "Honolulu (GMT-10)", value: "Pacific/Honolulu", offset: "GMT-10" },
    ]
  },
  {
    region: "América - Canadá",
    timezones: [
      { label: "Toronto (GMT-5)", value: "America/Toronto", offset: "GMT-5" },
      { label: "Vancouver (GMT-8)", value: "America/Vancouver", offset: "GMT-8" },
      { label: "Montreal (GMT-5)", value: "America/Montreal", offset: "GMT-5" },
      { label: "Calgary (GMT-7)", value: "America/Edmonton", offset: "GMT-7" },
      { label: "Halifax (GMT-4)", value: "America/Halifax", offset: "GMT-4" },
    ]
  },
  {
    region: "América - Centroamérica",
    timezones: [
      { label: "Guatemala (GMT-6)", value: "America/Guatemala", offset: "GMT-6" },
      { label: "San José, Costa Rica (GMT-6)", value: "America/Costa_Rica", offset: "GMT-6" },
      { label: "Ciudad de Panamá (GMT-5)", value: "America/Panama", offset: "GMT-5" },
      { label: "San Salvador (GMT-6)", value: "America/El_Salvador", offset: "GMT-6" },
      { label: "Tegucigalpa (GMT-6)", value: "America/Tegucigalpa", offset: "GMT-6" },
    ]
  },
  {
    region: "América del Sur",
    timezones: [
      { label: "Buenos Aires (GMT-3)", value: "America/Argentina/Buenos_Aires", offset: "GMT-3" },
      { label: "São Paulo (GMT-3)", value: "America/Sao_Paulo", offset: "GMT-3" },
      { label: "Lima (GMT-5)", value: "America/Lima", offset: "GMT-5" },
      { label: "Bogotá (GMT-5)", value: "America/Bogota", offset: "GMT-5" },
      { label: "Santiago (GMT-3)", value: "America/Santiago", offset: "GMT-3" },
      { label: "Caracas (GMT-4)", value: "America/Caracas", offset: "GMT-4" },
      { label: "La Paz (GMT-4)", value: "America/La_Paz", offset: "GMT-4" },
    ]
  },
  {
    region: "Europa Occidental",
    timezones: [
      { label: "Londres (GMT+0)", value: "Europe/London", offset: "GMT+0" },
      { label: "Lisboa (GMT+0)", value: "Europe/Lisbon", offset: "GMT+0" },
      { label: "Dublín (GMT+0)", value: "Europe/Dublin", offset: "GMT+0" },
      { label: "Reikiavik (GMT+0)", value: "Atlantic/Reykjavik", offset: "GMT+0" },
    ]
  },
  {
    region: "Europa Central",
    timezones: [
      { label: "Madrid (GMT+1)", value: "Europe/Madrid", offset: "GMT+1" },
      { label: "París (GMT+1)", value: "Europe/Paris", offset: "GMT+1" },
      { label: "Roma (GMT+1)", value: "Europe/Rome", offset: "GMT+1" },
      { label: "Berlín (GMT+1)", value: "Europe/Berlin", offset: "GMT+1" },
      { label: "Ámsterdam (GMT+1)", value: "Europe/Amsterdam", offset: "GMT+1" },
      { label: "Bruselas (GMT+1)", value: "Europe/Brussels", offset: "GMT+1" },
      { label: "Viena (GMT+1)", value: "Europe/Vienna", offset: "GMT+1" },
      { label: "Praga (GMT+1)", value: "Europe/Prague", offset: "GMT+1" },
    ]
  },
  {
    region: "Europa Oriental",
    timezones: [
      { label: "Atenas (GMT+2)", value: "Europe/Athens", offset: "GMT+2" },
      { label: "Helsinki (GMT+2)", value: "Europe/Helsinki", offset: "GMT+2" },
      { label: "Estambul (GMT+3)", value: "Europe/Istanbul", offset: "GMT+3" },
      { label: "Kiev (GMT+2)", value: "Europe/Kiev", offset: "GMT+2" },
      { label: "Bucarest (GMT+2)", value: "Europe/Bucharest", offset: "GMT+2" },
      { label: "Moscú (GMT+3)", value: "Europe/Moscow", offset: "GMT+3" },
    ]
  },
  {
    region: "Asia - Medio Oriente",
    timezones: [
      { label: "Dubái (GMT+4)", value: "Asia/Dubai", offset: "GMT+4" },
      { label: "Tel Aviv (GMT+2)", value: "Asia/Jerusalem", offset: "GMT+2" },
      { label: "Riad (GMT+3)", value: "Asia/Riyadh", offset: "GMT+3" },
      { label: "Doha (GMT+3)", value: "Asia/Qatar", offset: "GMT+3" },
      { label: "Kuwait (GMT+3)", value: "Asia/Kuwait", offset: "GMT+3" },
    ]
  },
  {
    region: "Asia - Sur",
    timezones: [
      { label: "IST - India Standard Time (UTC+5:30)", value: "Asia/Kolkata", offset: "UTC+5:30" },
      { label: "Karachi (GMT+5)", value: "Asia/Karachi", offset: "GMT+5" },
      { label: "Dhaka (GMT+6)", value: "Asia/Dhaka", offset: "GMT+6" },
      { label: "Colombo (GMT+5:30)", value: "Asia/Colombo", offset: "GMT+5:30" },
    ]
  },
  {
    region: "Asia - Sudeste",
    timezones: [
      { label: "Bangkok (GMT+7)", value: "Asia/Bangkok", offset: "GMT+7" },
      { label: "Singapur (GMT+8)", value: "Asia/Singapore", offset: "GMT+8" },
      { label: "Yakarta (GMT+7)", value: "Asia/Jakarta", offset: "GMT+7" },
      { label: "Manila (GMT+8)", value: "Asia/Manila", offset: "GMT+8" },
      { label: "Kuala Lumpur (GMT+8)", value: "Asia/Kuala_Lumpur", offset: "GMT+8" },
      { label: "Hanói (GMT+7)", value: "Asia/Ho_Chi_Minh", offset: "GMT+7" },
    ]
  },
  {
    region: "Asia - Este",
    timezones: [
      { label: "Tokio (GMT+9)", value: "Asia/Tokyo", offset: "GMT+9" },
      { label: "Seúl (GMT+9)", value: "Asia/Seoul", offset: "GMT+9" },
      { label: "Pekín (GMT+8)", value: "Asia/Shanghai", offset: "GMT+8" },
      { label: "Hong Kong (GMT+8)", value: "Asia/Hong_Kong", offset: "GMT+8" },
      { label: "Taipei (GMT+8)", value: "Asia/Taipei", offset: "GMT+8" },
    ]
  },
  {
    region: "África",
    timezones: [
      { label: "El Cairo (GMT+2)", value: "Africa/Cairo", offset: "GMT+2" },
      { label: "Johannesburgo (GMT+2)", value: "Africa/Johannesburg", offset: "GMT+2" },
      { label: "Lagos (GMT+1)", value: "Africa/Lagos", offset: "GMT+1" },
      { label: "Nairobi (GMT+3)", value: "Africa/Nairobi", offset: "GMT+3" },
      { label: "Casablanca (GMT+0)", value: "Africa/Casablanca", offset: "GMT+0" },
      { label: "Argel (GMT+1)", value: "Africa/Algiers", offset: "GMT+1" },
    ]
  },
  {
    region: "Oceanía",
    timezones: [
      { label: "Sídney (GMT+10)", value: "Australia/Sydney", offset: "GMT+10" },
      { label: "Melbourne (GMT+10)", value: "Australia/Melbourne", offset: "GMT+10" },
      { label: "Brisbane (GMT+10)", value: "Australia/Brisbane", offset: "GMT+10" },
      { label: "Perth (GMT+8)", value: "Australia/Perth", offset: "GMT+8" },
      { label: "Auckland (GMT+12)", value: "Pacific/Auckland", offset: "GMT+12" },
      { label: "Fiyi (GMT+12)", value: "Pacific/Fiji", offset: "GMT+12" },
    ]
  },
  {
    region: "Caribe",
    timezones: [
      { label: "La Habana (GMT-5)", value: "America/Havana", offset: "GMT-5" },
      { label: "Santo Domingo (GMT-4)", value: "America/Santo_Domingo", offset: "GMT-4" },
      { label: "San Juan (GMT-4)", value: "America/Puerto_Rico", offset: "GMT-4" },
      { label: "Kingston (GMT-5)", value: "America/Jamaica", offset: "GMT-5" },
      { label: "Puerto España (GMT-4)", value: "America/Port_of_Spain", offset: "GMT-4" },
    ]
  }
];

// Función helper para obtener todas las opciones de zona horaria en un solo array
export function getAllTimezones(): TimezoneOption[] {
  return TIMEZONE_CATALOG.flatMap(region => region.timezones);
}

// Función helper para buscar una zona horaria por su valor
export function findTimezoneByValue(value: string): TimezoneOption | undefined {
  return getAllTimezones().find(tz => tz.value === value);
}