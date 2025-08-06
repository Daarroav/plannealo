import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Image } from "lucide-react";

const newTravelSchema = z.object({
  name: z.string().min(1, "El nombre del viaje es requerido"),
  clientName: z.string().min(1, "El nombre del cliente es requerido"),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  endDate: z.string().min(1, "La fecha de fin es requerida"),
  travelers: z.number().min(1, "Debe haber al menos 1 viajero"),
});

type NewTravelForm = z.infer<typeof newTravelSchema>;

interface NewTravelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewTravelForm) => void;
  isLoading?: boolean;
}

export function NewTravelModal({ isOpen, onClose, onSubmit, isLoading }: NewTravelModalProps) {
  const form = useForm<NewTravelForm>({
    resolver: zodResolver(newTravelSchema),
    defaultValues: {
      name: "",
      clientName: "",
      startDate: "",
      endDate: "",
      travelers: 1,
    },
  });

  const handleSubmit = (data: NewTravelForm) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-foreground">Crear Nuevo Viaje</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Nombre del Viaje *</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Ej: Riviera Maya 2024"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="clientName">Cliente *</Label>
              <Input
                id="clientName"
                {...form.register("clientName")}
                placeholder="Nombre del cliente"
              />
              {form.formState.errors.clientName && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.clientName.message}
                </p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="startDate">Fecha de Inicio *</Label>
              <Input
                id="startDate"
                type="date"
                {...form.register("startDate")}
              />
              {form.formState.errors.startDate && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.startDate.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="endDate">Fecha de Fin *</Label>
              <Input
                id="endDate"
                type="date"
                {...form.register("endDate")}
              />
              {form.formState.errors.endDate && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.endDate.message}
                </p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="travelers">Número de Viajeros *</Label>
            <Select onValueChange={(value) => form.setValue("travelers", parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 viajero</SelectItem>
                <SelectItem value="2">2 viajeros</SelectItem>
                <SelectItem value="3">3 viajeros</SelectItem>
                <SelectItem value="4">4 viajeros</SelectItem>
                <SelectItem value="5">5+ viajeros</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.travelers && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.travelers.message}
              </p>
            )}
          </div>
          
          <div>
            <Label>Imagen de Portada</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors duration-200">
              <Image className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">Arrastra una imagen o haz clic para seleccionar</p>
              <p className="text-sm text-muted-foreground">PNG, JPG hasta 10MB</p>
              <Button type="button" variant="outline" className="mt-3">
                Seleccionar Imagen
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90" disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear Viaje"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
