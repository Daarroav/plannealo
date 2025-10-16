import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
import { FileText } from "lucide-react";

// Extend the schema with additional fields for the form
const accommodationFormSchema = insertAccommodationSchema.extend({
  checkInDate: z.string().min(1, "La fecha de entrada es requerida"),
  checkInTime: z.string().optional(),
  checkOutDate: z.string().min(1, "La fecha de salida es requerida"),
  checkOutTime: z.string().optional(),
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
  const [thumbnailRemoved, setThumbnailRemoved] = useState<boolean>(false);
  const [removedExistingAttachments, setRemovedExistingAttachments] = useState<number[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log("Editing accommodation:", editingAccommodation);
  

  const form = useForm<AccommodationForm>({
    resolver: zodResolver(accommodationFormSchema),
    defaultValues: {
      travelId,
      name: editingAccommodation?.name || "",
      type: editingAccommodation?.type || "",
      location: editingAccommodation?.location || "",
      checkInDate: editingAccommodation?.checkIn ? format(new Date(editingAccommodation.checkIn), "yyyy-MM-dd") : "",
      checkInTime: editingAccommodation?.checkIn ? format(new Date(editingAccommodation.checkIn), "HH:mm") : "",
      checkOutDate: editingAccommodation?.checkOut ? format(new Date(editingAccommodation.checkOut), "yyyy-MM-dd") : "",
      checkOutTime: editingAccommodation?.checkOut ? format(new Date(editingAccommodation.checkOut), "HH:mm") : "",
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

  const removeExistingAttachment = (index: number) => {
    setRemovedExistingAttachments(prev => [...prev, index]);
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailRemoved(true);
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
    // Force blur on any active input to ensure values are captured
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      activeElement.blur();
      // Wait a bit for the blur event to process
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Get the most current form values
    const currentValues = form.getValues();
    
    // Combine date and time for check-in and check-out
    // Use 00:00 if no time is specified
    const checkInTime = currentValues.checkInTime || "00:00";
    const checkOutTime = currentValues.checkOutTime || "00:00";
    const checkIn = new Date(`${currentValues.checkInDate}T${checkInTime}:00`);
    const checkOut = new Date(`${currentValues.checkOutDate}T${checkOutTime}:00`);
  
    // Create FormData
    const formData = new FormData();
    
    // Add all form fields to formData
    formData.append('name', currentValues.name);
    formData.append('type', currentValues.type);
    formData.append('location', currentValues.location);
    formData.append('checkIn', checkIn.toISOString());
    formData.append('checkOut', checkOut.toISOString());
    formData.append('roomType', `${currentValues.roomCount} ${currentValues.roomType}`);
    formData.append('price', currentValues.price || '');
    formData.append('confirmationNumber', currentValues.confirmationNumber || '');
    formData.append('policies', currentValues.policies || '');
    formData.append('notes', currentValues.notes || '');
    formData.append('travelId', currentValues.travelId);
    
    // Handle thumbnail logic more explicitly
    if (thumbnail) {
      // New thumbnail uploaded
      formData.append('thumbnail', thumbnail);
    } else if (thumbnailRemoved && editingAccommodation?.thumbnail) {
      // Explicitly remove existing thumbnail
      formData.append('removeThumbnail', 'true');
    }
    // If no changes to thumbnail, don't send thumbnail data
    
    // Only add new attached files to formData if they exist
    if (attachedFiles.length > 0) {
      attachedFiles.forEach((file, index) => {
        formData.append('attachments', file);
      });
    }

    // Send information about removed existing attachments
    if (removedExistingAttachments.length > 0) {
      formData.append('removedExistingAttachments', JSON.stringify(removedExistingAttachments));
      console.log('Sending removed attachments:', removedExistingAttachments);
    }

    // For editing, send current remaining attachments to preserve them
    if (editingAccommodation?.attachments) {
      const remainingAttachments = editingAccommodation.attachments.filter((_, index) => 
        !removedExistingAttachments.includes(index)
      );
      if (remainingAttachments.length > 0) {
        formData.append('existingAttachments', JSON.stringify(remainingAttachments));
      }
    }
  
    // Enviar el formData directamente
    try {
      await onSubmit(formData);
      // Limpiar el formulario si es exitoso
      form.reset();
      setCheckInDate(undefined);
      setCheckOutDate(undefined);
      setAttachedFiles([]);
      setRemovedExistingAttachments([]);
      setThumbnail(null);
      setThumbnailRemoved(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleClose = () => {
    form.reset();
    setThumbnail(null);
    setThumbnailRemoved(false);
    setCheckInDate(undefined);
    setCheckOutDate(undefined);
    setAttachedFiles([]);
    setRemovedExistingAttachments([]);
    setPriceInCents(0);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  // Update form when editing accommodation changes
  React.useEffect(() => {
    if (editingAccommodation) {
      setCheckInDate(editingAccommodation.checkIn ? new Date(editingAccommodation.checkIn) : undefined);
      setCheckOutDate(editingAccommodation.checkOut ? new Date(editingAccommodation.checkOut) : undefined);
      
      // Reset thumbnail states when editing different accommodation
      setThumbnailRemoved(false);
      setThumbnail(null);
      
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
        attachments: editingAccommodation.attachments || [],
      });

      // Sync price formatting
      if (editingAccommodation.price) {
        const priceValue = parseFloat(editingAccommodation.price);
        if (priceValue > 0) {
          const cents = Math.round(priceValue * 100);
          setPriceInCents(cents);
        } else {
          setPriceInCents(0);
        }
      } else {
        setPriceInCents(0);
      }

      // Reset attached files state - don't try to convert existing URLs to File objects
      // This prevents overwriting when only updating thumbnail
      setAttachedFiles([]);
      setRemovedExistingAttachments([]);
    } else {
      // Reset all states for new accommodation
      setCheckInDate(undefined);
      setCheckOutDate(undefined);
      setThumbnailRemoved(false);
      setThumbnail(null);
      setPriceInCents(0);
      setAttachedFiles([]);
      setRemovedExistingAttachments([]);
      
      form.reset({
        travelId,
        name: "",
        type: "",
        location: "",
        checkInDate: "",
        checkInTime: "",
        checkOutDate: "",
        checkOutTime: "",
        roomType: "",
        roomCount: 1,
        price: "",
        confirmationNumber: "",
        policies: "",
        notes: "",
      });
    }
  }, [editingAccommodation, form, travelId]);


  const [priceInCents, setPriceInCents] = useState<number>(0);

  // Format currency using Intl.NumberFormat
  const formatCurrency = (cents: number): string => {
    const pesos = cents / 100;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(pesos);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Remove all non-digits
    const digitsOnly = input.replace(/\D/g, "");
    
    if (!digitsOnly) {
      setPriceInCents(0);
      form.setValue("price", "");
      return;
    }
    
    // Convert to number (this represents cents)
    const cents = parseInt(digitsOnly, 10);
    setPriceInCents(cents);
    
    // Save the dollar amount (cents / 100) as string in the form
    const dollars = cents / 100;
    form.setValue("price", dollars.toString());
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {editingAccommodation ? "Editar Alojamiento" : "Agregar Alojamiento"}
          </DialogTitle>
          <DialogDescription>
            {editingAccommodation ? "Modifica los detalles del alojamiento" : "Agrega un nuevo alojamiento al itinerario"}
          </DialogDescription>
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
              <Select onValueChange={(value) => form.setValue("type", value)} value={form.watch("type")}>
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

            <div className="w-full">
            <label htmlFor="price" className="block mb-1 font-medium">
              Precio Total
            </label>
            <Input
              id="price"
              type="text"
              value={priceInCents > 0 ? formatCurrency(priceInCents) : ""}
              onChange={handlePriceChange}
              placeholder="$15,000.00"
            />
            <input type="hidden" {...form.register("price")} />
            {form.formState.errors.price && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.price.message}
              </p>
            )}
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
          <Label>Imagen Principal del Alojamiento</Label>
          <p className="text-xs text-muted-foreground mt-1">Sube una imagen representativa del alojamiento (JPG, PNG, WEBP, SVG)</p>
            <div className="mt-2">
              <input
                type="file"
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
                Seleccionar Imagen
              </Button>
            </div>

            {(thumbnail || (editingAccommodation?.thumbnail && !thumbnailRemoved)) && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Vista Previa de la Imagen:</p>
                <div className="w-fit relative">
                  <img 
                    src={
                      thumbnail 
                        ? URL.createObjectURL(thumbnail) 
                        : editingAccommodation?.thumbnail?.startsWith('/objects/')
                          ? `/api${editingAccommodation.thumbnail}`
                          : editingAccommodation?.thumbnail?.startsWith('/uploads/')
                            ? editingAccommodation.thumbnail
                            : `/api/objects/${editingAccommodation?.thumbnail}`
                    } 
                    alt="Thumbnail" 
                    className="max-w-full max-h-40 rounded-lg border" 
                    onError={(e) => {
                      console.error("Error loading thumbnail image. URL:", e.currentTarget.src);
                      // Try fallback URL if the current one fails
                      const currentSrc = e.currentTarget.src;
                      if (editingAccommodation?.thumbnail && !thumbnail) {
                        if (!currentSrc.includes('/api/objects/')) {
                          e.currentTarget.src = `/api/objects/${editingAccommodation.thumbnail}`;
                        } else if (!currentSrc.includes('/uploads/')) {
                          e.currentTarget.src = editingAccommodation.thumbnail.startsWith('/uploads/') 
                            ? editingAccommodation.thumbnail 
                            : `/uploads/${editingAccommodation.thumbnail}`;
                        } else {
                          // If all attempts fail, hide the image
                          e.currentTarget.style.display = 'none';
                          console.error("Failed to load thumbnail from all possible URLs");
                        }
                      } else {
                        e.currentTarget.style.display = 'none';
                      }
                    }}
                    onLoad={() => {
                      console.log("Thumbnail loaded successfully");
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeThumbnail()}
                    className="absolute top-0 right-0 bg-red-500 text-white opacity-80 hover:opacity-100"
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
            <Label>Documentos Adjuntos</Label>
            <p className="text-xs text-muted-foreground mt-1">Sube documentos relacionados al alojamiento (confirmaciones, vouchers, políticas, etc.)</p>
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
                Seleccionar Documentos
              </Button>
            </div>

        
            {(attachedFiles.length > 0 || (editingAccommodation?.attachments && editingAccommodation.attachments.length > 0)) && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Documentos Adjuntos:</p>
                
                {/* Show existing attachments */}
                {editingAccommodation?.attachments
                  ?.filter((_, index) => !removedExistingAttachments.includes(index))
                  ?.map((url, index, filteredArray) => (
                  <div key={`existing-${index}`} className="flex items-center justify-between bg-muted p-2 rounded">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-muted-foreground mr-2" />
                      <span className="text-sm truncate">Archivo existente {index + 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Existente</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Find the original index in the unfiltered array
                          const originalIndex = editingAccommodation.attachments?.indexOf(url) ?? -1;
                          if (originalIndex !== -1) {
                            removeExistingAttachment(originalIndex);
                          }
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {/* Show new attachments */}
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