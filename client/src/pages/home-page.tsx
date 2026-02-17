import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationHeader } from "@/components/ui/navigation-header";
import { StatsCard } from "@/components/ui/stats-card";
import { TravelCard } from "@/components/ui/travel-card";
import { NewTravelModal } from "@/components/ui/new-travel-modal";
import { CalendarView } from "@/components/ui/calendar-view";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Airplane, People, Time, Plus, Search, AppStore, Calendar } from "@icon-park/react";
import type { Travel } from "@shared/schema";

interface Stats {
  activeTrips: number;
  drafts: number;
  clients: number;
}

export default function HomePage() {
  const [isNewTravelModalOpen, setIsNewTravelModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("current");
  const [activeTab, setActiveTab] = useState("list");
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: travels = [], isLoading: travelsLoading } = useQuery<Travel[]>({
    queryKey: ["/api/travels"],
    staleTime: 1 * 60 * 1000, // 1 minute for travel list
    refetchOnWindowFocus: true,
  });

  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const createTravelMutation = useMutation({
    mutationFn: async (data: any) => {
      const { _selectedImage, ...travelData } = data;

      // Create FormData to include the image
      const formData = new FormData();

      // Add all travel data fields
      Object.keys(travelData).forEach(key => {
        formData.append(key, travelData[key]);
      });

      // Add cover image if provided
      if (_selectedImage) {
        formData.append('coverImage', _selectedImage);
      }

      // Send with fetch since we're using FormData
      const response = await fetch("/api/travels", {
        method: "POST",
        body: formData,
        credentials: "include", // Important for session cookies
      });

      if (!response.ok) {
        let errorMsg = 'Error al crear el viaje.';
        try {
          const errorData = await response.json();
          errorMsg = errorData?.message || errorMsg;
        } catch {
          // Si no es JSON, intenta como texto
          try {
            errorMsg = await response.text();
          } catch {}
        }
        throw new Error(errorMsg);
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setIsNewTravelModalOpen(false);
      toast({
        title: "Viaje creado",
        description: "El nuevo viaje ha sido creado exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const softDeleteTravelMutation = useMutation({
    mutationFn: async (travelId: string) => {
      const response = await fetch(`/api/travels/${travelId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "delete" }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al eliminar viaje");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Viaje eliminado",
        description: "El viaje ha sido eliminado correctamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Helper function to determine if a travel is past
  const isPastTravel = (travel: Travel) => {
    const endDate = new Date(travel.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return endDate < today;
  };

  const filteredTravels = travels
    .filter(travel => {
      // Excluir viajes con status = delete
      if (travel.status === "delete") {
        return false;
      }

      const matchesSearch = travel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           travel.clientName.toLowerCase().includes(searchTerm.toLowerCase());

      const isPast = isPastTravel(travel);

      let matchesStatus = false;
      if (statusFilter === "current") {
        // Actuales: viajes vigentes (publicados o borradores)
        matchesStatus = !isPast;
      } else if (statusFilter === "published") {
        // Publicados: solo publicados actuales
        matchesStatus = !isPast && travel.status === "published";
      } else if (statusFilter === "draft") {
        // Borradores: solo borradores actuales
        matchesStatus = !isPast && travel.status === "draft";
      } else if (statusFilter === "past") {
        // Pasados: todos los viajes pasados (cualquier estado)
        matchesStatus = isPast;
      }

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  console.log(filteredTravels);

  const handleEditTravel = (travelId: string) => {
    window.location.href = `/travel/${travelId}`;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <NavigationHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Mis viajes</h2>
              <p className="text-muted-foreground">Crea y administra los itinerarios de tus viajes</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="grid grid-cols-2 gap-3 order-2 sm:order-1 w-full sm:flex sm:flex-wrap sm:justify-start">
                <div className="w-full sm:w-52">
                  <StatsCard
                    title="Mis viajes publicados"
                    value={stats?.activeTrips || 0}
                    icon={Airplane}
                    iconBgColor="bg-secondary/10"
                    iconTextColor="text-secondary"
                    size="compact"
                  />
                </div>
                {(user?.role === "admin" || user?.role === "master") && (
                  <div className="w-full sm:w-52">
                    <StatsCard
                      title="Viajeros"
                      value={stats?.clients || 0}
                      icon={People}
                      iconBgColor="bg-primary/10"
                      iconTextColor="text-primary"
                      size="compact"
                    />
                  </div>
                )}
                <div className="w-full sm:w-52">
                  <StatsCard
                    title="Mis viajes en borrador"
                    value={stats?.drafts || 0}
                    icon={Time}
                    iconBgColor="bg-accent/10"
                    iconTextColor="text-accent"
                    size="compact"
                  />
                </div>
              </div>
              <Button
                onClick={() => setIsNewTravelModalOpen(true)}
                className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2 order-1 sm:order-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Viaje</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Travels Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-background rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <h3 className="text-lg font-semibold text-foreground">Gestión de Itinerarios</h3>
                  <TabsList className="grid w-fit grid-cols-2">
                    <TabsTrigger value="list" className="flex items-center gap-2">
                      <AppStore className="h-4 w-4" />
                      Lista
                    </TabsTrigger>
                    <TabsTrigger value="calendar" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Calendario
                    </TabsTrigger>
                  </TabsList>
                </div>

                {activeTab === "list" && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 sm:flex-initial">
                      <Input
                        placeholder="Buscar viajes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full"
                      />
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">Actuales</SelectItem>
                        <SelectItem value="published">Publicados</SelectItem>
                        <SelectItem value="draft">Borradores</SelectItem>
                        <SelectItem value="past">Pasados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <TabsContent value="list" className="mt-0">
                {travelsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border border-border rounded-lg overflow-hidden animate-pulse">
                        <div className="w-full h-48 bg-muted" />
                        <div className="p-4 space-y-3">
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                          <div className="h-3 bg-muted rounded w-2/3" />
                          <div className="h-8 bg-muted rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredTravels.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTravels.map((travel) => (
                      <TravelCard
                        key={travel.id}
                        travel={travel}
                        onEdit={handleEditTravel}
                        onDelete={(id) => softDeleteTravelMutation.mutate(id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center py-8 sm:py-12 px-4">
                    <Airplane className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">No se encontraron viajes</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6 max-w-sm">
                      {searchTerm || statusFilter !== "current" 
                        ? "Prueba con diferentes filtros de búsqueda" 
                        : "Comienza creando tu primer itinerario de viaje"}
                    </p>
                    <Button 
                      onClick={() => setIsNewTravelModalOpen(true)}
                      className="bg-accent hover:bg-accent/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Primer Viaje
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="calendar" className="mt-0">
                <CalendarView travels={travels} />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>

      <NewTravelModal
        travel={null}
        isOpen={isNewTravelModalOpen}
        onClose={() => setIsNewTravelModalOpen(false)}
        onSubmit={(data) => createTravelMutation.mutate(data)}
        isLoading={createTravelMutation.isPending}
      />
    </div>
  );
}