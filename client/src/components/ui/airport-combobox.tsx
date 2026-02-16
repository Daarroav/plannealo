import { useState } from "react";
import { CheckOne, Up, Down } from "@icon-park/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";

interface AirportComboboxProps {
  value?: string; // Nombre del aeropuerto seleccionado
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
}

interface Airport {
  id: string;
  airportName: string;
  iataCode?: string;
  country?: string;
  state?: string;
  city?: string;
}

export function AirportCombobox({
  value,
  onChange,
  placeholder = "Buscar aeropuerto...",
  disabled = false,
  label,
}: AirportComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Fetch airports
  const { data: airports = [], isLoading } = useQuery<Airport[]>({
    queryKey: ["/api/airports"],
    enabled: !disabled,
  });

  // Filtrar aeropuertos basado en búsqueda
  const filteredAirports = airports.filter((airport) => {
    const searchLower = searchValue.toLowerCase();
    return (
      airport.airportName.toLowerCase().includes(searchLower) ||
      airport.iataCode?.toLowerCase().includes(searchLower) ||
      airport.country?.toLowerCase().includes(searchLower) ||
      airport.state?.toLowerCase().includes(searchLower) ||
      airport.city?.toLowerCase().includes(searchLower)
    );
  });

  const handleSelect = (airport: Airport) => {
    // Formatear el valor que se guarda: "IATA - Nombre" o solo "Nombre" si no hay IATA
    // Esto permite que extractIataCode funcione para la detección automática de zona horaria
    const valueToSave = airport.iataCode 
      ? `${airport.iataCode} - ${airport.airportName}`
      : airport.airportName;
    
    onChange(valueToSave === value ? undefined : valueToSave);
    setOpen(false);
    setSearchValue("");
  };

  // Formatear el display del aeropuerto para la lista
  const formatAirportDisplay = (airport: Airport) => {
    const parts = [airport.airportName];
    
    if (airport.iataCode) {
      parts.push(airport.iataCode);
    }
    
    const location = [airport.country, airport.state, airport.city]
      .filter(Boolean)
      .join(", ");
    
    if (location) {
      return `${parts.join(" - ")} (${location})`;
    }
    
    return parts.join(" - ");
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
            data-testid="button-select-airport"
          >
            {value || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Buscar aeropuerto..."
              value={searchValue}
              onValueChange={setSearchValue}
              data-testid="input-search-airport"
            />
            <CommandList>
              {isLoading ? (
                <CommandEmpty>Cargando...</CommandEmpty>
              ) : filteredAirports.length === 0 ? (
                <CommandEmpty>No se encontraron aeropuertos.</CommandEmpty>
              ) : null}
              
              {filteredAirports.length > 0 && (
                <CommandGroup>
                  {filteredAirports.map((airport) => {
                    const airportValue = airport.iataCode 
                      ? `${airport.iataCode} - ${airport.airportName}`
                      : airport.airportName;
                    
                    return (
                      <CommandItem
                        key={airport.id}
                        value={airport.airportName}
                        onSelect={() => handleSelect(airport)}
                        data-testid={`item-airport-${airport.id}`}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === airportValue ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="text-sm">{formatAirportDisplay(airport)}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
