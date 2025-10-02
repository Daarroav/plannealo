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

      // Check response status
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to download backup');
          } catch (jsonError) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
          }
        } else {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      // Verify we have a response body
      if (!response.body) {
        throw new Error('No response body received from server');
      }

      // Get the blob with error handling
      let blob;
      try {
        blob = await response.blob();
      } catch (blobError: any) {
        console.error('Error converting response to blob:', blobError);
        throw new Error('Error al procesar el archivo descargado');
      }

      console.log('Blob received:', blob.size, 'bytes, type:', blob.type);

      if (!blob || blob.size === 0) {
        throw new Error('Received empty file from server');
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
        stack: error?.stack
      });

      // Close loading toast
      toastId.dismiss?.();

      let errorMessage = "No se pudo descargar el respaldo de archivos.";

      if (error.name === 'AbortError') {
        errorMessage = "La descarga tardó demasiado tiempo (más de 3 minutos). Intenta con un rango de fechas más pequeño.";
      } else if (error.message.includes('network') || error.message.includes('Failed to fetch') || error.message.includes('conexión')) {
        errorMessage = "Error de red. Verifica tu conexión a internet e intenta nuevamente.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error al descargar",
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
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