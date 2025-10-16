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
import { Plane, Users, Clock, Plus, Search, Grid3X3, Calendar } from "lucide-react";
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
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      const selectedImage = data._selectedImage;

      // First create the travel
      const response = await apiRequest("POST", "/api/travels", {
        name: data.name,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        travelers: data.travelers,
      });
      const travel = await response.json();

      // If there's a selected image, upload it
      if (selectedImage) {
        try {
          // Get upload URL
          const uploadResponse = await apiRequest("POST", "/api/objects/upload", {});
          const { uploadURL } = await uploadResponse.json();

          // Upload the image to object storage
          const uploadResult = await fetch(uploadURL, {
            method: 'PUT',
            body: selectedImage,
            headers: {
              'Content-Type': selectedImage.type,
            },
          });

          if (uploadResult.ok) {
            // Update travel with cover image
            await apiRequest("PUT", `/api/travels/${travel.id}/cover-image`, {
              coverImageURL: uploadURL,
            });
          }
        } catch (error) {
          console.error("Error uploading cover image:", error);
          // Don't fail the whole operation if image upload fails
        }
      }

      return travel;
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

  // Helper function to determine if a travel is past
  const isPastTravel = (travel: Travel) => {
    const endDate = new Date(travel.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return endDate < today;
  };

  const filteredTravels = travels.filter(travel => {
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
  });

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
              <h2 className="text-3xl font-bold text-foreground mb-2">Gestión de Viajes</h2>
              <p className="text-muted-foreground">Crea y administra los itinerarios de tus clientes</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button 
                onClick={() => setIsNewTravelModalOpen(true)}
                className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Viaje</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Viajes Publicados"
            value={stats?.activeTrips || 0}
            icon={Plane}
            iconBgColor="bg-green-100"
            iconTextColor="text-green-600"
          />
          <StatsCard
            title="Clientes"
            value={stats?.clients || 0}
            icon={Users}
            iconBgColor="bg-blue-100"
            iconTextColor="text-blue-600"
          />
          <StatsCard
            title="Borradores"
            value={stats?.drafts || 0}
            icon={Clock}
            iconBgColor="bg-yellow-100"
            iconTextColor="text-yellow-600"
          />
        </div>

        {/* Travels Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-background rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                  <h3 className="text-lg font-semibold text-foreground">Gestión de Itinerarios</h3>
                  <TabsList className="grid w-fit grid-cols-2">
                    <TabsTrigger value="list" className="flex items-center gap-2">
                      <Grid3X3 className="h-4 w-4" />
                      Lista
                    </TabsTrigger>
                    <TabsTrigger value="calendar" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Calendario
                    </TabsTrigger>
                  </TabsList>
                </div>

                {activeTab === "list" && (
                  <div className="flex space-x-3">
                    <div className="relative">
                      <Input
                        placeholder="Buscar viajes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2"
                      />
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px]">
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
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron viajes</h3>
                    <p className="text-muted-foreground mb-6">
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