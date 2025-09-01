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
  // Propiedades opcionales para fechas alternativas
  _alternativeDate?: string;
  _originalDate?: string;
  _dateOffset?: number;
}

export class AeroDataBoxService {
  
  // Buscar aeropuertos por término
  static async searchAirports(term: string): Promise<Airport[]> {
    try {
      if (!API_KEY) {
        throw new Error('AeroDataBox API key not configured');
      }

      // Validar longitud mínima del término de búsqueda
      if (!term || term.trim().length < 3) {
        return []; // Retornar array vacío en lugar de error para términos cortos
      }

      const response = await aeroDataBoxAPI.get(`/airports/search/term`, {
        params: {
          q: term.trim(),
          limit: 10
        }
      });

      return response.data?.items || [];
    } catch (error: any) {
      console.error('Error searching airports:', error.response?.data || error.message);
      
      // Si el error es de longitud mínima, retornar array vacío en lugar de lanzar error
      if (error.response?.data?.message?.includes('Minimum required length')) {
        return [];
      }
      
      throw new Error('Failed to search airports');
    }
  }

  // Obtener vuelos de salida desde un aeropuerto con búsqueda flexible
  static async getDepartureFlights(airportCode: string, date: string): Promise<FlightInfo[]> {
    try {
      if (!API_KEY) {
        throw new Error('AeroDataBox API key not configured');
      }

      // Usar código IATA si está disponible, sino ICAO
      const codeType = airportCode.length === 3 ? 'iata' : 'icao';
      
      // Intentar diferentes rangos de tiempo
      const timeRanges = [
        { from: 'T08:00', to: 'T14:00', desc: 'mañana' },     // 6 horas
        { from: 'T14:00', to: 'T20:00', desc: 'tarde' },     // 6 horas  
        { from: 'T06:00', to: 'T12:00', desc: 'madrugada' }, // 6 horas
        { from: 'T20:00', to: 'T23:59', desc: 'noche' }     // 3h59m
      ];

      for (const range of timeRanges) {
        try {
          const fromLocal = date + range.from;
          const toLocal = date + range.to;
          
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

          const flights = response.data?.departures || [];
          if (flights.length > 0) {
            console.log(`Found ${flights.length} flights in ${range.desc} period`);
            // Mapear estructura de datos de AeroDataBox a nuestro formato
            const processedFlights = flights.map((flight: any) => ({
              number: flight.number || 'N/A',
              airline: flight.airline || { name: 'Unknown', iata: '', icao: '' },
              departure: {
                airport: {
                  icao: airportCode, // Usamos el código del aeropuerto de origen
                  iata: airportCode.length === 3 ? airportCode : '',
                  name: 'Departure Airport',
                  municipalityName: 'Origin City'
                },
                scheduledTimeLocal: flight.departure?.scheduledTime?.local || flight.departure?.scheduledTime?.utc || '',
                actualTimeLocal: flight.departure?.actualTime?.local || flight.departure?.actualTime?.utc,
                terminal: flight.departure?.terminal,
                gate: flight.departure?.gate
              },
              arrival: {
                airport: flight.arrival?.airport || { name: 'Unknown', iata: '', icao: '', municipalityName: 'Unknown' },
                scheduledTimeLocal: flight.arrival?.scheduledTime?.local || flight.arrival?.scheduledTime?.utc || '',
                actualTimeLocal: flight.arrival?.actualTime?.local || flight.arrival?.actualTime?.utc,
                terminal: flight.arrival?.terminal,
                gate: flight.arrival?.gate
              },
              aircraft: flight.aircraft,
              status: flight.status || 'Unknown'
            }));
            return processedFlights;
          }
        } catch (rangeError: any) {
          console.log(`No flights found in ${range.desc} period:`, rangeError.response?.data?.message || rangeError.message);
          continue; // Intentar siguiente rango
        }
      }

      // Si no encontró nada en el día solicitado, buscar días cercanos
      return await this.searchNearbyDates(airportCode, codeType, date);

    } catch (error: any) {
      console.error('Error getting departure flights:', error.response?.data || error.message);
      throw new Error('No se pudieron obtener vuelos para este aeropuerto.');
    }
  }

