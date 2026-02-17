import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Left, Right, Calendar as DateIcon } from "@icon-park/react";
import { useLocation } from "wouter";
import type { Travel } from "@shared/schema";

interface CalendarViewProps {
  travels: Travel[];
}

const PASTEL_COLORS = [
  "bg-pink-100 text-pink-800 border-pink-200",
  "bg-blue-100 text-blue-800 border-blue-200", 
  "bg-green-100 text-green-800 border-green-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-orange-100 text-orange-800 border-orange-200",
  "bg-indigo-100 text-indigo-800 border-indigo-200",
  "bg-cyan-100 text-cyan-800 border-cyan-200",
  "bg-emerald-100 text-emerald-800 border-emerald-200",
  "bg-violet-100 text-violet-800 border-violet-200",
  "bg-rose-100 text-rose-800 border-rose-200"
];

const UNPUBLISHED_COLOR = "bg-gray-100 text-gray-600 border-gray-200";

const DAYS_OF_WEEK = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function CalendarView({ travels }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [, setLocation] = useLocation();

  // Get month and year from current date
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Get first day of week (0 = Sunday, 1 = Monday, etc.)
    // Convert to Monday-first (0 = Monday, 1 = Tuesday, etc.)
    let firstDayOfWeek = firstDayOfMonth.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  }, [currentMonth, currentYear]);

  // Función para normalizar fechas (ignorar horas)
  const normalizeDate = (date: Date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  // Get travels for a specific date
  const getTravelsForDate = (day: number) => {
    if (!day) return [];
    
    const targetDate = new Date(currentYear, currentMonth, day);
    
    return travels.filter(travel => {
      // Excluir viajes con status = delete
      if (travel.status === "delete") {
        return false;
      }
      
      const startDate = new Date(travel.startDate);
      const endDate = new Date(travel.endDate);
      
      // Normalizamos las fechas para comparar solo días
      const normalizedTarget = normalizeDate(targetDate);
      const normalizedStart = normalizeDate(startDate);
      const normalizedEnd = normalizeDate(endDate);
      
      // Check if the target date falls within the travel period
      return normalizedTarget >= normalizedStart && normalizedTarget <= normalizedEnd;
    });
  };

  // Assign colors to travels consistently
  const travelColors = useMemo(() => {
    const colorMap = new Map<string, string>();
    let colorIndex = 0;
    
    travels.forEach(travel => {
      // Excluir viajes con status = delete
      if (travel.status === "delete") {
        return;
      }
      
      if (!colorMap.has(travel.id)) {
        if (travel.status === 'published') {
          colorMap.set(travel.id, PASTEL_COLORS[colorIndex % PASTEL_COLORS.length]);
          colorIndex++;
        } else {
          colorMap.set(travel.id, UNPUBLISHED_COLOR);
        }
      }
    });
    
    return colorMap;
  }, [travels]);

  return (
    <Card className="w-full">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <DateIcon className="h-5 w-5" />
            Calendario de Mis viajes
          </CardTitle>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <Left className="h-4 w-4" />
            </Button>
            <span className="text-base sm:text-lg font-semibold min-w-[140px] text-center">
              {MONTHS[currentMonth]} {currentYear}
            </span>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <Right className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 md:p-6">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-4">
          {/* Days of week header */}
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="p-1 sm:p-2 text-center text-xs sm:text-sm font-semibold text-gray-600 border-b">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((day, index) => {
            const dayTravels = day ? getTravelsForDate(day) : [];
            const isToday = day && 
              new Date().getDate() === day && 
              new Date().getMonth() === currentMonth && 
              new Date().getFullYear() === currentYear;
            
            return (
              <div
                key={index}
                className={`min-h-[60px] sm:min-h-[80px] p-0.5 sm:p-1 border border-gray-200 transition-colors ${
                  day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                } ${isToday ? 'ring-1 sm:ring-2 ring-red-500 bg-red-50' : ''}`}
              >
                {day && (
                  <>
                    <div className={`text-xs sm:text-sm font-medium ${isToday ? 'text-red-600' : 'text-gray-900'} mb-0.5 sm:mb-1 px-0.5`}>
                      {day}
                    </div>
                    <div className="space-y-0.5 sm:space-y-1">
                      {dayTravels.slice(0, 2).map(travel => (
                        <Badge
                          key={travel.id}
                          variant="outline"
                          className={`text-[10px] sm:text-xs px-0.5 sm:px-1 py-0 h-4 sm:h-5 block truncate cursor-pointer hover:opacity-80 transition-opacity ${travelColors.get(travel.id)}`}
                          title={`${travel.name} - ${travel.clientName}`}
                          onClick={() => setLocation(`/travel/${travel.id}`)}
                        >
                          {travel.name}
                        </Badge>
                      ))}
                      {dayTravels.length > 2 && (
                        <div className="text-[9px] sm:text-xs text-gray-500 text-center cursor-pointer hover:text-gray-700">
                          +{dayTravels.length - 2}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="border-t pt-3 sm:pt-4">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Leyenda:</h4>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <Badge variant="outline" className={`${PASTEL_COLORS[0]} text-[10px] sm:text-xs`}>
              Viajes Publicados
            </Badge>
            <Badge variant="outline" className={`${UNPUBLISHED_COLOR} text-[10px] sm:text-xs`}>
              Borradores
            </Badge>
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-600">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-red-500 rounded-sm"></div>
              Hoy
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}