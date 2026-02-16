import { useState } from "react";
import { CheckOne, Up, Down, Plus } from "@icon-park/react";
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
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface LocationComboboxProps {
  type: "country" | "state" | "city";
  value?: string; // ID de la ubicación seleccionada
  onChange: (value: string | undefined) => void;
  parentId?: string; // Para estados (countryId) y ciudades (stateId)
  countryId?: string; // Para ciudades (necesitamos tanto stateId como countryId)
  placeholder?: string;
  disabled?: boolean;
  label?: string;
}

interface LocationItem {
  id: string;
  name: string;
  countryId?: string;
  stateId?: string;
}

export function LocationCombobox({
  type,
  value,
  onChange,
  parentId,
  countryId,
  placeholder,
  disabled = false,
  label,
}: LocationComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Construir query params
  const queryParams = new URLSearchParams();
  if (parentId) {
    queryParams.set("parentId", parentId);
  }
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

  // Determinar si debe hacer fetch
  const shouldFetch = !disabled && (type === "country" || !!parentId);

  // Fetch locations
  const { data: locations = [], isLoading } = useQuery<LocationItem[]>({
    queryKey: ["/api/locations", type, parentId],
    enabled: shouldFetch,
    queryFn: async () => {
      const response = await fetch(`/api/locations/${type}${queryString}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch locations");
      return response.json();
    },
  });

  // Create location mutation
  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const payload: any = { name };
      
      if (type === "state" && parentId) {
        payload.countryId = parentId;
      } else if (type === "city") {
        if (parentId) payload.stateId = parentId;
        if (countryId) payload.countryId = countryId;
      }

      const response = await fetch(`/api/locations/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error("Failed to create location");
      return response.json();
    },
    onSuccess: (newLocation: LocationItem) => {
      // Invalidar el query específico con parentId si existe
      queryClient.invalidateQueries({ queryKey: ["/api/locations", type, parentId] });
      // También invalidar sin parentId para refrescar listas generales
      queryClient.invalidateQueries({ queryKey: ["/api/locations", type] });
      onChange(newLocation.id);
      setOpen(false);
      setSearchValue("");
    },
  });

  // Obtener el nombre actual basado en el value (ID)
  const selectedLocation = locations.find((loc) => loc.id === value);

  // Filtrar locations basado en búsqueda
  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Verificar si el valor de búsqueda es nuevo (no existe en la lista)
  const isNewValue =
    searchValue.trim() &&
    !locations.some(
      (loc) => loc.name.toLowerCase() === searchValue.toLowerCase()
    );

  const handleSelect = (locationId: string) => {
    onChange(locationId === value ? undefined : locationId);
    setOpen(false);
    setSearchValue("");
  };

  const handleCreate = async () => {
    if (!searchValue.trim() || createMutation.isPending) return;
    await createMutation.mutateAsync(searchValue.trim());
  };

  // Placeholder por defecto basado en el tipo
  const getDefaultPlaceholder = () => {
    if (type !== "country" && !parentId) {
      return type === "state" ? "Primero selecciona país..." : "Primero selecciona estado...";
    }
    return {
      country: "Seleccionar país...",
      state: "Seleccionar estado...",
      city: "Seleccionar ciudad...",
    }[type];
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
            disabled={disabled || (type !== "country" && !parentId)}
            data-testid={`button-select-${type}`}
          >
            {selectedLocation ? selectedLocation.name : placeholder || getDefaultPlaceholder()}
            <Down className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder={`Buscar ${type === "country" ? "país" : type === "state" ? "estado" : "ciudad"}...`}
              value={searchValue}
              onValueChange={setSearchValue}
              data-testid={`input-search-${type}`}
            />
            <CommandList>
              {isLoading ? (
                <CommandEmpty>Cargando...</CommandEmpty>
              ) : filteredLocations.length === 0 && !isNewValue ? (
                <CommandEmpty>No se encontraron resultados.</CommandEmpty>
              ) : null}
              
              {filteredLocations.length > 0 && (
                <CommandGroup>
                  {filteredLocations.map((location) => (
                    <CommandItem
                      key={location.id}
                      value={location.id}
                      onSelect={() => handleSelect(location.id)}
                      data-testid={`item-${type}-${location.id}`}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === location.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {location.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {isNewValue && (
                <CommandGroup>
                  <CommandItem
                    onSelect={handleCreate}
                    className="text-primary"
                    disabled={createMutation.isPending}
                    data-testid={`button-create-${type}`}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {createMutation.isPending ? "Creando..." : `Crear "${searchValue}"`}
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
