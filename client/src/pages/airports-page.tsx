
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NavigationHeader } from "@/components/ui/navigation-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Search, Plane, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import type { Airport } from "@/../../shared/schema";
import { TimezoneCombobox } from "@/components/ui/timezone-combobox";

interface TimezoneEntry {
  timezone: string;
}

export default function AirportsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingAirport, setEditingAirport] = useState<Airport | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [timezones, setTimezones] = useState<TimezoneEntry[]>([
    { timezone: "" }
  ]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      country: "",
      city: "",
      state: "",
      airportName: "",
      iataCode: "",
      icaoCode: "",
      latitude: "",
      longitude: "",
    },
  });

  // Fetch airports
  const { data: airports = [], isLoading } = useQuery({
    queryKey: ["/api/airports"],
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = editingAirport
        ? `/api/airports/${editingAirport.id}`
        : "/api/airports";
      const method = editingAirport ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, timezones }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al guardar aeropuerto");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/airports"] });
      setShowModal(false);
      setEditingAirport(null);
      form.reset();
      setTimezones([{ timezone: "" }]);
      toast({
        title: editingAirport ? "Aeropuerto actualizado" : "Aeropuerto creado",
        description: "La operación se completó exitosamente",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar el aeropuerto",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/airports/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al eliminar");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/airports"] });
      toast({
        title: "Aeropuerto eliminado",
        description: "El aeropuerto se eliminó correctamente",
      });
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    // Validar que todas las zonas horarias tengan un timezone seleccionado
    const invalidTimezone = timezones.find(tz => !tz.timezone);
    if (invalidTimezone) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Todas las zonas horarias deben tener una zona seleccionada",
      });
      return;
    }
    saveMutation.mutate(data);
  });

  const handleEdit = (airport: Airport) => {
    setEditingAirport(airport);
    form.reset({
      country: airport.country,
      city: airport.city,
      state: airport.state || "",
      airportName: airport.airportName,
      iataCode: airport.iataCode || "",
      icaoCode: airport.icaoCode || "",
      latitude: airport.latitude || "",
      longitude: airport.longitude || "",
    });
    setTimezones(airport.timezones as TimezoneEntry[] || [{ timezone: "" }]);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este aeropuerto?")) {
      deleteMutation.mutate(id);
    }
  };

  const addTimezone = () => {
    setTimezones([...timezones, { timezone: "" }]);
  };

  const removeTimezone = (index: number) => {
    if (timezones.length > 1) {
      setTimezones(timezones.filter((_, i) => i !== index));
    }
  };

  const updateTimezone = (index: number, field: keyof TimezoneEntry, value: string) => {
    const updated = [...timezones];
    updated[index] = { ...updated[index], [field]: value };
    setTimezones(updated);
  };

  const filteredAirports = airports.filter((airport: Airport) =>
    [airport.country, airport.city, airport.airportName, airport.iataCode, airport.icaoCode]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Catálogo de Aeropuertos</h1>
            <p className="text-muted-foreground mt-2">
              Gestiona la información de aeropuertos y sus zonas horarias
            </p>
          </div>
          <Button onClick={() => {
            setEditingAirport(null);
            form.reset();
            setTimezones([{ timezone: "" }]);
            setShowModal(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Aeropuerto
          </Button>
        </div>

        {/* Búsqueda */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por país, ciudad, nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lista de aeropuertos */}
        {isLoading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAirports.map((airport: Airport) => (
              <Card key={airport.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Plane className="w-5 h-5" />
                    {airport.airportName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>País:</strong> {airport.country}</p>
                    <p><strong>Ciudad:</strong> {airport.city}</p>
                    {airport.state && <p><strong>Estado:</strong> {airport.state}</p>}
                    <div className="flex gap-2 pt-2">
                      {airport.iataCode && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          IATA: {airport.iataCode}
                        </span>
                      )}
                      {airport.icaoCode && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          ICAO: {airport.icaoCode}
                        </span>
                      )}
                    </div>
                    {airport.timezones && Array.isArray(airport.timezones) && airport.timezones.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="font-semibold text-xs mb-1">Zonas horarias:</p>
                        {(airport.timezones as TimezoneEntry[]).map((tz, idx) => (
                          <p key={idx} className="text-xs text-muted-foreground">
                            • {tz.timezone}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(airport)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(airport.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal de formulario */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAirport ? "Editar Aeropuerto" : "Nuevo Aeropuerto"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">País *</Label>
                  <Input
                    id="country"
                    {...form.register("country", { required: true })}
                    placeholder="Ej: México"
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    {...form.register("city", { required: true })}
                    placeholder="Ej: Ciudad de México"
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado *</Label>
                  <Input
                    id="state"
                    {...form.register("state", { required: true })}
                    placeholder="Ej: Ciudad de México"
                  />
                </div>
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
                  <Input
                    id="iataCode"
                    {...form.register("iataCode")}
                    placeholder="Ej: MEX"
                    maxLength={3}
                  />
                </div>
                <div>
                  <Label htmlFor="icaoCode">Código ICAO</Label>
                  <Input
                    id="icaoCode"
                    {...form.register("icaoCode")}
                    placeholder="Ej: MMMX"
                    maxLength={4}
                  />
                </div>
                <div>
                  <Label htmlFor="latitude">Latitud</Label>
                  <Input
                    id="latitude"
                    {...form.register("latitude")}
                    placeholder="Ej: 19.4363"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitud</Label>
                  <Input
                    id="longitude"
                    {...form.register("longitude")}
                    placeholder="Ej: -99.0721"
                  />
                </div>
              </div>

              {/* Zonas horarias */}
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
                          onValueChange={(value) => updateTimezone(index, "timezone", value)}
                          placeholder="Seleccionar zona horaria..."
                        />
                      </div>
                      {timezones.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTimezone(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
