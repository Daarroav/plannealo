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
import { Upload, FileText, X, Link } from "lucide-react";
import { format } from "date-fns";
import { insertInsuranceSchema } from "@shared/schema";


// Form validation schema - extends the base schema with date string handling
const insuranceFormSchema = insertInsuranceSchema.extend({
  effectiveDate: z.string().min(1, "La fecha y hora es requerida"),
  effectiveTime: z.string().optional(),
  attachments: z.array(z.string()).optional(),
}).omit({
  travelId: true,
});

type InsuranceFormData = z.infer<typeof insuranceFormSchema>;

interface InsuranceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isPending?: boolean;
  initialData?: any;
}

const POLICY_TYPES = [
  "Seguro de Viaje Básico",
  "Seguro Médico Internacional",
  "Seguro de Cancelación",
  "Seguro de Equipaje",
  "Seguro de Accidentes",
  "Seguro Integral de Viaje",
  "Seguro de Responsabilidad Civil",
  "Otro"
];

export function InsuranceFormModal({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isPending = false,
  initialData
}: InsuranceFormModalProps) {
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  console.log("Initial data:", initialData);

  const form = useForm<InsuranceFormData>({
    resolver: zodResolver(insuranceFormSchema),
    defaultValues: {
      provider: "",
      policyNumber: "",
      policyType: "",
      emergencyNumber: "",
      effectiveDate: "",
      effectiveTime: "",
      importantInfo: "",
      policyDescription: "",
      notes: "",
      attachments: [],
    },
  });

  // Pre-llenar formulario cuando se está editando
  React.useEffect(() => {
    if (initialData) {
      const effectiveDateTime = new Date(initialData.effectiveDate);
      const dateStr = format(effectiveDateTime, "yyyy-MM-dd");
      const timeStr = format(effectiveDateTime, "HH:mm");
      
      form.reset({
        provider: initialData.provider || "",
        policyNumber: initialData.policyNumber || "",
        policyType: initialData.policyType || "",
        emergencyNumber: initialData.emergencyNumber || "",
        effectiveDate: dateStr,
        effectiveTime: timeStr,
        importantInfo: initialData.importantInfo || "",
        policyDescription: initialData.policyDescription || "",
        notes: initialData.notes || "",
        attachments: initialData.attachments || [],
      });
      
 
      if (Array.isArray(initialData.attachments) && initialData.attachments.length > 0) {
        if (initialData.attachments?.length > 0) {
          Promise.all(
            initialData.attachments.map(async (attachment: string | { path: string; originalName: string }) => {
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
            setAttachedFiles(files); // 👈 actualiza tu estado
          }).catch((err) => {
            console.error("Error cargando archivos adjuntos:", err);
          });
        }
      }
    } else {
      form.reset({
        provider: "",
        policyNumber: "",
        policyType: "",
        emergencyNumber: "",
        effectiveDate: "",
        effectiveTime: "",
        importantInfo: "",
        policyDescription: "",
        notes: "",
        attachments: [],
      });
      setAttachedFiles([]);
    }
  }, [initialData, form]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (data: InsuranceFormData) => {
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

    // Combine date and time for effective date
    const effectiveDateTime = currentValues.effectiveTime 
      ? new Date(`${currentValues.effectiveDate}T${currentValues.effectiveTime}`)
      : new Date(currentValues.effectiveDate);

    // Create FormData
    const formData = new FormData();
    
    // Add form fields
    if (initialData) {
      formData.append('id', initialData.id);
    }
    formData.append('provider', currentValues.provider);
    formData.append('policyNumber', currentValues.policyNumber);
    formData.append('policyType', currentValues.policyType);
    formData.append('emergencyNumber', currentValues.emergencyNumber || '');
    formData.append('effectiveDate', effectiveDateTime.toISOString());
    formData.append('importantInfo', currentValues.importantInfo || '');
    formData.append('policyDescription', currentValues.policyDescription || '');
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
    setAttachedFiles([]);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Seguro" : "Agregar Seguro"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Modifica la información del seguro de viaje" : "Agrega información de seguro de viaje al itinerario"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Información del Seguro</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Proveedor */}
              <div className="space-y-2">
                <Label htmlFor="provider">Proveedor *</Label>
                <Input
                  {...form.register("provider")}
                  placeholder="Ej: AXA, Mapfre, Allianz"
                  className={form.formState.errors.provider ? "border-red-500" : ""}
                />
                {form.formState.errors.provider && (
                  <p className="text-sm text-red-500">{form.formState.errors.provider.message}</p>
                )}
              </div>

              {/* Número de Política */}
              <div className="space-y-2">
                <Label htmlFor="policyNumber">Número de Política *</Label>
                <Input
                  {...form.register("policyNumber")}
                  placeholder="Número de póliza"
                  className={form.formState.errors.policyNumber ? "border-red-500" : ""}
                />
                {form.formState.errors.policyNumber && (
                  <p className="text-sm text-red-500">{form.formState.errors.policyNumber.message}</p>
                )}
              </div>

              {/* Tipo de Política */}
              <div className="space-y-2">
                <Label htmlFor="policyType">Tipo de Política *</Label>
                <Select onValueChange={(value) => form.setValue("policyType", value)} value={form.watch("policyType")}>
                  <SelectTrigger className={form.formState.errors.policyType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecciona el tipo de seguro" />
                  </SelectTrigger>
                  <SelectContent>
                    {POLICY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.policyType && (
                  <p className="text-sm text-red-500">{form.formState.errors.policyType.message}</p>
                )}
              </div>

              {/* Número de Emergencia */}
              <div className="space-y-2">
                <Label htmlFor="emergencyNumber">Número de Emergencia</Label>
                <Input
                  {...form.register("emergencyNumber")}
                  placeholder="Número de contacto de emergencia"
                />
              </div>
            </div>
          </div>

          {/* Fecha y Hora de Vigencia */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Vigencia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="effectiveDate">Fecha de Vigencia *</Label>
                <Input
                  type="date"
                  {...form.register("effectiveDate")}
                  className={form.formState.errors.effectiveDate ? "border-red-500" : ""}
                />
                {form.formState.errors.effectiveDate && (
                  <p className="text-sm text-red-500">{form.formState.errors.effectiveDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="effectiveTime">Hora de Vigencia</Label>
                <Input
                  type="time"
                  {...form.register("effectiveTime")}
                />
              </div>
            </div>
          </div>

          {/* Información Detallada */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Detalles de la Política</h3>
            
            {/* Información Importante */}
            <div className="space-y-2">
              <Label htmlFor="importantInfo">Información Importante</Label>
              <Textarea
                {...form.register("importantInfo")}
                placeholder="Información crítica sobre la cobertura, exclusiones importantes, etc."
                className="min-h-[80px]"
              />
            </div>

            {/* Descripción de la Política */}
            <div className="space-y-2">
              <Label htmlFor="policyDescription">Descripción de la Política</Label>
              <Textarea
                {...form.register("policyDescription")}
                placeholder="Descripción detallada de la cobertura, beneficios, límites, etc."
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* Archivos Adjuntos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Archivos Adjuntos</h3>
            
            <div className="border-2 border-dashed border-border rounded-lg p-6">
              <div className="text-center">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md inline-block">
                      Seleccionar Archivos
                    </span>
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <p className="text-sm text-muted-foreground">
                    PDF, Word, imágenes (JPG, PNG) - Máximo 10 archivos
                  </p>
                </div>
              </div>

              {/* Lista de archivos seleccionados */}
    
              {attachedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Archivos seleccionados:</h4>
                  {attachedFiles.map((fileName, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                      <div className="flex items-center space-x-2">
                      <a href={URL.createObjectURL(fileName)} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span  className="text-sm text-foreground">{fileName.name}</span>
                        </a>
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
          </div>

          {/* Notas Adicionales */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              {...form.register("notes")}
              placeholder="Cualquier información adicional sobre el seguro..."
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
              {isPending ? "Guardando..." : "Guardar Seguro"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}