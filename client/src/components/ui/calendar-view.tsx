import { useState, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Left, Right, Calendar as DateIcon } from "@icon-park/react";
import { useLocation } from "wouter";
import type { Travel, Accommodation, Activity, Flight, Transport, Cruise, Insurance, Note } from "@shared/schema";

interface CalendarViewProps {
  travels: Travel[];
}

const DAYS_OF_WEEK = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

type ItineraryEventType = "accommodation" | "activity" | "flight" | "transport" | "cruise" | "insurance" | "note";

type TravelFullData = {
  travel: Travel;
  accommodations: Accommodation[];
  activities: Activity[];
  flights: Flight[];
  transports: Transport[];
  cruises: Cruise[];
  insurances: Insurance[];
  notes: Note[];
};

type CalendarEvent = {
  id: string;
  type: ItineraryEventType;
  date: Date;
  label: string;
  travelId: string;
  travelName: string;
};

const EVENT_TYPE_STYLES: Record<ItineraryEventType, string> = {
  flight: "bg-blue-50 text-blue-700 border-blue-200",
  activity: "bg-emerald-50 text-emerald-700 border-emerald-200",
  transport: "bg-amber-50 text-amber-700 border-amber-200",
  accommodation: "bg-violet-50 text-violet-700 border-violet-200",
  cruise: "bg-cyan-50 text-cyan-700 border-cyan-200",
  insurance: "bg-rose-50 text-rose-700 border-rose-200",
  note: "bg-gray-50 text-gray-700 border-gray-200",
};

const EVENT_FILTERS: Array<{ id: "all" | ItineraryEventType; label: string }> = [
  { id: "all", label: "Todo" },
  { id: "flight", label: "Vuelos" },
  { id: "activity", label: "Actividades" },
  { id: "transport", label: "Transporte" },
  { id: "accommodation", label: "Alojamiento" },
  { id: "cruise", label: "Cruceros" },
  { id: "insurance", label: "Seguros" },
  { id: "note", label: "Notas" },
];

const MAX_EVENTS_PER_DAY = 4;

