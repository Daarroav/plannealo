import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NavigationHeader } from "@/components/ui/navigation-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Delete, Search, Building } from "@icon-park/react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import type { ServiceProvider } from "@/../../shared/schema";

export default function ServiceProvidersPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingProvider, setEditingProvider] =
    useState<ServiceProvider | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: "",
      contactName: "",
      contactPhone: "",
    },
  });

  // Fetch providers
  const { data: providers = [], isLoading } = useQuery<ServiceProvider[]>({
    queryKey: ["/api/service-providers"],
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = editingProvider
        ? `/api/service-providers/${editingProvider.id}`
        : "/api/service-providers";
      const method = editingProvider ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al guardar proveedor");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/service-providers"] });
      setShowModal(false);
      setEditingProvider(null);
      form.reset();
      toast({
        title: editingProvider ? "Proveedor actualizado" : "Proveedor creado",
        description: "La operación se completó exitosamente",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar el proveedor",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/service-providers/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al eliminar");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/service-providers"] });
      toast({
        title: "Proveedor eliminado",
        description: "El proveedor se eliminó correctamente",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "No se pudo eliminar el proveedor. Puede estar asociado a servicios.",
      });
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    saveMutation.mutate({ ...data, active: true });
  });

  const handleEdit = (provider: ServiceProvider) => {
    setEditingProvider(provider);
    form.reset({
      name: provider.name,
      contactName: provider.contactName || "",
      contactPhone: provider.contactPhone || "",
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este proveedor?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredProviders = providers.filter((provider: ServiceProvider) =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Proveedores de Servicios
            </h1>
            <p className="text-muted-foreground mt-2">
              Gestiona el catálogo de proveedores de servicios
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingProvider(null);
              form.reset({ name: "", contactName: "", contactPhone: "" });
              setShowModal(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Proveedor
          </Button>
        </div>

        {/* Búsqueda */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lista de proveedores */}
        {isLoading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProviders.map((provider: ServiceProvider) => (
              <Card key={provider.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="w-5 h-5" />
                    {provider.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {provider.contactName && (
                      <div className="text-muted-foreground">
                        <span className="font-medium">Contacto:</span>{" "}
                        {provider.contactName}
                      </div>
                    )}
                    {provider.contactPhone && (
                      <div className="text-muted-foreground">
                        <span className="font-medium">Teléfono:</span>{" "}
                        {provider.contactPhone}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(provider)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(provider.id)}
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProvider ? "Editar Proveedor" : "Nuevo Proveedor"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del Proveedor *</Label>
                <Input
                  id="name"
                  {...form.register("name", { required: true })}
                  placeholder="Ej: Viajes Internacionales SA"
                />
              </div>

              <div>
                <Label htmlFor="contactName">Nombre del Contacto</Label>
                <Input
                  id="contactName"
                  {...form.register("contactName")}
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div>
                <Label htmlFor="contactPhone">Número de Contacto</Label>
                <Input
                  id="contactPhone"
                  {...form.register("contactPhone")}
                  placeholder="Ej: +52 984 123 4567"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
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
