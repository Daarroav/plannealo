import { useState, useEffect } from "react";
import { NavigationHeader } from "@/components/ui/navigation-header";
import { StatsCard } from "@/components/ui/stats-card";
import { Plane } from "lucide-react";
import type { Travel } from "@shared/schema";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

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
  const [stats, setStats] = useState<TravelStats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/reports");
        if (!res.ok) throw new Error("Error fetching reports");
        const data: TravelStats = await res.json();
        setStats(data);
        console.info(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchStats();
  }, []);

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
          {/* <Button 
              onClick={() => navigate("/clients/new")}
              className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Cliente</span>
            </Button> */}
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