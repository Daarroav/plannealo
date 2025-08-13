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

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto p-6 print:p-0 print:max-w-none">
        {/* Encabezado del viaje */}
        <div className="text-center mb-8 print:mb-6">
          <h1 className="text-4xl font-bold text-foreground mb-4 print:text-3xl">
            {travel.title}
          </h1>
          <div className="flex items-center justify-center space-x-6 text-muted-foreground mb-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(travel.startDate)} - {formatDate(travel.endDate)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{travel.destination}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{travel.clientName}</span>
            </div>
          </div>
          {travel.description && (
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {travel.description}
            </p>
          )}
        </div>

        {/* Alojamientos */}
        {accommodations.length > 0 && (
          <section className="mb-8 print:mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 print:text-xl flex items-center">
              <Bed className="w-6 h-6 mr-2 text-accent" />
              Alojamientos
            </h2>
            <div className="grid gap-4">
              {accommodations.map((accommodation) => (
                <Card key={accommodation.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{accommodation.name}</h3>
                      <Badge>{accommodation.category}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>📍 {accommodation.address}</div>
                      <div>📅 {formatDate(accommodation.checkIn)} - {formatDate(accommodation.checkOut)}</div>
                      <div>🛏️ {accommodation.roomType}</div>
                      {accommodation.confirmationNumber && (
                        <div>🎫 {accommodation.confirmationNumber}</div>
                      )}
                    </div>
                    {accommodation.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">{accommodation.notes}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Actividades */}
        {activities.length > 0 && (
          <section className="mb-8 print:mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 print:text-xl flex items-center">
              <Camera className="w-6 h-6 mr-2 text-accent" />
              Actividades
            </h2>
            <div className="grid gap-4">
              {activities.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{activity.name}</h3>
                      <Badge>{activity.category}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>📍 {activity.location}</div>
                      <div>📅 {formatDateTime(activity.dateTime)}</div>
                      <div>⏱️ Duración: {activity.duration} horas</div>
                      {activity.price && <div>💰 ${activity.price}</div>}
                    </div>
                    {activity.description && (
                      <p className="mt-2 text-sm text-muted-foreground">{activity.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Vuelos */}
        {flights.length > 0 && (
          <section className="mb-8 print:mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 print:text-xl flex items-center">
              <Plane className="w-6 h-6 mr-2 text-accent" />
              Vuelos
            </h2>
            <div className="grid gap-4">
              {flights.map((flight) => (
                <Card key={flight.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{flight.airline} {flight.flightNumber}</h3>
                      <Badge>{flight.class}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>🛫 {flight.departure} → {flight.arrival}</div>
                      <div>📅 {formatDateTime(flight.departureDateTime)}</div>
                      <div>⏱️ {formatDateTime(flight.arrivalDateTime)}</div>
                      {flight.confirmationNumber && (
                        <div>🎫 {flight.confirmationNumber}</div>
                      )}
                    </div>
                    {flight.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">{flight.notes}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Transportes */}
        {transports.length > 0 && (
          <section className="mb-8 print:mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 print:text-xl flex items-center">
              <Car className="w-6 h-6 mr-2 text-accent" />
              Transporte
            </h2>
            <div className="grid gap-4">
              {transports.map((transport) => (
                <Card key={transport.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{transport.company}</h3>
                      <Badge>{transport.type}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>📍 {transport.pickupLocation} → {transport.dropoffLocation}</div>
                      <div>📅 {formatDateTime(transport.pickupDateTime)}</div>
                      {transport.confirmationNumber && (
                        <div>🎫 {transport.confirmationNumber}</div>
                      )}
                    </div>
                    {transport.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">{transport.notes}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Cruceros */}
        {cruises.length > 0 && (
          <section className="mb-8 print:mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 print:text-xl flex items-center">
              <Ship className="w-6 h-6 mr-2 text-accent" />
              Cruceros
            </h2>
            <div className="grid gap-4">
              {cruises.map((cruise) => (
                <Card key={cruise.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{cruise.cruiseLine}</h3>
                      <Badge>{cruise.cabinType}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>🚢 {cruise.shipName}</div>
                      <div>📅 {formatDate(cruise.sailingDate)} - {formatDate(cruise.disembarkationDate)}</div>
                      <div>🛳️ {cruise.sailingPort} → {cruise.disembarkationPort}</div>
                      {cruise.confirmationNumber && (
                        <div>🎫 {cruise.confirmationNumber}</div>
                      )}
                    </div>
                    {cruise.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">{cruise.notes}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
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
                      <Badge>{insurance.type}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>📋 {insurance.policyNumber}</div>
                      <div>📅 {formatDate(insurance.startDate)} - {formatDate(insurance.endDate)}</div>
                      <div>📞 {insurance.emergencyContact}</div>
                      <div>💰 ${insurance.coverage}</div>
                    </div>
                    {insurance.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">{insurance.notes}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Notas visibles para viajeros */}
        {notes.filter(note => note.visibleToTravelers).length > 0 && (
          <section className="mb-8 print:mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 print:text-xl flex items-center">
              <StickyNote className="w-6 h-6 mr-2 text-accent" />
              Notas Importantes
            </h2>
            <div className="grid gap-4">
              {notes.filter(note => note.visibleToTravelers).map((note) => (
                <Card key={note.id}>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{formatDateTime(note.noteDate)}</p>
                    <div className="p-3 bg-muted/20 rounded-lg border-l-4 border-accent">
                      <p className="whitespace-pre-wrap">{note.content}</p>
                    </div>
                    {note.attachments && note.attachments.length > 0 && (
                      <div className="mt-3 border-t border-border pt-3">
                        <p className="text-sm font-medium text-foreground mb-2">Documentos Adjuntos</p>
                        <div className="space-y-1">
                          {note.attachments.map((fileName: string, index: number) => (
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