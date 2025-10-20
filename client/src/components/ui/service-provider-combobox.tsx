
import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
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
import { queryClient } from "@/lib/queryClient";

interface ServiceProvider {
  id: string;
  name: string;
  active: boolean;
}

interface ServiceProviderComboboxProps {
  value?: string; // Nombre del proveedor seleccionado
  onChange: (value: string | undefined, provider?: ServiceProvider) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
}

export function ServiceProviderCombobox({
  value,
  onChange,
  placeholder = "Seleccionar proveedor...",
  disabled = false,
  label,
}: ServiceProviderComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Fetch service providers
  const { data: providers = [], isLoading } = useQuery<ServiceProvider[]>({
    queryKey: ["/api/service-providers"],
    enabled: !disabled,
  });

  // Create service provider mutation
  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch("/api/service-providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, active: true }),
      });
      if (!response.ok) throw new Error("Failed to create service provider");
      return response.json();
    },
    onSuccess: (newProvider) => {
      queryClient.invalidateQueries({ queryKey: ["/api/service-providers"] });
      onChange(newProvider.name, newProvider);
      setSearchValue("");
      setOpen(false);
    },
  });

  // Filter providers based on search
  const filteredProviders = providers.filter((provider) =>
    provider.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Check if search value is a new provider
  const isNewProvider =
    searchValue.trim() !== "" &&
    !filteredProviders.some(
      (p) => p.name.toLowerCase() === searchValue.toLowerCase()
    );

  const handleSelect = (providerName: string) => {
    const selectedProvider = providers.find(p => p.name === providerName);
    onChange(providerName === value ? undefined : providerName, selectedProvider);
    setOpen(false);
    setSearchValue("");
  };

  const handleCreate = () => {
    if (searchValue.trim()) {
      createMutation.mutate(searchValue.trim());
    }
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
          >
            {value || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Buscar o crear proveedor..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              {isLoading ? (
                <CommandEmpty>Cargando...</CommandEmpty>
              ) : filteredProviders.length === 0 && !isNewProvider ? (
                <CommandEmpty>No se encontraron proveedores.</CommandEmpty>
              ) : null}

              {filteredProviders.length > 0 && (
                <CommandGroup heading="Proveedores">
                  {filteredProviders.map((provider) => (
                    <CommandItem
                      key={provider.id}
                      value={provider.name}
                      onSelect={() => handleSelect(provider.name)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === provider.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {provider.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {isNewProvider && (
                <CommandGroup heading="Crear nuevo">
                  <CommandItem onSelect={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear "{searchValue}"
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
