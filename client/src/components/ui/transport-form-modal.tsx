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
  editingTransport?: any;
}

export function TransportFormModal({ isOpen, onClose, onSubmit, isLoading, travelId, editingTransport }: TransportFormModalProps) {
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

  // Pre-llenar formulario cuando se está editando
  React.useEffect(() => {
    if (editingTransport) {
      const pickupDateTime = new Date(editingTransport.pickupDate);
      const endDateTime = editingTransport.endDate ? new Date(editingTransport.endDate) : null;
      
      setPickupDate(pickupDateTime);
      setEndDate(endDateTime);
      
      form.reset({
        travelId,
        type: editingTransport.type || "",
        name: editingTransport.name || "",
        provider: editingTransport.provider || "",
        contactName: editingTransport.contactName || "",
        contactNumber: editingTransport.contactNumber || "",
        pickupDateField: format(pickupDateTime, "yyyy-MM-dd"),
        pickupTimeField: format(pickupDateTime, "HH:mm"),
        pickupLocation: editingTransport.pickupLocation || "",
        endDateField: endDateTime ? format(endDateTime, "yyyy-MM-dd") : "",
        endTimeField: endDateTime ? format(endDateTime, "HH:mm") : "12:00",
        dropoffLocation: editingTransport.dropoffLocation || "",
        confirmationNumber: editingTransport.confirmationNumber || "",
        notes: editingTransport.notes || "",
      });
    } else {
      setPickupDate(undefined);
      setEndDate(undefined);
      form.reset({
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
      });
    }
  }, [editingTransport, form, travelId]);

  const handleSubmit = async (data: TransportForm) => {
    // Force blur on any active input to ensure values are captured
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      activeElement.blur();
      // Wait a bit for the blur event to process
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Get the most current form values
    const currentValues = form.getValues();
    
    // Combine date and time for pickup
    const pickupDateTime = new Date(`${currentValues.pickupDateField}T${currentValues.pickupTimeField}:00`);
    
    let endDateTime = null;
    if (currentValues.endDateField && currentValues.endTimeField) {
      endDateTime = new Date(`${currentValues.endDateField}T${currentValues.endTimeField}:00`);
    }

    const submitData = {
      travelId: currentValues.travelId,
      type: currentValues.type,
      name: currentValues.name,
      provider: currentValues.provider || undefined,
      contactName: currentValues.contactName || undefined,
      contactNumber: currentValues.contactNumber || undefined,
      pickupDate: pickupDateTime,
      pickupLocation: currentValues.pickupLocation,
      endDate: endDateTime || undefined,
      dropoffLocation: currentValues.dropoffLocation || undefined,
      confirmationNumber: currentValues.confirmationNumber || undefined,
      notes: currentValues.notes || undefined,
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
    { value: "traslado_privado", label: "Traslado Privado" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Transporte</DialogTitle>
          <DialogDescription>
            Agrega información de transporte al itinerario
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Transport Type and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="type">Tipo de Transporte *</Label>
              <Select onValueChange={(value) => form.setValue("type", value)} value={form.watch("type")}>
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