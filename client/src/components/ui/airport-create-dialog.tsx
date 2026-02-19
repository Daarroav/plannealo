import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Close } from "@icon-park/react";
import { TimezoneCombobox } from "@/components/ui/timezone-combobox";
import { LocationCombobox } from "@/components/ui/location-combobox";
import { useToast } from "@/hooks/use-toast";

interface TimezoneEntry {
  timezone: string;
}

interface AirportCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (airport: any) => void;
}

export function AirportCreateDialog({ open, onOpenChange, onCreated }: AirportCreateDialogProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [timezones, setTimezones] = useState<TimezoneEntry[]>([{ timezone: "" }]);
  const [selectedCountryId, setSelectedCountryId] = useState<string | undefined>();
  const [selectedStateId, setSelectedStateId] = useState<string | undefined>();
  const [selectedCityId, setSelectedCityId] = useState<string | undefined>();

  const form = useForm({
    defaultValues: {
      airportName: "",
      iataCode: "",
      icaoCode: "",
      latitude: "",
      longitude: "",
    },
  });

  const resetForm = () => {
    form.reset({
      airportName: "",
      iataCode: "",
      icaoCode: "",
      latitude: "",
      longitude: "",
    });
    setTimezones([{ timezone: "" }]);
    setSelectedCountryId(undefined);
    setSelectedStateId(undefined);
    setSelectedCityId(undefined);
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/airports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...data,
          countryId: selectedCountryId,
          stateId: selectedStateId,
          cityId: selectedCityId,
          timezones,
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo crear el aeropuerto");
      }

      return response.json();
    },
    onSuccess: (airport) => {
      queryClient.invalidateQueries({ queryKey: ["/api/airports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/catalog/flights"] });
      toast({
        title: "Aeropuerto creado",
        description: "El aeropuerto se agregó al catálogo correctamente.",
      });
      onCreated?.(airport);
      resetForm();
      onOpenChange(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el aeropuerto.",
      });
    },
  });

  const addTimezone = () => {
    setTimezones((prev) => [...prev, { timezone: "" }]);
  };

  const removeTimezone = (index: number) => {
    setTimezones((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  const updateTimezone = (index: number, value: string) => {
    setTimezones((prev) => {
      const updated = [...prev];
      updated[index] = { timezone: value };
      return updated;
    });
  };

  const handleSubmit = form.handleSubmit((data) => {
    if (!selectedCountryId || !selectedStateId || !selectedCityId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes seleccionar país, estado y ciudad.",
      });
      return;
    }

    if (timezones.some((tz) => !tz.timezone)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Todas las zonas horarias deben tener una zona seleccionada.",
      });
      return;
    }

    createMutation.mutate(data);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          resetForm();
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Aeropuerto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LocationCombobox
              type="country"
              value={selectedCountryId}
              onChange={(value) => {
                setSelectedCountryId(value);
                setSelectedStateId(undefined);
                setSelectedCityId(undefined);
              }}
              label="País *"
            />

            <LocationCombobox
              type="state"
              value={selectedStateId}
              onChange={(value) => {
                setSelectedStateId(value);
                setSelectedCityId(undefined);
              }}
              parentId={selectedCountryId}
              label="Estado *"
            />

            <LocationCombobox
              type="city"
              value={selectedCityId}
              onChange={setSelectedCityId}
              parentId={selectedStateId}
              countryId={selectedCountryId}
              label="Ciudad *"
            />

            <div>
              <Label htmlFor="airportName">Nombre del Aeropuerto *</Label>
              <Input
                id="airportName"
                {...form.register("airportName", { required: true })}
                placeholder="Ej: Aeropuerto Internacional Benito Juárez"
              />
            </div>

            <div>
              <Label htmlFor="iataCode">Código IATA</Label>
              <Input id="iataCode" {...form.register("iataCode")} placeholder="Ej: MEX" maxLength={3} />
            </div>

            <div>
              <Label htmlFor="icaoCode">Código ICAO</Label>
              <Input id="icaoCode" {...form.register("icaoCode")} placeholder="Ej: MMMX" maxLength={4} />
            </div>

            <div>
              <Label htmlFor="latitude">Latitud</Label>
              <Input id="latitude" {...form.register("latitude")} placeholder="Ej: 19.4363" />
            </div>

            <div>
              <Label htmlFor="longitude">Longitud</Label>
              <Input id="longitude" {...form.register("longitude")} placeholder="Ej: -99.0721" />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <Label className="text-base">Zonas Horarias *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addTimezone}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Zona Horaria
              </Button>
            </div>

            <div className="space-y-3">
              {timezones.map((tz, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <TimezoneCombobox
                      value={tz.timezone}
                      onValueChange={(value) => updateTimezone(index, value)}
                      placeholder="Seleccionar zona horaria..."
                    />
                  </div>

                  {timezones.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeTimezone(index)}>
                      <Close className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
