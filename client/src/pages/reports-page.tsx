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
  const { toast } = useToast();

  const handleBackupDownload = async () => {
    const toastId = toast({
      title: "Preparando respaldo...",
      description: "Esto puede tomar varios minutos dependiendo del tamaño.",
      duration: Infinity,
    });

    try {
      const response = await fetch('/api/backup/storage', {
        method: 'GET',
        credentials: 'include',
        signal: AbortSignal.timeout(180000) // 3 minutes timeout
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to download backup');
      }

      // Check if we got a blob/stream response
      if (!response.body) {
        throw new Error('No response body received');
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error('Received empty file');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `storage_backup_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
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

      // Close loading toast
      toastId.dismiss?.();

      let errorMessage = "No se pudo descargar el respaldo de archivos.";

      if (error.name === 'TimeoutError') {
        errorMessage = "La descarga tardó demasiado. Intenta nuevamente o contacta al soporte.";
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = "Error de conexión. Verifica tu internet e intenta nuevamente.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error al descargar",
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
      });
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
          <div className="mt-4 md:mt-0">
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
                  Descargar Respaldo de Archivos
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