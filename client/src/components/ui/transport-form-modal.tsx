import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { insertTransportSchema } from "@shared/schema";

// Extend the schema with additional fields for the form
const transportFormSchema = insertTransportSchema.extend({
  pickupDateField: z.string().min(1, "La fecha de recogida es requerida"),
  pickupTimeField: z.string().min(1, "La hora de recogida es requerida"),
  endDateField: z.string().optional(),
  endTimeField: z.string().optional(),
}).omit({
  pickupDate: true,
  endDate: true,
});

type TransportForm = z.infer<typeof transportFormSchema>;

interface TransportFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  travelId: string;
}

export function TransportFormModal({ isOpen, onClose, onSubmit, isLoading, travelId }: TransportFormModalProps) {
  const [pickupDate, setPickupDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const form = useForm<TransportForm>({
    resolver: zodResolver(transportFormSchema),
    defaultValues: {
      travelId,
      type: "",
      name: "",
      provider: "",
      contactName: "",
      contactNumber: "",
      pickupDateField: "",
      pickupTimeField: "12:00",
      pickupLocation: "",
      endDateField: "",
      endTimeField: "12:00",
      dropoffLocation: "",
      confirmationNumber: "",
      notes: "",
    },
  });

  const handleSubmit = (data: TransportForm) => {
    // Combine date and time for pickup
    const pickupDateTime = new Date(`${data.pickupDateField}T${data.pickupTimeField}:00`);
    
    let endDateTime = null;
    if (data.endDateField && data.endTimeField) {
      endDateTime = new Date(`${data.endDateField}T${data.endTimeField}:00`);
    }

    const submitData = {
      travelId: data.travelId,
      type: data.type,
      name: data.name,
      provider: data.provider || undefined,
      contactName: data.contactName || undefined,
      contactNumber: data.contactNumber || undefined,
      pickupDate: pickupDateTime,
      pickupLocation: data.pickupLocation,
      endDate: endDateTime || undefined,
      dropoffLocation: data.dropoffLocation || undefined,
      confirmationNumber: data.confirmationNumber || undefined,
      notes: data.notes || undefined,
    };

    onSubmit(submitData);
    form.reset();
    setPickupDate(undefined);
    setEndDate(undefined);
  };

  const handleClose = () => {
    form.reset();
    setPickupDate(undefined);
    setEndDate(undefined);
    onClose();
  };

  const transportTypes = [
    { value: "autobus", label: "Autobús" },
    { value: "alquiler_auto", label: "Alquiler de Auto" },
    { value: "uber", label: "Uber" },
    { value: "taxi", label: "Taxi" },
    { value: "transporte_publico", label: "Transporte Público" },
    { value: "tren", label: "Tren" },
    { value: "embarcacion", label: "Embarcación" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Transporte</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Transport Type and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="type">Tipo de Transporte *</Label>
              <Select onValueChange={(value) => form.setValue("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de transporte" />
                </SelectTrigger>
                <SelectContent>
                  {transportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.type.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="name">Nombre del Servicio *</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Ej: Traslado al aeropuerto"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
          </div>

          {/* Provider and Confirmation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="provider">Proveedor</Label>
              <Input
                id="provider"
                {...form.register("provider")}
                placeholder="Empresa o nombre del proveedor"
              />
            </div>

            <div>
              <Label htmlFor="confirmationNumber">Número de Confirmación</Label>
              <Input
                id="confirmationNumber"
                {...form.register("confirmationNumber")}
                placeholder="Número de confirmación de la reserva"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="contactName">Nombre de Contacto</Label>
              <Input
                id="contactName"
                {...form.register("contactName")}
                placeholder="Nombre de la persona de contacto"
              />
            </div>

            <div>
              <Label htmlFor="contactNumber">Número de Contacto</Label>
              <Input
                id="contactNumber"
                {...form.register("contactNumber")}
                placeholder="Teléfono de contacto"
              />
            </div>
          </div>

          {/* Pickup Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Información de Recogida</h3>
            
            <div>
              <Label htmlFor="pickupLocation">Lugar de Recogida *</Label>
              <Input
                id="pickupLocation"
                {...form.register("pickupLocation")}
                placeholder="Dirección o lugar de recogida"
              />
              {form.formState.errors.pickupLocation && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.pickupLocation.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Fecha de Recogida *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !pickupDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {pickupDate ? format(pickupDate, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={pickupDate}
                      onSelect={(date) => {
                        setPickupDate(date);
                        if (date) {
                          form.setValue("pickupDateField", format(date, "yyyy-MM-dd"));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.pickupDateField && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.pickupDateField.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="pickupTimeField">Hora de Recogida *</Label>
                <Input
                  id="pickupTimeField"
                  type="time"
                  {...form.register("pickupTimeField")}
                />
                {form.formState.errors.pickupTimeField && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.pickupTimeField.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dropoff Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Información de Entrega (Opcional)</h3>
            
            <div>
              <Label htmlFor="dropoffLocation">Lugar de Entrega</Label>
              <Input
                id="dropoffLocation"
                {...form.register("dropoffLocation")}
                placeholder="Dirección o lugar de entrega/destino"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Fecha de Finalización</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha (opcional)"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date);
                        if (date) {
                          form.setValue("endDateField", format(date, "yyyy-MM-dd"));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="endTimeField">Hora de Finalización</Label>
                <Input
                  id="endTimeField"
                  type="time"
                  {...form.register("endTimeField")}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Input
              id="notes"
              {...form.register("notes")}
              placeholder="Información adicional, instrucciones especiales, etc."
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
              {isLoading ? "Guardando..." : "Guardar Transporte"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}