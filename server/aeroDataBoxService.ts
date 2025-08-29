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
      const searchDate = new Date(date);
      const fromDateTime = new Date(searchDate);
      fromDateTime.setHours(0, 0, 0, 0);
      
      const toDateTime = new Date(searchDate);
      toDateTime.setHours(23, 59, 59, 999);
      
      // Formato ISO para la API
      const fromLocal = fromDateTime.toISOString().slice(0, 19);
      const toLocal = toDateTime.toISOString().slice(0, 19);
      
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
      throw new Error('Failed to get departure flights');
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
      throw new Error('Failed to search flights between airports');
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