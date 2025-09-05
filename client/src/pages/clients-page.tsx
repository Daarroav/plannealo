import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { NavigationHeader } from "@/components/ui/navigation-header";
import { StatsCard } from "@/components/ui/stats-card";

import { Plane, Users, Clock, Plus, Search, Grid3X3, Calendar } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  lastActive: string;
  stats: {
    total: number;
    published: number;
    draft: number;
  };
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalTravels: 0,
    publishedTravels: 0,
    draftTravels: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/clients/stats");
        if (!response.ok) {
          throw new Error("Error al cargar los datos de clientes");
        }
        const data = await response.json();
        setClients(data.clients);
        setStats(data.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        console.error("Error fetching client stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-6">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Clientes</h2>
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
                    title="Clientes"
                    value={stats?.totalClients || 0}
                    icon={Users}
                    iconBgColor="bg-green-100"
                    iconTextColor="text-green-600"
                />

                <StatsCard
                    title="Viajes Totales"
                    value={stats?.totalTravels || 0}
                    icon={Plane}
                    iconBgColor="bg-blue-100"
                    iconTextColor="text-blue-600"
                />
                <StatsCard
                    title="Viajes Activos"
                    value={stats?.publishedTravels || 0}
                    icon={Plane}
                    iconBgColor="bg-green-100"
                    iconTextColor="text-green-600"
                />
             
                <StatsCard
                    title="Borradores"
                    value={stats?.draftTravels || 0}
                    icon={Clock}
                    iconBgColor="bg-yellow-100"
                    iconTextColor="text-yellow-600"
                />
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miembro desde</th>
             
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estadísticas</th>
                    
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">{client.name.charAt(0)}</span>
                            </div>
                            <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                            </div>
                        </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(client.joinedAt)}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {client.stats.total} total
                            </span>
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {client.stats.published} publicados
                            </span>
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            {client.stats.draft} borradores
                            </span>
                        </div>
                        </td>
                      
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
}