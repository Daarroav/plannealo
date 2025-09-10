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
  Download,
  Mail,
  Globe,
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
  
  // Obtener el token de los query parameters si existe
  const searchParams = new URLSearchParams(window.location.search);
  const publicToken = searchParams.get('token');

  const { data, isLoading, error } = useQuery<TravelData>({
    queryKey: ["/api/travels", id, "full", publicToken],
    queryFn: async () => {
      const url = new URL(`/api/travels/${id}/full`, window.location.origin);
      if (publicToken) {
        url.searchParams.set('token', publicToken);
      }
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch travel data');
      }
      return response.json();
    },
    enabled: !!id,
  });

  console.info(data);

  const formatDateTime = (dateTime: string | Date) => {
    const date = new Date(dateTime);
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
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
          <p className="text-muted-foreground">
            No se pudo cargar el itinerario
          </p>
        </div>
      </div>
    );
  }

  const {
    travel,
    accommodations,
    activities,
    flights,
    transports,
    cruises,
    insurances,
    notes,
  } = data;

  // Combinar y ordenar todos los eventos cronológicamente
  const getAllEvents = () => {
    const events: Array<{
      id: string;
      type:
        | "accommodation"
        | "activity"
        | "flight"
        | "transport"
        | "cruise"
        | "note";
      date: Date;
      data: any;
    }> = [];

    // Agregar actividades
    activities.forEach((activity) => {
      events.push({
        id: activity.id,
        type: "activity",
        date: new Date(activity.date),
        data: activity,
      });
    });

    // Agregar vuelos
    flights.forEach((flight) => {
      events.push({
        id: flight.id,
        type: "flight",
        date: new Date(flight.departureDate),
        data: flight,
      });
    });

    // Agregar transportes
    transports.forEach((transport) => {
      events.push({
        id: transport.id,
        type: "transport",
        date: new Date(transport.pickupDate),
        data: transport,
      });
    });

    // Agregar cruceros
    cruises.forEach((cruise) => {
      events.push({
        id: cruise.id,
        type: "cruise",
        date: new Date(cruise.departureDate),
        data: cruise,
      });
    });

    // Agregar alojamientos
    accommodations.forEach((accommodation) => {
      events.push({
        id: accommodation.id,
        type: "accommodation",
        date: new Date(accommodation.checkIn),
        data: accommodation,
      });
    });

    // Agregar notas importantes visibles para viajeros
    notes
      .filter((note) => note.visibleToTravelers)
      .forEach((note) => {
        events.push({
          id: note.id,
          type: "note",
          date: new Date(note.noteDate),
          data: note,
        });
      });

    // Ordenar cronológicamente
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const chronologicalEvents = getAllEvents();

  // Agrupar eventos por día
  const groupEventsByDay = (events: any[]) => {
    const groups: { [key: string]: any[] } = {};

    events.forEach((event) => {
      const date = new Date(event.date);
      const dayKey = date.toISOString().split("T")[0]; // YYYY-MM-DD format

      if (!groups[dayKey]) {
        groups[dayKey] = [];
      }
      groups[dayKey].push(event);
    });

    return Object.keys(groups)
      .sort()
      .map((dateKey) => ({
        date: new Date(dateKey),
        events: groups[dateKey],
      }));
  };

  const formatDayLabel = (date: Date) => {
    const dayNames = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
    const monthNames = [
      "ENE",
      "FEB",
      "MAR",
      "ABR",
      "MAY",
      "JUN",
      "JUL",
      "AGO",
      "SEP",
      "OCT",
      "NOV",
      "DIC",
    ];

    return {
      dayOfWeek: dayNames[date.getDay()],
      month: monthNames[date.getMonth()],
      dayNumber: date.getDate(),
    };
  };

  const groupedEvents = groupEventsByDay(chronologicalEvents);

  const renderEventCard = (event: any) => {
    switch (event.type) {
      case "activity":
        return (
          <div
            key={event.id}
            className="border border-border rounded-lg p-4 bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-accent" />
                <h3 className="text-lg font-semibold">{event.data.name}</h3>
              </div>
              <Badge variant="secondary" className="text-xs">
                Actividad
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-600 uppercase text-xs">
                  TIPO
                </div>
                <div className="text-gray-900">{event.data.type}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600 uppercase text-xs">
                  HORARIO
                </div>
                <div className="text-gray-900">
                  {event.data.startTime} -{" "}
                  {event.data.endTime || "Sin hora fin"}
                </div>
              </div>
              {event.data.provider && (
                <div>
                  <div className="font-medium text-gray-600 uppercase text-xs">
                    PROVEEDOR
                  </div>
                  <div className="text-gray-900">{event.data.provider}</div>
                </div>
              )}
              {event.data.confirmationNumber && (
                <div>
                  <div className="font-medium text-gray-600 uppercase text-xs">
                    CONFIRMACIÓN
                  </div>
                  <div className="text-gray-900">
                    {event.data.confirmationNumber}
                  </div>
                </div>
              )}
            </div>
            {event.data.notes && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600">{event.data.notes}</div>
              </div>
            )}
          </div>
        );

      case "flight":
        return (
          <div
            key={event.id}
            className="border border-border rounded-lg p-4 bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <Plane className="w-4 h-4 text-accent" />
                <h3 className="text-lg font-semibold">
                  Vuelo: {event.data.departureCity} → {event.data.arrivalCity}
                </h3>
              </div>
              <Badge variant="secondary" className="text-xs">
                Vuelo
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-600 uppercase text-xs">
                  AEROLÍNEA & VUELO
                </div>
                <div className="text-gray-900">
                  {event.data.airline} {event.data.flightNumber}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-600 uppercase text-xs">
                  SALIDA
                </div>
                <div className="text-gray-900">
                  {formatDateTime(event.data.departureDate)}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-600 uppercase text-xs">
                  LLEGADA
                </div>
                <div className="text-gray-900">
                  {formatDateTime(event.data.arrivalDate)}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-600 uppercase text-xs">
                  CLASE
                </div>
                <div className="text-gray-900">{event.data.class}</div>
              </div>
              {event.data.departureTerminal && (
                <div>
                  <div className="font-medium text-gray-600 uppercase text-xs">
                    TERMINAL SALIDA
                  </div>
                  <div className="text-gray-900">
                    {event.data.departureTerminal}
                  </div>
                </div>
              )}
              {event.data.arrivalTerminal && (
                <div>
                  <div className="font-medium text-gray-600 uppercase text-xs">
                    TERMINAL LLEGADA
                  </div>
                  <div className="text-gray-900">
                    {event.data.arrivalTerminal}
                  </div>
                </div>
              )}
              <div>
                <div className="font-medium text-gray-600 uppercase text-xs">
                  RESERVA
                </div>
                <div className="text-gray-900">
                  {event.data.reservationNumber}
                </div>
              </div>
            </div>
          </div>
        );

      case "transport":
        return (
          <div
            key={event.id}
            className="border border-border rounded-lg p-4 bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <Car className="w-4 h-4 text-accent" />
                <h3 className="text-lg font-semibold">{event.data.name}</h3>
              </div>
              <Badge variant="secondary" className="text-xs">
                Transporte
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-600 uppercase text-xs">
                  TIPO
                </div>
                <div className="text-gray-900">{event.data.type}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600 uppercase text-xs">
                  RECOGIDA
                </div>
                <div className="text-gray-900">
                  {formatDateTime(event.data.pickupDate)}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-600 uppercase text-xs">
                  DESDE
                </div>
                <div className="text-gray-900">{event.data.pickupLocation}</div>
              </div>
              {event.data.dropoffLocation && (
                <div>
                  <div className="font-medium text-gray-600 uppercase text-xs">
                    HASTA
                  </div>
                  <div className="text-gray-900">
                    {event.data.dropoffLocation}
                  </div>
                </div>
              )}
              {event.data.provider && (
                <div>
                  <div className="font-medium text-gray-600 uppercase text-xs">
                    PROVEEDOR
                  </div>
                  <div className="text-gray-900">{event.data.provider}</div>
                </div>
              )}
              {event.data.contactName && (
                <div>
                  <div className="font-medium text-gray-600 uppercase text-xs">
                    CONTACTO
                  </div>
                  <div className="text-gray-900">
                    {event.data.contactName}: {event.data.contactNumber}
                  </div>
                </div>
              )}
              {event.data.confirmationNumber && (
                <div>
                  <div className="font-medium text-gray-600 uppercase text-xs">
                    CONFIRMACIÓN
                  </div>
                  <div className="text-gray-900">
                    {event.data.confirmationNumber}
                  </div>
                </div>
              )}
            </div>
            {event.data.notes && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600">{event.data.notes}</div>
              </div>
            )}
          </div>
        );

      case "cruise":
        return (
          <div
            key={event.id}
            className="border border-border rounded-lg p-4 bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <Ship className="w-4 h-4 text-accent" />
                <h3 className="text-lg font-semibold">
                  {event.data.cruiseLine}
                </h3>
              </div>
              <Badge variant="secondary" className="text-xs">
                Crucero
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-600 uppercase text-xs">
                  SALIDA
                </div>
                <div className="text-gray-900">
                  {formatDateTime(event.data.departureDate)}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-600 uppercase text-xs">
                  REGRESO
                </div>
                <div className="text-gray-900">
                  {formatDateTime(event.data.arrivalDate)}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-600 uppercase text-xs">
                  PUERTO SALIDA
                </div>
                <div className="text-gray-900">{event.data.departurePort}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600 uppercase text-xs">
                  PUERTO LLEGADA
                </div>
                <div className="text-gray-900">{event.data.arrivalPort}</div>
              </div>
              {event.data.confirmationNumber && (
                <div>
                  <div className="font-medium text-gray-600 uppercase text-xs">
                    CONFIRMACIÓN
                  </div>
                  <div className="text-gray-900">
                    {event.data.confirmationNumber}
                  </div>
                </div>
              )}
            </div>
            {event.data.notes && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600">{event.data.notes}</div>
              </div>
            )}
          </div>
        );

      case "accommodation":
        return (
          <div
            key={event.id}
            className="border border-border rounded-lg p-4 bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <Bed className="w-4 h-4 text-accent" />
                <h3 className="text-lg font-semibold">{event.data.name}</h3>
              </div>
              <Badge variant="secondary" className="text-xs">
                Alojamiento
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-600 uppercase text-xs">
                  TIPO
                </div>
                <div className="text-gray-900">{event.data.type}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600 uppercase text-xs">
                  UBICACIÓN
                </div>
                <div className="text-gray-900">{event.data.location}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600 uppercase text-xs">
                  CHECK-IN
                </div>
                <div className="text-gray-900">
                  {formatDateTime(event.data.checkIn)}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-600 uppercase text-xs">
                  CHECK-OUT
                </div>
                <div className="text-gray-900">
                  {formatDateTime(event.data.checkOut)}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-600 uppercase text-xs">
                  HABITACIÓN
                </div>
                <div className="text-gray-900">{event.data.roomType}</div>
              </div>
              {event.data.confirmationNumber && (
                <div>
                  <div className="font-medium text-gray-600 uppercase text-xs">
                    CONFIRMACIÓN
                  </div>
                  <div className="text-gray-900">
                    {event.data.confirmationNumber}
                  </div>
                </div>
              )}
            </div>
            {event.data.notes && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600">{event.data.notes}</div>
              </div>
            )}
            {event.data.policies && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <strong>Políticas:</strong> {event.data.policies}
                </div>
              </div>
            )}
            {event.data.thumbnail && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <img 
                  src={event.data.thumbnail.startsWith('/uploads/') ? event.data.thumbnail : `/uploads/${event.data.thumbnail}`}
                  alt={`Imagen de ${event.data.name}`}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            {event.data.attachments && event.data.attachments.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Documentos Adjuntos
                </p>
                <div className="space-y-1">
                  {event.data.attachments.map(
                    (fileName: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <FileText className="w-4 h-4 text-gray-600" />
                        <a 
                          href={fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {fileName.replace('/uploads/', '').replace(/^.*\//, '')}
                        </a>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case "note":
        return (
          <div
            key={event.id}
            className="border border-border rounded-lg p-4  border-l-4 border-l-yellow-400"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <StickyNote className="w-4 h-4 text-yellow-600" />
                <h3 className="text-lg font-semibold">{event.data.title}</h3>
              </div>
              <Badge
                variant="secondary"
                className="text-xs bg-yellow-100 text-yellow-800"
              >
                Nota Importante
              </Badge>
            </div>
            <div className="p-3 rounded-lg ">
              <p className="whitespace-pre-wrap text-sm text-gray-800">
                {event.data.content}
              </p>
            </div>
            {event.data.attachments && event.data.attachments.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Documentos Adjuntos
                </p>
                <div className="space-y-1">
                  {event.data.attachments.map(
                    (fileName: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <FileText className="w-4 h-4 text-gray-600" />
                        <a 
                          href={fileName.startsWith('/uploads/') ? fileName : `/uploads/${fileName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {fileName.replace('/uploads/', '').replace(/^.*\//, '')}
                        </a>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
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
        className="cover-page relative w-full h-screen flex items-center justify-center text-center overflow-hidden print:break-after-page"
        style={{
          backgroundImage: travel.coverImage
            ? `url(${travel.coverImage.startsWith("/objects/") ? `/api${travel.coverImage}` : travel.coverImage})`
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay oscuro para mejorar legibilidad del texto */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Logo y marca en la parte superior */}
        <div className="absolute top-8 left-8 z-10">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg">PLANNEALO</div>
                <div className="text-gray-600 text-sm">Agencia de Viajes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido de la portada */}
        <div className="relative z-10 text-white px-8 max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-8 print:text-5xl drop-shadow-2xl">
            {travel.name}
          </h1>
          <h2 className="text-3xl font-light mb-6 print:text-2xl drop-shadow-xl">
            {travel.clientName}
          </h2>
          <div className="flex items-center justify-center space-x-8 text-xl print:text-lg drop-shadow-lg mb-8">
            <div className="flex items-center space-x-2">
              <Calendar className="w-6 h-6" />
              <span>
                {formatDate(travel.startDate)} - {formatDate(travel.endDate)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6" />
              <span>
                {travel.travelers}{" "}
                {travel.travelers === 1 ? "viajero" : "viajeros"}
              </span>
            </div>
          </div>
          
          {/* Información del agente de viajes en la portada */}
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-3 text-center">Su Agente de Viajes</h3>
            <div className="text-center space-y-2">
              <p className="text-sm opacity-90">
                <strong>Email:</strong> plannealo@gmail.com
              </p>
              <p className="text-sm opacity-90">
                <strong>Teléfono:</strong> +1 (555) 123-4567
              </p>
              <p className="text-xs opacity-75 mt-3">
                Estamos aquí para hacer de tu viaje una experiencia inolvidable
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal - Itinerario en páginas siguientes */}
      <div className="max-w-4xl mx-auto p-6 print:p-4 print:max-w-none">
        {/* Encabezado del itinerario en páginas siguientes */}
        <div className="text-center mb-8 print:mb-4">
          <h1 className="text-4xl font-bold text-foreground mb-4 print:text-3xl">
            Itinerario Detallado
          </h1>
          <h2 className="text-2xl text-muted-foreground mb-4 print:text-xl">
            {travel.name}
          </h2>
          <div className="flex items-center justify-center space-x-6 text-muted-foreground mb-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(travel.startDate)} - {formatDate(travel.endDate)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>
                {travel.clientName} ({travel.travelers}{" "}
                {travel.travelers === 1 ? "viajero" : "viajeros"})
              </span>
            </div>
          </div>
        </div>

        {/* Itinerario Cronológico */}
        {groupedEvents.length > 0 && (
          <section className="mb-8 print:mb-6 print:p-3">
            <h2 className="text-2xl font-bold text-foreground mb-6 print:text-xl flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-accent" />
              Itinerario Cronológico
            </h2>
            <div className="space-y-8 print:px-4">
              {groupedEvents.map((dayGroup, dayIndex) => {
                const dayLabel = formatDayLabel(dayGroup.date);
                return (
                  <div
                    key={dayIndex}
                    className="border-b-2 border-border pb-8 last:border-b-0 print:px-2"
                  >
                    <div className="flex flex-col  gap-3">
                      {/* Etiqueta del día - lado izquierdo */}
                      <div className="flex text-center w-12">
                        <div className="flex flex-row justify-between bg-gray-900 text-white px-3 py-1.5 rounded-sm text-center items-center w-auto gap-3 ">
                          <div className="text-xs font-bold">
                            {dayLabel.dayOfWeek}
                          </div>
                          <div className="text-lg font-medium">
                            {dayLabel.month}
                          </div>
                          <div className="text-lg font-bold mt-1">
                            {dayLabel.dayNumber}
                          </div>
                        </div>
                      </div>

                      {/* Tarjetas del día - lado derecho */}
                      <div className="flex-1 space-y-3">
                        {dayGroup.events.map((event) => renderEventCard(event))}
                      </div>
                    </div>
                  </div>
                );
              })}
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
                      <h3 className="text-lg font-semibold">
                        {insurance.provider}
                      </h3>
                      <Badge>{insurance.policyType}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>📋 Póliza: {insurance.policyNumber}</div>
                      <div>
                        📅 Válido desde:{" "}
                        {formatDateTime(insurance.effectiveDate)}
                      </div>
                      {insurance.emergencyNumber && (
                        <div>📞 Emergencias: {insurance.emergencyNumber}</div>
                      )}
                      {insurance.importantInfo && (
                        <div>ℹ️ {insurance.importantInfo}</div>
                      )}
                    </div>
                    {insurance.policyDescription && (
                      <p className="mt-2 text-sm text-muted-foreground border-t border-border pt-2">
                        <strong>Descripción:</strong>{" "}
                        {insurance.policyDescription}
                      </p>
                    )}
                    {insurance.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        <strong>Notas:</strong> {insurance.notes}
                      </p>
                    )}
                    {insurance.attachments &&
                      insurance.attachments.length > 0 && (
                        <div className="mt-3 border-t border-border pt-3">
                          <p className="text-sm font-medium text-foreground mb-2">
                            Documentos Adjuntos
                          </p>
                          <div className="space-y-1">
                            {insurance.attachments.map(
                              (fileName: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2 text-sm"
                                >
                                  <FileText className="w-4 h-4 text-muted-foreground" />
                                  <a 
                                    href={fileName.startsWith('/uploads/') ? fileName : `/uploads/${fileName}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline"
                                  >
                                    {fileName.replace('/uploads/', '').replace(/^.*\//, '')}
                                  </a>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Footer visible en pantalla y para impresión */}
        <div className="mt-8 border-t-2 border-accent pt-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* Logo y información de la agencia */}
            <div className="flex items-center space-x-4">
              <div className=" h-16 bg-white rounded-full flex items-center justify-center ">
                <img src="http://127.0.0.1:3000/@fs/C:/xampp/htdocs/Proyectos/Arten/ViajePlan_180825/ViajePlan/attached_assets/LOGO_PNG_NEGRO-min_1755552589565.png" alt="Logo" className="w-auto h-14" />
              </div>
              <div>
                {/*<h3 className="text-lg font-bold text-foreground">PLANNEALO</h3>*/}
                <p className="text-sm text-muted-foreground">Agencia de Viajes</p>
                <p className="text-xs text-muted-foreground">Especialistas en experiencias únicas</p>
              </div>
            </div>
            
            {/* Información de contacto */}
            <div className="text-center lg:text-right">
              <h4 className="font-semibold text-foreground mb-2">Información de Contacto</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Email:</strong> plannealo@gmail.com</p>
                <p><strong>WhatsApp:</strong> +1 (555) 987-6543</p>
                  <p><strong>Registro:</strong> RNT-54321</p>
                <p><strong>Web:</strong> www.plannealo.com</p>
              </div>
            </div>
          </div>
          
          {/* Línea separadora y información adicional */}
          <div className="mt-6 pt-4 border-t border-border text-center">
            <div className="flex flex-col items-center text-xs text-muted-foreground text-center">
          
             
              <div className="text-center">
                <p>Powered by Arten Digital</p>
                <p>© 2024 PLANNEALO. Todos los derechos reservados.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
