import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Download, Eye, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const shareFormSchema = z.object({
  recipientEmail: z.string().email("Debe ser un email válido"),
  clientName: z.string().min(1, "El nombre del cliente es requerido"),
});

type ShareFormData = z.infer<typeof shareFormSchema>;

interface ShareTravelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  travelId: string;
  travelTitle: string;
}

export function ShareTravelModal({ 
  open, 
  onOpenChange, 
  travelId, 
  travelTitle 
}: ShareTravelModalProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  const form = useForm<ShareFormData>({
    resolver: zodResolver(shareFormSchema),
    defaultValues: {
      recipientEmail: "",
      clientName: "",
    },
  });

  const handleSendEmail = async (data: ShareFormData) => {
    try {
      setIsSendingEmail(true);
      
      const response = await fetch(`/api/travels/${travelId}/share`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail: data.recipientEmail,
          clientName: data.clientName,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "¡Itinerario enviado!",
          description: `El itinerario ha sido enviado a ${data.recipientEmail} con acceso hasta ${new Date(result.tokenExpiry).toLocaleDateString('es-ES')}`,
        });
        form.reset();
        onOpenChange(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al enviar el correo");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al enviar el itinerario por correo electrónico.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      const response = await fetch(`/api/travels/${travelId}/generate-pdf`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `itinerario-${travelTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "¡PDF descargado!",
          description: "El itinerario ha sido descargado exitosamente",
        });
      } else {
        throw new Error("Error al generar PDF");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el PDF",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePreview = () => {
    // Abrir la vista previa del viaje en una nueva ventana
    window.open(`/travel/${travelId}/preview`, '_blank');
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-accent" />
            <span>Compartir Itinerario</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSendEmail)} className="space-y-6">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <strong>Viaje:</strong> {travelTitle}
            </div>

            {/* Información del Cliente */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Datos del Cliente</h3>
              
              <div className="space-y-2">
                <Label htmlFor="clientName">Nombre del Cliente</Label>
                <Input
                  id="clientName"
                  {...form.register("clientName")}
                  placeholder="Nombre completo del cliente"
                />
                {form.formState.errors.clientName && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.clientName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientEmail">Correo Electrónico</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  {...form.register("recipientEmail")}
                  placeholder="cliente@ejemplo.com"
                />
                {form.formState.errors.recipientEmail && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.recipientEmail.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border">
                <h4 className="font-medium text-sm text-blue-800 dark:text-blue-200">📧 Información del envío</h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  El cliente recibirá un correo con un enlace seguro para ver el itinerario. 
                  El enlace será válido por 90 días y no requiere crear una cuenta.
                </p>
              </div>
            </div>

            {/* Opciones de Compartir */}
            <div className="space-y-4 border-t border-border pt-4">
              <h3 className="text-lg font-semibold text-foreground">Opciones</h3>
              
              <div className="grid grid-cols-1 gap-3">
                {/* Vista Previa */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreview}
                  className="flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Vista Previa</span>
                </Button>

             
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSendingEmail}
              className="flex-1 bg-accent hover:bg-accent/90"
            >
              <Mail className="w-4 h-4 mr-2" />
              {isSendingEmail ? "Enviando..." : "Enviar por Email"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}