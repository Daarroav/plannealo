import { useState } from "react";
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { insertFlightSchema } from "@shared/schema";

// Extend the schema with additional fields for the form
const flightFormSchema = insertFlightSchema.extend({
  departureDateField: z.string().min(1, "La fecha de salida es requerida"),
  departureTimeField: z.string().min(1, "La hora de salida es requerida"),
  arrivalDateField: z.string().min(1, "La fecha de llegada es requerida"),
  arrivalTimeField: z.string().min(1, "La hora de llegada es requerida"),
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
}

export function FlightFormModal({ isOpen, onClose, onSubmit, isLoading, travelId }: FlightFormModalProps) {
  const [departureDate, setDepartureDate] = useState<Date>();
  const [arrivalDate, setArrivalDate] = useState<Date>();

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
    },
  });

  const handleSubmit = (data: FlightForm) => {
    // Combine date and time for departure and arrival
    const departureDateTime = new Date(`${data.departureDateField}T${data.departureTimeField}:00`);
    const arrivalDateTime = new Date(`${data.arrivalDateField}T${data.arrivalTimeField}:00`);

    const submitData = {
      travelId: data.travelId,
      airline: data.airline,
      flightNumber: data.flightNumber,
      reservationNumber: data.reservationNumber,
      departureCity: data.departureCity,
      arrivalCity: data.arrivalCity,
      departureDate: departureDateTime.toISOString(),
      arrivalDate: arrivalDateTime.toISOString(),
      departureTerminal: data.departureTerminal,
      arrivalTerminal: data.arrivalTerminal,
      class: data.class,
    };

    onSubmit(submitData);
    form.reset();
    setDepartureDate(undefined);
    setArrivalDate(undefined);
  };

  const handleClose = () => {
    form.reset();
    setDepartureDate(undefined);
    setArrivalDate(undefined);
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
          <DialogTitle className="text-2xl font-bold text-foreground">Vuelo</DialogTitle>
          <DialogDescription>
            Agrega información de vuelo al itinerario
          </DialogDescription>
        </DialogHeader>
        
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
            <Label htmlFor="reservationNumber"># de Confirmación *</Label>
            <Input
              id="reservationNumber"
              {...form.register("reservationNumber")}
              placeholder="Número de confirmación de la reserva"
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
              <Label htmlFor="class">Clase de Vuelo *</Label>
              <Select onValueChange={(value) => form.setValue("class", value)}>
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
      </DialogContent>
    </Dialog>
  );
}