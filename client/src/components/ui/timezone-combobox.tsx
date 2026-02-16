import * as React from "react";
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
import { TIMEZONE_CATALOG } from "@/lib/timezone-catalog";

interface TimezoneComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  testId?: string;
  suggestedTimezones?: string[]; // Zonas horarias sugeridas del aeropuerto
}

export function TimezoneCombobox({
  value,
  onValueChange,
  placeholder = "Buscar zona horaria...",
  id,
  testId,
  suggestedTimezones = [],
}: TimezoneComboboxProps) {
  const [open, setOpen] = React.useState(false);

  // Encontrar el label de la zona horaria seleccionada
  const selectedLabel = React.useMemo(() => {
    if (!value) return null;
    for (const region of TIMEZONE_CATALOG) {
      const tz = region.timezones.find((t) => t.value === value);
      if (tz) return tz.label;
    }
    return null;
  }, [value]);

  // Crear lista de zonas sugeridas con sus labels
  const suggestedTimezoneOptions = React.useMemo(() => {
    if (!suggestedTimezones || suggestedTimezones.length === 0) return [];
    
    const options = [];
    for (const tzValue of suggestedTimezones) {
      for (const region of TIMEZONE_CATALOG) {
        const tz = region.timezones.find((t) => t.value === tzValue);
        if (tz) {
          options.push(tz);
          break;
        }
      }
    }
    return options;
  }, [suggestedTimezones]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          data-testid={testId}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedLabel || placeholder}
          <Down className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar zona horaria..." />
          <CommandList>
            <CommandEmpty>No se encontró zona horaria.</CommandEmpty>
            
            {/* Mostrar zonas sugeridas del aeropuerto primero */}
            {suggestedTimezoneOptions.length > 0 && (
              <CommandGroup heading="🛫 Zonas del aeropuerto seleccionado" className="bg-blue-50/50">
                {suggestedTimezoneOptions.map((tz) => (
                  <CommandItem
                    key={`suggested-${tz.value}`}
                    value={tz.label}
                    onSelect={() => {
                      onValueChange(tz.value);
                      setOpen(false);
                    }}
                    className="font-medium"
                  >
                    <CheckOne
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === tz.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {tz.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            
            {/* Mostrar todas las zonas horarias por región */}
            {TIMEZONE_CATALOG.map((region) => (
              <CommandGroup key={region.region} heading={region.region}>
                {region.timezones.map((tz) => (
                  <CommandItem
                    key={tz.value}
                    value={tz.label}
                    onSelect={() => {
                      onValueChange(tz.value);
                      setOpen(false);
                    }}
                  >
                    <CheckOne
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === tz.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {tz.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
