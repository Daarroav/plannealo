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
import { Upload, FileText, X } from "lucide-react";
import { format } from "date-fns";
import { insertInsuranceSchema } from "@shared/schema";
import { ServiceProviderCombobox } from "@/components/ui/service-provider-combobox";


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
  const [removedExistingAttachments, setRemovedExistingAttachments] = useState<number[]>([]);

  console.log("Initial data:", initialData);

  const form = useForm<InsuranceFormData>({
    resolver: zodResolver(insuranceFormSchema),
    defaultValues: {
      provider: "",
      policyNumber: "",
      policyType: "",
      emergencyNumber: "",
      effectiveDate: "",
      effectiveTime: "06:00",
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
      
 
      setAttachedFiles([]);
      setRemovedExistingAttachments([]);
    } else {
      form.reset({
        provider: "",
        policyNumber: "",
        policyType: "",
        emergencyNumber: "",
        effectiveDate: "",
        effectiveTime: "06:00",
        importantInfo: "",
        policyDescription: "",
        notes: "",
        attachments: [],
      });
      setAttachedFiles([]);
      setRemovedExistingAttachments([]);
    }
  }, [initialData, form]);

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

    // Actualizar proveedor solo si emergencyNumber está lleno y ambos campos del proveedor están vacíos
    if (currentValues.provider && currentValues.emergencyNumber) {
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
              contactPhone: currentValues.emergencyNumber,
            }),
          });
        }
      } catch (error) {
        console.error('Error updating provider contact:', error);
      }
    }

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

    // Send information about removed existing attachments
    if (removedExistingAttachments.length > 0) {
      formData.append('removedExistingAttachments', JSON.stringify(removedExistingAttachments));
    }

    // For editing, send current remaining attachments to preserve them
    if (initialData?.attachments) {
      const remainingAttachments = initialData.attachments.filter((_, index) => 
        !removedExistingAttachments.includes(index)
      );
      if (remainingAttachments.length > 0) {
        formData.append('existingAttachments', JSON.stringify(remainingAttachments));
      }
    }

    console.log("FormData to send:", formData);
    onSubmit(formData);
    form.reset();
    setAttachedFiles([]);
    setRemovedExistingAttachments([]);
  };

  const handleClose = () => {
    form.reset();
    setAttachedFiles([]);
    setRemovedExistingAttachments([]);
    onOpenChange(false);
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
                <ServiceProviderCombobox
                  label="Proveedor *"
                  value={form.watch("provider") || ""}
                  onChange={(value, provider) => {
                    form.setValue("provider", value || "");
                    // Auto-llenar número de emergencia (contactPhone del proveedor)
                    if (provider?.contactPhone) {
                      form.setValue("emergencyNumber", provider.contactPhone);
                    }
                  }}
                  placeholder="Seleccionar o crear proveedor..."
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

              {/* Lista de archivos */}
              {(attachedFiles.length > 0 || (initialData?.attachments && initialData.attachments.length > 0)) && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Documentos Adjuntos:</h4>
                  
                  {/* Show existing attachments */}
                  {initialData?.attachments
                    ?.filter((_, index) => !removedExistingAttachments.includes(index))
                    ?.map((url, index) => {
                      const originalIndex = initialData.attachments?.indexOf(url) ?? -1;
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
                  {attachedFiles.map((fileName, index) => (
                    <div key={`new-${index}`} className="flex items-center justify-between bg-muted p-2 rounded">
                      <div className="flex items-center space-x-2">
                        <a href={URL.createObjectURL(fileName)} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">{fileName.name}</span>
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