export function CalendarView({ travels }: CalendarViewProps) {
  const getStartOfWeek = (date: Date) => {
    const result = new Date(date);
    const day = result.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    result.setDate(result.getDate() + diff);
    result.setHours(0, 0, 0, 0);
    return result;
  };

  const addDays = (date: Date, amount: number) => {
    const next = new Date(date);
    next.setDate(next.getDate() + amount);
    return next;
  };

  const formatRangeLabel = (start: Date, end: Date) => {
    const formatDay = new Intl.DateTimeFormat("es-MX", { day: "2-digit" });
    const formatMonth = new Intl.DateTimeFormat("es-MX", { month: "short" });
    const formatMonthYear = new Intl.DateTimeFormat("es-MX", { month: "short", year: "numeric" });

    const startDay = formatDay.format(start);
    const endDay = formatDay.format(end);
    const startMonth = formatMonth.format(start).replace(".", "");
    const endMonth = formatMonth.format(end).replace(".", "");
    const startMonthYear = formatMonthYear.format(start).replace(".", "");
    const endMonthYear = formatMonthYear.format(end).replace(".", "");

    if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
      return `${startDay}-${endDay} ${startMonthYear}`;
    }

    if (start.getFullYear() === end.getFullYear()) {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${start.getFullYear()}`;
    }

    return `${startDay} ${startMonthYear} - ${endDay} ${endMonthYear}`;
  };

  const buildDateWithTime = (dateValue: string | Date, timeValue?: string | null) => {
    const date = new Date(dateValue);
    if (timeValue) {
      const [hours, minutes] = timeValue.split(":").map(Number);
      date.setHours(Number.isFinite(hours) ? hours : 0, Number.isFinite(minutes) ? minutes : 0, 0, 0);
    }
    return date;
  };

  const buildLabeledName = (prefix: string, name?: string | null) => {
    if (!name) return prefix;
    const normalized = name.trim();
    if (!normalized) return prefix;
    if (normalized.toLowerCase().startsWith(prefix.toLowerCase())) return normalized;
    return `${prefix} ${normalized}`;
  };

  const getEventLabel = (type: ItineraryEventType, data: any) => {
    switch (type) {
      case "flight": {
        const from = data.departureAirport || data.departureCity;
        const to = data.arrivalAirport || data.arrivalCity;
        const route = from && to ? `${from}-${to}` : `${data.airline || ""} ${data.flightNumber || ""}`.trim();
        return buildLabeledName("Vuelo", route || undefined);
      }
      case "activity":
        return buildLabeledName("Actividad", data.name);
      case "transport": {
        const from = data.pickupLocation;
        const to = data.dropoffLocation;
        const route = from && to ? `${from}-${to}` : from || to || data.name || data.type;
        return buildLabeledName("Transporte", route);
      }
      case "accommodation":
        return buildLabeledName("Alojamiento", data.name);
      case "cruise":
        return buildLabeledName("Crucero", data.cruiseLine);
      case "insurance":
        return buildLabeledName("Seguro", data.provider);
      case "note":
        return buildLabeledName("Nota", data.title);
      default:
        return "Evento";
    }
  };

  const [currentStartDate, setCurrentStartDate] = useState(() => getStartOfWeek(new Date()));
  const [activeEventFilter, setActiveEventFilter] = useState<"all" | ItineraryEventType>("all");
  const [, setLocation] = useLocation();

  const activeTravels = useMemo(() => travels.filter((travel) => travel.status !== "delete"), [travels]);
  const travelIds = useMemo(() => activeTravels.map((travel) => travel.id), [activeTravels]);

  const travelDetailsQueries = useQueries({
    queries: travelIds.map((travelId) => ({
      queryKey: ["/api/travels", travelId, "full"],
      enabled: Boolean(travelId),
    })),
  });

  const calendarEvents = useMemo(() => {
    const events: CalendarEvent[] = [];

    travelDetailsQueries.forEach((query, index) => {
      const data = query.data as TravelFullData | undefined;
      if (!data) return;

      const travelName = data.travel?.name || activeTravels[index]?.name || "Viaje";
      const travelId = data.travel?.id || travelIds[index];

      data.accommodations?.forEach((item) => {
        events.push({
          id: `${travelId}-accommodation-${item.id}`,
          type: "accommodation",
          date: new Date(item.checkIn),
          label: getEventLabel("accommodation", item),
          travelId,
          travelName,
        });
      });

      data.activities?.forEach((item) => {
        events.push({
          id: `${travelId}-activity-${item.id}`,
          type: "activity",
          date: buildDateWithTime(item.date, item.startTime),
          label: getEventLabel("activity", item),
          travelId,
          travelName,
        });
      });

      data.flights?.forEach((item) => {
        events.push({
          id: `${travelId}-flight-${item.id}`,
          type: "flight",
          date: new Date(item.departureDate),
          label: getEventLabel("flight", item),
          travelId,
          travelName,
        });
      });

      data.transports?.forEach((item) => {
        events.push({
          id: `${travelId}-transport-${item.id}`,
          type: "transport",
          date: buildDateWithTime(item.pickupDate, null),
          label: getEventLabel("transport", item),
          travelId,
          travelName,
        });
      });

      data.cruises?.forEach((item) => {
        events.push({
          id: `${travelId}-cruise-${item.id}`,
          type: "cruise",
          date: new Date(item.departureDate),
          label: getEventLabel("cruise", item),
          travelId,
          travelName,
        });
      });

      data.insurances?.forEach((item) => {
        events.push({
          id: `${travelId}-insurance-${item.id}`,
          type: "insurance",
          date: new Date(item.effectiveDate),
          label: getEventLabel("insurance", item),
          travelId,
          travelName,
        });
      });

      data.notes?.forEach((item) => {
        events.push({
          id: `${travelId}-note-${item.id}`,
          type: "note",
          date: new Date(item.noteDate),
          label: getEventLabel("note", item),
          travelId,
          travelName,
        });
      });
    });

    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [travelDetailsQueries, activeTravels, travelIds]);

  const getDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    calendarEvents.forEach((event) => {
      const key = getDateKey(event.date);
      const list = map.get(key) || [];
      list.push(event);
      map.set(key, list);
    });
    return map;
  }, [calendarEvents]);

  const startDate = currentStartDate;
  const endDate = addDays(startDate, 13);

  const calendarDays = useMemo(() => {
    return Array.from({ length: 14 }, (_, index) => addDays(startDate, index));
  }, [startDate]);

  const goToPreviousTwoWeeks = () => {
    setCurrentStartDate(addDays(currentStartDate, -14));
  };

  const goToNextTwoWeeks = () => {
    setCurrentStartDate(addDays(currentStartDate, 14));
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <DateIcon className="h-5 w-5" />
            Calendario de Mis viajes
          </CardTitle>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <Button variant="outline" size="sm" onClick={goToPreviousTwoWeeks}>
              <Left className="h-4 w-4" />
            </Button>
            <span className="text-base sm:text-lg font-semibold min-w-[160px] text-center">
              {formatRangeLabel(startDate, endDate)}
            </span>
            <Button variant="outline" size="sm" onClick={goToNextTwoWeeks}>
              <Right className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 md:p-6">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-4">
          {/* Days of week header */}
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="p-1 sm:p-2 text-center text-xs sm:text-sm font-semibold text-gray-600 border-b">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((dayDate, index) => {
            const isToday =
              new Date().getDate() === dayDate.getDate() &&
              new Date().getMonth() === dayDate.getMonth() &&
              new Date().getFullYear() === dayDate.getFullYear();

            const dayKey = getDateKey(dayDate);
            const dayEvents = (eventsByDate.get(dayKey) || []).filter((event) =>
              activeEventFilter === "all" ? true : event.type === activeEventFilter
            );
            const visibleEvents = dayEvents.slice(0, MAX_EVENTS_PER_DAY);
            const showMonthLabel = dayDate.getDate() === 1 || index === 0;

            return (
              <div
                key={dayKey}
                className={`min-h-[120px] sm:min-h-[140px] p-1 sm:p-1.5 border border-gray-200 transition-colors bg-white hover:bg-gray-50 ${
                  isToday ? "ring-1 sm:ring-2 ring-red-500 bg-red-50" : ""
                }`}
              >
                <div className={`text-xs sm:text-sm font-medium ${isToday ? "text-red-600" : "text-gray-900"} mb-1`}>
                  {dayDate.getDate()}
                  {showMonthLabel && (
                    <span className="ml-1 text-[10px] sm:text-xs text-gray-500">
                      {dayDate.toLocaleDateString("es-MX", { month: "short" }).replace(".", "")}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {visibleEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`rounded-sm border px-1 py-0.5 text-[10px] sm:text-xs leading-tight truncate cursor-pointer hover:opacity-90 transition-opacity ${
                        EVENT_TYPE_STYLES[event.type]
                      }`}
                      title={`${event.label} • ${event.travelName}`}
                      onClick={() => setLocation(`/travel/${event.travelId}`)}
                    >
                      <div className="truncate">{event.label}</div>
                      <div className="truncate text-[9px] sm:text-[10px] text-gray-500">{event.travelName}</div>
                    </div>
                  ))}
                  {dayEvents.length > MAX_EVENTS_PER_DAY && (
                    <div className="text-[9px] sm:text-xs text-gray-500 text-center cursor-default">
                      +{dayEvents.length - MAX_EVENTS_PER_DAY} mas
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t pt-3 sm:pt-4 space-y-3">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-600">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-red-500 rounded-sm"></div>
            Hoy
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Filtrar por evento:</h4>
            <div className="flex flex-wrap gap-2">
              {EVENT_FILTERS.map((filter) => {
                const isActive = activeEventFilter === filter.id;
                const style = filter.id === "all" ? "bg-gray-100 text-gray-700 border-gray-200" : EVENT_TYPE_STYLES[filter.id];

                return (
                  <Button
                    key={filter.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveEventFilter(filter.id)}
                    className={`text-[10px] sm:text-xs h-7 px-2 border ${isActive ? style : ""}`}
                  >
                    {filter.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}