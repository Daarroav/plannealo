
import { useState } from "react";
import { NavigationHeader } from "@/components/ui/navigation-header";
import { Download, Loader2, Database, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BackupsPage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  const handleBackupDownload = async () => {
    setIsDownloading(true);
    
    const toastId = toast({
      title: "Preparando respaldo...",
      description: "Esto puede tomar varios minutos dependiendo del tamaño.",
      duration: Infinity,
    });

    try {
      const params = new URLSearchParams();
      if (startDate) {
        params.append('startDate', startDate.toISOString());
      }
      if (endDate) {
        params.append('endDate', endDate.toISOString());
      }

      const url = `/api/backup/storage${params.toString() ? `?${params.toString()}` : ''}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 180000);

      let response;
      try {
        response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          signal: controller.signal
        });
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('La descarga tardó demasiado tiempo (más de 3 minutos). Intenta con un rango de fechas más pequeño.');
        }
        throw new Error('Error de red. Verifica tu conexión a internet e intenta nuevamente.');
      }

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('Response not OK:', response.status, response.statusText);
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server error: ${response.status}`);
          } catch (jsonError) {
            throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
          }
        } else {
          try {
            const errorText = await response.text();
            console.error('Server error response:', errorText);
            throw new Error(`Error del servidor (${response.status}): ${errorText.substring(0, 100)}`);
          } catch {
            throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
          }
        }
      }

      if (!response.body) {
        throw new Error('El servidor no envió ningún archivo');
      }

      const contentType = response.headers.get('content-type');
      console.log('Response content-type:', contentType);
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Respuesta inesperada del servidor');
        } catch (e: any) {
          if (e.message) {
            throw e;
          }
          throw new Error('Respuesta inesperada del servidor');
        }
      }

      if (contentType && !contentType.includes('application/zip') && !contentType.includes('application/octet-stream')) {
        console.warn('Unexpected content type:', contentType);
        throw new Error(`Tipo de archivo inesperado: ${contentType}. Se esperaba un archivo ZIP.`);
      }

      let blob;
      try {
        blob = await response.blob();
        console.log('Blob created successfully:', blob.size, 'bytes, type:', blob.type);
      } catch (blobError: any) {
        console.error('Error converting response to blob:', blobError);
        console.error('Blob error details:', {
          name: blobError?.name,
          message: blobError?.message,
          stack: blobError?.stack
        });
        throw new Error('Error al procesar el archivo descargado. El servidor puede haber enviado datos corruptos.');
      }

      if (!blob) {
        throw new Error('No se pudo crear el archivo de respaldo');
      }

      if (blob.size === 0) {
        throw new Error('El archivo de respaldo está vacío. Puede que no haya archivos en el rango de fechas seleccionado.');
      }

      if (blob.type && blob.type !== 'application/zip' && blob.type !== 'application/octet-stream' && blob.type !== '') {
        console.warn('Blob type mismatch:', blob.type);
        throw new Error(`Tipo de archivo incorrecto: ${blob.type}`);
      }

      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      
      let filename = `storage_backup_${new Date().toISOString().split('T')[0]}`;
      if (startDate || endDate) {
        const dateRange = `${startDate ? startDate.toISOString().split('T')[0] : 'inicio'}_a_${endDate ? endDate.toISOString().split('T')[0] : 'fin'}`;
        filename = `storage_backup_${dateRange}`;
      }
      a.download = `${filename}.zip`;
      
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      }, 100);

      toastId.dismiss?.();

      toast({
        title: "Respaldo descargado",
        description: `Archivo descargado exitosamente (${(blob.size / 1024 / 1024).toFixed(2)} MB)`,
      });
    } catch (error: any) {
      console.error('Error downloading backup:', error);
      console.error('Error details:', {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
        type: typeof error
      });

      toastId.dismiss?.();

      let errorMessage = "No se pudo descargar el respaldo de archivos.";
      let errorDescription = "";

      if (error.name === 'AbortError') {
        errorMessage = "Tiempo de espera agotado";
        errorDescription = "La descarga tardó más de 3 minutos. Intenta con un rango de fechas más pequeño o descarga sin filtro de fechas.";
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = "Error de conexión";
        errorDescription = "No se pudo conectar con el servidor. Verifica tu conexión a internet e intenta nuevamente.";
      } else if (error.message.includes('blob') || error.message.includes('procesar')) {
        errorMessage = "Error al procesar el archivo";
        errorDescription = error.message + " Intenta nuevamente o contacta al administrador si el problema persiste.";
      } else if (error.message.includes('servidor')) {
        errorMessage = "Error del servidor";
        errorDescription = error.message;
      } else if (error.message) {
        errorMessage = error.message;
        if (error.message.length > 60) {
          errorDescription = error.message;
          errorMessage = "Error al descargar respaldo";
        }
      }

      toast({
        title: errorMessage,
        description: errorDescription || "Intenta nuevamente o contacta al administrador si el problema persiste.",
        variant: "destructive",
        duration: 10000,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <NavigationHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Respaldos de Sistema</h2>
          <p className="text-muted-foreground">Gestiona y descarga respaldos de los archivos del sistema</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Respaldo de Archivos
              </CardTitle>
              <CardDescription>
                Descarga un archivo ZIP con todos los archivos almacenados (imágenes, PDFs, documentos adjuntos)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Fecha de inicio (opcional)</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Fecha de fin (opcional)</label>
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
                        {endDate ? format(endDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {(startDate || endDate) && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    Se descargarán solo los archivos subidos {startDate && `desde ${format(startDate, "PPP", { locale: es })}`}
                    {startDate && endDate && " "}
                    {endDate && `hasta ${format(endDate, "PPP", { locale: es })}`}
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={handleBackupDownload} 
                  disabled={isDownloading}
                  className="gap-2"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creando respaldo...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Descargar Respaldo
                    </>
                  )}
                </Button>

                {(startDate || endDate) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStartDate(undefined);
                      setEndDate(undefined);
                    }}
                  >
                    Limpiar fechas
                  </Button>
                )}
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Información importante:</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>El respaldo puede tardar varios minutos dependiendo del tamaño</li>
                  <li>Los archivos se organizarán por carpetas según su tipo</li>
                  <li>Si no seleccionas fechas, se descargarán TODOS los archivos</li>
                  <li>El archivo descargado será un ZIP comprimido</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
