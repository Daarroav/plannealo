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
import { ShareTravelModal } from "@/components/ui/share-travel-modal";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { CoverImageUploader } from "@/components/ui/cover-image-uploader";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { NewTravelModal } from "@/components/ui/new-travel-modal";
import { ToLeft, Hotel, Pin, Airplane, Car, Ship, Shield, Plus, Edit, Share, Camera, Delete, Time, Notepad } from "@icon-park/react";
import { normalizeCostBreakdown, parseCostAmount } from "@/lib/cost";
import type { Travel, Accommodation, Activity, Flight, Transport, Cruise, Insurance, Note } from "@shared/schema";

type TravelData = {
  travel: Travel;
  accommodations: Accommodation[];
  activities: Activity[];
  flights: Flight[];
  transports: Transport[];
  cruises: Cruise[];
  insurances: Insurance[];
  notes: Note[];
};

type ItineraryItemType = "accommodation" | "activity" | "flight" | "transport" | "cruise" | "insurance" | "note";
type ItineraryItem = {
  type: ItineraryItemType;
  id: string;
  start: Date;
  data:
    | Accommodation
    | Activity
    | Flight
    | Transport
    | Cruise
    | Insurance
    | Note;
};

const invalidateTravelQueries = (travelId: string) => {
  queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "full"] });
  queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId] });
  queryClient.invalidateQueries({ queryKey: ["/api/travels"] });
  queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
  queryClient.invalidateQueries({ queryKey: [`/api/travels/${travelId}/accommodations`] });
  queryClient.invalidateQueries({ queryKey: [`/api/travels/${travelId}/activities`] });
  queryClient.invalidateQueries({ queryKey: [`/api/travels/${travelId}/flights`] });
  queryClient.invalidateQueries({ queryKey: [`/api/travels/${travelId}/transports`] });
  queryClient.invalidateQueries({ queryKey: [`/api/travels/${travelId}/cruises`] });
  queryClient.invalidateQueries({ queryKey: [`/api/travels/${travelId}/insurances`] });
  queryClient.invalidateQueries({ queryKey: [`/api/travels/${travelId}/notes`] });
};

