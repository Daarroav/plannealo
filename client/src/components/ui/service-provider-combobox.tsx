
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

interface ServiceProvider {
  id: string;
  name: string;
  active: boolean;
  contactName?: string | null;
  contactPhone?: string | null;
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

  // Filter providers based on search
  const filteredProviders = providers.filter((provider) =>
    provider.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (providerName: string) => {
    const selectedProvider = providers.find(p => p.name === providerName);
    onChange(providerName === value ? undefined : providerName, selectedProvider);
    setOpen(false);
    setSearchValue("");
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
            <Down className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Buscar proveedor..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              {isLoading ? (
                <CommandEmpty>Cargando...</CommandEmpty>
              ) : filteredProviders.length === 0 ? (
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
                      <CheckOne
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
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
