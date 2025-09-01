import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandInput } from "@/components/ui/command";
import { Check, ChevronDown, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

interface Airport {
  icao: string;
  iata: string;
  name: string;
  shortName: string;
  municipalityName: string;
  location: {
    lat: number;
    lon: number;
  };
  countryCode: string;
}

interface AirportSearchProps {
  label: string;
  placeholder: string;
  value: string;
  onSelect: (airport: Airport) => void;
  error?: string;
}

export function AirportSearch({ label, placeholder, value, onSelect, error }: AirportSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);

  // Buscar aeropuertos cuando cambie el término de búsqueda
  useEffect(() => {
    const searchAirports = async () => {
      if (searchTerm.length < 2) {
        setAirports([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/airports/search?q=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
          const data = await response.json();
          setAirports(data);
        } else {
          console.error('Error searching airports:', response.statusText);
          setAirports([]);
        }
      } catch (error) {
        console.error('Error searching airports:', error);
        setAirports([]);
      } finally {
        setLoading(false);
      }
    };

    const delayedSearch = setTimeout(searchAirports, 300);
    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const handleSelect = (airport: Airport) => {
    setSelectedAirport(airport);
    onSelect(airport);
    setOpen(false);
    setSearchTerm("");
  };

  const displayValue = selectedAirport 
    ? `${selectedAirport.iata || selectedAirport.icao} - ${selectedAirport.shortName || selectedAirport.name}`
    : value;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between text-left font-normal",
              !displayValue && "text-muted-foreground",
              error && "border-red-500"
            )}
          >
            <div className="flex items-center space-x-2">
              <Plane className="w-4 h-4" />
              <span className="truncate">
                {displayValue || placeholder}
              </span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Buscar aeropuertos..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandEmpty>
              {loading ? "Buscando..." : searchTerm.length < 2 ? "Escribe al menos 2 caracteres" : "No se encontraron aeropuertos."}
            </CommandEmpty>
            {airports.length > 0 && (
              <CommandGroup>
                {airports.map((airport) => (
                  <CommandItem
                    key={airport.icao}
                    value={`${airport.iata || airport.icao} ${airport.name} ${airport.municipalityName}`}
                    onSelect={() => handleSelect(airport)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedAirport?.icao === airport.icao ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {airport.iata || airport.icao}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {airport.shortName || airport.name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {airport.municipalityName}, {airport.countryCode}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </Command>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}