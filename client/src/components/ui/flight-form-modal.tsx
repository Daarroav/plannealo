import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, Plane } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { insertFlightSchema } from "@shared/schema";
import { AirportSearch } from "./airport-search";
import { FlightSearchModal } from "./flight-search-modal";
import { FileUploader } from "./file-uploader";

// Extend the schema with additional fields for the form
const flightFormSchema = insertFlightSchema.extend({
  departureDateField: z.string().min(1, "La fecha de salida es requerida"),
  departureTimeField: z.string().min(1, "La hora de salida es requerida"),
  arrivalDateField: z.string().min(1, "La fecha de llegada es requerida"),
  arrivalTimeField: z.string().min(1, "La hora de llegada es requerida"),
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

export function FlightFormModal({ isOpen, onClose, onSubmit, isLoading, travelId, editingFlight }: FlightFormModalProps) {
  const [departureDate, setDepartureDate] = useState<Date>();
  const [arrivalDate, setArrivalDate] = useState<Date>();
  const [flightSearchOpen, setFlightSearchOpen] = useState(false);
  const [originAirport, setOriginAirport] = useState<Airport | null>(null);
  const [destinationAirport, setDestinationAirport] = useState<Airport | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

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
      departureTimeField: "12:00",
      arrivalDateField: "",
      arrivalTimeField: "12:00",
      departureTerminal: "",
      arrivalTerminal: "",
      class: "",
      attachments: [],
    },
  });

  // Pre-llenar formulario cuando se está editando
  React.useEffect(() => {
    if (editingFlight) {
      const depDateTime = new Date(editingFlight.departureDate);
      const arrDateTime = new Date(editingFlight.arrivalDate);
      
      setDepartureDate(depDateTime);
      setArrivalDate(arrDateTime);
      
      form.reset({
        travelId,
        airline: editingFlight.airline || "",
        flightNumber: editingFlight.flightNumber || "",
        reservationNumber: editingFlight.reservationNumber || "",
        departureCity: editingFlight.departureCity || "",
        arrivalCity: editingFlight.arrivalCity || "",
        departureDateField: format(depDateTime, "yyyy-MM-dd"),
        departureTimeField: format(depDateTime, "HH:mm"),
        arrivalDateField: format(arrDateTime, "yyyy-MM-dd"),
        arrivalTimeField: format(arrDateTime, "HH:mm"),
        departureTerminal: editingFlight.departureTerminal || "",
        arrivalTerminal: editingFlight.arrivalTerminal || "",
        class: editingFlight.class || "",
        attachments: editingFlight.attachments || [],
      });
      
      // Load existing attachments as files
      if (Array.isArray(editingFlight.attachments) && editingFlight.attachments.length > 0) {
        Promise.all(
          editingFlight.attachments.map(async (attachment: string | { path: string; originalName: string }) => {
            // Manejar tanto el formato antiguo (string) como el nuevo (objeto)
            const attachmentUrl = typeof attachment === 'string' ? attachment : attachment.path;
            const originalName = typeof attachment === 'string' 
              ? attachment.split('/').pop() || 'archivo'
              : attachment.originalName || 'archivo';
            
            const fullUrl = attachmentUrl.startsWith("/objects/")
              ? `/api${attachmentUrl}`
              : attachmentUrl.startsWith("/uploads/")
              ? `/api/objects${attachmentUrl}`
              : `/api/objects/uploads/${attachmentUrl}`;
              
            const response = await fetch(fullUrl);
            const blob = await response.blob();
            return new File([blob], originalName, { type: blob.type });
          })
        ).then((files) => {
          setAttachedFiles(files);
        }).catch((err) => {
          console.error("Error cargando archivos adjuntos:", err);
        });
      }
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
        departureDateField: "",
        departureTimeField: "12:00",
        arrivalDateField: "",
        arrivalTimeField: "12:00",
        departureTerminal: "",
        arrivalTerminal: "",
        class: "",
        attachments: [],
      });
      setAttachedFiles([]);
    }
  }, [editingFlight, form, travelId]);

  // Función para llenar automáticamente el formulario cuando se selecciona un vuelo
  const handleSelectFlight = (flight: FlightInfo) => {
    try {
      // Validar que tenemos la información mínima necesaria
      if (!flight.departure?.scheduledTimeLocal || !flight.arrival?.scheduledTimeLocal) {
        console.error("Flight missing required time information", flight);
        return;
      }

      // Usar directamente los tiempos de la API (ya incluyen zona horaria local)
      const departureTime = new Date(flight.departure.scheduledTimeLocal);
      const arrivalTime = new Date(flight.arrival.scheduledTimeLocal);

      // Validar que las fechas son válidas
      if (isNaN(departureTime.getTime()) || isNaN(arrivalTime.getTime())) {
        console.error("Invalid flight times", flight);
        return;
      }

      // Actualizar los estados de fecha para los calendarios
      setDepartureDate(departureTime);
      setArrivalDate(arrivalTime);

      // Llenar formulario con datos de la API
      form.setValue("airline", flight.airline?.name || `${flight.airline?.iata || flight.airline?.icao || 'Aerolínea'}`);
      form.setValue("flightNumber", flight.number || "");
      form.setValue("departureCity", `${flight.departure?.airport?.iata || flight.departure?.airport?.icao || 'N/A'} - ${flight.departure?.airport?.municipalityName || 'Ciudad de origen'}`);
      form.setValue("arrivalCity", `${flight.arrival?.airport?.iata || flight.arrival?.airport?.icao || 'N/A'} - ${flight.arrival?.airport?.municipalityName || 'Ciudad de destino'}`);
      
      // Usar las fechas y horas directamente de la API (ya en zona horaria local)
      form.setValue("departureDateField", format(departureTime, "yyyy-MM-dd"));
      form.setValue("departureTimeField", format(departureTime, "HH:mm"));
      form.setValue("arrivalDateField", format(arrivalTime, "yyyy-MM-dd"));
      form.setValue("arrivalTimeField", format(arrivalTime, "HH:mm"));
      
      form.setValue("departureTerminal", flight.departure?.terminal || "");
      form.setValue("arrivalTerminal", flight.arrival?.terminal || "");
      
      console.log("Flight form populated successfully with API times:", {
        departure: flight.departure.scheduledTimeLocal,
        arrival: flight.arrival.scheduledTimeLocal
      });
    } catch (error) {
      console.error("Error populating flight form:", error, flight);
    }
  };

  const handleSubmit = async (data: FlightForm) => {
    // Force blur on any active input to ensure values are captured
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      activeElement.blur();
      // Wait a bit for the blur event to process
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Get the most current form values
    const currentValues = form.getValues();
    
    // Combine date and time for departure and arrival
    const departureDateTime = new Date(`${currentValues.departureDateField}T${currentValues.departureTimeField}:00`);
    const arrivalDateTime = new Date(`${currentValues.arrivalDateField}T${currentValues.arrivalTimeField}:00`);

    // Create FormData
    const formData = new FormData();
    
    // Add form fields
    if (editingFlight) {
      formData.append('id', editingFlight.id);
    }
    formData.append('travelId', currentValues.travelId);
    formData.append('airline', currentValues.airline);
    formData.append('flightNumber', currentValues.flightNumber);
    formData.append('reservationNumber', currentValues.reservationNumber || '');
    formData.append('departureCity', currentValues.departureCity || '');
    formData.append('arrivalCity', currentValues.arrivalCity || '');
    formData.append('departureDate', departureDateTime.toISOString());
    formData.append('arrivalDate', arrivalDateTime.toISOString());
    formData.append('departureTerminal', currentValues.departureTerminal || '');
    formData.append('arrivalTerminal', currentValues.arrivalTerminal || '');
    formData.append('class', currentValues.class || '');
    
    // Add attached files
    attachedFiles.forEach((file) => {
      formData.append('attachments', file);
    });

    onSubmit(formData);
    form.reset();
    setDepartureDate(undefined);
    setArrivalDate(undefined);
    setAttachedFiles([]);
  };

  const handleClose = () => {
    form.reset();
    setDepartureDate(undefined);
    setArrivalDate(undefined);
    setAttachedFiles([]);
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

        {/* Búsqueda de vuelos automática */}
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
          {/* Flight Basic Info */}
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

          {/* Confirmation Number */}
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

          {/* Departure Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="departureCity">Aeropuerto de salida *</Label>
              <Input
                id="departureCity"
                {...form.register("departureCity")}
                placeholder="Buscar Aeropuerto de salida *"
              />
              {form.formState.errors.departureCity && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.departureCity.message}
                </p>
              )}
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

          {/* Arrival Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="arrivalCity">Aeropuerto de llegada *</Label>
              <Input
                id="arrivalCity"
                {...form.register("arrivalCity")}
                placeholder="Buscar Llegada Aeropuerto *"
              />
              {form.formState.errors.arrivalCity && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.arrivalCity.message}
                </p>
              )}
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

          {/* Additional Details */}
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

          {/* File Attachments */}
          <div>
            <Label>Documentos Adjuntos</Label>
            <FileUploader
              name="attachments"
              defaultFiles={editingFlight?.attachments || []}
              onFilesChange={setAttachedFiles}
              maxFiles={10}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
            />
          </div>

          {/* Form Actions */}
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

        {/* Modal de búsqueda de vuelos */}
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