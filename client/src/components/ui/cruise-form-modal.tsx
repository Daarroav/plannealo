import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { insertCruiseSchema } from "@shared/schema";

// Form validation schema - extends the base schema with date string handling
const cruiseFormSchema = insertCruiseSchema.extend({
  departureDate: z.string().min(1, "La fecha de salida es requerida"),
  departureTime: z.string().optional(),
  arrivalDate: z.string().min(1, "La fecha de llegada es requerida"), 
  arrivalTime: z.string().optional(),
}).omit({
  travelId: true,
});

type CruiseFormData = z.infer<typeof cruiseFormSchema>;

interface CruiseFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isPending?: boolean;
}

export function CruiseFormModal({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isPending = false 
}: CruiseFormModalProps) {
  const form = useForm<CruiseFormData>({
    resolver: zodResolver(cruiseFormSchema),
    defaultValues: {
      cruiseLine: "",
      confirmationNumber: "",
      departureDate: "",
      departureTime: "",
      departurePort: "",
      arrivalDate: "",
      arrivalTime: "",
      arrivalPort: "",
      notes: "",
    },
  });

  const handleSubmit = (data: CruiseFormData) => {
    console.log("Form data before processing:", data);

    // Combine date and time for departure
    const departureDateTime = data.departureTime 
      ? new Date(`${data.departureDate}T${data.departureTime}`)
      : new Date(data.departureDate);

    // Combine date and time for arrival
    const arrivalDateTime = data.arrivalTime 
      ? new Date(`${data.arrivalDate}T${data.arrivalTime}`)
      : new Date(data.arrivalDate);

    const processedData = {
      cruiseLine: data.cruiseLine,
      confirmationNumber: data.confirmationNumber || undefined,
      departureDate: departureDateTime,
      departurePort: data.departurePort,
      arrivalDate: arrivalDateTime,
      arrivalPort: data.arrivalPort,
      notes: data.notes || undefined,
    };

    console.log("Processed data to send:", processedData);
    onSubmit(processedData);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Crucero</DialogTitle>
          <DialogDescription>
            Agrega información de crucero al itinerario
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Línea de Cruceros */}
            <div className="space-y-2">
              <Label htmlFor="cruiseLine">Barco o Línea de Cruceros *</Label>
              <Input
                {...form.register("cruiseLine")}
                placeholder="Ej: Royal Caribbean, Norwegian Cruise"
                className={form.formState.errors.cruiseLine ? "border-red-500" : ""}
              />
              {form.formState.errors.cruiseLine && (
                <p className="text-sm text-red-500">{form.formState.errors.cruiseLine.message}</p>
              )}
            </div>

            {/* Número de Confirmación */}
            <div className="space-y-2">
              <Label htmlFor="confirmationNumber">Número de Confirmación</Label>
              <Input
                {...form.register("confirmationNumber")}
                placeholder="Número de confirmación"
              />
            </div>
          </div>

          {/* Información de Salida */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Información de Salida</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departureDate">Fecha de Salida *</Label>
                <Input
                  type="date"
                  {...form.register("departureDate")}
                  className={form.formState.errors.departureDate ? "border-red-500" : ""}
                />
                {form.formState.errors.departureDate && (
                  <p className="text-sm text-red-500">{form.formState.errors.departureDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="departureTime">Hora de Salida</Label>
                <Input
                  type="time"
                  {...form.register("departureTime")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="departurePort">Puerto de Salida *</Label>
                <Input
                  {...form.register("departurePort")}
                  placeholder="Ej: Puerto de Miami"
                  className={form.formState.errors.departurePort ? "border-red-500" : ""}
                />
                {form.formState.errors.departurePort && (
                  <p className="text-sm text-red-500">{form.formState.errors.departurePort.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información de Llegada */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Información de Llegada</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="arrivalDate">Fecha de Llegada *</Label>
                <Input
                  type="date"
                  {...form.register("arrivalDate")}
                  className={form.formState.errors.arrivalDate ? "border-red-500" : ""}
                />
                {form.formState.errors.arrivalDate && (
                  <p className="text-sm text-red-500">{form.formState.errors.arrivalDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="arrivalTime">Hora de Llegada</Label>
                <Input
                  type="time"
                  {...form.register("arrivalTime")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="arrivalPort">Puerto de Llegada *</Label>
                <Input
                  {...form.register("arrivalPort")}
                  placeholder="Ej: Puerto de Miami"
                  className={form.formState.errors.arrivalPort ? "border-red-500" : ""}
                />
                {form.formState.errors.arrivalPort && (
                  <p className="text-sm text-red-500">{form.formState.errors.arrivalPort.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              {...form.register("notes")}
              placeholder="Información adicional sobre el crucero..."
              className="min-h-[80px]"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Guardando..." : "Guardar Crucero"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}