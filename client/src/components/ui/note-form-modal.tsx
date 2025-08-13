import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { insertNoteSchema } from "@shared/schema";

// Form validation schema - extends the base schema with date string handling
const noteFormSchema = insertNoteSchema.extend({
  noteDate: z.string().min(1, "La fecha es requerida"),
}).omit({
  travelId: true,
});

type NoteFormData = z.infer<typeof noteFormSchema>;

interface NoteFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isPending?: boolean;
}

export function NoteFormModal({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isPending = false 
}: NoteFormModalProps) {
  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: "",
      noteDate: "",
      content: "",
      visibleToTravelers: true,
    },
  });

  const handleSubmit = (data: NoteFormData) => {
    console.log("Form data before processing:", data);

    const processedData = {
      title: data.title,
      noteDate: new Date(data.noteDate),
      content: data.content,
      visibleToTravelers: data.visibleToTravelers,
    };

    console.log("Processed data to send:", processedData);
    onSubmit(processedData);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const visibleToTravelers = form.watch("visibleToTravelers");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nota</DialogTitle>
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

          {/* Fecha */}
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
              {isPending ? "Guardando..." : "Guardar Nota"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}