import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { NavigationHeader } from "@/components/ui/navigation-header";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Bed, MapPin, Plane, Car, Plus, Edit } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Travel, Accommodation, Activity, Flight, Transport } from "@shared/schema";

export default function TravelDetail() {
  const [, params] = useRoute("/travel/:id");
  const [activeSection, setActiveSection] = useState("accommodations");
  const { toast } = useToast();
  
  const travelId = params?.id;

  const { data: travel, isLoading: travelLoading } = useQuery<Travel>({
    queryKey: ["/api/travels", travelId],
    enabled: !!travelId,
  });

  const { data: accommodations = [] } = useQuery<Accommodation[]>({
    queryKey: ["/api/travels", travelId, "accommodations"],
    enabled: !!travelId,
  });

  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ["/api/travels", travelId, "activities"],
    enabled: !!travelId,
  });

  const { data: flights = [] } = useQuery<Flight[]>({
    queryKey: ["/api/travels", travelId, "flights"],
    enabled: !!travelId,
  });

  const { data: transports = [] } = useQuery<Transport[]>({
    queryKey: ["/api/travels", travelId, "transports"],
    enabled: !!travelId,
  });

  const publishTravelMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("PUT", `/api/travels/${travelId}`, {
        status: "published"
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId] });
      queryClient.invalidateQueries({ queryKey: ["/api/travels"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Viaje publicado",
        description: "El viaje ha sido publicado exitosamente.",
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

  const saveDraftMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("PUT", `/api/travels/${travelId}`, {
        status: "draft"
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Borrador guardado",
        description: "Los cambios han sido guardados como borrador.",
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

  const formatDateTime = (date: Date | string | null, includeTime = false) => {
    if (!date) return "";
    const dateObj = new Date(date);
    if (includeTime) {
      return format(dateObj, "dd MMM yyyy, HH:mm", { locale: es });
    }
    return format(dateObj, "dd MMM yyyy", { locale: es });
  };

  if (travelLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <NavigationHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-16 bg-muted rounded" />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted rounded" />
                ))}
              </div>
              <div className="lg:col-span-3 space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!travel) {
    return (
      <div className="min-h-screen bg-muted/30">
        <NavigationHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-2">Viaje no encontrado</h2>
            <p className="text-muted-foreground mb-6">
              El viaje que buscas no existe o no tienes permisos para verlo.
            </p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const navigationItems = [
    { id: "accommodations", label: "Alojamientos", icon: Bed, count: accommodations.length },
    { id: "activities", label: "Actividades", icon: MapPin, count: activities.length },
    { id: "flights", label: "Vuelos", icon: Plane, count: flights.length },
    { id: "transport", label: "Transporte", icon: Car, count: transports.length },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <NavigationHeader />
      
      {/* Travel Detail Header */}
      <div className="bg-background border-b border-border sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">{travel.name}</h1>
                <p className="text-sm text-muted-foreground">Cliente: {travel.clientName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant={travel.status === "published" ? "default" : "secondary"}>
                {travel.status === "published" ? "Publicado" : "Borrador"}
              </Badge>
              <Button 
                variant="outline"
                onClick={() => saveDraftMutation.mutate()}
                disabled={saveDraftMutation.isPending}
              >
                {saveDraftMutation.isPending ? "Guardando..." : "Guardar Borrador"}
              </Button>
              {travel.status !== "published" && (
                <Button 
                  className="bg-accent hover:bg-accent/90"
                  onClick={() => publishTravelMutation.mutate()}
                  disabled={publishTravelMutation.isPending}
                >
                  {publishTravelMutation.isPending ? "Publicando..." : "Publicar Viaje"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2 sticky top-32">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? "bg-accent/10 text-accent border-l-4 border-accent"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.count}
                  </Badge>
                </button>
              ))}
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Accommodations Section */}
            {activeSection === "accommodations" && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Alojamientos</h2>
                  <Button className="bg-accent hover:bg-accent/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Alojamiento
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {accommodations.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Bed className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No hay alojamientos</h3>
                        <p className="text-muted-foreground mb-6">Agrega el primer alojamiento para este viaje</p>
                        <Button className="bg-accent hover:bg-accent/90">
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Alojamiento
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    accommodations.map((accommodation) => (
                      <Card key={accommodation.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                                <Bed className="w-6 h-6 text-muted-foreground" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-foreground">{accommodation.name}</h3>
                                <p className="text-muted-foreground">{accommodation.type}</p>
                                <p className="text-sm text-muted-foreground">{accommodation.location}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-foreground">Check-in</p>
                              <p className="text-muted-foreground">{formatDateTime(accommodation.checkIn, true)}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Check-out</p>
                              <p className="text-muted-foreground">{formatDateTime(accommodation.checkOut, true)}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Habitación</p>
                              <p className="text-muted-foreground">{accommodation.roomType}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-foreground">Precio Total</p>
                              <p className="text-accent font-semibold">{accommodation.price || "No especificado"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Confirmación</p>
                              <p className="text-muted-foreground">{accommodation.confirmationNumber || "Pendiente"}</p>
                            </div>
                          </div>
                          
                          {accommodation.notes && (
                            <div className="border-t border-border pt-4">
                              <p className="text-sm font-medium text-foreground mb-2">Notas Especiales</p>
                              <p className="text-muted-foreground text-sm">{accommodation.notes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </section>
            )}

            {/* Activities Section */}
            {activeSection === "activities" && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Actividades y Tours</h2>
                  <Button className="bg-accent hover:bg-accent/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Actividad
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {activities.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No hay actividades</h3>
                        <p className="text-muted-foreground mb-6">Agrega la primera actividad para este viaje</p>
                        <Button className="bg-accent hover:bg-accent/90">
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Actividad
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    activities.map((activity) => (
                      <Card key={activity.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-foreground">{activity.name}</h3>
                                <p className="text-muted-foreground">{activity.type}</p>
                                {activity.provider && <p className="text-sm text-muted-foreground">Proveedor: {activity.provider}</p>}
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-foreground">Fecha</p>
                              <p className="text-muted-foreground">{formatDateTime(activity.date)}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Horario</p>
                              <p className="text-muted-foreground">
                                {activity.startTime && activity.endTime 
                                  ? `${activity.startTime} - ${activity.endTime}` 
                                  : "No especificado"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Confirmación</p>
                              <p className="text-muted-foreground">{activity.confirmationNumber || "Pendiente"}</p>
                            </div>
                          </div>
                          
                          {activity.conditions && (
                            <div className="border-t border-border pt-4">
                              <p className="text-sm font-medium text-foreground mb-2">Condiciones</p>
                              <p className="text-muted-foreground text-sm">{activity.conditions}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </section>
            )}

            {/* Flights Section */}
            {activeSection === "flights" && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Vuelos</h2>
                  <Button className="bg-accent hover:bg-accent/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Vuelo
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {flights.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No hay vuelos</h3>
                        <p className="text-muted-foreground mb-6">Agrega el primer vuelo para este viaje</p>
                        <Button className="bg-accent hover:bg-accent/90">
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Vuelo
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    flights.map((flight) => (
                      <Card key={flight.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                                <Plane className="w-6 h-6 text-green-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-foreground">
                                  {flight.departureCity} → {flight.arrivalCity}
                                </h3>
                                <p className="text-muted-foreground">{flight.airline}</p>
                                <p className="text-sm text-muted-foreground">Vuelo {flight.flightNumber}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-foreground">Salida</p>
                              <p className="text-muted-foreground">{formatDateTime(flight.departureDate, true)}</p>
                              {flight.departureTerminal && (
                                <p className="text-sm text-muted-foreground">{flight.departureTerminal}</p>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Llegada</p>
                              <p className="text-muted-foreground">{formatDateTime(flight.arrivalDate, true)}</p>
                              {flight.arrivalTerminal && (
                                <p className="text-sm text-muted-foreground">{flight.arrivalTerminal}</p>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Clase</p>
                              <p className="text-muted-foreground">{flight.class}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Reserva</p>
                              <p className="text-muted-foreground">{flight.reservationNumber}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </section>
            )}

            {/* Transport Section */}
            {activeSection === "transport" && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Transporte Local</h2>
                  <Button className="bg-accent hover:bg-accent/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Transporte
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {transports.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No hay transportes</h3>
                        <p className="text-muted-foreground mb-6">Agrega el primer transporte para este viaje</p>
                        <Button className="bg-accent hover:bg-accent/90">
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Transporte
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    transports.map((transport) => (
                      <Card key={transport.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Car className="w-6 h-6 text-orange-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-foreground">{transport.name}</h3>
                                <p className="text-muted-foreground">{transport.type}</p>
                                {transport.provider && <p className="text-sm text-muted-foreground">{transport.provider}</p>}
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-foreground">Fecha Inicio</p>
                              <p className="text-muted-foreground">{formatDateTime(transport.startDate)}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Fecha Fin</p>
                              <p className="text-muted-foreground">{transport.endDate ? formatDateTime(transport.endDate) : "No especificado"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Confirmación</p>
                              <p className="text-muted-foreground">{transport.confirmationNumber || "Pendiente"}</p>
                            </div>
                          </div>
                          
                          <div className="border-t border-border pt-4">
                            <p className="text-sm font-medium text-foreground mb-2">Lugar de Recogida</p>
                            <p className="text-muted-foreground text-sm">{transport.pickupLocation}</p>
                            {transport.dropoffLocation && (
                              <>
                                <p className="text-sm font-medium text-foreground mb-2 mt-3">Lugar de Destino</p>
                                <p className="text-muted-foreground text-sm">{transport.dropoffLocation}</p>
                              </>
                            )}
                            {transport.notes && (
                              <>
                                <p className="text-sm font-medium text-foreground mb-2 mt-3">Notas</p>
                                <p className="text-muted-foreground text-sm">{transport.notes}</p>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
