import axios from 'axios';

const AERODATABOX_BASE_URL = 'https://aerodatabox.p.rapidapi.com';
const API_KEY = process.env.AERODATABOX_API_KEY;

if (!API_KEY) {
  console.warn('AERODATABOX_API_KEY not found in environment variables');
}

const aeroDataBoxAPI = axios.create({
  baseURL: AERODATABOX_BASE_URL,
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com',
    'Accept': 'application/json'
  }
});

export interface Airport {
  icao: string;
  iata: string;
  name: string;
  shortName: string;
  municipalityName: string;
  location: {
    lat: number;
    lon: number;
  };
  countryCode: string;
}

export interface FlightInfo {
  number: string;
  airline: {
    name: string;
    icao: string;
    iata: string;
  };
  departure: {
    airport: {
      icao: string;
      iata: string;
      name: string;
      municipalityName: string;
    };
    scheduledTimeLocal: string;
    actualTimeLocal?: string;
    terminal?: string;
    gate?: string;
  };
  arrival: {
    airport: {
      icao: string;
      iata: string;
      name: string;
      municipalityName: string;
    };
    scheduledTimeLocal: string;
    actualTimeLocal?: string;
    terminal?: string;
    gate?: string;
  };
  aircraft?: {
    model: string;
  };
  status: string;
}

export class AeroDataBoxService {
  
  // Buscar aeropuertos por término
  static async searchAirports(term: string): Promise<Airport[]> {
    try {
      if (!API_KEY) {
        throw new Error('AeroDataBox API key not configured');
      }

      const response = await aeroDataBoxAPI.get(`/airports/search/term`, {
        params: {
          q: term,
          limit: 10
        }
      });

      return response.data?.items || [];
    } catch (error: any) {
      console.error('Error searching airports:', error.response?.data || error.message);
      throw new Error('Failed to search airports');
    }
  }

  // Obtener vuelos de salida desde un aeropuerto
  static async getDepartureFlights(airportCode: string, date: string): Promise<FlightInfo[]> {
    try {
      if (!API_KEY) {
        throw new Error('AeroDataBox API key not configured');
      }

      // Usar código IATA si está disponible, sino ICAO
      const codeType = airportCode.length === 3 ? 'iata' : 'icao';
      
      // Convertir fecha YYYY-MM-DD a formato requerido por la API
      // La API espera formato YYYY-MM-DDTHH:MM en hora local del aeropuerto
      // Restricción: menos de 12 horas de duración
      const fromLocal = date + 'T06:00';  // 6 AM
      const toLocal = date + 'T17:59';    // 5:59 PM (11 horas 59 minutos)
      
      const response = await aeroDataBoxAPI.get(`/flights/airports/${codeType}/${airportCode}/${fromLocal}/${toLocal}`, {
        params: {
          direction: 'Departure',
          withLeg: true,
          withCancelled: false,
          withCodeshared: true,
          withCargo: false,
          withPrivate: false,
          withLocation: false
        }
      });

      return response.data?.departures || [];
    } catch (error: any) {
      console.error('Error getting departure flights:', error.response?.data || error.message);
      
      // Proporcionar información más específica sobre los errores
      if (error.response?.data?.message?.includes('time period')) {
        throw new Error('El rango de tiempo debe ser menor a 12 horas. Intente con una fecha más reciente o aeropuertos con más tráfico.');
      } else if (error.response?.status === 404) {
        throw new Error('No se encontraron datos para este aeropuerto en la fecha seleccionada.');
      } else if (error.response?.status === 403) {
        throw new Error('Límite de API alcanzado. Intente nuevamente en unos minutos.');
      } else {
        throw new Error('No se pudieron obtener los vuelos de salida. Verifique los códigos de aeropuerto y la fecha.');
      }
    }
  }

  // Buscar vuelos entre dos aeropuertos específicos
  static async searchFlightsBetweenAirports(originCode: string, destinationCode: string, date: string): Promise<FlightInfo[]> {
    try {
      // Primero obtenemos todos los vuelos de salida del aeropuerto origen
      const departureFlights = await this.getDepartureFlights(originCode, date);
      
      // Filtramos solo los vuelos que van al aeropuerto de destino
      const destinationCodeUpper = destinationCode.toUpperCase();
      const filteredFlights = departureFlights.filter(flight => 
        flight.arrival?.airport?.iata === destinationCodeUpper || 
        flight.arrival?.airport?.icao === destinationCodeUpper
      );

      return filteredFlights;
    } catch (error: any) {
      console.error('Error searching flights between airports:', error.message);
      
      // Información más específica para el usuario
      if (error.message.includes('tiempo')) {
        throw new Error('Error en el rango de fechas. Intente con una fecha más cercana (dentro de los próximos 1-2 días).');
      } else if (error.message.includes('datos')) {
        throw new Error('No hay datos disponibles para esta ruta. Intente con aeropuertos internacionales principales (MEX, CUN, GDL).');
      } else {
        throw new Error('No se encontraron vuelos para esta ruta y fecha. Los datos pueden estar limitados para algunos aeropuertos regionales.');
      }
    }
  }

  // Formatear fecha para la API (YYYY-MM-DDTHH:MM)
  static formatDateForAPI(date: Date): string {
    return date.toISOString().slice(0, 16);
  }

  // Obtener información básica de un aeropuerto
  static async getAirportInfo(code: string): Promise<Airport | null> {
    try {
      if (!API_KEY) {
        throw new Error('AeroDataBox API key not configured');
      }

      const codeType = code.length === 3 ? 'iata' : 'icao';
      
      const response = await aeroDataBoxAPI.get(`/airports/${codeType}/${code}`);
      
      return response.data || null;
    } catch (error: any) {
      console.error('Error getting airport info:', error.response?.data || error.message);
      return null;
    }
  }
}