  // Buscar en fechas cercanas
  static async searchNearbyDates(airportCode: string, codeType: string, originalDate: string): Promise<FlightInfo[]> {
    const searchDate = new Date(originalDate);
    const nearbyDates = [];
    
    // Generar fechas cercanas (±3 días)
    for (let i = -3; i <= 3; i++) {
      if (i === 0) continue; // Ya probamos la fecha original
      const nearDate = new Date(searchDate);
      nearDate.setDate(nearDate.getDate() + i);
      nearbyDates.push({
        date: nearDate.toISOString().split('T')[0],
        offset: i
      });
    }

    // Buscar en fechas cercanas
    for (const nearbyDate of nearbyDates) {
      try {
        const fromLocal = nearbyDate.date + 'T08:00';
        const toLocal = nearbyDate.date + 'T20:00';
        
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

        const flights = response.data?.departures || [];
        if (flights.length > 0) {
          const dayText = nearbyDate.offset > 0 ? `${nearbyDate.offset} días después` : `${Math.abs(nearbyDate.offset)} días antes`;
          console.log(`Found ${flights.length} flights ${dayText} (${nearbyDate.date})`);
          
          // Mapear estructura de datos y agregar información de fecha alternativa
          const processedFlights = flights.map((flight: any) => ({
            number: flight.number || 'N/A',
            airline: flight.airline || { name: 'Unknown', iata: '', icao: '' },
            departure: {
              airport: {
                icao: airportCode,
                iata: airportCode.length === 3 ? airportCode : '',
                name: 'Departure Airport',
                municipalityName: 'Origin City'
              },
              scheduledTimeLocal: flight.departure?.scheduledTime?.local || flight.departure?.scheduledTime?.utc || '',
              actualTimeLocal: flight.departure?.actualTime?.local || flight.departure?.actualTime?.utc,
              terminal: flight.departure?.terminal,
              gate: flight.departure?.gate
            },
            arrival: {
              airport: flight.arrival?.airport || { name: 'Unknown', iata: '', icao: '', municipalityName: 'Unknown' },
              scheduledTimeLocal: flight.arrival?.scheduledTime?.local || flight.arrival?.scheduledTime?.utc || '',
              actualTimeLocal: flight.arrival?.actualTime?.local || flight.arrival?.actualTime?.utc,
              terminal: flight.arrival?.terminal,
              gate: flight.arrival?.gate
            },
            aircraft: flight.aircraft,
            status: flight.status || 'Unknown',
            _alternativeDate: nearbyDate.date,
            _originalDate: originalDate,
            _dateOffset: nearbyDate.offset
          }));
          
          return processedFlights;
        }
      } catch (error) {
        continue;
      }
    }

    throw new Error('No se encontraron vuelos en las fechas cercanas');
  }

  // Buscar vuelos entre dos aeropuertos específicos con búsqueda flexible
  static async searchFlightsBetweenAirports(originCode: string, destinationCode: string, date: string): Promise<any> {
    try {
      // Obtener información del aeropuerto de origen para mejores datos
      const originAirport = await this.getAirportInfo(originCode);
      
      // Primero obtenemos todos los vuelos de salida del aeropuerto origen
      const departureFlights = await this.getDepartureFlights(originCode, date);
      
      // Filtramos solo los vuelos que van al aeropuerto de destino
      const destinationCodeUpper = destinationCode.toUpperCase();
      const filteredFlights = departureFlights.filter(flight => 
        flight.arrival?.airport?.iata === destinationCodeUpper || 
        flight.arrival?.airport?.icao === destinationCodeUpper
      );

      // Verificar si son vuelos de fecha alternativa
      const hasAlternativeDate = departureFlights.length > 0 && departureFlights[0]._alternativeDate;
      
      return {
        flights: filteredFlights,
        searchInfo: {
          originalDate: date,
          actualDate: hasAlternativeDate ? departureFlights[0]._alternativeDate : date,
          isAlternativeDate: hasAlternativeDate,
          dateOffset: hasAlternativeDate ? departureFlights[0]._dateOffset : 0,
          totalFlightsFound: departureFlights.length,
          matchingFlights: filteredFlights.length
        }
      };
    } catch (error: any) {
      console.error('Error searching flights between airports:', error.message);
      
      // Análisis detallado del error
      let errorDetails = {
        reason: 'unknown',
        suggestion: '',
        technicalError: error.message
      };

      if (error.message.includes('API key')) {
        errorDetails.reason = 'api_key';
        errorDetails.suggestion = 'Problema de configuración. Contacte al administrador.';
      } else if (error.message.includes('fechas cercanas')) {
        errorDetails.reason = 'no_data_nearby';
        errorDetails.suggestion = `No se encontraron vuelos desde ${originCode} hacia ${destinationCode} en la fecha ${date} ni en fechas cercanas. Intente con:
        • Aeropuertos principales (MEX, CUN, GDL, MTY)
        • Fechas más cercanas (hoy o mañana)
        • Rutas comerciales conocidas`;
      } else if (error.message.includes('aeropuerto')) {
        errorDetails.reason = 'airport_data';
        errorDetails.suggestion = `El aeropuerto ${originCode} puede tener datos limitados. Los aeropuertos regionales a menudo no tienen información completa de vuelos en tiempo real.`;
      } else {
        errorDetails.reason = 'general';
        errorDetails.suggestion = 'Error general en la búsqueda. Verifique los códigos de aeropuerto y la fecha, o intente más tarde.';
      }

      return {
        flights: [],
        searchInfo: {
          originalDate: date,
          actualDate: date,
          isAlternativeDate: false,
          dateOffset: 0,
          totalFlightsFound: 0,
          matchingFlights: 0,
          error: errorDetails
        }
      };
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