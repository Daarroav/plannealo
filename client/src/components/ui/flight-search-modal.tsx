import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loading, Airplane, Time, Pin, Close, Info } from "@icon-park/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface FlightInfo {
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

interface Airport {
  icao: string;
  iata: string;
  name: string;
  shortName: string;
  municipalityName: string;
}

interface FlightSearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelectFlight: (flight: FlightInfo) => void;
  originAirport: Airport | null;
  destinationAirport: Airport | null;
}

export function FlightSearchModal({ 
  open, 
  onClose, 
  onSelectFlight,
  originAirport,
  destinationAirport
}: FlightSearchModalProps) {
  const [searchDate, setSearchDate] = useState("");
  const [flights, setFlights] = useState<FlightInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchMessage, setSearchMessage] = useState<string>("");
  const [searchMessageType, setSearchMessageType] = useState<"info" | "warning" | "error">("info");

  const handleSearch = async () => {
    if (!originAirport || !destinationAirport || !searchDate) {
      return;
    }

    setLoading(true);
    setSearched(true);
    setSearchMessage("");

    try {
      const originCode = originAirport.iata || originAirport.icao;
      const destinationCode = destinationAirport.iata || destinationAirport.icao;

      const response = await fetch(
        `/api/flights/search?origin=${originCode}&destination=${destinationCode}&date=${searchDate}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Flight search response:", data);
        setFlights(data.flights || []);

        // Debug: mostrar el primer vuelo para ver la estructura
        if (data.flights && data.flights.length > 0) {
          console.log("First flight structure:", data.flights[0]);
        }

        // Mostrar información adicional sobre la búsqueda
        if (data.searchInfo) {
          if (data.searchInfo.error) {
            setSearchMessage(data.searchInfo.error.suggestion);
            setSearchMessageType("error");
          } else if (data.searchInfo.isAlternativeDate) {
            const offsetText = data.searchInfo.dateOffset > 0 
              ? `${data.searchInfo.dateOffset} días después`
              : `${Math.abs(data.searchInfo.dateOffset)} días antes`;
            setSearchMessage(`No se encontraron vuelos para ${searchDate}. Mostrando vuelos para ${data.searchInfo.actualDate} (${offsetText})`);
            setSearchMessageType("warning");
          } else if (data.searchInfo.matchingFlights === 0 && data.searchInfo.totalFlightsFound > 0) {
            setSearchMessage(`Se encontraron ${data.searchInfo.totalFlightsFound} vuelos desde ${originCode}, pero ninguno hacia ${destinationCode}. Revise el aeropuerto de destino.`);
            setSearchMessageType("warning");
          } else if (data.searchInfo.matchingFlights > 0) {
            setSearchMessage(`Se encontraron ${data.searchInfo.matchingFlights} vuelos disponibles`);
            setSearchMessageType("info");
          }
        }
      } else {
        console.error('Error searching flights:', response.statusText);
        setFlights([]);
        setSearchMessage("Error al buscar vuelos. Intente nuevamente.");
        setSearchMessageType("error");
      }
    } catch (error) {
      console.error('Error searching flights:', error);
      setFlights([]);
      setSearchMessage("Error de conexión. Verifique su conexión a internet.");
      setSearchMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlight = (flight: FlightInfo) => {
    onSelectFlight(flight);
    onClose();
  };

  const formatTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return format(date, "HH:mm");
    } catch (error) {
      console.warn("Error formatting time:", dateTimeString);
      return "00:00";
    }
  };

  const formatDate = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return format(date, "dd MMM", { locale: es });
    } catch (error) {
      console.warn("Error formatting date:", dateTimeString);
      return "N/A";
    }
  };

  const formatFlightDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return "N/A";
    try {
      const date = new Date(dateTimeString);
      return format(date, "hh:mm a", { locale: es });
    } catch (error) {
      console.warn("Error formatting flight date/time:", dateTimeString);
      return "N/A";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buscar Vuelos Disponibles</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información de la ruta */}
          {originAirport && destinationAirport && (
            <div className="flex items-center justify-center space-x-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="font-bold">{originAirport.iata || originAirport.icao}</div>
                <div className="text-sm text-muted-foreground">
                  {originAirport.municipalityName}
                </div>
              </div>
              <Airplane className="w-6 h-6 text-blue-600" />
              <div className="text-center">
                <div className="font-bold">{destinationAirport.iata || destinationAirport.icao}</div>
                <div className="text-sm text-muted-foreground">
                  {destinationAirport.municipalityName}
                </div>
              </div>
            </div>
          )}

          {/* Selector de fecha */}
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <Label htmlFor="searchDate">Fecha del vuelo</Label>
              <Input
                id="searchDate"
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={!originAirport || !destinationAirport || !searchDate || loading}
              className="flex items-center space-x-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Buscar Vuelos</span>
            </Button>
          </div>

          {/* Mensaje de información de búsqueda */}
          {searchMessage && (
            <div className={`border rounded-lg p-4 mb-4 ${
              searchMessageType === "error" ? "border-red-200 bg-red-50" :
              searchMessageType === "warning" ? "border-yellow-200 bg-yellow-50" :
              "border-blue-200 bg-blue-50"
            }`}>
              <div className="flex items-start space-x-3">
                {searchMessageType === "error" && <Close className="w-5 h-5 text-red-600 mt-0.5" />}
                {searchMessageType === "warning" && (
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
                {searchMessageType === "info" && <Info className="w-5 h-5 text-blue-600 mt-0.5" />}
                <p className={`text-sm ${
                  searchMessageType === "error" ? "text-red-800" :
                  searchMessageType === "warning" ? "text-yellow-800" :
                  "text-blue-800"
                }`}>
                  {searchMessage}
                </p>
              </div>
            </div>
          )}

          {/* Resultados de búsqueda */}
          {loading && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Buscando vuelos disponibles...</p>
            </div>
          )}

          {searched && !loading && flights.length === 0 && !searchMessage && (
            <div className="text-center py-8 text-muted-foreground">
              <Airplane className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron vuelos para esta ruta y fecha.</p>
              <p className="text-sm">Intenta con otra fecha o verifica los aeropuertos seleccionados.</p>
            </div>
          )}

          {flights.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Vuelos disponibles ({flights.length})</h3>
              <div className="space-y-3">
                {flights.map((flight, index) => (
                  <div 
                    key={index}
                    className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleSelectFlight(flight)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {/* Información de la aerolínea y vuelo */}
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-bold text-lg">
                            {flight.airline?.iata || flight.airline?.icao || 'N/A'} {flight.number}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {flight.airline?.name || 'Aerolínea no especificada'}
                          </span>
                          {flight.status && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                              {flight.status}
                            </span>
                          )}
                        </div>

                        {/* Información del vuelo */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Salida */}
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <Pin className="w-4 h-4 text-blue-600" />
                              <span className="font-medium">Salida</span>
                            </div>
                            <div className="text-lg font-bold">
                              {formatTime(flight.departure.scheduledTimeLocal)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(flight.departure.scheduledTimeLocal)}
                            </div>
                            <div className="text-sm">
                              {flight.departure?.airport?.iata || flight.departure?.airport?.icao || 'N/A'} - {flight.departure?.airport?.municipalityName || 'Ciudad no especificada'}
                            </div>
                            {flight.departure.terminal && (
                              <div className="text-xs text-muted-foreground">
                                Terminal: {flight.departure.terminal}
                              </div>
                            )}
                          </div>

                          {/* Duración del vuelo */}
                          <div className="flex items-center justify-center">
                            <div className="text-center">
                              <Time className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                              <div className="text-sm text-muted-foreground">
                                {flight.aircraft?.model || "Vuelo directo"}
                              </div>
                            </div>
                          </div>

                          {/* Llegada */}
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <Pin className="w-4 h-4 text-green-600" />
                              <span className="font-medium">Llegada</span>
                            </div>
                            <div className="text-lg font-bold">
                              {formatTime(flight.arrival.scheduledTimeLocal)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(flight.arrival.scheduledTimeLocal)}
                            </div>
                            <div className="text-sm">
                              {flight.arrival?.airport?.iata || flight.arrival?.airport?.icao || 'N/A'} - {flight.arrival?.airport?.municipalityName || 'Ciudad no especificada'}
                            </div>
                            {flight.arrival.terminal && (
                              <div className="text-xs text-muted-foreground">
                                Terminal: {flight.arrival.terminal}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}