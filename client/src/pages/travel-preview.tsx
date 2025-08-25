import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Bed, 
  Camera, 
  Plane, 
  Car, 
  Ship, 
  Shield,
  StickyNote,
  Eye,
  EyeOff,
  FileText,
  ArrowLeft,
  Download
} from "lucide-react";

interface TravelData {
  travel: any;
  accommodations: any[];
  activities: any[];
  flights: any[];
  transports: any[];
  cruises: any[];
  insurances: any[];
  notes: any[];
}

export default function TravelPreview() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery<TravelData>({
    queryKey: ['/api/travels', id, 'full'],
    enabled: !!id,
  });

  console.info(data);

  const formatDateTime = (dateTime: string | Date) => {
    const date = new Date(dateTime);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGoBack = () => {
    window.close();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando vista previa...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Error</h1>
          <p className="text-muted-foreground">No se pudo cargar el itinerario</p>
        </div>
      </div>
    );
  }

  const { travel, accommodations, activities, flights, transports, cruises, insurances, notes } = data;

  // Combinar y ordenar todos los eventos cronológicamente
  const getAllEvents = () => {
    const events: Array<{
      id: string;
      type: 'accommodation' | 'activity' | 'flight' | 'transport' | 'cruise' | 'note';
      date: Date;
      data: any;
    }> = [];

    // Agregar actividades
    activities.forEach(activity => {
      events.push({
        id: activity.id,
        type: 'activity',
        date: new Date(activity.date),
        data: activity
      });
    });

    // Agregar vuelos
    flights.forEach(flight => {
      events.push({
        id: flight.id,
        type: 'flight',
        date: new Date(flight.departureDate),
        data: flight
      });
    });

    // Agregar transportes
    transports.forEach(transport => {
      events.push({
        id: transport.id,
        type: 'transport',
        date: new Date(transport.pickupDate),
        data: transport
      });
    });

    // Agregar cruceros
    cruises.forEach(cruise => {
      events.push({
        id: cruise.id,
        type: 'cruise',
        date: new Date(cruise.departureDate),
        data: cruise
      });
    });

    // Agregar alojamientos
    accommodations.forEach(accommodation => {
      events.push({
        id: accommodation.id,
        type: 'accommodation',
        date: new Date(accommodation.checkIn),
        data: accommodation
      });
    });

    // Agregar notas importantes visibles para viajeros
    notes
      .filter(note => note.visibleToTravelers)
      .forEach(note => {
        events.push({
          id: note.id,
          type: 'note',
          date: new Date(note.noteDate),
          data: note
        });
      });

    // Ordenar cronológicamente
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const chronologicalEvents = getAllEvents();

  const renderEventCard = (event: any) => {
    switch (event.type) {
      case 'activity':
        return (
          <Card key={event.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{event.data.name}</h3>
                <Badge variant="secondary">
                  <Camera className="w-3 h-3 mr-1" />
                  Actividad
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>📅 {formatDateTime(event.data.date)}</div>
                <div>🏷️ {event.data.type}</div>
                {event.data.provider && <div>👥 {event.data.provider}</div>}
                {event.data.startTime && <div>⏰ {event.data.startTime} - {event.data.endTime || 'Sin hora fin'}</div>}
                {event.data.confirmationNumber && <div>🎫 {event.data.confirmationNumber}</div>}
              </div>
              {event.data.notes && (
                <p className="mt-2 text-sm text-muted-foreground">{event.data.notes}</p>
              )}
            </CardContent>
          </Card>
        );

      case 'flight':
        return (
          <Card key={event.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{event.data.airline} {event.data.flightNumber}</h3>
                <Badge variant="secondary">
                  <Plane className="w-3 h-3 mr-1" />
                  Vuelo
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>🛫 {event.data.departureCity} → {event.data.arrivalCity}</div>
                <div>📅 Salida: {formatDateTime(event.data.departureDate)}</div>
                <div>📅 Llegada: {formatDateTime(event.data.arrivalDate)}</div>
                <div>✈️ Clase: {event.data.class}</div>
                {event.data.departureTerminal && <div>🏢 Terminal salida: {event.data.departureTerminal}</div>}
                {event.data.arrivalTerminal && <div>🏢 Terminal llegada: {event.data.arrivalTerminal}</div>}
                <div>🎫 {event.data.reservationNumber}</div>
              </div>
            </CardContent>
          </Card>
        );

      case 'transport':
        return (
          <Card key={event.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{event.data.name}</h3>
                <Badge variant="secondary">
                  <Car className="w-3 h-3 mr-1" />
                  Transporte
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>🚗 {event.data.type}</div>
                <div>📅 Recogida: {formatDateTime(event.data.pickupDate)}</div>
                <div>📍 Desde: {event.data.pickupLocation}</div>
                {event.data.dropoffLocation && <div>📍 Hasta: {event.data.dropoffLocation}</div>}
                {event.data.provider && <div>👥 {event.data.provider}</div>}
                {event.data.contactName && <div>📞 {event.data.contactName}: {event.data.contactNumber}</div>}
                {event.data.confirmationNumber && <div>🎫 {event.data.confirmationNumber}</div>}
              </div>
              {event.data.notes && (
                <p className="mt-2 text-sm text-muted-foreground">{event.data.notes}</p>
              )}
            </CardContent>
          </Card>
        );

      case 'cruise':
        return (
          <Card key={event.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{event.data.cruiseLine}</h3>
                <Badge variant="secondary">
                  <Ship className="w-3 h-3 mr-1" />
                  Crucero
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>📅 Salida: {formatDateTime(event.data.departureDate)}</div>
                <div>📅 Regreso: {formatDateTime(event.data.arrivalDate)}</div>
                <div>🛳️ Desde: {event.data.departurePort}</div>
                <div>🛳️ Hasta: {event.data.arrivalPort}</div>
                {event.data.confirmationNumber && <div>🎫 {event.data.confirmationNumber}</div>}
              </div>
              {event.data.notes && (
                <p className="mt-2 text-sm text-muted-foreground">{event.data.notes}</p>
              )}
            </CardContent>
          </Card>
        );

      case 'accommodation':
        return (
          <Card key={event.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{event.data.name}</h3>
                <Badge variant="secondary">
                  <Bed className="w-3 h-3 mr-1" />
                  Alojamiento
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>🏨 {event.data.type}</div>
                <div>📍 {event.data.location}</div>
                <div>📅 Check-in: {formatDateTime(event.data.checkIn)}</div>
                <div>📅 Check-out: {formatDateTime(event.data.checkOut)}</div>
                <div>🛏️ {event.data.roomType}</div>
                {event.data.price && <div>💰 {event.data.price}</div>}
                {event.data.confirmationNumber && <div>🎫 {event.data.confirmationNumber}</div>}
              </div>
              {event.data.notes && (
                <p className="mt-2 text-sm text-muted-foreground">{event.data.notes}</p>
              )}
              {event.data.policies && (
                <p className="mt-2 text-sm text-muted-foreground border-t border-border pt-2">
                  <strong>Políticas:</strong> {event.data.policies}
                </p>
              )}
            </CardContent>
          </Card>
        );

      case 'note':
        return (
          <Card key={event.id} className="border-l-4 border-accent bg-accent/5">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{event.data.title}</h3>
                <Badge variant="secondary">
                  <StickyNote className="w-3 h-3 mr-1" />
                  Nota Importante
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                📅 {formatDateTime(event.data.noteDate)}
              </div>
              <div className="p-3 bg-muted/20 rounded-lg border-l-4 border-accent">
                <p className="whitespace-pre-wrap text-sm">{event.data.content}</p>
              </div>
              {event.data.attachments && event.data.attachments.length > 0 && (
                <div className="mt-3 border-t border-border pt-3">
                  <p className="text-sm font-medium text-foreground mb-2">Documentos Adjuntos</p>
                  <div className="space-y-1">
                    {event.data.attachments.map((fileName: string, index: number) => (
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
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - no se imprime */}
      <div className="no-print bg-white border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cerrar
          </Button>
          <h1 className="text-xl font-semibold">Vista Previa del Itinerario</h1>
        </div>
        <Button onClick={handlePrint} className="bg-accent hover:bg-accent/90">
          <Download className="w-4 h-4 mr-2" />
          Imprimir / Guardar PDF
        </Button>
      </div>

      {/* Portada con imagen de fondo */}
      <div 
        className="cover-page relative w-full h-screen print:h-[11in] print:w-[8.5in] flex items-center justify-center text-center print:page-break-after-always overflow-hidden"
        style={{
          backgroundImage: travel.coverImage ? `url(${travel.coverImage.startsWith('/objects/') ? `/api${travel.coverImage}` : travel.coverImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay oscuro para mejorar legibilidad del texto */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Contenido de la portada */}
        <div className="relative z-10 text-white px-8 max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-8 print:text-5xl drop-shadow-2xl">
            {travel.name}
          </h1>
          <h2 className="text-3xl font-light mb-6 print:text-2xl drop-shadow-xl">
            {travel.clientName}
          </h2>
          <div className="flex items-center justify-center space-x-8 text-xl print:text-lg drop-shadow-lg">
            <div className="flex items-center space-x-2">
              <Calendar className="w-6 h-6" />
              <span>{formatDate(travel.startDate)} - {formatDate(travel.endDate)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6" />
              <span>{travel.travelers} {travel.travelers === 1 ? 'viajero' : 'viajeros'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal - Itinerario en páginas siguientes */}
      <div className="max-w-4xl mx-auto p-6 print:p-0 print:max-w-none print:pt-8">
        {/* Encabezado del itinerario en páginas siguientes */}
        <div className="text-center mb-8 print:mb-6 print:mt-0">
          <h1 className="text-4xl font-bold text-foreground mb-4 print:text-3xl">
            Itinerario Detallado
          </h1>
          <h2 className="text-2xl text-muted-foreground mb-4 print:text-xl">
            {travel.name}
          </h2>
          <div className="flex items-center justify-center space-x-6 text-muted-foreground mb-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(travel.startDate)} - {formatDate(travel.endDate)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{travel.clientName} ({travel.travelers} {travel.travelers === 1 ? 'viajero' : 'viajeros'})</span>
            </div>
          </div>
        </div>

        {/* Itinerario Cronológico */}
        {chronologicalEvents.length > 0 && (
          <section className="mb-8 print:mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 print:text-xl flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-accent" />
              Itinerario Cronológico
            </h2>
            <div className="grid gap-4">
              {chronologicalEvents.map((event) => renderEventCard(event))}
            </div>
          </section>
        )}

        {/* Seguros */}
        {insurances.length > 0 && (
          <section className="mb-8 print:mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 print:text-xl flex items-center">
              <Shield className="w-6 h-6 mr-2 text-accent" />
              Seguros
            </h2>
            <div className="grid gap-4">
              {insurances.map((insurance) => (
                <Card key={insurance.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{insurance.provider}</h3>
                      <Badge>{insurance.policyType}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>📋 Póliza: {insurance.policyNumber}</div>
                      <div>📅 Válido desde: {formatDateTime(insurance.effectiveDate)}</div>
                      {insurance.emergencyNumber && <div>📞 Emergencias: {insurance.emergencyNumber}</div>}
                      {insurance.importantInfo && <div>ℹ️ {insurance.importantInfo}</div>}
                    </div>
                    {insurance.policyDescription && (
                      <p className="mt-2 text-sm text-muted-foreground border-t border-border pt-2">
                        <strong>Descripción:</strong> {insurance.policyDescription}
                      </p>
                    )}
                    {insurance.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        <strong>Notas:</strong> {insurance.notes}
                      </p>
                    )}
                    {insurance.attachments && insurance.attachments.length > 0 && (
                      <div className="mt-3 border-t border-border pt-3">
                        <p className="text-sm font-medium text-foreground mb-2">Documentos Adjuntos</p>
                        <div className="space-y-1">
                          {insurance.attachments.map((fileName: string, index: number) => (
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
              ))}
            </div>
          </section>
        )}


        {/* Footer para impresión */}
        <div className="print:block hidden mt-8 border-t border-border pt-4 text-center text-sm text-muted-foreground">
          <p>Itinerario generado por PLANNEALO - Agencia de Viajes</p>
          <p>Fecha de generación: {formatDate(new Date())}</p>
        </div>
      </div>
    </div>
  );
}