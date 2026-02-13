import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutocompleteOption {
  value: string;
  label: string;
  data?: any; // Datos adicionales del catálogo
}

interface AutocompleteInputProps {
  id?: string;
  value: string;
  onChange: (value: string, data?: any) => void;
  options: AutocompleteOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onLoadData?: (data: any) => void; // Callback para cargar todos los datos de una sugerencia
}

export function AutocompleteInput({
  id,
  value,
  onChange,
  options,
  placeholder = "Escribe o selecciona...",
  className,
  disabled = false,
  onLoadData,
}: AutocompleteInputProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(value);

  // Actualizar el searchValue cuando cambia el value prop
  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  // Filtrar opciones basándose en el texto escrito
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (option: AutocompleteOption) => {
    setSearchValue(option.label);
    onChange(option.value, option.data);
    setOpen(false);
    
    // Si hay un callback para cargar datos, llamarlo
    if (onLoadData && option.data) {
      onLoadData(option.data);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onChange(newValue);
    if (!open && newValue) {
      setOpen(true);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            id={id}
            value={searchValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={cn("pr-8", className)}
            disabled={disabled}
            onFocus={() => setOpen(true)}
          />
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandList>
            {filteredOptions.length === 0 ? (
              <CommandEmpty>Sin resultados en el catálogo</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        searchValue === option.label ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
