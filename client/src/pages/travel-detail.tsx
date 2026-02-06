import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { NavigationHeader } from "@/components/ui/navigation-header";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { ObjectUploader } from "@/components/ObjectUploader";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Bed, MapPin, Plane, Car, Ship, Shield, StickyNote, Plus, Edit, Share, Camera, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { extractIataCode, getTimezoneForAirport } from "@/lib/timezones";
import type { Travel, Accommodation, Activity, Flight, Transport, Cruise, Insurance, Note } from "@shared/schema";
import React from "react";

function TravelDetail() {
  // Hooks y estados principales
  const [, params] = useRoute("/travel/:id");
  const travelId = params?.id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [openEventModal, setOpenEventModal] = React.useState(false);

  // Handler para abrir modal unificado
  const handleOpenEventModal = () => setOpenEventModal(true);
  const handleCloseEventModal = () => setOpenEventModal(false);

  // Renderizado principal
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      {/* Banner principal */}
      <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-8">
        <h1 className="text-4xl font-bold text-white">Detalle del Viaje</h1>
      </div>
      {/* Sección principal */}
      <main className="max-w-4xl mx-auto">
        {/* Botón para abrir modal unificado de eventos */}
        <Button onClick={handleOpenEventModal} className="mb-4 flex items-center gap-2">
          <Plus size={20} /> Agregar Evento
        </Button>
        {/* Modal unificado de eventos */}
        <Dialog open={openEventModal} onOpenChange={setOpenEventModal}>
          <DialogContent className="max-w-lg mx-auto">
            <DialogHeader>
              <h2 className="text-xl font-semibold">Agregar Evento al Itinerario</h2>
            </DialogHeader>
            {/* Aquí van los formularios para cada tipo de evento */}
            {/* <AccommodationFormModal /> */}
            {/* <ActivityFormModal /> */}
            {/* <FlightFormModal /> */}
            {/* <TransportFormModal /> */}
            {/* <CruiseFormModal /> */}
            {/* <InsuranceFormModal /> */}
            {/* <NoteFormModal /> */}
            {/* UX: mostrar solo el formulario seleccionado, registrar en orden cronológico */}
          </DialogContent>
        </Dialog>
        {/* Aquí va el resto del detalle del viaje, cronología, cards, etc. */}
        {/* ...existing code... */}
      </main>
    </div>
  );
}

export default TravelDetail;