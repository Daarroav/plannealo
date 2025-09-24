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
import { FileUploader } from "./file-uploader";
import React from "react";

// Form validation schema - extends the base schema with date string handling
const cruiseFormSchema = insertCruiseSchema.extend({
  departureDate: z.string().min(1, "La fecha de salida es requerida"),
  departureTime: z.string().optional(),
  arrivalDate: z.string().min(1, "La fecha de llegada es requerida"), 
  arrivalTime: z.string().optional(),
  attachments: z.array(z.string()).optional(),
}).omit({
  travelId: true,
});

type CruiseFormData = z.infer<typeof cruiseFormSchema>;

interface CruiseFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isPending?: boolean;
  editingCruise?: any;
}

export function CruiseFormModal({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isPending = false,
  editingCruise
}: CruiseFormModalProps) {
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const form = useForm<CruiseFormData>({
    resolver: zodResolver(cruiseFormSchema),
    defaultValues: {
      cruiseLine: editingCruise?.cruiseLine || "",
      confirmationNumber: editingCruise?.confirmationNumber || "",
      departureDate: editingCruise?.departureDate || "",
      departureTime: editingCruise?.departureTime || "",
      departurePort: editingCruise?.departurePort || "",
      arrivalDate: editingCruise?.arrivalDate || "",
      arrivalTime: editingCruise?.arrivalTime || "",
      arrivalPort: editingCruise?.arrivalPort || "",
      notes: editingCruise?.notes || "",
      attachments: [],
    },
  });


  // Pre-llenar formulario cuando se está editando
  React.useEffect(() => {
      if (editingCruise) {
        const depDateTime = new Date(editingCruise.departureDate);
        const arrDateTime = new Date(editingCruise.arrivalDate);
        
        // Extract date in YYYY-MM-DD format for date inputs
        const depDateStr = depDateTime.toISOString().split('T')[0];
        const arrDateStr = arrDateTime.toISOString().split('T')[0];
        
        // Extract time in HH:MM format for time inputs
        const depTimeStr = depDateTime.toTimeString().slice(0, 5);
        const arrTimeStr = arrDateTime.toTimeString().slice(0, 5);
        
        form.reset({
          cruiseLine: editingCruise.cruiseLine || "",
          confirmationNumber: editingCruise.confirmationNumber || "",
          departureDate: depDateStr,
          departureTime: depTimeStr,
          departurePort: editingCruise.departurePort || "",
          arrivalDate: arrDateStr,
          arrivalTime: arrTimeStr,
          arrivalPort: editingCruise.arrivalPort || "",
          notes: editingCruise.notes || "",
          attachments: editingCruise.attachments || [],
        });
        
        // Load existing attachments as files
        if (Array.isArray(editingCruise.attachments) && editingCruise.attachments.length > 0) {
          Promise.all(
            editingCruise.attachments.map(async (attachment: string | { path: string; originalName: string }) => {
              // Manejar tanto el formato antiguo (string) como el nuevo (objeto)
              const attachmentUrl = typeof attachment === 'string' ? attachment : attachment.path;
              const originalName = typeof attachment === 'string' 
                ? attachment.split('/').pop() || 'archivo'
                : attachment.originalName || 'archivo';
              
              const fullUrl = attachmentUrl.startsWith("/objects/")
                ? `/api${attachmentUrl}`
                : attachmentUrl.startsWith("/uploads/")
                ? `/api/objects${attachmentUrl}`
                : `/api/objects/uploads/${attachmentUrl}`;
                
              const response = await fetch(fullUrl);
              const blob = await response.blob();
              return new File([blob], originalName, { type: blob.type });
            })
          ).then((files) => {
            setAttachedFiles(files);
          }).catch((err) => {
            console.error("Error cargando archivos adjuntos:", err);
          });
        }
      } else {
        form.reset({
          cruiseLine: "",
          confirmationNumber: "",
          departureDate: "",
          departureTime: "",
          departurePort: "",
          arrivalDate: "",
          arrivalTime: "",
          arrivalPort: "",
          notes: "",
          attachments: [],
        });
        setAttachedFiles([]);
      }
    }, [editingCruise, form]);


  console.log("Editing cruise now:", editingCruise);

  const handleSubmit = async (data: CruiseFormData) => {
    // Force blur on any active input to ensure values are captured
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      activeElement.blur();
      // Wait a bit for the blur event to process
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Get the most current form values
    const currentValues = form.getValues();
    console.log("Form data before processing:", currentValues);

    // Combine date and time for departure
    const departureDateTime = currentValues.departureTime 
      ? new Date(`${currentValues.departureDate}T${currentValues.departureTime}:00`)
      : new Date(`${currentValues.departureDate}T09:00:00`);

    // Combine date and time for arrival
    const arrivalDateTime = currentValues.arrivalTime 
      ? new Date(`${currentValues.arrivalDate}T${currentValues.arrivalTime}:00`)
      : new Date(`${currentValues.arrivalDate}T18:00:00`);

    // Create FormData
    const formData = new FormData();
    
    // Add form fields (no editing support yet, so no id)
    formData.append('cruiseLine', currentValues.cruiseLine);
    formData.append('confirmationNumber', currentValues.confirmationNumber || '');
    formData.append('departureDate', departureDateTime.toISOString());
    formData.append('departurePort', currentValues.departurePort);
    formData.append('arrivalDate', arrivalDateTime.toISOString());
    formData.append('arrivalPort', currentValues.arrivalPort);
    formData.append('notes', currentValues.notes || '');
    
    // Add attached files
    attachedFiles.forEach((file) => {
      formData.append('attachments', file);
    });

    console.log("FormData to send:", formData);
    onSubmit(formData);
    form.reset();
    setAttachedFiles([]);
  };

  const handleClose = () => {
    form.reset();
    setAttachedFiles([]);
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

          {/* File Attachments */}
          <div>
            <Label>Documentos Adjuntos</Label>
            <FileUploader
              name="attachments"
              defaultFiles={editingCruise?.attachments || []}
              onFilesChange={setAttachedFiles}
              maxFiles={10}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
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