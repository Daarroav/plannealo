import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, Plane, Upload, FileText, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { insertFlightSchema } from "@shared/schema";
import { AirportSearch } from "./airport-search";
import { FlightSearchModal } from "./flight-search-modal";
import { extractIataCode, getTimezoneForAirport, mexicoComponentsToUTC } from "@/lib/timezones";
import { TIMEZONE_CATALOG, type TimezoneOption } from "@/lib/timezone-catalog";
import { TimezoneCombobox } from "./timezone-combobox";
import { AirportCombobox } from "./airport-combobox";
import { CostBreakdownFields } from "@/components/ui/cost-breakdown-fields";
import { normalizeCostBreakdown, type CostValue } from "@/lib/cost";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";

// Extend the schema with additional fields for the form
const flightFormSchema = insertFlightSchema.extend({
  departureDateField: z.string().min(1, "La fecha de salida es requerida"),
  departureTimeField: z.string().min(1, "La hora de salida es requerida"),
  arrivalDateField: z.string().min(1, "La fecha de llegada es requerida"),
  arrivalTimeField: z.string().min(1, "La hora de llegada es requerida"),
  departureAirport: z.string().optional(),
  arrivalAirport: z.string().optional(),
  attachments: z.array(z.string()).optional(),
}).omit({
  departureDate: true,
  arrivalDate: true,
});

type FlightForm = z.infer<typeof flightFormSchema>;

interface FlightFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  travelId: string;
  editingFlight?: any;
}

