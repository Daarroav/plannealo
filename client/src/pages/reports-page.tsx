import { useState, useEffect } from "react";
import { NavigationHeader } from "@/components/ui/navigation-header";
import { StatsCard } from "@/components/ui/stats-card";
import { Plane, Download, Loader2 } from "lucide-react";
import type { Travel } from "@shared/schema";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

ChartJS.register(ArcElement, Tooltip, Legend);


interface TravelStats {
  totalTravels: number;
  publishedTravels: number;
  draftTravels: number;
  cancelledTravels: number;
  sentTravels: number;
  completedTravels: number;
  totalClients: number; // si lo tienes disponible en la API
  travels?: Travel[]; // opcional, si quieres pasar el listado completo
}


export default function ReportsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/reports"],
  });
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
      // Build query parameters for date filter
      const params = new URLSearchParams();
      if (startDate) {
        params.append('startDate', startDate.toISOString());
      }
      if (endDate) {
        params.append('endDate', endDate.toISOString());
      }

      const url = `/api/backup/storage${params.toString() ? `?${params.toString()}` : ''}`;
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minutes

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

      // Check response status first
      if (!response.ok) {
        console.error('Response not OK:', response.status, response.statusText);
        
        // Try to get error details from response
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server error: ${response.status}`);
          } catch (jsonError) {
            throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
          }
        } else {
          // Try to read as text for better error messages
          try {
            const errorText = await response.text();
            console.error('Server error response:', errorText);
            throw new Error(`Error del servidor (${response.status}): ${errorText.substring(0, 100)}`);
          } catch {
            throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
          }
        }
      }

      // Verify we have a response body
      if (!response.body) {
        throw new Error('El servidor no envió ningún archivo');
      }

      // Validate content type before trying to read as blob
      const contentType = response.headers.get('content-type');
      console.log('Response content-type:', contentType);
      
      if (contentType && contentType.includes('application/json')) {
        // This might be an error response that passed the OK check
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

      // Verify it's a zip file
      if (contentType && !contentType.includes('application/zip') && !contentType.includes('application/octet-stream')) {
        console.warn('Unexpected content type:', contentType);
        throw new Error(`Tipo de archivo inesperado: ${contentType}. Se esperaba un archivo ZIP.`);
      }

      // Get the blob with proper error handling
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

      // Validate blob
      if (!blob) {
        throw new Error('No se pudo crear el archivo de respaldo');
      }

      if (blob.size === 0) {
        throw new Error('El archivo de respaldo está vacío. Puede que no haya archivos en el rango de fechas seleccionado.');
      }

      // Additional validation: check if blob is actually a zip file
      if (blob.type && blob.type !== 'application/zip' && blob.type !== 'application/octet-stream' && blob.type !== '') {
        console.warn('Blob type mismatch:', blob.type);
        throw new Error(`Tipo de archivo incorrecto: ${blob.type}`);
      }

      // Create download link
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      
      // Generate filename
      let filename = `storage_backup_${new Date().toISOString().split('T')[0]}`;
      if (startDate || endDate) {
        const dateRange = `${startDate ? startDate.toISOString().split('T')[0] : 'inicio'}_a_${endDate ? endDate.toISOString().split('T')[0] : 'fin'}`;
        filename = `storage_backup_${dateRange}`;
      }
      a.download = `${filename}.zip`;
      
      document.body.appendChild(a);
      a.click();

      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      }, 100);

      // Close loading toast
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

      // Close loading toast
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
        // Extract more context if available
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


  if (!stats) return <p>Cargando...</p>; // <-- Aquí prevenimos el error

  const data = {
    labels: ["Publicados", "Enviados", "Cancelados", "Concluidos"],
    datasets: [
      {
        label: "Viajes",
        data: [
          stats?.publishedTravels,
          stats?.sentTravels,
          stats?.cancelledTravels,
          stats?.completedTravels,
        ],
        backgroundColor: ["#93c5fd", "#fde047", "#fca5a5", "#86efac"],
        hoverOffset: 8,
      },
    ],
  };

  if (!stats) return <p>Sin datos...</p>;

  return (

    <div className="min-h-screen bg-muted/30">
    <NavigationHeader />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="p-6">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Reportes</h2>
            <p className="text-muted-foreground">Visualiza y administra los clientes de tus viajes</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP", { locale: es }) : "Fecha inicio"}
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

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP", { locale: es }) : "Fecha fin"}
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

            <Button 
              onClick={handleBackupDownload} 
              disabled={isDownloading}
              variant="outline"
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
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

        <StatsCard
            title="Viajes Publicados"
            value={stats?.publishedTravels || 0}
            icon={Plane}
            iconBgColor="bg-blue-100"
            iconTextColor="text-blue-600"
        />

        {/* <StatsCard
            title="Viajes Borradores"
            value={stats?.draftTravels || 0}
            icon={Plane}
            iconBgColor="bg-yellow-100"
            iconTextColor="text-yellow-600"
        /> */}
        <StatsCard
            title="Viajes Cancelados"
            value={stats?.cancelledTravels || 0}
            icon={Plane}
            iconBgColor="bg-red-100"
            iconTextColor="text-red-600"
        />

        <StatsCard
            title="Viajes Enviados"
            value={stats?.sentTravels || 0}
            icon={Plane}
            iconBgColor="bg-yellow-100"
            iconTextColor="text-yellow-600"
        />

        <StatsCard
            title="Viajes Concluidos"
            value={stats?.completedTravels || 0}
            icon={Plane}
            iconBgColor="bg-green-100"
            iconTextColor="text-green-600"
        />
        </div>



    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <h2 className="text-center font-bold text-lg mb-4">Estado de los Viajes</h2>
      <Pie data={data} />
    </div>
    </div>
    </div>
    </div>
  );
}