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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { insertActivitySchema } from "@shared/schema";
import { FileUploader } from "@/components/ui/file-uploader";

// Extend the schema with additional fields for the form
const activityFormSchema = insertActivitySchema.extend({
  activityDate: z.string().min(1, "La fecha es requerida"),
  startTime: z.string().min(1, "La hora de inicio es requerida"),
  endTime: z.string().min(1, "La hora de finalización es requerida"),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  startLocation: z.string().min(1, "La ubicación de inicio es requerida"),
  endLocation: z.string().optional(),
}).omit({
  date: true,
});

type ActivityForm = z.infer<typeof activityFormSchema>;

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  travelId: string;
  editingActivity?: any;
}

export function ActivityFormModal({ isOpen, onClose, onSubmit, isLoading, travelId, editingActivity }: ActivityFormModalProps) {
  const [activityDate, setActivityDate] = useState<Date>();
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  console.info("Editing activity:", editingActivity);
  
  const form = useForm<ActivityForm>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      travelId,
      name: "",
      type:  "actividad",
      provider: "",
      activityDate: "",
      startTime: "",
      endTime: "",
      confirmationNumber: "",
      contactName: "",
      contactPhone: "",
      startLocation: "",
      endLocation: "",
      conditions: "",
      notes: "",
    },
  });

  // Pre-llenar formulario cuando se está editando
  React.useEffect(() => {
    if (editingActivity) {
      const activityDateTime = new Date(editingActivity.date);
      const dateStr = format(activityDateTime, "yyyy-MM-dd");
      const timeStr = format(activityDateTime, "HH:mm");
      
      setActivityDate(activityDateTime); // Se actualiza la fecha del calendario
      
      // Handle existing attachments for editing
      if (editingActivity.attachments && editingActivity.attachments.length > 0) {
        const existingFiles = editingActivity.attachments.map((url: string) => {
          const filename = url.split('/').pop() || 'attachment';
          const file = new File([], filename, { type: 'application/octet-stream' });
          return file;
        });
        setAttachedFiles(existingFiles);
      } else {
        setAttachedFiles([]);
      }
      
      form.reset({
        travelId,
        name: editingActivity.name || "",
        type: editingActivity.type || "",
        provider: editingActivity.provider || "",
        activityDate: dateStr,
        startTime: editingActivity.startTime || timeStr,
        endTime: editingActivity.endTime || "",
        confirmationNumber: editingActivity.confirmationNumber || "",
        contactName: editingActivity.contactName || "",
        contactPhone: editingActivity.contactPhone || "",
        startLocation: editingActivity.placeStart || "",
        endLocation: editingActivity.placeEnd || "",
        conditions: editingActivity.conditions || "",
        notes: editingActivity.notes || "",
      });
    } else {
      setActivityDate(undefined);
      setAttachedFiles([]);
      form.reset({
        travelId,
        name: "",
        type: "actividad",
        provider: "",
        activityDate: "",
        startTime: "",
        endTime: "",
        confirmationNumber: "",
        contactName: "",
        contactPhone: "",
        startLocation: "",
        endLocation: "",
        conditions: "",
        notes: "",
      });
    }
  }, [editingActivity, form, travelId]);

  const handleSubmit = async (data: ActivityForm) => {
    // Force blur on any active input to ensure values are captured
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      activeElement.blur();
      // Wait a bit for the blur event to process
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Get the most current form values
    const currentValues = form.getValues();

    console.info("Form values:", currentValues);
    
    // Combine date and time for the activity
    const activityDateTime = new Date(`${currentValues.activityDate}T${currentValues.startTime}:00`);

    // Create FormData
    const formData = new FormData();
    
    // Add form fields
    if (editingActivity) {
      formData.append('id', editingActivity.id);
    }
    formData.append('travelId', currentValues.travelId);
    formData.append('name', currentValues.name);
    formData.append('type', currentValues.type);
    formData.append('provider', currentValues.provider || '');
    formData.append('date', activityDateTime.toISOString());
    formData.append('startTime', currentValues.startTime);
    formData.append('endTime', currentValues.endTime);
    formData.append('confirmationNumber', currentValues.confirmationNumber || '');
    formData.append('conditions', currentValues.conditions || '');
    formData.append('notes', currentValues.notes || '');
    formData.append('contactName', currentValues.contactName || '');
    formData.append('contactPhone', currentValues.contactPhone || '');
    formData.append('placeStart', currentValues.startLocation);
    formData.append('placeEnd', currentValues.endLocation || '');
    
    // Add attached files
    attachedFiles.forEach((file) => {
      formData.append('attachments', file);
    });

    onSubmit(formData);
    form.reset();
    setActivityDate(undefined);
    setAttachedFiles([]);
  };

  const handleClose = () => {
    form.reset();
    setActivityDate(undefined);
    setAttachedFiles([]);
    onClose();
  };

  const activityTypes = [
    { value: "actividad", label: "Actividad" },
    { value: "tour", label: "Tour" },
    { value: "restaurante", label: "Restaurante" },
    { value: "excursion", label: "Excursión" },
    { value: "otro", label: "Otro" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Agregar Actividad</DialogTitle>
          <DialogDescription>
            Agrega una nueva actividad al itinerario del viaje
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="type">Tipo de Actividad *</Label>
              <Select defaultValue="actividad" onValueChange={(value) => form.setValue("type", value)} value={form.watch("type")}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type) => (
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
              <Label htmlFor="confirmationNumber">Número de Confirmación</Label>
              <Input
                id="confirmationNumber"
                {...form.register("confirmationNumber")}
                placeholder="Ej: ACT123456789"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Nombre de la Actividad *</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Ej: Cenote Dos Ojos"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="provider">Proveedor/Empresa</Label>
              <Input
                id="provider"
                {...form.register("provider")}
                placeholder="Ej: Xcaret Expeditions"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="contactName">Nombre del Contacto</Label>
              <Input
                id="contactName"
                {...form.register("contactName")}
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div>
              <Label htmlFor="contactPhone">Número de Contacto</Label>
              <Input
                id="contactPhone"
                {...form.register("contactPhone")}
                placeholder="Ej: +52 984 123 4567"
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Fecha de la Actividad *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !activityDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {activityDate ? format(activityDate, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={activityDate}
                    onSelect={(date) => {
                      setActivityDate(date);
                      if (date) {
                        form.setValue("activityDate", format(date, "yyyy-MM-dd"));
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.activityDate && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.activityDate.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="startTime">Hora de Inicio *</Label>
              <Input
                id="startTime"
                type="time"
                {...form.register("startTime")}
              />
              {form.formState.errors.startTime && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.startTime.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="endTime">Hora de Finalización *</Label>
              <Input
                id="endTime"
                type="time"
                {...form.register("endTime")}
              />
              {form.formState.errors.endTime && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          {/* Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="startLocation">Ubicación de Inicio *</Label>
              <Input
                id="startLocation"
                {...form.register("startLocation")}
                placeholder="Ej: Hotel lobby, Playa del Carmen centro"
              />
              {form.formState.errors.startLocation && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.startLocation.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="endLocation">Ubicación de Finalización</Label>
              <Input
                id="endLocation"
                {...form.register("endLocation")}
                placeholder="Ej: Cenote Dos Ojos, Hotel"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <Label htmlFor="conditions">Condiciones y Términos</Label>
            <Textarea
              id="conditions"
              {...form.register("conditions")}
              placeholder="Incluye políticas de cancelación, requisitos especiales, qué incluye la actividad, etc."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="Información adicional como instrucciones especiales, qué llevar, recomendaciones, etc."
              rows={3}
            />
          </div>

          {/* File Attachments */}
          <div>
            <Label>Archivos Adjuntos</Label>
            <FileUploader
              name="attachments"
              defaultFiles={editingActivity?.attachments || []}
              onFilesChange={setAttachedFiles}
              maxFiles={10}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
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
              {isLoading ? "Guardando..." : "Guardar Actividad"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}