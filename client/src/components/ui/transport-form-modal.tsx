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
import { CalendarIcon, Upload, FileText, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { insertTransportSchema } from "@shared/schema";
import { ServiceProviderCombobox } from "@/components/ui/service-provider-combobox";

// Extend the schema with additional fields for the form
const transportFormSchema = insertTransportSchema.extend({
  pickupDateField: z.string().min(1, "La fecha de recogida es requerida"),
  pickupTimeField: z.string().min(1, "La hora de recogida es requerida"),
  endDateField: z.string().optional(),
  endTimeField: z.string().optional(),
  attachments: z.array(z.string()).optional(),
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
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [removedExistingAttachments, setRemovedExistingAttachments] = useState<number[]>([]);

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
      pickupTimeField: "06:00",
      pickupLocation: "",
      endDateField: "",
      endTimeField: "06:00",
      dropoffLocation: "",
      confirmationNumber: "",
      notes: "",
      attachments: [],
    },
  });

  // Pre-llenar formulario cuando se está editando
  React.useEffect(() => {
    if (editingTransport) {
      // Las fechas están guardadas en UTC, pero representan la hora local de México (GMT-6)
      // Necesitamos convertir de UTC a la hora que sería en México
      const pickupISOString = editingTransport.pickupDate;
      
      // Convertir de UTC a hora de México (GMT-6 = -360 minutos)
      const MEXICO_OFFSET_MINUTES = -360;
      
      const pickupUTC = new Date(pickupISOString);
      
      // Ajustar por el offset de México para obtener la hora local de México
      const pickupMexico = new Date(pickupUTC.getTime() + MEXICO_OFFSET_MINUTES * 60 * 1000);
      
      // Extraer componentes en hora de México
      const pickupDateStr = pickupMexico.toISOString().substring(0, 10);
      const pickupTimeStr = pickupMexico.toISOString().substring(11, 16);
      
      // Crear objeto Date para el calendario en hora local del navegador
      // pero que represente visualmente la hora de México
      const pickupDateTime = new Date(`${pickupDateStr}T${pickupTimeStr}:00`);
      setPickupDate(pickupDateTime);
      
      let endDateTime = undefined;
      let endDateStr = "";
      let endTimeStr = "06:00";
      
      if (editingTransport.endDate) {
        const endISOString = editingTransport.endDate;
        const endUTC = new Date(endISOString);
        const endMexico = new Date(endUTC.getTime() + MEXICO_OFFSET_MINUTES * 60 * 1000);
        
        endDateStr = endMexico.toISOString().substring(0, 10);
        endTimeStr = endMexico.toISOString().substring(11, 16);
        endDateTime = new Date(`${endDateStr}T${endTimeStr}:00`);
      }
      
      setEndDate(endDateTime);
      
      form.reset({
        travelId,
        type: editingTransport.type || "",
        name: editingTransport.name || "",
        provider: editingTransport.provider || "",
        contactName: editingTransport.contactName || "",
        contactNumber: editingTransport.contactNumber || "",
        pickupDateField: pickupDateStr,
        pickupTimeField: pickupTimeStr,
        pickupLocation: editingTransport.pickupLocation || "",
        endDateField: endDateStr,
        endTimeField: endTimeStr,
        dropoffLocation: editingTransport.dropoffLocation || "",
        confirmationNumber: editingTransport.confirmationNumber || "",
        notes: editingTransport.notes || "",
        attachments: editingTransport.attachments || [],
      });
      
      setAttachedFiles([]);
      setRemovedExistingAttachments([]);
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
        pickupTimeField: "06:00",
        pickupLocation: "",
        endDateField: "",
        endTimeField: "06:00",
        dropoffLocation: "",
        confirmationNumber: "",
        notes: "",
        attachments: [],
      });
      setAttachedFiles([]);
      setRemovedExistingAttachments([]);
    }
  }, [editingTransport, form, travelId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = (index: number) => {
    setRemovedExistingAttachments(prev => [...prev, index]);
  };

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
    
    // Actualizar proveedor solo si ambos campos están vacíos
    if (currentValues.provider && currentValues.contactName && currentValues.contactNumber) {
      try {
        const providersResponse = await fetch('/api/service-providers', { credentials: 'include' });
        const providers = await providersResponse.json();
        const selectedProvider = providers.find((p: any) => p.name === currentValues.provider);
        
        // Solo actualizar si ambos campos del proveedor están vacíos
        if (selectedProvider && !selectedProvider.contactName && !selectedProvider.contactPhone) {
          await fetch(`/api/service-providers/${selectedProvider.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              contactName: currentValues.contactName,
              contactPhone: currentValues.contactNumber,
            }),
          });
        }
      } catch (error) {
        console.error('Error updating provider contact:', error);
      }
    }
    
    // El usuario ingresó las horas pensando en zona horaria de México (GMT-6)
    // Necesitamos convertir a UTC para guardar
    const MEXICO_OFFSET_MINUTES = -360;
    
    // Crear fecha/hora de recogida como fue ingresada
    const pickupLocal = new Date(`${currentValues.pickupDateField}T${currentValues.pickupTimeField}:00`);
    // Convertir a UTC
    const pickupDateTime = new Date(pickupLocal.getTime() - MEXICO_OFFSET_MINUTES * 60 * 1000);
    
    let endDateTime = null;
    if (currentValues.endDateField && currentValues.endTimeField) {
      const endLocal = new Date(`${currentValues.endDateField}T${currentValues.endTimeField}:00`);
      endDateTime = new Date(endLocal.getTime() - MEXICO_OFFSET_MINUTES * 60 * 1000);
    }

    // Create FormData
    const formData = new FormData();
    
    // Add form fields
    if (editingTransport) {
      formData.append('id', editingTransport.id);
    }
    formData.append('travelId', currentValues.travelId);
    formData.append('type', currentValues.type);
    formData.append('name', currentValues.name);
    formData.append('provider', currentValues.provider || '');
    formData.append('contactName', currentValues.contactName || '');
    formData.append('contactNumber', currentValues.contactNumber || '');
    formData.append('pickupDate', pickupDateTime.toISOString());
    formData.append('pickupLocation', currentValues.pickupLocation);
    if (endDateTime) {
      formData.append('endDate', endDateTime.toISOString());
    }
    formData.append('dropoffLocation', currentValues.dropoffLocation || '');
    formData.append('confirmationNumber', currentValues.confirmationNumber || '');
    formData.append('notes', currentValues.notes || '');
    
    // Add attached files
    attachedFiles.forEach((file) => {
      formData.append('attachments', file);
    });

    // Send information about removed existing attachments
    if (removedExistingAttachments.length > 0) {
      formData.append('removedExistingAttachments', JSON.stringify(removedExistingAttachments));
    }

    // For editing, send current remaining attachments to preserve them
    if (editingTransport?.attachments) {
      const remainingAttachments = editingTransport.attachments.filter((_, index) => 
        !removedExistingAttachments.includes(index)
      );
      if (remainingAttachments.length > 0) {
        formData.append('existingAttachments', JSON.stringify(remainingAttachments));
      }
    }

    onSubmit(formData);
    form.reset();
    setPickupDate(undefined);
    setEndDate(undefined);
    setAttachedFiles([]);
    setRemovedExistingAttachments([]);
  };

  const handleClose = () => {
    form.reset();
    setPickupDate(undefined);
    setEndDate(undefined);
    setAttachedFiles([]);
    setRemovedExistingAttachments([]);
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
              <ServiceProviderCombobox
                label="Proveedor"
                value={form.watch("provider") || ""}
                onChange={(value, provider) => {
                  form.setValue("provider", value || "");
                  // Auto-llenar contacto solo si el proveedor tiene datos
                  if (provider?.contactName || provider?.contactPhone) {
                    if (provider.contactName) {
                      form.setValue("contactName", provider.contactName);
                    }
                    if (provider.contactPhone) {
                      form.setValue("contactNumber", provider.contactPhone);
                    }
                  }
                }}
                placeholder="Seleccionar o crear proveedor..."
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

          {/* File Attachments */}
          <div>
            <Label>Documentos Adjuntos</Label>
            <p className="text-xs text-muted-foreground mt-1">Sube documentos relacionados al transporte (confirmaciones, vouchers, etc.)</p>
            <div className="mt-2">
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload-transport"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-upload-transport')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Seleccionar Documentos
              </Button>
            </div>

            {(attachedFiles.length > 0 || (editingTransport?.attachments && editingTransport.attachments.length > 0)) && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Documentos Adjuntos:</p>
                
                {/* Show existing attachments */}
                {editingTransport?.attachments
                  ?.filter((_, index) => !removedExistingAttachments.includes(index))
                  ?.map((url, index) => {
                    const originalIndex = editingTransport.attachments?.indexOf(url) ?? -1;
                    return (
                      <div key={`existing-${index}`} className="flex items-center justify-between bg-muted p-2 rounded">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-muted-foreground mr-2" />
                          <span className="text-sm truncate">Documento existente {index + 1}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Existente</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExistingAttachment(originalIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                
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
              {isLoading ? "Guardando..." : "Guardar Transporte"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}