import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Upload, FileText, X } from "lucide-react";
import { insertNoteSchema } from "@shared/schema";

// Form validation schema - extends the base schema with date string handling
const noteFormSchema = insertNoteSchema.extend({
  noteDate: z.string().min(1, "La fecha es requerida"),
  noteTime: z.string().optional(),
  attachments: z.array(z.string()).optional(),
}).omit({
  travelId: true,
});

type NoteFormData = z.infer<typeof noteFormSchema>;

interface NoteFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isPending?: boolean;
  editingNote?: any;
}

export function NoteFormModal({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isPending = false,
  editingNote
}: NoteFormModalProps) {
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);

  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: "",
      noteDate: "",
      noteTime: "",
      content: "",
      visibleToTravelers: true,
      attachments: [],
    },
  });

  // Reset form when editing note changes
  React.useEffect(() => {
    if (editingNote) {
      const noteDate = editingNote.noteDate ? new Date(editingNote.noteDate).toISOString().split('T')[0] : "";
      form.reset({
        title: editingNote.title || "",
        noteDate,
        noteTime: editingNote.noteTime || "",
        content: editingNote.content || "",
        visibleToTravelers: editingNote.visibleToTravelers ?? true,
        attachments: editingNote.attachments || [],
      });
      setAttachedFiles(editingNote.attachments || []);
    } else {
      form.reset({
        title: "",
        noteDate: "",
        noteTime: "",
        content: "",
        visibleToTravelers: true,
        attachments: [],
      });
      setAttachedFiles([]);
    }
  }, [editingNote, form]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      const updatedFiles = [...attachedFiles, ...fileNames];
      setAttachedFiles(updatedFiles);
      form.setValue("attachments", updatedFiles);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = attachedFiles.filter((_, i) => i !== index);
    setAttachedFiles(updatedFiles);
    form.setValue("attachments", updatedFiles);
  };

  const handleSubmit = (data: NoteFormData) => {
    console.log("Form data before processing:", data);

    const processedData = {
      ...(editingNote ? { id: editingNote.id } : {}),
      title: data.title,
      noteDate: new Date(data.noteDate),
      noteTime: data.noteTime || undefined,
      content: data.content,
      visibleToTravelers: data.visibleToTravelers,
      attachments: attachedFiles.length > 0 ? attachedFiles : undefined,
    };

    console.log("Processed data to send:", processedData);
    onSubmit(processedData);
    form.reset();
    setAttachedFiles([]);
  };

  const handleClose = () => {
    form.reset();
    setAttachedFiles([]);
    onOpenChange(false);
  };

  const visibleToTravelers = form.watch("visibleToTravelers");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingNote ? "Editar Nota" : "Agregar Nota"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              {...form.register("title")}
              placeholder="Título de la nota"
              className={form.formState.errors.title ? "border-red-500" : ""}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="noteDate">Fecha *</Label>
              <Input
                type="date"
                {...form.register("noteDate")}
                className={form.formState.errors.noteDate ? "border-red-500" : ""}
              />
              {form.formState.errors.noteDate && (
                <p className="text-sm text-red-500">{form.formState.errors.noteDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="noteTime">Hora</Label>
              <Input
                type="time"
                {...form.register("noteTime")}
                placeholder="12:00"
              />
            </div>
          </div>

          {/* Contenido de la Nota */}
          <div className="space-y-2">
            <Label htmlFor="content">Texto de la Nota *</Label>
            <Textarea
              {...form.register("content")}
              placeholder="Escribe el contenido de la nota aquí..."
              className={`min-h-[150px] ${form.formState.errors.content ? "border-red-500" : ""}`}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
            )}
          </div>

          {/* Toggle de Visibilidad para Viajeros */}
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Visibilidad para Viajeros</Label>
                  <p className="text-sm text-muted-foreground">
                    Controla si esta nota será visible para los viajeros
                  </p>
                </div>
                <Switch
                  checked={visibleToTravelers}
                  onCheckedChange={(checked) => form.setValue("visibleToTravelers", checked)}
                />
              </div>
              
              {/* Indicador visual del estado */}
              <div className="mt-3 flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${visibleToTravelers ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium text-foreground">
                  {visibleToTravelers ? "Visible para viajeros" : "Solo visible para agentes"}
                </span>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">
                {visibleToTravelers 
                  ? "Los viajeros podrán ver esta nota en su itinerario"
                  : "Esta nota solo será visible para agentes de la agencia"
                }
              </p>
            </div>
          </div>

          {/* Documentos Adjuntos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Documentos</h3>
            
            <div className="border-2 border-dashed border-border rounded-lg p-6">
              <div className="text-center">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md inline-block">
                      Seleccionar Documentos
                    </span>
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <p className="text-sm text-muted-foreground">
                    PDF, Word, imágenes (JPG, PNG), texto - Máximo 10 archivos
                  </p>
                </div>
              </div>

              {/* Lista de archivos seleccionados */}
              {attachedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Documentos seleccionados:</h4>
                  {attachedFiles.map((fileName, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{fileName}</span>
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
              {isPending ? "Guardando..." : editingNote ? "Actualizar Nota" : "Guardar Nota"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}