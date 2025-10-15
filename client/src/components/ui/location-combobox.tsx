
import * as React from "react";
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

interface LocationComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  type: "country" | "state" | "city";
  parentId?: string; // Para states (country_id) y cities (state_id o country_id)
  label?: string;
}

export function LocationCombobox({
  value,
  onValueChange,
  placeholder = "Seleccionar...",
  type,
  parentId,
  label,
}: LocationComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<Array<{ id: string; name: string }>>([]);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Cargar items del catálogo
  React.useEffect(() => {
    const fetchItems = async () => {
      try {
        let url = `/api/locations/${type}`;
        if (parentId) {
          url += `?parentId=${parentId}`;
        }
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        }
      } catch (error) {
        console.error(`Error loading ${type}:`, error);
      }
    };

    fetchItems();
  }, [type, parentId]);

  const handleSelect = (itemName: string) => {
    onValueChange(itemName);
    setOpen(false);
    setSearchTerm("");
  };

  const handleCreateNew = async () => {
    if (!searchTerm.trim()) return;

    try {
      const body: any = { name: searchTerm.trim() };
      if (parentId && type === "state") {
        body.countryId = parentId;
      } else if (parentId && type === "city") {
        body.stateId = parentId;
      }

      const response = await fetch(`/api/locations/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const newItem = await response.json();
        setItems([...items, newItem]);
        handleSelect(newItem.name);
      }
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showCreateButton = searchTerm.trim() && !filteredItems.some(
    (item) => item.name.toLowerCase() === searchTerm.toLowerCase()
  );

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
          >
            {value || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder={`Buscar ${type}...`}
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              <CommandEmpty>
                {showCreateButton ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleCreateNew}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Crear "{searchTerm}"
                  </Button>
                ) : (
                  "No se encontraron resultados."
                )}
              </CommandEmpty>
              {filteredItems.length > 0 && (
                <CommandGroup>
                  {filteredItems.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={() => handleSelect(item.name)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === item.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item.name}
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