interface Airport {
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

const MEXICO_TIMEZONE = "America/Mexico_City";

export function FlightFormModal({ isOpen, onClose, onSubmit, isLoading, travelId, editingFlight }: FlightFormModalProps) {
  const [departureDate, setDepartureDate] = useState<Date>();
  const [arrivalDate, setArrivalDate] = useState<Date>();
  const [flightSearchOpen, setFlightSearchOpen] = useState(false);
  const [originAirport, setOriginAirport] = useState<Airport | null>(null);
  const [destinationAirport, setDestinationAirport] = useState<Airport | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [removedExistingAttachments, setRemovedExistingAttachments] = useState<number[]>([]);
  const [costValue, setCostValue] = useState<CostValue>({
    currency: "MXN",
    total: "",
    breakdown: [],
  });

  // Zonas horarias manuales (cuando no se usa búsqueda automática)
  const [manualDepartureTimezone, setManualDepartureTimezone] = useState<string>("");
  const [manualArrivalTimezone, setManualArrivalTimezone] = useState<string>("");

  // Zonas horarias sugeridas del aeropuerto seleccionado
  const [departureAirportTimezones, setDepartureAirportTimezones] = useState<string[]>([]);
  const [arrivalAirportTimezones, setArrivalAirportTimezones] = useState<string[]>([]);

  // Cargar aeropuertos para obtener zonas horarias (ANTES de usarlo en useEffect)
  const { data: airports = [] } = useQuery<any[]>({
    queryKey: ["/api/airports"],
  });

  // Cargar catálogo de vuelos
  const { data: flightsCatalog } = useQuery<{
    airlines: string[];
    routes: any[];
    departureAirports: Array<{ city: string; airportName: string; label: string }>;
    arrivalAirports: Array<{ city: string; airportName: string; label: string }>;
  }>({
    queryKey: ["/api/catalog/flights"],
  });

  // Preparar opciones de aeropuertos combinando catálogo y base de datos
  const departureAirportOptions = React.useMemo(() => {
    const catalogOptions = (flightsCatalog?.departureAirports || []).map(a => ({
      value: a.airportName,
      label: a.airportName,
      data: a,
      isRecent: true,
    }));

    const allAirportOptions = airports
      .filter((airport: any) => airport.airportName)
      .map((airport: any) => ({
        value: airport.airportName,
        label: airport.iataCode 
          ? `${airport.airportName} (${airport.iataCode})` 
          : airport.airportName,
        data: {
          airportName: airport.airportName,
          city: airport.iataCode 
            ? `${airport.iataCode} - ${airport.city || airport.airportName}`
            : airport.airportName,
        },
        isRecent: false,
      }));

    // Combinar y eliminar duplicados
    const seen = new Set(catalogOptions.map(o => o.value));
    const uniqueAllOptions = allAirportOptions.filter((o: any) => !seen.has(o.value));
    
    return [...catalogOptions, ...uniqueAllOptions];
  }, [flightsCatalog, airports]);

  const arrivalAirportOptions = React.useMemo(() => {
    const catalogOptions = (flightsCatalog?.arrivalAirports || []).map(a => ({
      value: a.airportName,
      label: a.airportName,
      data: a,
      isRecent: true,
    }));

    const allAirportOptions = airports
      .filter((airport: any) => airport.airportName)
      .map((airport: any) => ({
        value: airport.airportName,
        label: airport.iataCode 
          ? `${airport.airportName} (${airport.iataCode})` 
          : airport.airportName,
        data: {
          airportName: airport.airportName,
          city: airport.iataCode 
            ? `${airport.iataCode} - ${airport.city || airport.airportName}`
            : airport.airportName,
        },
        isRecent: false,
      }));

    // Combinar y eliminar duplicados
    const seen = new Set(catalogOptions.map(o => o.value));
    const uniqueAllOptions = allAirportOptions.filter((o: any) => !seen.has(o.value));
    
    return [...catalogOptions, ...uniqueAllOptions];
  }, [flightsCatalog, airports]);

  // Helper function to convert Mexico timezone to UTC
  const mexicoToUTC = (mexicoDateTimeStr: string): Date => {
    // Input format: YYYY-MM-DDTHH:mm
    const [dateStr, timeStr] = mexicoDateTimeStr.split('T');
    
    // Usamos la función centralizada que ya maneja la independencia de la zona horaria del navegador
    const utcIso = mexicoComponentsToUTC(dateStr, timeStr);
    return new Date(utcIso);
  };

  const form = useForm<FlightForm>({
    resolver: zodResolver(flightFormSchema),
    defaultValues: {
      travelId,
      airline: "",
      flightNumber: "",
      reservationNumber: "",
      departureCity: "",
      arrivalCity: "",
      departureDateField: "",
      departureTimeField: "06:00",
      arrivalDateField: "",
      arrivalTimeField: "06:00",
      departureTerminal: "",
      arrivalTerminal: "",
      class: "",
      attachments: [],
    },
  });

  // Helper function to convert UTC ISO date to Mexico timezone components
  const formatDateComponents = (utcISODate: string, targetTimezone: string) => {
    try {
      const utcDate = new Date(utcISODate);
      
      // Convert UTC to Mexico timezone using Intl API
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: MEXICO_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      const parts = formatter.formatToParts(utcDate);
      const year = parts.find(p => p.type === 'year')?.value || '2025';
      const month = parts.find(p => p.type === 'month')?.value || '01';
      const day = parts.find(p => p.type === 'day')?.value || '01';
      const hour = parts.find(p => p.type === 'hour')?.value || '00';
      const minute = parts.find(p => p.type === 'minute')?.value || '00';
      
      return {
        dateStr: `${year}-${month}-${day}`,
        timeStr: `${hour}:${minute}`
      };
    } catch (error) {
      console.error("Error formatting date components:", error, { utcISODate, targetTimezone });
      return { dateStr: "", timeStr: "" };
    }
  };

  // Pre-llenar formulario cuando se está editando
  React.useEffect(() => {
    if (editingFlight) {
      let depTz = editingFlight.departureTimezone || getTimezoneForAirport(extractIataCode(editingFlight.departureCity || ''), MEXICO_TIMEZONE);
      let arrTz = editingFlight.arrivalTimezone || getTimezoneForAirport(extractIataCode(editingFlight.arrivalCity || ''), MEXICO_TIMEZONE);

      // Ensure timezones are valid, fallback to Mexico City if not found
      depTz = depTz || MEXICO_TIMEZONE;
      arrTz = arrTz || MEXICO_TIMEZONE;

      const depComponents = formatDateComponents(editingFlight.departureDate, MEXICO_TIMEZONE);
      const arrComponents = formatDateComponents(editingFlight.arrivalDate, MEXICO_TIMEZONE);

      // Crear objetos Date que representen la fecha en zona México (sin conversión de timezone del navegador)
      // Parsear componentes y crear fecha "local" que ignorará el timezone del navegador
      const [depYear, depMonth, depDay] = depComponents.dateStr.split('-').map(Number);
      const [arrYear, arrMonth, arrDay] = arrComponents.dateStr.split('-').map(Number);
      
      // Crear Date usando el constructor que toma año, mes, día (en zona local del navegador pero con valores de México)
      setDepartureDate(new Date(depYear, depMonth - 1, depDay));
      setArrivalDate(new Date(arrYear, arrMonth - 1, arrDay));

      form.reset({
        travelId,
        airline: editingFlight.airline || "",
        flightNumber: editingFlight.flightNumber || "",
        reservationNumber: editingFlight.reservationNumber || "",
        departureCity: editingFlight.departureCity || "",
        arrivalCity: editingFlight.arrivalCity || "",
        departureAirport: editingFlight.departureAirport || "",
        arrivalAirport: editingFlight.arrivalAirport || "",
        departureDateField: depComponents.dateStr,
        departureTimeField: depComponents.timeStr,
        arrivalDateField: arrComponents.dateStr,
        arrivalTimeField: arrComponents.timeStr,
        departureTerminal: editingFlight.departureTerminal || "",
        arrivalTerminal: editingFlight.arrivalTiminal || "",
        class: editingFlight.class || "",
        attachments: editingFlight.attachments || [],
      });

      setCostValue({
        currency: editingFlight.costCurrency || "MXN",
        total: editingFlight.costAmount || "",
        breakdown: normalizeCostBreakdown(editingFlight.costBreakdown),
      });

      setManualDepartureTimezone(depTz);
      setManualArrivalTimezone(arrTz);

      const updateAirportTimezones = (city: string, setTimezones: React.Dispatch<React.SetStateAction<string[]>>) => {
        const iataCode = extractIataCode(city);
        if (iataCode) {
          const airportData = airports.find((airport: any) => airport.iataCode === iataCode);
          if (airportData && airportData.timezones) {
            setTimezones(airportData.timezones.map((tz: any) => tz.timezone));
          } else {
            setTimezones([]);
          }
        } else {
          setTimezones([]);
        }
      };

      updateAirportTimezones(editingFlight.departureCity, setDepartureAirportTimezones);
      updateAirportTimezones(editingFlight.arrivalCity, setArrivalAirportTimezones);

      setAttachedFiles([]);
      setRemovedExistingAttachments([]);
    } else {
      setDepartureDate(undefined);
      setArrivalDate(undefined);
      form.reset({
        travelId,
        airline: "",
        flightNumber: "",
        reservationNumber: "",
        departureCity: "",
        arrivalCity: "",
        departureAirport: "",
        arrivalAirport: "",
        departureDateField: "",
        departureTimeField: "06:00",
        arrivalDateField: "",
        arrivalTimeField: "06:00",
        departureTerminal: "",
        arrivalTerminal: "",
        class: "",
        attachments: [],
      });
      setCostValue({
        currency: "MXN",
        total: "",
        breakdown: [],
      });
      setAttachedFiles([]);
      setRemovedExistingAttachments([]);
      setManualDepartureTimezone("");
      setManualArrivalTimezone("");
      setDepartureAirportTimezones([]);
      setArrivalAirportTimezones([]);
    }
  }, [editingFlight, form, travelId, airports]);

  // Auto-completar zonas horarias cuando se detecta código IATA
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "departureCity" || name === "arrivalCity") {
        const departureCity = value.departureCity || '';
        const arrivalCity = value.arrivalCity || '';

        if (name === "departureCity") {
          const departureIata = extractIataCode(departureCity);
          if (departureIata) {
            const timezone = getTimezoneForAirport(departureIata, MEXICO_TIMEZONE);
            if (timezone) {
              setManualDepartureTimezone(timezone);
            }
          }

          const selectedAirport = airports.find((airport: any) => {
            const airportValue = airport.iataCode ? `${airport.iataCode} - ${airport.airportName}` : airport.airportName;
            return airportValue === departureCity;
          });

          if (selectedAirport && selectedAirport.timezones) {
            setDepartureAirportTimezones(selectedAirport.timezones.map((tz: any) => tz.timezone));
          } else {
            setDepartureAirportTimezones([]);
          }
        }

        if (name === "arrivalCity") {
          const arrivalIata = extractIataCode(arrivalCity);
          if (arrivalIata) {
            const timezone = getTimezoneForAirport(arrivalIata, MEXICO_TIMEZONE);
            if (timezone) {
              setManualArrivalTimezone(timezone);
            }
          }

          const selectedAirport = airports.find((airport: any) => {
            const airportValue = airport.iataCode ? `${airport.iataCode} - ${airport.airportName}` : airport.airportName;
            return airportValue === arrivalCity;
          });

          if (selectedAirport && selectedAirport.timezones) {
            setArrivalAirportTimezones(selectedAirport.timezones.map((tz: any) => tz.timezone));
          } else {
            setArrivalAirportTimezones([]);
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, airports]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = (index: number) => {
    setRemovedExistingAttachments(prev => [...prev, index]);
  };

  const handleSelectFlight = (flight: FlightInfo) => {
    try {
      if (!flight.departure?.scheduledTimeLocal || !flight.arrival?.scheduledTimeLocal) {
        console.error("Flight missing required time information", flight);
        return;
      }

      const departureTime = new Date(flight.departure.scheduledTimeLocal);
      const arrivalTime = new Date(flight.arrival.scheduledTimeLocal);

      if (isNaN(departureTime.getTime()) || isNaN(arrivalTime.getTime())) {
        console.error("Invalid flight times", flight);
        return;
      }

      // Set departure and arrival dates for the calendar inputs
      setDepartureDate(departureTime);
      setArrivalDate(arrivalTime);

      // Get current timezones or fallback to Mexico City
      let depTz = getTimezoneForAirport(extractIataCode(flight.departure.airport?.iata || flight.departure.airport?.icao || ''), MEXICO_TIMEZONE) || MEXICO_TIMEZONE;
      let arrTz = getTimezoneForAirport(extractIataCode(flight.arrival.airport?.iata || flight.arrival.airport?.icao || ''), MEXICO_TIMEZONE) || MEXICO_TIMEZONE;

      // Format dates and times for the form fields - convert UTC to Mexico timezone
      const depComponents = formatDateComponents(flight.departure.scheduledTimeLocal, depTz);
      const arrComponents = formatDateComponents(flight.arrival.scheduledTimeLocal, arrTz);

      form.setValue("airline", flight.airline?.name || `${flight.airline?.iata || flight.airline?.icao || 'Aerolínea'}`);
      form.setValue("flightNumber", flight.number || "");
      form.setValue("departureCity", `${flight.departure?.airport?.iata || flight.departure?.airport?.icao || 'N/A'} - ${flight.departure?.airport?.municipalityName || 'Ciudad de origen'}`);
      form.setValue("arrivalCity", `${flight.arrival?.airport?.iata || flight.arrival?.airport?.icao || 'N/A'} - ${flight.arrival?.airport?.municipalityName || 'Ciudad de destino'}`);
      form.setValue("departureAirport", flight.departure?.airport?.name || "");
      form.setValue("arrivalAirport", flight.arrival?.airport?.name || "");
      form.setValue("departureDateField", depComponents.dateStr);
      form.setValue("departureTimeField", depComponents.timeStr);
      form.setValue("arrivalDateField", arrComponents.dateStr);
      form.setValue("arrivalTimeField", arrComponents.timeStr);
      form.setValue("departureTerminal", flight.departure?.terminal || "");
      form.setValue("arrivalTerminal", flight.arrival?.terminal || "");

      // Set manual timezones based on detected or fallback
      setManualDepartureTimezone(depTz);
      setManualArrivalTimezone(arrTz);

      console.log("Flight form populated successfully with API times:", {
        departure: flight.departure.scheduledTimeLocal,
        arrival: flight.arrival.scheduledTimeLocal,
        departureTimezone: depTz,
        arrivalTimezone: arrTz
      });
    } catch (error) {
      console.error("Error populating flight form:", error, flight);
    }
  };

  const handleSubmit = async (data: FlightForm) => {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      activeElement.blur();
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    const currentValues = form.getValues();

    const departureIata = extractIataCode(currentValues.departureCity || '');
    const arrivalIata = extractIataCode(currentValues.arrivalCity || '');

    if (!departureIata && !manualDepartureTimezone) {
      form.setError('departureCity', { type: 'manual', message: 'Debes seleccionar una zona horaria de salida cuando no usas búsqueda automática' });
      return;
    }

    if (!arrivalIata && !manualArrivalTimezone) {
      form.setError('arrivalCity', { type: 'manual', message: 'Debes seleccionar una zona horaria de llegada cuando no usas búsqueda automática' });
      return;
    }

    let departureTz = departureIata ? getTimezoneForAirport(departureIata, MEXICO_TIMEZONE) : manualDepartureTimezone;
    let arrivalTz = arrivalIata ? getTimezoneForAirport(arrivalIata, MEXICO_TIMEZONE) : manualArrivalTimezone;

    departureTz = departureTz || MEXICO_TIMEZONE; // Fallback to Mexico City
    arrivalTz = arrivalTz || MEXICO_TIMEZONE;   // Fallback to Mexico City

    // Combine date and time fields - these are in Mexico timezone
    const departureDateTimeStr = `${currentValues.departureDateField}T${currentValues.departureTimeField}:00`;
    const arrivalDateTimeStr = `${currentValues.arrivalDateField}T${currentValues.arrivalTimeField}:00`;

    console.log('DEBUG DATE ISSUE:', {
      departureDateField: currentValues.departureDateField,
      departureTimeField: currentValues.departureTimeField,
      departureDateTimeStr,
      arrivalDateField: currentValues.arrivalDateField,
      arrivalDateTimeStr
    });

    // Convert Mexico Time to UTC manually
    const departureUTC = mexicoToUTC(departureDateTimeStr);
    const arrivalUTC = mexicoToUTC(arrivalDateTimeStr);

    console.log('DEBUG DATE CONVERTED:', {
      departureUTC: departureUTC.toISOString(),
      departureUTCFull: departureUTC.toString(),
      arrivalUTC: arrivalUTC.toISOString()
    });

    console.log('Converting Mexico time to UTC:', {
      departure: {
        inputTime: departureDateTimeStr,
        timezone: departureTz,
        savedUTC: departureUTC.toISOString()
      },
      arrival: {
        inputTime: arrivalDateTimeStr,
        timezone: arrivalTz,
        savedUTC: arrivalUTC.toISOString()
      }
    });

    const formData = new FormData();

    if (editingFlight) {
      formData.append('id', editingFlight.id);
    }
    formData.append('travelId', currentValues.travelId);
    formData.append('airline', currentValues.airline);
    formData.append('flightNumber', currentValues.flightNumber);
    formData.append('reservationNumber', currentValues.reservationNumber || '');
    formData.append('departureCity', currentValues.departureCity || '');
    formData.append('arrivalCity', currentValues.arrivalCity || '');
    formData.append('departureDate', departureUTC.toISOString()); // Save as UTC
    formData.append('departureTime', currentValues.departureTimeField); // Keep original time string for clarity if needed elsewhere
    formData.append('arrivalDate', arrivalUTC.toISOString()); // Save as UTC
    formData.append('arrivalTime', currentValues.arrivalTimeField); // Keep original time string
    formData.append('departureTerminal', currentValues.departureTerminal || '');
    formData.append('arrivalTerminal', currentValues.arrivalTerminal || '');
    formData.append('class', currentValues.class || '');
    formData.append('costAmount', costValue.total || '');
    formData.append('costCurrency', costValue.currency || 'MXN');
    if (costValue.breakdown.length > 0) {
      formData.append('costBreakdown', JSON.stringify(costValue.breakdown));
    }

    // Add determined timezones to formData
    formData.append('departureTimezone', departureTz);
    formData.append('arrivalTimezone', arrivalTz);

    attachedFiles.forEach((file) => {
      formData.append('attachments', file);
    });

    if (removedExistingAttachments.length > 0) {
      formData.append('removedExistingAttachments', JSON.stringify(removedExistingAttachments));
    }

    if (editingFlight?.attachments) {
      const remainingAttachments = editingFlight.attachments.filter((_: string, index: number) =>
        !removedExistingAttachments.includes(index)
      );
      if (remainingAttachments.length > 0) {
        formData.append('existingAttachments', JSON.stringify(remainingAttachments));
      }
    }

    onSubmit(formData);
    form.reset();
    setDepartureDate(undefined);
    setArrivalDate(undefined);
    setAttachedFiles([]);
    setRemovedExistingAttachments([]);
    setManualDepartureTimezone("");
    setManualArrivalTimezone("");
    setCostValue({
      currency: "MXN",
      total: "",
      breakdown: [],
    });
  };

  const handleClose = () => {
    form.reset();
    setDepartureDate(undefined);
    setArrivalDate(undefined);
    setAttachedFiles([]);
    setRemovedExistingAttachments([]);
    setManualDepartureTimezone("");
    setManualArrivalTimezone("");
    setCostValue({
      currency: "MXN",
      total: "",
      breakdown: [],
    });
    onClose();
  };

  const flightClasses = [
    { value: "economica", label: "Económica" },
    { value: "premium", label: "Premium Economy" },
    { value: "ejecutiva", label: "Ejecutiva/Business" },
    { value: "primera", label: "Primera Clase" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {editingFlight ? "Editar Vuelo" : "Agregar Vuelo"}
          </DialogTitle>
          <DialogDescription>
            {editingFlight
              ? "Modifica la información del vuelo"
              : "Agrega información de vuelo al itinerario"
            }
          </DialogDescription>
        </DialogHeader>

        {!editingFlight && (
          <div className="border rounded-lg p-4 bg-blue-50 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Plane className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Búsqueda Automática de Vuelos</h3>
            </div>
            <p className="text-sm text-blue-700 mb-4">
              Selecciona los aeropuertos de origen y destino para buscar vuelos disponibles y llenar automáticamente el formulario.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <AirportSearch
                label="Aeropuerto de Origen"
                placeholder="Buscar aeropuerto de salida..."
                value={originAirport ? `${originAirport.iata || originAirport.icao} - ${originAirport.shortName}` : ""}
                onSelect={setOriginAirport}
              />

              <AirportSearch
                label="Aeropuerto de Destino"
                placeholder="Buscar aeropuerto de llegada..."
                value={destinationAirport ? `${destinationAirport.iata || destinationAirport.icao} - ${destinationAirport.shortName}` : ""}
                onSelect={setDestinationAirport}
              />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setFlightSearchOpen(true)}
              disabled={!originAirport || !destinationAirport}
              className="w-full flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Buscar Vuelos Disponibles</span>
            </Button>
          </div>
        )}

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="airline">Aerolínea *</Label>
              <Input
                id="airline"
                {...form.register("airline")}
                placeholder="Ej: Volaris (Y4)"
              />
              {form.formState.errors.airline && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.airline.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="flightNumber"># de Vuelo *</Label>
              <Input
                id="flightNumber"
                {...form.register("flightNumber")}
                placeholder="Ej: Y4123"
              />
              {form.formState.errors.flightNumber && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.flightNumber.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="reservationNumber"># de Confirmación </Label>
            <Input
              id="reservationNumber"
              {...form.register("reservationNumber")}
              placeholder="Número de confirmación de la reserva" required={false}
            />
            {form.formState.errors.reservationNumber && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.reservationNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <AirportCombobox
                label="Aeropuerto de salida *"
                value={form.watch("departureCity")}
                onChange={(value) => form.setValue("departureCity", value || "")}
                placeholder="Buscar Aeropuerto de salida..."
              />
              {form.formState.errors.departureCity && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.departureCity.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="departureAirport">Nombre del Aeropuerto de Salida</Label>
              <AutocompleteInput
                id="departureAirport"
                value={form.watch("departureAirport") || ""}
                onChange={(value) => form.setValue("departureAirport", value)}
                options={departureAirportOptions}
                placeholder="Ej: Aeropuerto Internacional de Cancún"
                onLoadData={(airport) => {
                  if (airport) {
                    form.setValue("departureAirport", airport.airportName);
                    if (airport.city) {
                      form.setValue("departureCity", airport.city);
                    }
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Opcional: El nombre completo del aeropuerto para mejor visualización
              </p>
            </div>

            <div>
              <Label htmlFor="departureTimezone">Zona Horaria de Salida *</Label>
              <TimezoneCombobox
                id="departureTimezone"
                testId="select-departure-timezone"
                value={manualDepartureTimezone}
                onValueChange={setManualDepartureTimezone}
                placeholder="Buscar zona horaria..."
                suggestedTimezones={departureAirportTimezones}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {extractIataCode(form.watch("departureCity") || '')
                  ? "Se auto-completó según el aeropuerto. Puedes cambiarla si es necesario."
                  : "Selecciona la zona horaria del aeropuerto de salida"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Fecha de Salida *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !departureDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {departureDate ? format(departureDate, "dd/MM/yyyy", { locale: es }) : "FECHA DE SALIDA *"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={departureDate}
                      onSelect={(date) => {
                        setDepartureDate(date);
                        if (date) {
                          form.setValue("departureDateField", format(date, "yyyy-MM-dd"));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.departureDateField && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.departureDateField.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="departureTimeField">Hora de Salida *</Label>
                <Input
                  id="departureTimeField"
                  type="time"
                  {...form.register("departureTimeField")}
                  placeholder="12:00 a.m."
                />
                {form.formState.errors.departureTimeField && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.departureTimeField.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <AirportCombobox
                label="Aeropuerto de llegada *"
                value={form.watch("arrivalCity")}
                onChange={(value) => form.setValue("arrivalCity", value || "")}
                placeholder="Buscar Aeropuerto de llegada..."
              />
              {form.formState.errors.arrivalCity && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.arrivalCity.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="arrivalAirport">Nombre del Aeropuerto de Llegada</Label>
              <AutocompleteInput
                id="arrivalAirport"
                value={form.watch("arrivalAirport") || ""}
                onChange={(value) => form.setValue("arrivalAirport", value)}
                options={arrivalAirportOptions}
                placeholder="Ej: Aeropuerto Internacional de Guadalajara"
                onLoadData={(airport) => {
                  if (airport) {
                    form.setValue("arrivalAirport", airport.airportName);
                    if (airport.city) {
                      form.setValue("arrivalCity", airport.city);
                    }
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Opcional: El nombre completo del aeropuerto para mejor visualización
              </p>
            </div>

            <div>
              <Label htmlFor="arrivalTimezone">Zona Horaria de Llegada *</Label>
              <TimezoneCombobox
                id="arrivalTimezone"
                testId="select-arrival-timezone"
                value={manualArrivalTimezone}
                onValueChange={setManualArrivalTimezone}
                placeholder="Buscar zona horaria..."
                suggestedTimezones={arrivalAirportTimezones}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {extractIataCode(form.watch("arrivalCity") || '')
                  ? "Se auto-completó según el aeropuerto. Puedes cambiarla si es necesario."
                  : "Selecciona la zona horaria del aeropuerto de llegada"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Fecha de Llegada *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !arrivalDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {arrivalDate ? format(arrivalDate, "dd/MM/yyyy", { locale: es }) : "FECHA DE LLEGADA *"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={arrivalDate}
                      onSelect={(date) => {
                        setArrivalDate(date);
                        if (date) {
                          form.setValue("arrivalDateField", format(date, "yyyy-MM-dd"));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.arrivalDateField && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.arrivalDateField.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="arrivalTimeField">Hora de Llegada *</Label>
                <Input
                  id="arrivalTimeField"
                  type="time"
                  {...form.register("arrivalTimeField")}
                  placeholder="12:00 a.m."
                />
                {form.formState.errors.arrivalTimeField && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.arrivalTimeField.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="departureTerminal">Terminal Salida</Label>
              <Input
                id="departureTerminal"
                {...form.register("departureTerminal")}
                placeholder="Ej: Terminal 1"
              />
            </div>

            <div>
              <Label htmlFor="arrivalTerminal">Terminal Llegada</Label>
              <Input
                id="arrivalTerminal"
                {...form.register("arrivalTerminal")}
                placeholder="Ej: Terminal 2"
              />
            </div>

            <div>
              <Label htmlFor="class">Clase de Vuelo </Label>
              <Select onValueChange={(value) => form.setValue("class", value)} value={form.watch("class")} required={false}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar clase" />
                </SelectTrigger>
                <SelectContent>
                  {flightClasses.map((flightClass) => (
                    <SelectItem key={flightClass.value} value={flightClass.value}>
                      {flightClass.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.class && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.class.message}
                </p>
              )}
            </div>
          </div>

          <CostBreakdownFields value={costValue} onChange={setCostValue} />

          <div>
            <Label>Documentos Adjuntos</Label>
            <p className="text-xs text-muted-foreground mt-1">Sube documentos relacionados al vuelo (confirmaciones, boarding passes, etc.)</p>
            <div className="mt-2">
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload-flight"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-upload-flight')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Seleccionar Documentos
              </Button>
            </div>

            {(attachedFiles.length > 0 || (editingFlight?.attachments && editingFlight.attachments.length > 0)) && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Documentos Adjuntos:</p>

                {editingFlight?.attachments
                  ?.filter((_: string, index: number) => !removedExistingAttachments.includes(index))
                  ?.map((url: string, index: number) => {
                    const originalIndex = editingFlight.attachments?.indexOf(url) ?? -1;
                    return (
                      <div key={`existing-${index}`} className="flex items-center justify-between bg-muted p-2 rounded">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-muted-foreground mr-2" />
                          <span className="text-sm truncate">Documento existente {index + 1}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Existente</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExistingAttachment(originalIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}

                {attachedFiles.map((file, index) => (
                  <div key={`new-${index}`} className="flex items-center justify-between bg-muted p-2 rounded">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-muted-foreground mr-2" />
                      <span className="text-sm truncate">{file.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-accent hover:bg-accent/90"
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : "Guardar Vuelo"}
            </Button>
          </div>
        </form>

        <FlightSearchModal
          open={flightSearchOpen}
          onClose={() => setFlightSearchOpen(false)}
          onSelectFlight={handleSelectFlight}
          originAirport={originAirport}
          destinationAirport={destinationAirport}
        />
      </DialogContent>
    </Dialog>
  );
}