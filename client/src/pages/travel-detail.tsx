import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { NavigationHeader } from "@/components/ui/navigation-header";
import { AccommodationFormModal } from "@/components/ui/accommodation-form-modal";
import { ActivityFormModal } from "@/components/ui/activity-form-modal";
import { FlightFormModal } from "@/components/ui/flight-form-modal";
import { TransportFormModal } from "@/components/ui/transport-form-modal";
import { CruiseFormModal } from "@/components/ui/cruise-form-modal";
import { InsuranceFormModal } from "@/components/ui/insurance-form-modal";
import { NoteFormModal } from "@/components/ui/note-form-modal";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Bed, MapPin, Plane, Car, Ship, Shield, FileText, StickyNote, Eye, EyeOff, Plus, Edit } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Travel, Accommodation, Activity, Flight, Transport, Cruise, Insurance, Note } from "@shared/schema";

export default function TravelDetail() {
  const [, params] = useRoute("/travel/:id");
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("accommodations");
  const [showAccommodationModal, setShowAccommodationModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [showCruiseModal, setShowCruiseModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
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

  const { data: cruises = [] } = useQuery<Cruise[]>({
    queryKey: ["/api/travels", travelId, "cruises"],
    enabled: !!travelId,
  });

  const { data: insurances = [] } = useQuery<Insurance[]>({
    queryKey: ["/api/travels", travelId, "insurances"],
    enabled: !!travelId,
  });

  const { data: notes = [] } = useQuery<Note[]>({
    queryKey: ["/api/travels", travelId, "notes"],
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

  const createAccommodationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", `/api/travels/${travelId}/accommodations`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "accommodations"] });
      setShowAccommodationModal(false);
      toast({
        title: "Alojamiento agregado",
        description: "El alojamiento ha sido agregado exitosamente al viaje.",
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

  const createActivityMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", `/api/travels/${travelId}/activities`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "activities"] });
      setShowActivityModal(false);
      toast({
        title: "Actividad agregada",
        description: "La actividad ha sido agregada exitosamente al viaje.",
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

  const createFlightMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", `/api/travels/${travelId}/flights`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "flights"] });
      setShowFlightModal(false);
      toast({
        title: "Vuelo agregado",
        description: "El vuelo ha sido agregado exitosamente al viaje.",
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

  const createTransportMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", `/api/travels/${travelId}/transports`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "transports"] });
      setShowTransportModal(false);
      toast({
        title: "Transporte agregado",
        description: "El transporte ha sido agregado exitosamente al viaje.",
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

  const createCruiseMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Sending cruise data:", data);
      const response = await apiRequest("POST", `/api/travels/${travelId}/cruises`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "cruises"] });
      setShowCruiseModal(false);
      toast({
        title: "Crucero agregado",
        description: "El crucero ha sido agregado exitosamente al viaje.",
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

  const createInsuranceMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Sending insurance data:", data);
      const response = await apiRequest("POST", `/api/travels/${travelId}/insurances`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "insurances"] });
      setShowInsuranceModal(false);
      toast({
        title: "Seguro agregado",
        description: "Las notas del seguro han sido agregadas exitosamente al viaje.",
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

  const createNoteMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Sending note data:", data);
      const response = await apiRequest("POST", `/api/travels/${travelId}/notes`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "notes"] });
      setShowNoteModal(false);
      toast({
        title: "Nota agregada",
        description: "La nota ha sido agregada exitosamente al viaje.",
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

  // Handlers for editing
  const handleEditAccommodation = (accommodation: Accommodation) => {
    // Logic to open modal and pre-fill form with accommodation data
    console.log("Editing accommodation:", accommodation);
    // For now, just logging. In a real app, you'd open a modal and set state for editing.
  };

  const handleEditActivity = (activity: Activity) => {
    // Logic to open modal and pre-fill form with activity data
    console.log("Editing activity:", activity);
    // For now, just logging. In a real app, you'd open a modal and set state for editing.
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
            <Button onClick={() => setLocation("/")}>
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
    { id: "cruises", label: "Cruceros", icon: Ship, count: cruises.length },
    { id: "insurances", label: "Notas de Seguro", icon: Shield, count: insurances.length },
    { id: "notes", label: "Notas", icon: StickyNote, count: notes.length },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <NavigationHeader />
      {/* Travel Detail Header */}
      <div className="bg-background border-b border-border sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
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
                  <Button
                    className="bg-accent hover:bg-accent/90"
                    onClick={() => setShowAccommodationModal(true)}
                  >
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
                        <Button
                          className="bg-accent hover:bg-accent/90"
                          onClick={() => setShowAccommodationModal(true)}
                        >
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
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditAccommodation(accommodation)}
                            >
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
                              <p className="font-semibold text-[#040424]">{accommodation.price || "No especificado"}</p>
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
                  <Button
                    className="bg-accent hover:bg-accent/90"
                    onClick={() => setShowActivityModal(true)}
                  >
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
                        <Button
                          className="bg-accent hover:bg-accent/90"
                          onClick={() => setShowActivityModal(true)}
                        >
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
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditActivity(activity)}
                            >
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
                  <Button 
                    className="bg-accent hover:bg-accent/90"
                    onClick={() => setShowFlightModal(true)}
                  >
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
                        <Button 
                          className="bg-accent hover:bg-accent/90"
                          onClick={() => setShowFlightModal(true)}
                        >
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
                  <Button 
                    className="bg-accent hover:bg-accent/90"
                    onClick={() => setShowTransportModal(true)}
                  >
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
                        <Button 
                          className="bg-accent hover:bg-accent/90"
                          onClick={() => setShowTransportModal(true)}
                        >
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
                              <p className="text-sm font-medium text-foreground">Fecha Recogida</p>
                              <p className="text-muted-foreground">{formatDateTime(transport.pickupDate)}</p>
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

            {/* Cruises Section */}
            {activeSection === "cruises" && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Cruceros</h2>
                  <Button 
                    className="bg-accent hover:bg-accent/90"
                    onClick={() => setShowCruiseModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Crucero
                  </Button>
                </div>

                <div className="space-y-6">
                  {cruises.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Ship className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">
                          No hay cruceros planificados
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          Agrega información sobre cruceros para este viaje.
                        </p>
                        <Button onClick={() => setShowCruiseModal(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Primer Crucero
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    cruises.map((cruise) => (
                      <Card key={cruise.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Ship className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-foreground">{cruise.cruiseLine}</h3>
                                <p className="text-muted-foreground">Crucero</p>
                                {cruise.confirmationNumber && <p className="text-sm text-muted-foreground">#{cruise.confirmationNumber}</p>}
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-foreground">Salida</h4>
                              <div>
                                <p className="text-sm text-muted-foreground">Fecha y Hora</p>
                                <p className="font-medium">{formatDateTime(cruise.departureDate, true)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Puerto</p>
                                <p className="font-medium">{cruise.departurePort}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-foreground">Llegada</h4>
                              <div>
                                <p className="text-sm text-muted-foreground">Fecha y Hora</p>
                                <p className="font-medium">{formatDateTime(cruise.arrivalDate, true)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Puerto</p>
                                <p className="font-medium">{cruise.arrivalPort}</p>
                              </div>
                            </div>
                          </div>

                          {cruise.notes && (
                            <div className="border-t border-border pt-4">
                              <p className="text-sm font-medium text-foreground mb-2">Notas</p>
                              <p className="text-muted-foreground text-sm">{cruise.notes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </section>
            )}

            {/* Insurance Section */}
            {activeSection === "insurances" && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Notas de Seguro</h2>
                  <Button 
                    className="bg-accent hover:bg-accent/90"
                    onClick={() => setShowInsuranceModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Seguro
                  </Button>
                </div>

                <div className="space-y-6">
                  {insurances.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">
                          No hay seguros registrados
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          Agrega información sobre los seguros de viaje.
                        </p>
                        <Button onClick={() => setShowInsuranceModal(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Primer Seguro
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    insurances.map((insurance) => (
                      <Card key={insurance.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-green-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-foreground">{insurance.provider}</h3>
                                <p className="text-muted-foreground">{insurance.policyType}</p>
                                <p className="text-sm text-muted-foreground">#{insurance.policyNumber}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-foreground">Vigencia</p>
                              <p className="text-muted-foreground">{formatDateTime(insurance.effectiveDate, true)}</p>
                            </div>
                            {insurance.emergencyNumber && (
                              <div>
                                <p className="text-sm font-medium text-foreground">Número de Emergencia</p>
                                <p className="text-muted-foreground">{insurance.emergencyNumber}</p>
                              </div>
                            )}
                          </div>

                          {(insurance.importantInfo || insurance.policyDescription) && (
                            <div className="border-t border-border pt-4 space-y-3">
                              {insurance.importantInfo && (
                                <div>
                                  <p className="text-sm font-medium text-foreground">Información Importante</p>
                                  <p className="text-muted-foreground text-sm">{insurance.importantInfo}</p>
                                </div>
                              )}
                              {insurance.policyDescription && (
                                <div>
                                  <p className="text-sm font-medium text-foreground">Descripción de la Política</p>
                                  <p className="text-muted-foreground text-sm">{insurance.policyDescription}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {insurance.attachments && insurance.attachments.length > 0 && (
                            <div className="border-t border-border pt-4">
                              <p className="text-sm font-medium text-foreground mb-2">Archivos Adjuntos</p>
                              <div className="space-y-1">
                                {insurance.attachments.map((fileName, index) => (
                                  <div key={index} className="flex items-center space-x-2 text-sm">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">{fileName}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {insurance.notes && (
                            <div className="border-t border-border pt-4 mt-4">
                              <p className="text-sm font-medium text-foreground mb-2">Notas</p>
                              <p className="text-muted-foreground text-sm">{insurance.notes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </section>
            )}

            {/* Notes Section */}
            {activeSection === "notes" && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Notas</h2>
                  <Button 
                    className="bg-accent hover:bg-accent/90"
                    onClick={() => setShowNoteModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Nota
                  </Button>
                </div>

                <div className="space-y-6">
                  {notes.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <StickyNote className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">
                          No hay notas registradas
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          Agrega notas importantes sobre el viaje.
                        </p>
                        <Button onClick={() => setShowNoteModal(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Primera Nota
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    notes.map((note) => (
                      <Card key={note.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <StickyNote className="w-6 h-6 text-yellow-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-foreground">{note.title}</h3>
                                <p className="text-muted-foreground">{formatDateTime(note.noteDate)}</p>
                                
                                {/* Indicador de visibilidad */}
                                <div className="flex items-center space-x-2 mt-2">
                                  {note.visibleToTravelers ? (
                                    <>
                                      <Eye className="w-4 h-4 text-green-600" />
                                      <span className="text-sm font-medium text-green-600">
                                        Visible para viajeros
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <EyeOff className="w-4 h-4 text-gray-600" />
                                      <span className="text-sm font-medium text-gray-600">
                                        Solo para agentes
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Contenido de la nota */}
                          <div className="mt-4 p-4 bg-muted/20 rounded-lg border-l-4 border-accent">
                            <p className="text-foreground whitespace-pre-wrap">{note.content}</p>
                          </div>

                          {/* Documentos adjuntos */}
                          {note.attachments && note.attachments.length > 0 && (
                            <div className="mt-4 border-t border-border pt-4">
                              <p className="text-sm font-medium text-foreground mb-2">Documentos Adjuntos</p>
                              <div className="space-y-1">
                                {note.attachments.map((fileName, index) => (
                                  <div key={index} className="flex items-center space-x-2 text-sm">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">{fileName}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
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
      {/* Accommodation Form Modal */}
      <AccommodationFormModal
        isOpen={showAccommodationModal}
        onClose={() => setShowAccommodationModal(false)}
        onSubmit={createAccommodationMutation.mutate}
        isLoading={createAccommodationMutation.isPending}
        travelId={travelId!}
      />

      {/* Activity Form Modal */}
      <ActivityFormModal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        onSubmit={createActivityMutation.mutate}
        isLoading={createActivityMutation.isPending}
        travelId={travelId!}
      />

      {/* Flight Form Modal */}
      <FlightFormModal
        isOpen={showFlightModal}
        onClose={() => setShowFlightModal(false)}
        onSubmit={createFlightMutation.mutate}
        isLoading={createFlightMutation.isPending}
        travelId={travelId!}
      />

      {/* Transport Form Modal */}
      <TransportFormModal
        isOpen={showTransportModal}
        onClose={() => setShowTransportModal(false)}
        onSubmit={createTransportMutation.mutate}
        isLoading={createTransportMutation.isPending}
        travelId={travelId!}
      />

      {/* Cruise Form Modal */}
      <CruiseFormModal
        open={showCruiseModal}
        onOpenChange={setShowCruiseModal}
        onSubmit={createCruiseMutation.mutate}
        isPending={createCruiseMutation.isPending}
      />

      {/* Insurance Form Modal */}
      <InsuranceFormModal
        open={showInsuranceModal}
        onOpenChange={setShowInsuranceModal}
        onSubmit={createInsuranceMutation.mutate}
        isPending={createInsuranceMutation.isPending}
      />

      {/* Note Form Modal */}
      <NoteFormModal
        open={showNoteModal}
        onOpenChange={setShowNoteModal}
        onSubmit={createNoteMutation.mutate}
        isPending={createNoteMutation.isPending}
      />
    </div>
  );
}