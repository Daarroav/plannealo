import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
// components UI
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { NavigationHeader } from "@/components/ui/navigation-header";
import { AccommodationFormModal } from "@/components/ui/accommodation-form-modal";
import { ActivityFormModal } from "@/components/ui/activity-form-modal";
import { FlightFormModal } from "@/components/ui/flight-form-modal";
import { TransportFormModal } from "@/components/ui/transport-form-modal";
import { ShareTravelModal } from "@/components/ui/share-travel-modal";
// components
import { ObjectUploader } from "@/components/ObjectUploader";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { NewTravelModal } from "@/components/ui/new-travel-modal";
// icons
import { ArrowLeft, Bed, MapPin, Plane, Car, Eye, EyeOff, Plus, Edit, Share, Camera } from "lucide-react";
// utils
import { format } from "date-fns";
import { es } from "date-fns/locale";
// schemas or types
import type { Travel, Accommodation, Activity, Flight, Transport } from "@shared/schema";

export default function TravelDetail() {
  const [, params] = useRoute("/travel/:id");
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("accommodations");
  const [showAccommodationModal, setShowAccommodationModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [editingTransport, setEditingTransport] = useState<Transport | null>(null);
  const { toast } = useToast();
  const [isNewTravelModalOpen, setIsNewTravelModalOpen] = useState(false);

  const travelId = params?.id;

  console.info("Travel ID:", travelId);

  const formatPhoneNumber = (phoneNumber: string) => {
    return phoneNumber.replace(/\D/g, '').replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
  };

  const updateTravelMutation = useMutation({
    mutationFn: async (data: any) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      const selectedImage = data._selectedImage;
      
      // First create the travel
      const response = await apiRequest("PUT", `/api/travels/${travelId}`, {
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
            await apiRequest("PUT", `/api/travels/${travelId}/cover-image`, {
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
        title: "Viaje actualizado",
        description: "El viaje ha sido actualizado exitosamente.",
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

  // Get travel details
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

  const updateCoverImageMutation = useMutation({
    mutationFn: async (coverImageURL: string) => {
      const response = await apiRequest("PUT", `/api/travels/${travelId}/cover-image`, {
        coverImageURL
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId] });
      queryClient.invalidateQueries({ queryKey: ["/api/travels"] });
      toast({
        title: "Imagen actualizada",
        description: "La imagen de portada ha sido actualizada exitosamente.",
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

  const getUploadParameters = async () => {
    const response = await apiRequest("POST", "/api/objects/upload", {});
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleImageUploadComplete = (result: any) => {
    if (result.successful && result.successful.length > 0) {
      const uploadURL = result.successful[0].uploadURL;
      updateCoverImageMutation.mutate(uploadURL);
    }
  };

  const createAccommodationMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingAccommodation) {
        // Handle FormData for file uploads in updates too
        let response;
        if (data instanceof FormData) {
          response = await fetch(`/api/accommodations/${editingAccommodation.id}`, {
            method: "PUT",
            credentials: "include",
            body: data,
          });
        } else {
          response = await apiRequest("PUT", `/api/accommodations/${editingAccommodation.id}`, data);
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error updating accommodation");
        }
        
        return await response.json();
      } else {
        // Handle FormData for file uploads
        let response;
        if (data instanceof FormData) {
          response = await fetch(`/api/travels/${travelId}/accommodations`, {
            method: "POST",
            credentials: "include",
            body: data,
          });
        } else {
          response = await apiRequest("POST", `/api/travels/${travelId}/accommodations`, data);
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error creating accommodation");
        }
        
        return await response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "accommodations"] });
      setShowAccommodationModal(false);
      setEditingAccommodation(null);
      toast({
        title: editingAccommodation ? "Alojamiento actualizado" : "Alojamiento agregado",
        description: editingAccommodation ? "El alojamiento ha sido actualizado exitosamente." : "El alojamiento ha sido agregado exitosamente al viaje.",
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
      if (editingActivity) {
        const response = await apiRequest("PUT", `/api/activities/${editingActivity.id}`, data);
        return await response.json();
      } else {
        const response = await apiRequest("POST", `/api/travels/${travelId}/activities`, data);
        return await response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "activities"] });
      setShowActivityModal(false);
      setEditingActivity(null);
      toast({
        title: editingActivity ? "Actividad actualizada" : "Actividad agregada",
        description: editingActivity ? "La actividad ha sido actualizada exitosamente." : "La actividad ha sido agregada exitosamente al viaje.",
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
      if (editingFlight) {
        const response = await apiRequest("PUT", `/api/flights/${editingFlight.id}`, data);
        return await response.json();
      } else {
        const response = await apiRequest("POST", `/api/travels/${travelId}/flights`, data);
        return await response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "flights"] });
      setShowFlightModal(false);
      setEditingFlight(null);
      toast({
        title: editingFlight ? "Vuelo actualizado" : "Vuelo agregado",
        description: editingFlight ? "El vuelo ha sido actualizado exitosamente." : "El vuelo ha sido agregado exitosamente al viaje.",
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
      if (editingTransport) {
        const response = await apiRequest("PUT", `/api/transports/${editingTransport.id}`, data);
        return await response.json();
      } else {
        const response = await apiRequest("POST", `/api/travels/${travelId}/transports`, data);
        return await response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "transports"] });
      setShowTransportModal(false);
      setEditingTransport(null);
      toast({
        title: editingTransport ? "Transporte actualizado" : "Transporte agregado",
        description: editingTransport ? "El transporte ha sido actualizado exitosamente." : "El transporte ha sido agregado exitosamente al viaje.",
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
      if (editingCruise) {
        const response = await apiRequest("PUT", `/api/cruises/${editingCruise.id}`, data);
        return await response.json();
      } else {
        const response = await apiRequest("POST", `/api/travels/${travelId}/cruises`, data);
        return await response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "cruises"] });
      setShowCruiseModal(false);
      setEditingCruise(null);
      toast({
        title: editingCruise ? "Crucero actualizado" : "Crucero agregado",
        description: editingCruise ? "El crucero ha sido actualizado exitosamente." : "El crucero ha sido agregado exitosamente al viaje.",
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
      if (editingInsurance) {
        const response = await apiRequest("PUT", `/api/insurances/${editingInsurance.id}`, data);
        return await response.json();
      } else {
        const response = await apiRequest("POST", `/api/travels/${travelId}/insurances`, data);
        return await response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "insurances"] });
      setShowInsuranceModal(false);
      setEditingInsurance(null);
      toast({
        title: editingInsurance ? "Seguro actualizado" : "Seguro agregado",
        description: editingInsurance ? "El seguro ha sido actualizado exitosamente." : "El seguro ha sido agregado exitosamente al viaje.",
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
      if (editingNote) {
        const response = await apiRequest("PUT", `/api/travels/${travelId}/notes/${editingNote.id}`, data);
        return await response.json();
      } else {
        const response = await apiRequest("POST", `/api/travels/${travelId}/notes`, data);
        return await response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "notes"] });
      setShowNoteModal(false);
      setEditingNote(null);
      toast({
        title: editingNote ? "Nota actualizada" : "Nota agregada",
        description: editingNote ? "La nota ha sido actualizada exitosamente." : "La nota ha sido agregada exitosamente al viaje.",
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

  const updateAccommodationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/accommodations/${editingAccommodation!.id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "accommodations"] });
      setShowAccommodationModal(false);
      setEditingAccommodation(null);
      toast({
        title: "Alojamiento actualizado",
        description: "El alojamiento ha sido actualizado exitosamente.",
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

  const updateActivityMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/activities/${editingActivity!.id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "activities"] });
      setShowActivityModal(false);
      setEditingActivity(null);
      toast({
        title: "Actividad actualizada",
        description: "La actividad ha sido actualizada exitosamente.",
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

  const updateFlightMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/flights/${editingFlight!.id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "flights"] });
      setShowFlightModal(false);
      setEditingFlight(null);
      toast({
        title: "Vuelo actualizado",
        description: "El vuelo ha sido actualizado exitosamente.",
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

  const updateTransportMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/transports/${editingTransport!.id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "transports"] });
      setShowTransportModal(false);
      setEditingTransport(null);
      toast({
        title: "Transporte actualizado",
        description: "El transporte ha sido actualizado exitosamente.",
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

  const updateCruiseMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/cruises/${editingCruise!.id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "cruises"] });
      setShowCruiseModal(false);
      setEditingCruise(null);
      toast({
        title: "Crucero actualizado",
        description: "El crucero ha sido actualizado exitosamente.",
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

  const updateInsuranceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/insurances/${editingInsurance!.id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "insurances"] });
      setShowInsuranceModal(false);
      setEditingInsurance(null);
      toast({
        title: "Seguro actualizado",
        description: "El seguro ha sido actualizado exitosamente.",
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


  const formatDateTime = (
    date: Date | string | null,
    includeTime = false,
    forceUTC = false
  ): string => {
    if (!date) return "";
  
    const d = new Date(date);
  
    // Formateamos por partes para controlar exactamente salida (dd MMM yyyy[, HH:mm])
    const dateFmt = new Intl.DateTimeFormat("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: forceUTC ? "UTC" : undefined,
    });
  
    const parts = dateFmt.formatToParts(d);
    const day = parts.find((p) => p.type === "day")?.value ?? "";
    let month = parts.find((p) => p.type === "month")?.value ?? "";
    const year = parts.find((p) => p.type === "year")?.value ?? "";
  
    // Normalizar abreviatura de mes a "sep" en vez de "sept." (si aparece)
    month = month.replace(/\./g, "").replace("sept", "sep").toLowerCase();
  
    let result = `${day} ${month} ${year}`;
  
    if (includeTime) {
      const timeParts = new Intl.DateTimeFormat("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: forceUTC ? "UTC" : undefined,
      }).formatToParts(d);
  
      const hour = timeParts.find((p) => p.type === "hour")?.value ?? "00";
      const minute = timeParts.find((p) => p.type === "minute")?.value ?? "00";
  
      result += `, ${hour}:${minute}`;
    }
  
    return result;
  };

  // Handlers for editing
  const handleEditAccommodation = (accommodation: Accommodation) => {
    setEditingAccommodation(accommodation);
    setShowAccommodationModal(true);
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setShowActivityModal(true);
  };

  const handleEditFlight = (flight: Flight) => {
    setEditingFlight(flight);
    setShowFlightModal(true);
  };

  const handleEditTransport = (transport: Transport) => {
    setEditingTransport(transport);
    setShowTransportModal(true);
  };

  const handleEditCruise = (cruise: Cruise) => {
    setEditingCruise(cruise);
    setShowCruiseModal(true);
  };

  const handleEditInsurance = (insurance: Insurance) => {
    setEditingInsurance(insurance);
    setShowInsuranceModal(true);
  };

  const handleEditNote = (note: Note) => {
    console.log("Editing note:", note);
    setEditingNote(note);
    setShowNoteModal(true);
  };

  const handleAddNote = () => {
    setEditingNote(null);
    setShowNoteModal(true);
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });
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
    { id: "insurances", label: "Seguro de Asistencia", icon: Shield, count: insurances.length },
    { id: "notes", label: "Notas", icon: StickyNote, count: notes.length },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <NavigationHeader />
      {/* Travel Detail Header */}
      <div className="bg-background border-b border-border sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row  justify-between h-auto gap-2 sm:h-16 pb-2 sm:pb-0">
            

            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">{travel.name}</h1>
                <p className="text-sm text-muted-foreground">Cliente: {travel.clientName}</p>
              </div>
            </div>

        

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end px-4 sm:px-0">
              <Badge variant={travel.status === "published" ? "default" : "secondary"}>
                {travel.status === "published" ? "Publicado" : "Borrador"}
              </Badge>
              <Button
                variant="outline"
                onClick={() => setShowShareModal(true)}
              >
                <Share className="w-4 h-4 mr-2" />
                Compartir
              </Button>
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

      {/* Travel Cover Image Section */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Imagen de Portada</h2>
            <ObjectUploader
              maxNumberOfFiles={1}
              maxFileSize={10485760} // 10MB
              onGetUploadParameters={getUploadParameters}
              onComplete={handleImageUploadComplete}
              buttonClassName="bg-accent hover:bg-accent/90 text-white"
            >
              <Camera className="w-4 h-4 mr-2" />
              Cambiar Imagen
            </ObjectUploader>
          </div>
          <div className="relative w-full h-64 lg:h-80 rounded-lg overflow-hidden bg-muted">
            <img
              src={travel.coverImage ? (travel.coverImage.startsWith('/objects/') ? `/api${travel.coverImage}` : travel.coverImage) : "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400"}
              alt={`Portada de ${travel.name}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400";
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{travel.name}</h3>
                <div className="flex items-center justify-between gap-3">
                <p className="text-lg opacity-90 ">Cliente: {travel.clientName} </p>
                  <div onClick={() => setIsNewTravelModalOpen(true)}>
                    <Edit className="w-6 h-6 mr-2 hover:text-red-500 bg-red-500 hover:bg-white  p-1 rounded-lg transition cursor-pointer" />
        
                  </div>
                </div>
                <p className="text-sm opacity-75 mt-1">
                  {formatDateTime(travel.startDate)} - {formatDateTime(travel.endDate)} • {travel.travelers} viajero{travel.travelers !== 1 ? 's' : ''}
                </p>
              </div>
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
                    onClick={() => {
                      setEditingAccommodation(null);
                      setShowAccommodationModal(true);
                    }}
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
                          onClick={() => {
                            setEditingAccommodation(null);
                            setShowAccommodationModal(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Alojamiento
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    accommodations.map((accommodation) => (
                      <Card key={accommodation.id} className="p-4 border-l-4 border-l-blue-500">
                        <div className="flex justify-between items-start gap-4">
                          {accommodation.thumbnail && (
                            <div className="flex-shrink-0">
                          
                              <img
                                src={accommodation.thumbnail.startsWith('/uploads/') ? accommodation.thumbnail : `/uploads/${accommodation.thumbnail}`}
                                alt={accommodation.name}
                                className="w-20 h-20 object-cover rounded-lg border"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{accommodation.type}</Badge>
                              <h4 className="font-semibold text-foreground">{accommodation.name}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{accommodation.location}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Check-in:</span> {formatDateTime(accommodation.checkIn, true)}
                              </div>
                              <div>
                                <span className="font-medium">Check-out:</span> {formatDateTime(accommodation.checkOut, true)}
                              </div>
                              <div>
                                <span className="font-medium">Habitación:</span> {accommodation.roomType || "N/A"}
                              </div>
                              <div>
                                <span className="font-medium">Precio:</span> {formatPrice(Number(accommodation.price))}
                              </div>
                            </div>
                            {accommodation.notes && (
                              <p className="text-sm text-muted-foreground mt-2 italic">{accommodation.notes}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditAccommodation(accommodation)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
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
                    onClick={() => {
                      setEditingActivity(null);
                      setShowActivityModal(true);
                    }}
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
                          onClick={() => {
                            setEditingActivity(null);
                            setShowActivityModal(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Actividad
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    activities.map((activity) => (
                      <Card key={activity.id} className="p-4 border-l-4 border-l-green-500">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{activity.type}</Badge>
                              <h4 className="font-semibold text-foreground">{activity.name}</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Fecha:</span> {formatDateTime(activity.date)}
                              </div>
                              <div>
                                <span className="font-medium">Proveedor:</span> {activity.provider || "N/A"}
                              </div>
                              <div>
                                <span className="font-medium">Inicio:</span> {activity.startTime || "N/A"}
                              </div>
                              <div>
                                <span className="font-medium">Fin:</span> {activity.endTime || "N/A"}
                              </div>
                              <div>
                                <span className="font-medium">Lugar de inicio:</span> {activity.placeStart || "N/A"}
                              </div>
                              <div>
                                <span className="font-medium">Lugar de fin:</span> {activity.placeEnd || "N/A"}
                              </div>
                             
                             <div>
                              <span className="font-medium">Contacto:</span> {activity.contactName || "N/A"}
                             </div>
                             <div>
                              <span className="font-medium">Teléfono contacto:</span> {activity.contactPhone ? formatPhoneNumber(activity.contactPhone) : "N/A"}
                             </div>
                            </div>
                          
                            
                            {activity.notes && (
                              <p className="text-sm text-muted-foreground mt-2 italic">{activity.notes}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditActivity(activity)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
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
                    onClick={() => {
                      setEditingFlight(null);
                      setShowFlightModal(true);
                    }}
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
                          onClick={() => {
                            setEditingFlight(null);
                            setShowFlightModal(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Vuelo
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    flights.map((flight) => (
                      <Card key={flight.id} className="p-4 border-l-4 border-l-purple-500">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">Vuelo</Badge>
                              <h4 className="font-semibold text-foreground">{flight.airline} {flight.flightNumber}</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Origen:</span> {flight.departureCity}
                              </div>
                              <div>
                                <span className="font-medium">Destino:</span> {flight.arrivalCity}
                              </div>
                              <div>
                                <span className="font-medium">Salida:</span> {formatDateTime(flight.departureDate, true)}
                              </div>
                              <div>
                                <span className="font-medium">Llegada:</span> {formatDateTime(flight.arrivalDate, true)}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditFlight(flight)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
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
                    onClick={() => {
                      setEditingTransport(null);
                      setShowTransportModal(true);
                    }}
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
                          onClick={() => {
                            setEditingTransport(null);
                            setShowTransportModal(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Transporte
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    transports.map((transport) => (
                      <Card key={transport.id} className="p-4 border-l-4 border-l-orange-500">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{transport.type}</Badge>
                              <h4 className="font-semibold text-foreground">{transport.name || transport.type}</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Origen:</span> {transport.pickupLocation}
                              </div>
                              <div>
                                <span className="font-medium">Destino:</span> {transport.dropoffLocation || "N/A"}
                              </div>
                              <div>
                                <span className="font-medium">Fecha/Hora:</span> {formatDateTime(transport.pickupDate, true)}
                              </div>
                              <div>
                                <span className="font-medium">Proveedor:</span> {transport.provider || "N/A"}
                              </div>
                            </div>
                            {transport.notes && (
                              <p className="text-sm text-muted-foreground mt-2 italic">{transport.notes}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTransport(transport)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
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
                    onClick={() => {
                      setEditingCruise(null);
                      setShowCruiseModal(true);
                    }}
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
                        <Button onClick={() => {
                          setEditingCruise(null);
                          setShowCruiseModal(true);
                        }}>
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Primer Crucero
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    cruises.map((cruise) => (
                      <Card key={cruise.id} className="p-4 border-l-4 border-l-cyan-500">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">Crucero</Badge>
                              <h4 className="font-semibold text-foreground">{cruise.cruiseLine}</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Naviera:</span> {cruise.cruiseLine}
                              </div>
                              <div>
                                <span className="font-medium">Destino:</span> {cruise.arrivalPort}
                              </div>
                              <div>
                                <span className="font-medium">Salida:</span> {formatDateTime(cruise.departureDate, true)}
                              </div>
                              <div>
                                <span className="font-medium">Regreso:</span> {formatDateTime(cruise.arrivalDate, true)}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCruise(cruise)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
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
                  <h2 className="text-2xl font-bold text-foreground">Seguro de Asistencia</h2>
                  <Button
                    className="bg-accent hover:bg-accent/90"
                    onClick={() => {
                      setEditingInsurance(null);
                      setShowInsuranceModal(true);
                    }}
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
                        <Button onClick={() => {
                          setEditingInsurance(null);
                          setShowInsuranceModal(true);
                        }}>
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Primer Seguro
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    insurances.map((insurance) => (
                      <Card key={insurance.id} className="p-4 border-l-4 border-l-red-500">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{insurance.policyType}</Badge>
                              <h4 className="font-semibold text-foreground">{insurance.provider}</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Póliza:</span> {insurance.policyNumber}
                              </div>
                              <div>
                                <span className="font-medium">Descripción:</span> {insurance.policyDescription || "N/A"}
                              </div>
                              <div>
                                <span className="font-medium">Vigencia:</span> {formatDateTime(insurance.effectiveDate, true)}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditInsurance(insurance)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
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
                    onClick={handleAddNote}
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
                        <Button onClick={handleAddNote}>
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Primera Nota
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    notes.map((note) => (
                      <Card key={note.id} className="p-4 border-l-4 border-l-gray-500">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={note.visibleToTravelers ? "default" : "secondary"}>
                                {note.visibleToTravelers ? "Visible" : "Interno"}
                              </Badge>
                              <h4 className="font-semibold text-foreground">{note.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Fecha: {formatDateTime(note.noteDate, false, true)}
                            </p>
                            <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditNote(note)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
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
        onClose={() => {
          setShowAccommodationModal(false);
          setEditingAccommodation(null);
        }}
        onSubmit={createAccommodationMutation.mutate}
        isLoading={createAccommodationMutation.isPending}
        travelId={travelId!}
        editingAccommodation={editingAccommodation}
      />

      {/* Activity Form Modal */}
      <ActivityFormModal
        isOpen={showActivityModal}
        onClose={() => {
          setShowActivityModal(false);
          setEditingActivity(null);
        }}
        onSubmit={createActivityMutation.mutate}
        isLoading={createActivityMutation.isPending}
        travelId={travelId!}
        editingActivity={editingActivity}
      />

      {/* Flight Form Modal */}
      <FlightFormModal
        isOpen={showFlightModal}
        onClose={() => {
          setShowFlightModal(false);
          setEditingFlight(null);
        }}
        onSubmit={createFlightMutation.mutate}
        isLoading={createFlightMutation.isPending}
        travelId={travelId!}
        editingFlight={editingFlight}
      />

      {/* Transport Form Modal */}
      <TransportFormModal
        isOpen={showTransportModal}
        onClose={() => {
          setShowTransportModal(false);
          setEditingTransport(null);
        }}
        onSubmit={createTransportMutation.mutate}
        isLoading={createTransportMutation.isPending}
        travelId={travelId!}
        editingTransport={editingTransport}
      />

      {/* Cruise Form Modal */}
      <CruiseFormModal
        open={showCruiseModal}
        onOpenChange={() => {
          setShowCruiseModal(false);
          setEditingCruise(null);
        }}
        onSubmit={createCruiseMutation.mutate}
        isPending={createCruiseMutation.isPending}
        editingCruise={editingCruise}
      />

      {/* Insurance Form Modal */}
      <InsuranceFormModal
        open={showInsuranceModal}
        onOpenChange={(open) => {
          setShowInsuranceModal(open);
          if (!open) setEditingInsurance(null);
        }}
        onSubmit={createInsuranceMutation.mutate}
        isPending={createInsuranceMutation.isPending}
        initialData={editingInsurance}
      />

      {/* Note Form Modal */}
      <NoteFormModal
        open={showNoteModal}
        onOpenChange={(open) => {
          setShowNoteModal(open);
          if (!open) {
            setEditingNote(null);
          }
        }}
        onSubmit={createNoteMutation.mutate}
        isPending={createNoteMutation.isPending}
        editingNote={editingNote}
      />

      {/* Share Travel Modal */}
      <ShareTravelModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        travelId={travelId!}
        travelTitle={travel?.name || ""}
      />

      <NewTravelModal
        travel={travel}
        isOpen={isNewTravelModalOpen}
        onClose={() => setIsNewTravelModalOpen(false)}
        onSubmit={(data) => updateTravelMutation.mutate(data)}
        isLoading={updateTravelMutation.isPending}
      />
    </div>
  );
}