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
  clientEmail: z.string().email("Debe ser un email válido"),
  clientName: z.string().min(1, "El nombre del cliente es requerido"),
  message: z.string().optional(),
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
      clientEmail: "",
      clientName: "",
      message: "",
    },
  });

  const handleSendEmail = async (data: ShareFormData) => {
    try {
      setIsSendingEmail(true);
      
      const response = await fetch(`/api/travels/${travelId}/share/email`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientEmail: data.clientEmail,
          clientName: data.clientName,
          message: data.message,
        }),
      });

      if (response.ok) {
        toast({
          title: "¡Itinerario enviado!",
          description: `El itinerario ha sido enviado a ${data.clientEmail}`,
        });
        form.reset();
        onOpenChange(false);
      } else {
        throw new Error("Error al enviar el correo");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Por el momento el envío de correo no está configurado. Usa la opción de descarga PDF.",
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
                <Label htmlFor="clientEmail">Correo Electrónico</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  {...form.register("clientEmail")}
                  placeholder="cliente@ejemplo.com"
                />
                {form.formState.errors.clientEmail && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.clientEmail.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensaje Personalizado (Opcional)</Label>
                <Textarea
                  id="message"
                  {...form.register("message")}
                  placeholder="Mensaje personalizado para el cliente..."
                  rows={3}
                />
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

                {/* Descargar PDF */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGeneratingPDF ? "Generando PDF..." : "Descargar PDF"}</span>
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