import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ServiceProviderCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (provider: any) => void;
}

export function ServiceProviderCreateDialog({
  open,
  onOpenChange,
  onCreated,
}: ServiceProviderCreateDialogProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: "",
      contactName: "",
      contactPhone: "",
    },
  });

  const resetForm = () => {
    form.reset({
      name: "",
      contactName: "",
      contactPhone: "",
    });
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/service-providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...data, active: true }),
      });

      if (!response.ok) {
        throw new Error("No se pudo crear el proveedor");
      }

      return response.json();
    },
    onSuccess: (provider) => {
      queryClient.invalidateQueries({ queryKey: ["/api/service-providers"] });
      toast({
        title: "Proveedor creado",
        description: "El proveedor se agregó al catálogo correctamente.",
      });
      onCreated?.(provider);
      resetForm();
      onOpenChange(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el proveedor.",
      });
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo Proveedor</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="provider-name">Nombre del Proveedor *</Label>
            <Input
              id="provider-name"
              {...form.register("name", { required: true })}
              placeholder="Ej: Viajes Internacionales SA"
            />
          </div>

          <div>
            <Label htmlFor="provider-contact-name">Nombre del Contacto</Label>
            <Input
              id="provider-contact-name"
              {...form.register("contactName")}
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div>
            <Label htmlFor="provider-contact-phone">Número de Contacto</Label>
            <Input
              id="provider-contact-phone"
              {...form.register("contactPhone")}
              placeholder="Ej: +52 984 123 4567"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
