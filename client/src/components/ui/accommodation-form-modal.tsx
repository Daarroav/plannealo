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
import { insertAccommodationSchema, type Accommodation } from "@shared/schema";
import { useRef } from "react";

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
  editingAccommodation?: Accommodation | null;
}

export function AccommodationFormModal({ isOpen, onClose, onSubmit, isLoading, travelId, editingAccommodation }: AccommodationFormModalProps) {
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  

  const form = useForm<AccommodationForm>({
    resolver: zodResolver(accommodationFormSchema),
    defaultValues: {
      travelId,
      name: editingAccommodation?.name || "",
      type: editingAccommodation?.type || "",
      location: editingAccommodation?.location || "",
      checkInDate: editingAccommodation?.checkIn ? format(new Date(editingAccommodation.checkIn), "yyyy-MM-dd") : "",
      checkInTime: editingAccommodation?.checkIn ? format(new Date(editingAccommodation.checkIn), "HH:mm") : "15:00",
      checkOutDate: editingAccommodation?.checkOut ? format(new Date(editingAccommodation.checkOut), "yyyy-MM-dd") : "",
      checkOutTime: editingAccommodation?.checkOut ? format(new Date(editingAccommodation.checkOut), "HH:mm") : "11:00",
      roomType: editingAccommodation?.roomType?.replace(/^\d+\s/, "") || "",
      roomCount: editingAccommodation?.roomType ? parseInt(editingAccommodation.roomType.split(' ')[0]) || 1 : 1,
      price: editingAccommodation?.price || "",
      confirmationNumber: editingAccommodation?.confirmationNumber || "",
      policies: editingAccommodation?.policies || "",
      notes: editingAccommodation?.notes || "",
    },
  });

  

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
    }
    // Resetear el valor del input para permitir seleccionar el mismo archivo nuevamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    // Resetear el valor del input al eliminar la imagen
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /*const handleSubmit = (data: AccommodationForm) => {
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
      thumbnail: thumbnail,
    };

    onSubmit(submitData);
    form.reset();
    setCheckInDate(undefined);
    setCheckOutDate(undefined);
    setAttachedFiles([]);
  };*/

  const handleSubmit = async (data: AccommodationForm) => {
    // Combine date and time for check-in and check-out
    const checkIn = new Date(`${data.checkInDate}T${data.checkInTime}:00`);
    const checkOut = new Date(`${data.checkOutDate}T${data.checkOutTime}:00`);
  
    // Create FormData
    const formData = new FormData();
    
    // Add all form fields to formData
    formData.append('name', data.name);
    formData.append('type', data.type);
    formData.append('location', data.location);
    formData.append('checkIn', checkIn.toISOString());
    formData.append('checkOut', checkOut.toISOString());
    formData.append('roomType', `${data.roomCount} ${data.roomType}`);
    formData.append('price', data.price || '');
    formData.append('confirmationNumber', data.confirmationNumber || '');
    formData.append('policies', data.policies || '');
    formData.append('notes', data.notes || '');
    formData.append('travelId', data.travelId);
    
    // Add thumbnail file if exists
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }
  
    // Enviar el formData directamente
    try {
      await onSubmit(formData);
      // Limpiar el formulario si es exitoso
      form.reset();
      setCheckInDate(undefined);
      setCheckOutDate(undefined);
      setAttachedFiles([]);
      setThumbnail(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleClose = () => {
    form.reset();
    setCheckInDate(undefined);
    setCheckOutDate(undefined);
    setAttachedFiles([]);
    onClose();
  };

  // Update form when editing accommodation changes
  useState(() => {
    if (editingAccommodation) {
      setCheckInDate(editingAccommodation.checkIn ? new Date(editingAccommodation.checkIn) : undefined);
      setCheckOutDate(editingAccommodation.checkOut ? new Date(editingAccommodation.checkOut) : undefined);
      form.reset({
        travelId,
        name: editingAccommodation.name,
        type: editingAccommodation.type,
        location: editingAccommodation.location,
        checkInDate: format(new Date(editingAccommodation.checkIn), "yyyy-MM-dd"),
        checkInTime: format(new Date(editingAccommodation.checkIn), "HH:mm"),
        checkOutDate: format(new Date(editingAccommodation.checkOut), "yyyy-MM-dd"),
        checkOutTime: format(new Date(editingAccommodation.checkOut), "HH:mm"),
        roomType: editingAccommodation.roomType?.replace(/^\d+\s/, "") || "",
        roomCount: editingAccommodation.roomType ? parseInt(editingAccommodation.roomType.split(' ')[0]) || 1 : 1,
        price: editingAccommodation.price || "",
        confirmationNumber: editingAccommodation.confirmationNumber || "",
        policies: editingAccommodation.policies || "",
        notes: editingAccommodation.notes || "",
      });
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {editingAccommodation ? "Editar Alojamiento" : "Agregar Alojamiento"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" encType="multipart/form-data">
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

          {/* Thumbnail */}
          <hr />
          <div>
            <Label>Imagen Alojamiento</Label>
            <div className="mt-2">
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp,.svg"
                onChange={handleThumbnailUpload}
                className="hidden"
                id="thumbnail"
                ref={fileInputRef}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('thumbnail')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Seleccionar Archivos
              </Button>
            </div>

            {thumbnail && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium"> Imagen Previsualizada:</p>
                <div className=" w-fit">
                  <img src={URL.createObjectURL(thumbnail)} alt="Thumbnail" className="max-w-full max-h-40" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeThumbnail()}
                    className="absolute top-0 right-0 bg-accent text-white opacity-80"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <hr />


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
              {isLoading ? "Guardando..." : editingAccommodation ? "Actualizar Alojamiento" : "Guardar Alojamiento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}