export default function TravelDetail() {
  const [, params] = useRoute("/travel/:id");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<"all" | ItineraryItemType>("all");
  const [showEventMenu, setShowEventMenu] = useState(false);
  const [showAccommodationModal, setShowAccommodationModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [showCruiseModal, setShowCruiseModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [editingTransport, setEditingTransport] = useState<Transport | null>(null);
  const [editingCruise, setEditingCruise] = useState<Cruise | null>(null);
  const [editingInsurance, setEditingInsurance] = useState<Insurance | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const { toast } = useToast();
  const [isNewTravelModalOpen, setIsNewTravelModalOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: "accommodation" | "activity" | "flight" | "transport" | "cruise" | "insurance" | "note";
    id: string;
    name?: string;
  } | null>(null);

  const travelId = params?.id;

  const updateTravelMutation = useMutation({
    mutationFn: async (data: any) => {
      const { _selectedImage, ...travelData } = data;
      const formData = new FormData();

      Object.keys(travelData).forEach((key) => {
        if (travelData[key] !== undefined && travelData[key] !== null) {
          formData.append(key, travelData[key]);
        }
      });

      if (_selectedImage) {
        formData.append("coverImage", _selectedImage);
      }

      const response = await fetch(`/api/travels/${travelId}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error updating travel");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "full"] });
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

  const { data: travelData, isLoading: travelLoading, error: travelError } = useQuery<TravelData>({
    queryKey: ["/api/travels", travelId, "full"],
    enabled: !!travelId,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const travel = travelData?.travel;
  const displayClientName =
    user?.role === "traveler" && user?.name ? user.name : travel?.clientName;
  const accommodations = travelData?.accommodations || [];
  const activities = travelData?.activities || [];
  const flights = travelData?.flights || [];
  const transports = travelData?.transports || [];
  const cruises = travelData?.cruises || [];
  const insurances = travelData?.insurances || [];
  const notes = travelData?.notes || [];

  const accommodationsLoading = travelLoading;
  const accommodationsError = travelError;

  const publishTravelMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("PUT", `/api/travels/${travelId}`, {
        status: "published",
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
        status: "draft",
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
        coverImageURL,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/travels/${travelId}/full`] });
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

  const handleCoverImageUpload = (objectPath: string) => {
    console.log("Cover image uploaded:", objectPath);
    updateCoverImageMutation.mutate(objectPath);
  };

  const createAccommodationMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const endpoint = editingAccommodation
        ? `/api/accommodations/${editingAccommodation.id}`
        : `/api/travels/${travelId}/accommodations`;
      const method = editingAccommodation ? "PUT" : "POST";
      const response = await apiRequest(method, endpoint, formData);
      return await response.json();
    },
    onSuccess: (newAccommodation) => {
      queryClient.setQueryData(["/api/travels", travelId, "full"], (oldData: any) => {
        if (!oldData) return oldData;

        const items = oldData.accommodations || [];

        if (editingAccommodation) {
          return {
            ...oldData,
            accommodations: items.map((acc: any) =>
              acc.id === editingAccommodation.id ? newAccommodation : acc
            ),
          };
        }

        return {
          ...oldData,
          accommodations: [...items, newAccommodation],
        };
      });

      invalidateTravelQueries(travelId!);
      setShowAccommodationModal(false);
      setEditingAccommodation(null);
      toast({
        title: editingAccommodation ? "Alojamiento actualizado" : "Alojamiento agregado",
        description: editingAccommodation
          ? "El alojamiento ha sido actualizado exitosamente."
          : "El alojamiento ha sido agregado exitosamente al viaje.",
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
      }
      const response = await apiRequest("POST", `/api/travels/${travelId}/activities`, data);
      return await response.json();
    },
    onSuccess: (newActivity) => {
      queryClient.setQueryData(["/api/travels", travelId, "full"], (oldData: any) => {
        if (!oldData) return oldData;

        const items = oldData.activities || [];

        if (editingActivity) {
          return {
            ...oldData,
            activities: items.map((act: any) =>
              act.id === editingActivity.id ? newActivity : act
            ),
          };
        }

        return {
          ...oldData,
          activities: [...items, newActivity],
        };
      });

      invalidateTravelQueries(travelId!);
      setShowActivityModal(false);
      setEditingActivity(null);
      toast({
        title: editingActivity ? "Actividad actualizada" : "Actividad agregada",
        description: editingActivity
          ? "La actividad ha sido actualizada exitosamente."
          : "La actividad ha sido agregada exitosamente al viaje.",
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
      }
      const response = await apiRequest("POST", `/api/travels/${travelId}/flights`, data);
      return await response.json();
    },
    onSuccess: (newFlight) => {
      queryClient.setQueryData(["/api/travels", travelId, "full"], (oldData: any) => {
        if (!oldData) return oldData;

        const items = oldData.flights || [];

        if (editingFlight) {
          return {
            ...oldData,
            flights: items.map((flight: any) =>
              flight.id === editingFlight.id ? newFlight : flight
            ),
          };
        }

        return {
          ...oldData,
          flights: [...items, newFlight],
        };
      });

      invalidateTravelQueries(travelId!);
      setShowFlightModal(false);
      setEditingFlight(null);
      toast({
        title: editingFlight ? "Vuelo actualizado" : "Vuelo agregado",
        description: editingFlight
          ? "El vuelo ha sido actualizado exitosamente."
          : "El vuelo ha sido agregado exitosamente al viaje.",
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
      }
      const response = await apiRequest("POST", `/api/travels/${travelId}/transports`, data);
      return await response.json();
    },
    onSuccess: (newTransport) => {
      queryClient.setQueryData(["/api/travels", travelId, "full"], (oldData: any) => {
        if (!oldData) return oldData;

        const items = oldData.transports || [];

        if (editingTransport) {
          return {
            ...oldData,
            transports: items.map((trans: any) =>
              trans.id === editingTransport.id ? newTransport : trans
            ),
          };
        }

        return {
          ...oldData,
          transports: [...items, newTransport],
        };
      });

      invalidateTravelQueries(travelId!);
      setShowTransportModal(false);
      setEditingTransport(null);
      toast({
        title: editingTransport ? "Transporte actualizado" : "Transporte agregado",
        description: editingTransport
          ? "El transporte ha sido actualizado exitosamente."
          : "El transporte ha sido agregado exitosamente al viaje.",
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
      }
      const response = await apiRequest("POST", `/api/travels/${travelId}/cruises`, data);
      return await response.json();
    },
    onSuccess: (newCruise) => {
      queryClient.setQueryData(["/api/travels", travelId, "full"], (oldData: any) => {
        if (!oldData) return oldData;

        const items = oldData.cruises || [];

        if (editingCruise) {
          return {
            ...oldData,
            cruises: items.map((cruise: any) =>
              cruise.id === editingCruise.id ? newCruise : cruise
            ),
          };
        }

        return {
          ...oldData,
          cruises: [...items, newCruise],
        };
      });

      invalidateTravelQueries(travelId!);
      setShowCruiseModal(false);
      setEditingCruise(null);
      toast({
        title: editingCruise ? "Crucero actualizado" : "Crucero agregado",
        description: editingCruise
          ? "El crucero ha sido actualizado exitosamente."
          : "El crucero ha sido agregado exitosamente al viaje.",
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
      }
      const response = await apiRequest("POST", `/api/travels/${travelId}/insurances`, data);
      return await response.json();
    },
    onSuccess: (newInsurance) => {
      queryClient.setQueryData(["/api/travels", travelId, "full"], (oldData: any) => {
        if (!oldData) return oldData;

        const items = oldData.insurances || [];

        if (editingInsurance) {
          return {
            ...oldData,
            insurances: items.map((ins: any) =>
              ins.id === editingInsurance.id ? newInsurance : ins
            ),
          };
        }

        return {
          ...oldData,
          insurances: [...items, newInsurance],
        };
      });

      invalidateTravelQueries(travelId!);
      setShowInsuranceModal(false);
      setEditingInsurance(null);
      toast({
        title: editingInsurance ? "Seguro actualizado" : "Seguro agregado",
        description: editingInsurance
          ? "El seguro ha sido actualizado exitosamente."
          : "El seguro ha sido agregado exitosamente al viaje.",
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
    mutationFn: async (formData: FormData) => {
      if (editingNote) {
        const response = await apiRequest("PUT", `/api/travels/${travelId}/notes/${editingNote.id}`, formData);
        return await response.json();
      }
      const response = await apiRequest("POST", `/api/travels/${travelId}/notes`, formData);
      return await response.json();
    },
    onSuccess: (newNote) => {
      queryClient.setQueryData(["/api/travels", travelId, "full"], (oldData: any) => {
        if (!oldData) return oldData;

        const items = oldData.notes || [];

        if (editingNote) {
          return {
            ...oldData,
            notes: items.map((note: any) =>
              note.id === editingNote.id ? newNote : note
            ),
          };
        }

        return {
          ...oldData,
          notes: [...items, newNote],
        };
      });

      invalidateTravelQueries(travelId!);
      setShowNoteModal(false);
      setEditingNote(null);
      toast({
        title: editingNote ? "Nota actualizada" : "Nota agregada",
        description: editingNote
          ? "La nota ha sido actualizada exitosamente."
          : "La nota ha sido agregada exitosamente.",
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

  const deleteAccommodationMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/accommodations/${id}`),
    onSuccess: () => {
      invalidateTravelQueries(travelId!);
      toast({ title: "Alojamiento eliminado", description: "El alojamiento ha sido eliminado correctamente" });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: () => {
      toast({ title: "Error", description: "No se pudo eliminar el alojamiento", variant: "destructive" });
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/activities/${id}`),
    onSuccess: () => {
      invalidateTravelQueries(travelId!);
      toast({ title: "Actividad eliminada", description: "La actividad ha sido eliminada correctamente" });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: () => {
      toast({ title: "Error", description: "No se pudo eliminar la actividad", variant: "destructive" });
    },
  });

  const deleteFlightMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/flights/${id}`),
    onSuccess: () => {
      invalidateTravelQueries(travelId!);
      toast({ title: "Vuelo eliminado", description: "El vuelo ha sido eliminado correctamente" });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: () => {
      toast({ title: "Error", description: "No se pudo eliminar el vuelo", variant: "destructive" });
    },
  });

  const deleteTransportMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/transports/${id}`),
    onSuccess: () => {
      invalidateTravelQueries(travelId!);
      toast({ title: "Transporte eliminado", description: "El transporte ha sido eliminado correctamente" });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: () => {
      toast({ title: "Error", description: "No se pudo eliminar el transporte", variant: "destructive" });
    },
  });

  const deleteCruiseMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/cruises/${id}`),
    onSuccess: () => {
      invalidateTravelQueries(travelId!);
      toast({ title: "Crucero eliminado", description: "El crucero ha sido eliminado correctamente" });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: () => {
      toast({ title: "Error", description: "No se pudo eliminar el crucero", variant: "destructive" });
    },
  });

  const deleteInsuranceMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/insurances/${id}`),
    onSuccess: () => {
      invalidateTravelQueries(travelId!);
      toast({ title: "Seguro eliminado", description: "El seguro ha sido eliminado correctamente" });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: () => {
      toast({ title: "Error", description: "No se pudo eliminar el seguro", variant: "destructive" });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/notes/${id}`),
    onSuccess: () => {
      invalidateTravelQueries(travelId!);
      toast({ title: "Nota eliminada", description: "La nota ha sido eliminada correctamente" });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: () => {
      toast({ title: "Error", description: "No se pudo eliminar la nota", variant: "destructive" });
    },
  });

  const handleDeleteClick = (
    type: "accommodation" | "activity" | "flight" | "transport" | "cruise" | "insurance" | "note",
    id: string,
    name?: string
  ) => {
    setItemToDelete({ type, id, name });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    switch (itemToDelete.type) {
      case "accommodation":
        deleteAccommodationMutation.mutate(itemToDelete.id);
        break;
      case "activity":
        deleteActivityMutation.mutate(itemToDelete.id);
        break;
      case "flight":
        deleteFlightMutation.mutate(itemToDelete.id);
        break;
      case "transport":
        deleteTransportMutation.mutate(itemToDelete.id);
        break;
      case "cruise":
        deleteCruiseMutation.mutate(itemToDelete.id);
        break;
      case "insurance":
        deleteInsuranceMutation.mutate(itemToDelete.id);
        break;
      case "note":
        deleteNoteMutation.mutate(itemToDelete.id);
        break;
    }
  };

  const getDeleteDialogMessage = () => {
    if (!itemToDelete) return { title: "", description: "" };

    const typeNames = {
      accommodation: "Alojamiento",
      activity: "Actividad",
      flight: "Vuelo",
      transport: "Transporte",
      cruise: "Crucero",
      insurance: "Seguro",
      note: "Nota",
    };

    const typeName = typeNames[itemToDelete.type];
    return {
      title: `Eliminar ${typeName}`,
      description: `¿Estás seguro que quieres eliminar est${itemToDelete.type === "activity" || itemToDelete.type === "note" ? "a" : "e"} ${typeName}? Esta acción no se puede deshacer.`,
    };
  };

  const isDeleting =
    deleteAccommodationMutation.isPending ||
    deleteActivityMutation.isPending ||
    deleteFlightMutation.isPending ||
    deleteTransportMutation.isPending ||
    deleteCruiseMutation.isPending ||
    deleteInsuranceMutation.isPending ||
    deleteNoteMutation.isPending;

  const formatDateTime = (date: Date | string | null, includeTime = false, forceUTC = false): string => {
    if (!date) return "";

    const d = new Date(date);
    const dateFmt = new Intl.DateTimeFormat("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: forceUTC ? "UTC" : "America/Mexico_City",
    });

    const parts = dateFmt.formatToParts(d);
    const day = parts.find((p) => p.type === "day")?.value ?? "";
    let month = parts.find((p) => p.type === "month")?.value ?? "";
    const year = parts.find((p) => p.type === "year")?.value ?? "";

    month = month.replace(/\./g, "").replace("sept", "sep").toLowerCase();

    let result = `${day} ${month} ${year}`;

    if (includeTime) {
      const timeParts = new Intl.DateTimeFormat("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: forceUTC ? "UTC" : "America/Mexico_City",
      }).formatToParts(d);

      const hour = timeParts.find((p) => p.type === "hour")?.value ?? "00";
      const minute = timeParts.find((p) => p.type === "minute")?.value ?? "00";
      const dayPeriod = timeParts.find((p) => p.type === "dayPeriod")?.value ?? "";

      result += `, ${hour}:${minute} ${dayPeriod}`;
    }

    return result;
  };

  const formatFlightDateTime = (date: Date | string | null): string => {
    if (!date) return "";

    const d = new Date(date);
    const dateFmt = new Intl.DateTimeFormat("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "America/Mexico_City",
    });

    const parts = dateFmt.formatToParts(d);
    const day = parts.find((p) => p.type === "day")?.value ?? "";
    let month = parts.find((p) => p.type === "month")?.value ?? "";
    const year = parts.find((p) => p.type === "year")?.value ?? "";

    month = month.replace(/\./g, "").replace("sept", "sep").toLowerCase();

    const timeParts = new Intl.DateTimeFormat("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/Mexico_City",
    }).formatToParts(d);

    const hour = timeParts.find((p) => p.type === "hour")?.value ?? "00";
    const minute = timeParts.find((p) => p.type === "minute")?.value ?? "00";
    const dayPeriod = timeParts.find((p) => p.type === "dayPeriod")?.value ?? "";

    return `${day} ${month} ${year}, ${hour}:${minute} ${dayPeriod}`;
  };

  const formatTime12h = (time24: string | null): string => {
    if (!time24) return "N/A";

    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "p. m." : "a. m.";
    const hours12 = hours % 12 || 12;

    return `${hours12.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

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
    setEditingNote(note);
    setShowNoteModal(true);
  };

  const cleanNotesFromStructuredData = (notesText: string) => {
    if (!notesText) return null;

    const cleanedNotes = notesText
      .replace(/[-\s]*Tel:\s*[+]?[\d\s\-\(\)]+/gi, "")
      .replace(/[-\s]*Teléfono:\s*[+]?[\d\s\-\(\)]+/gi, "")
      .replace(/[-\s]*Phone:\s*[+]?[\d\s\-\(\)]+/gi, "")
      .replace(/Ubicación inicio:\s*[^\n\r]+/gi, "")
      .replace(/Lugar de inicio:\s*[^\n\r]+/gi, "")
      .replace(/Ubicación fin:\s*[^\n\r]+/gi, "")
      .replace(/Lugar de fin:\s*[^\n\r]+/gi, "")
      .replace(/Contacto:\s*[^-\n\r]+?(?:\s*[-\s]*Tel|$)/gi, "")
      .replace(/Contact:\s*[^-\n\r]+?(?:\s*[-\s]*Tel|$)/gi, "")
      .replace(/^\s*[-\n\r]+/gi, "")
      .replace(/[-\n\r]+\s*$/gi, "")
      .trim();

    return cleanedNotes || null;
  };

  const buildDateWithTime = (dateValue: Date | string, timeValue?: string | null) => {
    const date = new Date(dateValue);
    if (timeValue) {
      const [hours, minutes] = timeValue.split(":").map(Number);
      date.setHours(Number.isFinite(hours) ? hours : 0, Number.isFinite(minutes) ? minutes : 0, 0, 0);
    }
    return date;
  };

  const getItineraryStart = (item: ItineraryItem): Date => {
    return item.start;
  };

  const formatCurrency = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${currency} ${amount.toFixed(2)}`;
    }
  };

  const getItemCost = (item: ItineraryItem) => {
    const data: any = item.data;
    const costAmountValue = typeof data?.costAmount === "string" ? data.costAmount.trim() : data?.costAmount;
    const amountRaw = costAmountValue ? costAmountValue : item.type === "accommodation" ? data?.price : "";
    const breakdownTotal = normalizeCostBreakdown(data?.costBreakdown).reduce((sum, entry) => {
      return sum + parseCostAmount(entry.amount);
    }, 0);
    const amount = amountRaw ? parseCostAmount(amountRaw) : breakdownTotal;
    const currency = data?.costCurrency?.trim?.() || data?.costCurrency || "MXN";
    
    // Debug logging para verificar valores
    if (amount > 0) {
      console.log(`[Cost Debug] ${getItemTitle(item)}:`, {
        type: item.type,
        rawValue: amountRaw,
        parsedAmount: amount,
        currency: currency,
        breakdown: data?.costBreakdown,
        breakdownTotal: breakdownTotal
      });
    }
    
    return { amount, currency };
  };

  const getItemTitle = (item: ItineraryItem) => {
    switch (item.type) {
      case "accommodation":
        return (item.data as Accommodation).name;
      case "activity":
        return (item.data as Activity).name;
      case "flight":
        return `${(item.data as Flight).airline} ${(item.data as Flight).flightNumber}`;
      case "transport":
        return (item.data as Transport).name || (item.data as Transport).type;
      case "cruise":
        return (item.data as Cruise).cruiseLine;
      case "insurance":
        return (item.data as Insurance).provider;
      case "note":
        return (item.data as Note).title;
      default:
        return "Evento";
    }
  };

  const openEventModal = (type: ItineraryItemType) => {
    switch (type) {
      case "accommodation":
        setEditingAccommodation(null);
        setShowAccommodationModal(true);
        break;
      case "activity":
        setEditingActivity(null);
        setShowActivityModal(true);
        break;
      case "flight":
        setEditingFlight(null);
        setShowFlightModal(true);
        break;
      case "transport":
        setEditingTransport(null);
        setShowTransportModal(true);
        break;
      case "cruise":
        setEditingCruise(null);
        setShowCruiseModal(true);
        break;
      case "insurance":
        setEditingInsurance(null);
        setShowInsuranceModal(true);
        break;
      case "note":
        setEditingNote(null);
        setShowNoteModal(true);
        break;
    }
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
          <aside className="lg:sticky lg:top-32 h-fit">
            <Card className="border-border">
              <CardContent className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Resumen de costos</h3>
                  <p className="text-xs text-muted-foreground">Total estimado del viaje</p>
                </div>

                <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
                  Aun no has agregado costos al itinerario.
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between text-xs uppercase text-muted-foreground">
                    <span>Eventos con costo</span>
                    <span>0</span>
                  </div>
                  <div className="mt-3 space-y-3" />
                </div>
              </CardContent>
            </Card>
          </aside>
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
              <ToLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const itineraryItems: ItineraryItem[] = [
    ...accommodations.map((item) => ({
      type: "accommodation" as const,
      id: item.id,
      start: new Date(item.checkIn),
      data: item,
    })),
    ...activities.map((item) => ({
      type: "activity" as const,
      id: item.id,
      start: buildDateWithTime(item.date, item.startTime),
      data: item,
    })),
    ...flights.map((item) => ({
      type: "flight" as const,
      id: item.id,
      start: new Date(item.departureDate),
      data: item,
    })),
    ...transports.map((item) => ({
      type: "transport" as const,
      id: item.id,
      start: buildDateWithTime(item.pickupDate, null),
      data: item,
    })),
    ...cruises.map((item) => ({
      type: "cruise" as const,
      id: item.id,
      start: new Date(item.departureDate),
      data: item,
    })),
    ...insurances.map((item) => ({
      type: "insurance" as const,
      id: item.id,
      start: new Date(item.effectiveDate),
      data: item,
    })),
    ...notes.map((item) => ({
      type: "note" as const,
      id: item.id,
      start: new Date(item.noteDate),
      data: item,
    })),
  ];

  const sortedItinerary = [...itineraryItems].sort(
    (a, b) => getItineraryStart(a).getTime() - getItineraryStart(b).getTime()
  );

  const filteredItinerary =
    activeSection === "all"
      ? sortedItinerary
      : sortedItinerary.filter((item) => item.type === activeSection);

  const costItems = sortedItinerary
    .map((item) => {
      const cost = getItemCost(item);
      return { item, ...cost };
    })
    .filter((entry) => entry.amount > 0);

  const totalsByCurrency = costItems.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.currency] = (acc[entry.currency] || 0) + entry.amount;
    return acc;
  }, {});

  // Debug: Verificar totales calculados
  console.log('[Cost Summary]', {
    totalItems: costItems.length,
    totals: totalsByCurrency,
    itemsBreakdown: costItems.map(item => ({
      title: getItemTitle(item.item),
      amount: item.amount,
      currency: item.currency
    }))
  });

  const navigationItems = [
    { id: "all", label: "Itinerario", icon: Time, count: itineraryItems.length },
    { id: "accommodation", label: "Alojamientos", icon: Hotel, count: accommodations.length },
    { id: "activity", label: "Actividades", icon: Pin, count: activities.length },
    { id: "flight", label: "Vuelos", icon: Airplane, count: flights.length },
    { id: "transport", label: "Transporte", icon: Car, count: transports.length },
    { id: "cruise", label: "Cruceros", icon: Ship, count: cruises.length },
    { id: "insurance", label: "Seguro de Asistencia", icon: Shield, count: insurances.length },
    { id: "note", label: "Notas", icon: Notepad, count: notes.length },
  ] as const;

  return (
    <div className="min-h-screen bg-muted/30">
      <NavigationHeader />
      <div className="bg-background border-b border-border sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between h-auto gap-2 sm:h-16 pb-2 sm:pb-0">
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <Button variant="ghost" size="icon" onClick={() => setLocation("/")}> 
                <ToLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">{travel.name}</h1>
                <p className="text-sm text-muted-foreground">Viajero: {displayClientName}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:justify-end">
              <Badge variant={travel.status === "published" ? "default" : "secondary"}>
                {travel.status === "published" ? "Publicado" : "Borrador"}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setShowShareModal(true)}>
                <Share className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Compartir</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
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

      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Imagen de Portada</h2>
            <CoverImageUploader
              onUploadComplete={handleCoverImageUpload}
              buttonClassName="bg-accent hover:bg-accent/90 text-white"
            >
              <Camera className="w-4 h-4 mr-2" />
              Cambiar Imagen
            </CoverImageUploader>
          </div>
          <div className="relative w-full h-64 lg:h-80 rounded-lg overflow-hidden bg-muted">
            <img
              src={
                travel.coverImage
                  ? travel.coverImage.startsWith("/objects/")
                    ? `/api${travel.coverImage}`
                    : travel.coverImage
                  : "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400"
              }
              alt={`Portada de ${travel.name}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400";
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-4 sm:p-6 text-white w-full">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{travel.name}</h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                  <p className="text-base sm:text-lg opacity-90">Viajero: {displayClientName}</p>
                  <button
                    type="button"
                    className="inline-flex sm:flex items-center gap-0 sm:gap-1.5 text-xs sm:text-sm p-1 sm:px-2 sm:py-1 rounded-md bg-accent hover:bg-accent/90 text-white transition w-fit"
                    onClick={() => setIsNewTravelModalOpen(true)}
                    title="Editar información de viaje"
                  >
                    <Edit className="w-4 h-4 text-white" />
                    <span className="hidden sm:inline">Editar informacion de viaje</span>
                  </button>
                </div>
                <p className="text-sm opacity-75 mt-1">
                  {formatDateTime(travel.startDate)} - {formatDateTime(travel.endDate)} • {travel.travelers} viajero
                  {travel.travelers !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)_320px]">
          <div className="hidden lg:block">
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

          <div>
            <section className="mb-12">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Itinerario</h2>
                  <p className="text-sm text-muted-foreground">Orden cronologico del viaje</p>
                </div>
                <p className="text-sm text-muted-foreground">Usa el boton flotante para agregar eventos</p>
              </div>

              {accommodationsLoading ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando itinerario...</p>
                  </CardContent>
                </Card>
              ) : accommodationsError ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Time className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Error al cargar el itinerario</h3>
                    <p className="text-muted-foreground mb-6">Ocurrió un error al cargar la informacion</p>
                    <Button
                      variant="outline"
                      onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/travels", travelId, "full"] })}
                    >
                      Reintentar
                    </Button>
                  </CardContent>
                </Card>
              ) : filteredItinerary.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Time className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No hay eventos en el itinerario</h3>
                    <p className="text-muted-foreground mb-6">
                      {activeSection === "all"
                        ? "Agrega el primer evento para comenzar el itinerario"
                        : "No hay eventos para este tipo"}
                    </p>
                    <Button className="bg-accent hover:bg-accent/90" onClick={() => setShowEventMenu(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar evento
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {filteredItinerary.map((item) => {
                    switch (item.type) {
                      case "accommodation": {
                        const accommodation = item.data as Accommodation;
                        const accommodationCost = getItemCost(item);
                        const thumbnailSrc = accommodation.thumbnail
                          ? accommodation.thumbnail.startsWith("/objects/")
                            ? `/api${accommodation.thumbnail}`
                            : accommodation.thumbnail.startsWith("/uploads/")
                              ? accommodation.thumbnail
                              : `/uploads/${accommodation.thumbnail}`
                          : "";

                        return (
                          <Card key={`${item.type}-${item.id}`} className="p-4 border-l-4 border-l-primary">
                            <div className="flex justify-between items-start gap-4">
                              {thumbnailSrc && (
                                <div className="flex-shrink-0">
                                  <img
                                    src={thumbnailSrc}
                                    alt={accommodation.name}
                                    className="w-20 h-20 object-cover rounded-lg border"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="secondary">Alojamiento</Badge>
                                  <Badge variant="outline">{accommodation.type}</Badge>
                                  <h4 className="font-semibold text-foreground">{accommodation.name}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{accommodation.location}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="font-medium">Check-in:</span> {formatDateTime(accommodation.checkIn, true)}
                                  </div>
                                  <div>
                                    <span className="font-medium">Check-out:</span> {formatDateTime(accommodation.checkOut, true)}
                                  </div>
                                  <div>
                                    <span className="font-medium">Habitación:</span> {accommodation.roomType || "N/A"}
                                  </div>
                                  {accommodationCost.amount > 0 && (
                                    <div>
                                      <span className="font-medium">Costo:</span> {formatCurrency(accommodationCost.amount, accommodationCost.currency)}
                                    </div>
                                  )}
                                </div>
                                {accommodation.notes && (
                                  <p className="text-sm text-muted-foreground mt-2 italic">{accommodation.notes}</p>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditAccommodation(accommodation)}
                                  data-testid={`button-edit-accommodation-${accommodation.id}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick("accommodation", accommodation.id, accommodation.name)}
                                  data-testid={`button-delete-accommodation-${accommodation.id}`}
                                  className="hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Delete className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      }
                      case "activity": {
                        const activity = item.data as Activity;
                        const activityCost = getItemCost(item);
                        return (
                          <Card key={`${item.type}-${item.id}`} className="p-4 border-l-4 border-l-secondary">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="secondary">Actividad</Badge>
                                  <Badge variant="outline">{activity.type}</Badge>
                                  <h4 className="font-semibold text-foreground">{activity.name}</h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                  <div>
                                  {activityCost.amount > 0 && (
                                    <div>
                                      <span className="font-medium">Costo:</span> {formatCurrency(activityCost.amount, activityCost.currency)}
                                    </div>
                                  )}
                                    <span className="font-medium">Fecha:</span> {formatDateTime(activity.date)}
                                  </div>
                                  <div>
                                    <span className="font-medium">Proveedor:</span> {activity.provider || "N/A"}
                                  </div>
                                  <div>
                                    <span className="font-medium">Inicio:</span> {formatTime12h(activity.startTime)}
                                  </div>
                                  <div>
                                    <span className="font-medium">Fin:</span> {formatTime12h(activity.endTime)}
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
                                    <span className="font-medium">Telefono contacto:</span> {activity.contactPhone || "N/A"}
                                  </div>
                                </div>

                                {activity.notes && (
                                  <p className="text-sm text-muted-foreground mt-2 italic">
                                    {cleanNotesFromStructuredData(activity.notes)}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditActivity(activity)}
                                  data-testid={`button-edit-activity-${activity.id}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick("activity", activity.id, activity.name)}
                                  data-testid={`button-delete-activity-${activity.id}`}
                                  className="hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Delete className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      }
                      case "flight": {
                        const flight = item.data as Flight;
                        const flightCost = getItemCost(item);
                        const flightTitle = flight.departureAirport && flight.arrivalAirport 
                          ? `${flight.departureAirport} → ${flight.arrivalAirport}`
                          : `${flight.departureCity} → ${flight.arrivalCity}`;
                        
                        return (
                          <Card key={`${item.type}-${item.id}`} className="p-4 border-l-4 border-l-accent">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="secondary">Vuelo</Badge>
                                  <h4 className="font-semibold text-foreground">
                                    {flightTitle}
                                  </h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="font-medium">Aerolínea:</span> {flight.airline} {flight.flightNumber}
                                  </div>
                                  <div>
                                    <span className="font-medium">Clase:</span> {flight.class}
                                  </div>
                                  <div>
                                    <span className="font-medium">Salida:</span> {formatFlightDateTime(flight.departureDate)}
                                  </div>
                                  <div>
                                    <span className="font-medium">Llegada:</span> {formatFlightDateTime(flight.arrivalDate)}
                                  </div>
                                  {flightCost.amount > 0 && (
                                    <div>
                                      <span className="font-medium">Costo:</span> {formatCurrency(flightCost.amount, flightCost.currency)}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditFlight(flight)}
                                  data-testid={`button-edit-flight-${flight.id}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick("flight", flight.id)}
                                  data-testid={`button-delete-flight-${flight.id}`}
                                  className="hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Delete className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      }
                      case "transport": {
                        const transport = item.data as Transport;
                        const transportCost = getItemCost(item);
                        return (
                          <Card key={`${item.type}-${item.id}`} className="p-4 border-l-4 border-l-accent/50">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="secondary">Transporte</Badge>
                                  <Badge variant="outline">{transport.type}</Badge>
                                  <h4 className="font-semibold text-foreground">{transport.name || transport.type}</h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
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
                                  {transportCost.amount > 0 && (
                                    <div>
                                      <span className="font-medium">Costo:</span> {formatCurrency(transportCost.amount, transportCost.currency)}
                                    </div>
                                  )}
                                </div>
                                {transport.notes && (
                                  <p className="text-sm text-muted-foreground mt-2 italic">{transport.notes}</p>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditTransport(transport)}
                                  data-testid={`button-edit-transport-${transport.id}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick("transport", transport.id)}
                                  data-testid={`button-delete-transport-${transport.id}`}
                                  className="hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Delete className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      }
                      case "cruise": {
                        const cruise = item.data as Cruise;
                        const cruiseCost = getItemCost(item);
                        return (
                          <Card key={`${item.type}-${item.id}`} className="p-4 border-l-4 border-l-primary/50">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="secondary">Crucero</Badge>
                                  <h4 className="font-semibold text-foreground">{cruise.cruiseLine}</h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
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
                                  {cruiseCost.amount > 0 && (
                                    <div>
                                      <span className="font-medium">Costo:</span> {formatCurrency(cruiseCost.amount, cruiseCost.currency)}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditCruise(cruise)}
                                  data-testid={`button-edit-cruise-${cruise.id}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick("cruise", cruise.id)}
                                  data-testid={`button-delete-cruise-${cruise.id}`}
                                  className="hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Delete className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      }
                      case "insurance": {
                        const insurance = item.data as Insurance;
                        const insuranceCost = getItemCost(item);
                        return (
                          <Card key={`${item.type}-${item.id}`} className="p-4 border-l-4 border-l-destructive">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="secondary">Seguro</Badge>
                                  <Badge variant="outline">{insurance.policyType}</Badge>
                                  <h4 className="font-semibold text-foreground">{insurance.provider}</h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="font-medium">Poliza:</span> {insurance.policyNumber}
                                  </div>
                                  <div>
                                    <span className="font-medium">Descripcion:</span> {insurance.policyDescription || "N/A"}
                                  </div>
                                  <div>
                                    <span className="font-medium">Vigencia:</span> {formatDateTime(insurance.effectiveDate, true)}
                                  </div>
                                  {insuranceCost.amount > 0 && (
                                    <div>
                                      <span className="font-medium">Costo:</span> {formatCurrency(insuranceCost.amount, insuranceCost.currency)}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditInsurance(insurance)}
                                  data-testid={`button-edit-insurance-${insurance.id}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick("insurance", insurance.id)}
                                  data-testid={`button-delete-insurance-${insurance.id}`}
                                  className="hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Delete className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      }
                      case "note": {
                        const note = item.data as Note;
                        const noteCost = getItemCost(item);
                        return (
                          <Card key={`${item.type}-${item.id}`} className="p-4 border-l-4 border-l-muted">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="secondary">Nota</Badge>
                                  <Badge variant={note.visibleToTravelers ? "default" : "secondary"}>
                                    {note.visibleToTravelers ? "Visible" : "Interno"}
                                  </Badge>
                                  <h4 className="font-semibold text-foreground">{note.title}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  Fecha: {formatDateTime(note.noteDate, true)}
                                </p>
                                {noteCost.amount > 0 && (
                                  <p className="text-sm text-muted-foreground mb-2">
                                    <span className="font-medium">Costo:</span> {formatCurrency(noteCost.amount, noteCost.currency)}
                                  </p>
                                )}
                                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditNote(note)}
                                  data-testid={`button-edit-note-${note.id}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick("note", note.id)}
                                  data-testid={`button-delete-note-${note.id}`}
                                  className="hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Delete className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      }
                      default:
                        return null;
                    }
                  })}
                </div>
              )}
            </section>
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
              <div className={`mb-3 flex flex-col items-stretch gap-2 transition-all ${showEventMenu ? "opacity-100" : "pointer-events-none opacity-0"}`}>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowEventMenu(false);
                    openEventModal("accommodation");
                  }}
                  className="justify-start whitespace-nowrap"
                >
                  <Hotel className="w-4 h-4 mr-2" />
                  Alojamiento
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowEventMenu(false);
                    openEventModal("activity");
                  }}
                  className="justify-start whitespace-nowrap"
                >
                  <Pin className="w-4 h-4 mr-2" />
                  Actividad
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowEventMenu(false);
                    openEventModal("flight");
                  }}
                  className="justify-start whitespace-nowrap"
                >
                  <Airplane className="w-4 h-4 mr-2" />
                  Vuelo
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowEventMenu(false);
                    openEventModal("transport");
                  }}
                  className="justify-start whitespace-nowrap"
                >
                  <Car className="w-4 h-4 mr-2" />
                  Transporte
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowEventMenu(false);
                    openEventModal("cruise");
                  }}
                  className="justify-start whitespace-nowrap"
                >
                  <Ship className="w-4 h-4 mr-2" />
                  Crucero
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowEventMenu(false);
                    openEventModal("insurance");
                  }}
                  className="justify-start whitespace-nowrap"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Seguro
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowEventMenu(false);
                    openEventModal("note");
                  }}
                  className="justify-start whitespace-nowrap"
                >
                  <Notepad className="w-4 h-4 mr-2" />
                  Nota
                </Button>
              </div>
              <Button
                className="h-14 w-14 rounded-full bg-accent hover:bg-accent/90 shadow-lg flex-shrink-0 flex items-center justify-center p-0"
                size="icon"
                onClick={() => setShowEventMenu((prev) => !prev)}
              >
                <Plus className={`h-6 w-6 transition-transform ${showEventMenu ? "rotate-45" : ""}`} />
              </Button>
            </div>
          </div>

          <aside className="lg:sticky lg:top-32 h-fit">
            <Card className="border-border">
              <CardContent className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Resumen de costos</h3>
                  <p className="text-xs text-muted-foreground">Total estimado del viaje</p>
                </div>

                {costItems.length === 0 ? (
                  <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
                    Aun no has agregado costos al itinerario.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(totalsByCurrency).map(([currency, total]) => (
                      <div key={currency} className="rounded-lg bg-accent/10 border border-accent/20 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-base font-bold text-accent">Total {currency}</span>
                          <span className="text-lg font-bold text-accent">{formatCurrency(total, currency)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between text-xs uppercase text-muted-foreground">
                    <span>Eventos con costo</span>
                    <span>{costItems.length}</span>
                  </div>
                  <div className="mt-3 space-y-3">
                    {costItems.slice(0, 6).map(({ item, amount, currency }) => (
                      <div key={`${item.type}-${item.id}-cost`} className="flex items-start justify-between gap-3 text-sm">
                        <div>
                          <p className="font-medium text-foreground">{getItemTitle(item)}</p>
                          <p className="text-xs text-muted-foreground">
                            {navigationItems.find((nav) => nav.id === item.type)?.label || "Evento"}
                          </p>
                        </div>
                        <span className="text-foreground">{formatCurrency(amount, currency)}</span>
                      </div>
                    ))}
                    {costItems.length > 6 && (
                      <p className="text-xs text-muted-foreground">+{costItems.length - 6} mas</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

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

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={getDeleteDialogMessage().title}
        description={getDeleteDialogMessage().description}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}