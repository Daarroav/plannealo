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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { insertTransportSchema } from "@shared/schema";

// Extend the schema with additional fields for the form
const transportFormSchema = insertTransportSchema.extend({
  startDateField: z.string().min(1, "La fecha de inicio es requerida"),
  startTimeField: z.string().min(1, "La hora de inicio es requerida"),
  endDateField: z.string().min(1, "La fecha de finalización es requerida"),  
  endTimeField: z.string().min(1, "La hora de finalización es requerida"),
  contactName: z.string().min(1, "El nombre de contacto es requerido"),
  contactPhone: z.string().min(1, "El número de contacto es requerido"),
}).omit({
  startDate: true,
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
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const form = useForm<TransportForm>({
    resolver: zodResolver(transportFormSchema),
    defaultValues: {
      travelId,
      type: "",
      name: "",
      provider: "",
      pickupLocation: "",
      dropoffLocation: "",
      confirmationNumber: "",
      notes: "",
      startDateField: "",
      startTimeField: "12:00",
      endDateField: "",
      endTimeField: "12:00",
      contactName: "",
      contactPhone: "",
    },
  });

  const handleSubmit = (data: TransportForm) => {
    // Combine date and time for start and end
    const startDateTime = new Date(`${data.startDateField}T${data.startTimeField}:00`);
    const endDateTime = new Date(`${data.endDateField}T${data.endTimeField}:00`);

    const submitData = {
      travelId: data.travelId,
      type: data.type,
      name: data.name,
      provider: data.provider,
      pickupLocation: data.pickupLocation,
      dropoffLocation: data.dropoffLocation,
      confirmationNumber: data.confirmationNumber,
      notes: `Contacto: ${data.contactName}, Tel: ${data.contactPhone}`,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
    };

    onSubmit(submitData);
    form.reset();
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleClose = () => {
    form.reset();
    setStartDate(undefined);
    setEndDate(undefined);
    onClose();
  };

  const transportTypes = [
    { value: "autobus", label: "Autobús" },
    { value: "alquiler-auto", label: "Alquiler de Auto" },
    { value: "uber", label: "Uber" },
    { value: "taxi", label: "Taxi" },
    { value: "transporte-publico", label: "Transporte Público" },
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
              <Label htmlFor="confirmationNumber">Número de Confirmación *</Label>
              <Input
                id="confirmationNumber"
                {...form.register("confirmationNumber")}
                placeholder="Número de confirmación"
              />
              {form.formState.errors.confirmationNumber && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.confirmationNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Provider and Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="name">Nombre del Servicio *</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Nombre del servicio de transporte"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="provider">Proveedor</Label>
              <Input
                id="provider"
                {...form.register("provider")}
                placeholder="Empresa proveedora"
              />
            </div>

            <div>
              <Label htmlFor="contactName">Nombre de Contacto *</Label>
              <Input
                id="contactName"
                {...form.register("contactName")}
                placeholder="Persona de contacto"
              />
              {form.formState.errors.contactName && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.contactName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="contactPhone">Número de Contacto *</Label>
              <Input
                id="contactPhone"
                {...form.register("contactPhone")}
                placeholder="+52 999 123 4567"
              />
              {form.formState.errors.contactPhone && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.contactPhone.message}
                </p>
              )}
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
                placeholder="Dirección o punto de recogida"
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
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yyyy", { locale: es }) : "Fecha de recogida"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        if (date) {
                          form.setValue("startDateField", format(date, "yyyy-MM-dd"));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.startDateField && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.startDateField.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="startTimeField">Hora de Recogida *</Label>
                <Input
                  id="startTimeField"
                  type="time"
                  {...form.register("startTimeField")}
                />
                {form.formState.errors.startTimeField && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.startTimeField.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dropoff Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Información de Entrega</h3>
            
            <div>
              <Label htmlFor="dropoffLocation">Punto de Llegada/Entrega *</Label>
              <Input
                id="dropoffLocation"
                {...form.register("dropoffLocation")}
                placeholder="Dirección o punto de entrega"
              />
              {form.formState.errors.dropoffLocation && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.dropoffLocation.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Fecha de Finalización *</Label>
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
                      {endDate ? format(endDate, "dd/MM/yyyy", { locale: es }) : "Fecha de finalización"}
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
                {form.formState.errors.endDateField && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.endDateField.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="endTimeField">Hora de Finalización *</Label>
                <Input
                  id="endTimeField"
                  type="time"
                  {...form.register("endTimeField")}
                />
                {form.formState.errors.endTimeField && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.endTimeField.message}
                  </p>
                )}
              </div>
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
              {isLoading ? "Guardando..." : "Guardar Transporte"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}