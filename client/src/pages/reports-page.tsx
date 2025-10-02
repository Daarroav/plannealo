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
    setIsDownloading(true);
    try {
      const response = await fetch('/api/backup/storage', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al crear el respaldo');
      }

      // Get the filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `storage_backup_${new Date().toISOString().slice(0, 10)}.zip`;

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Respaldo creado",
        description: "El archivo ZIP se ha descargado exitosamente",
      });
    } catch (error) {
      console.error('Error downloading backup:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el respaldo",
        variant: "destructive",
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