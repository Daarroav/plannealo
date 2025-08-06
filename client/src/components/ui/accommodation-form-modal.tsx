import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { insertAccommodationSchema } from "@shared/schema";

// Extend the schema with additional fields for the form
const accommodationFormSchema = insertAccommodationSchema.extend({
  checkInDate: z.string().min(1, "La fecha de entrada es requerida"),
  checkInTime: z.string().min(1, "La hora de entrada es requerida"),
  checkOutDate: z.string().min(1, "La fecha de salida es requerida"),
  checkOutTime: z.string().min(1, "La hora de salida es requerida"),
  roomCount: z.number().min(1, "Debe especificar al menos 1 habitación"),
}).omit({
  checkIn: true,
  checkOut: true,
});

type AccommodationForm = z.infer<typeof accommodationFormSchema>;

interface AccommodationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  travelId: string;
}

export function AccommodationFormModal({ isOpen, onClose, onSubmit, isLoading, travelId }: AccommodationFormModalProps) {
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const form = useForm<AccommodationForm>({
    resolver: zodResolver(accommodationFormSchema),
    defaultValues: {
      travelId,
      name: "",
      type: "",
      location: "",
      checkInDate: "",
      checkInTime: "15:00",
      checkOutDate: "",
      checkOutTime: "11:00",
      roomType: "",
      roomCount: 1,
      price: "",
      confirmationNumber: "",
      policies: "",
      notes: "",
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (data: AccommodationForm) => {
    // Combine date and time for check-in and check-out
    const checkIn = new Date(`${data.checkInDate}T${data.checkInTime}:00`);
    const checkOut = new Date(`${data.checkOutDate}T${data.checkOutTime}:00`);

    const submitData = {
      travelId: data.travelId,
      name: data.name,
      type: data.type,
      location: data.location,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      roomType: `${data.roomCount} ${data.roomType}`,
      price: data.price,
      confirmationNumber: data.confirmationNumber,
      policies: data.policies,
      notes: data.notes,
    };

    onSubmit(submitData);
    form.reset();
    setCheckInDate(undefined);
    setCheckOutDate(undefined);
    setAttachedFiles([]);
  };

  const handleClose = () => {
    form.reset();
    setCheckInDate(undefined);
    setCheckOutDate(undefined);
    setAttachedFiles([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Agregar Alojamiento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Nombre del Alojamiento *</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Ej: Hotel Xcaret México"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="confirmationNumber">Número de Confirmación</Label>
              <Input
                id="confirmationNumber"
                {...form.register("confirmationNumber")}
                placeholder="Ej: HTL123456789"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="type">Tipo de Alojamiento *</Label>
              <Select onValueChange={(value) => form.setValue("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hotel">Hotel</SelectItem>
                  <SelectItem value="resort">Resort</SelectItem>
                  <SelectItem value="hostal">Hostal</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="cabaña">Cabaña</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.type.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="location">Ubicación *</Label>
              <Input
                id="location"
                {...form.register("location")}
                placeholder="Ej: Playa del Carmen, Quintana Roo"
              />
              {form.formState.errors.location && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.location.message}
                </p>
              )}
            </div>
          </div>

          {/* Check-in and Check-out */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>Fecha y Hora de Entrada *</Label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !checkInDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkInDate ? format(checkInDate, "dd/MM/yyyy", { locale: es }) : "Fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkInDate}
                      onSelect={(date) => {
                        setCheckInDate(date);
                        if (date) {
                          form.setValue("checkInDate", format(date, "yyyy-MM-dd"));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  type="time"
                  {...form.register("checkInTime")}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Fecha y Hora de Salida *</Label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !checkOutDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOutDate ? format(checkOutDate, "dd/MM/yyyy", { locale: es }) : "Fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkOutDate}
                      onSelect={(date) => {
                        setCheckOutDate(date);
                        if (date) {
                          form.setValue("checkOutDate", format(date, "yyyy-MM-dd"));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  type="time"
                  {...form.register("checkOutTime")}
                />
              </div>
            </div>
          </div>

          {/* Room Details and Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="roomCount">Cantidad de Habitaciones *</Label>
              <Input
                id="roomCount"
                type="number"
                min="1"
                {...form.register("roomCount", { valueAsNumber: true })}
              />
              {form.formState.errors.roomCount && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.roomCount.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="roomType">Tipo de Habitación *</Label>
              <Input
                id="roomType"
                {...form.register("roomType")}
                placeholder="Ej: Habitación Doble"
              />
              {form.formState.errors.roomType && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.roomType.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="price">Precio Total</Label>
              <Input
                id="price"
                {...form.register("price")}
                placeholder="Ej: $15,000 MXN"
              />
            </div>
          </div>

          {/* Policies */}
          <div>
            <Label htmlFor="policies">Política de Cancelación</Label>
            <Textarea
              id="policies"
              {...form.register("policies")}
              placeholder="Describe las políticas de cancelación, modificación y otros términos importantes..."
              rows={3}
            />
          </div>

          {/* Additional Details */}
          <div>
            <Label htmlFor="notes">Detalles Adicionales</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="Incluye información adicional como servicios incluidos, amenidades especiales, instrucciones especiales, etc."
              rows={4}
            />
          </div>

          {/* File Attachments */}
          <div>
            <Label>Adjuntar Archivos</Label>
            <div className="mt-2">
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Seleccionar Archivos
              </Button>
            </div>

            {attachedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Archivos adjuntos:</p>
                {attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                    <span className="text-sm truncate">{file.name}</span>
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
              {isLoading ? "Guardando..." : "Guardar Alojamiento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}