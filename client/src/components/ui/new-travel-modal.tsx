import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Image, Upload } from "lucide-react";
import type { Travel } from "@shared/schema";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

const newTravelSchema = z.object({
  name: z.string().min(1, "El nombre del viaje es requerido"),
  clientName: z.string().min(1, "El nombre del cliente es requerido"),
  clientEmail: z.string().email("El correo electrónico no es válido"),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  endDate: z.string().min(1, "La fecha de fin es requerida"),
  travelers: z.number().min(1, "Debe haber al menos 1 viajero"),
});

type NewTravelForm = z.infer<typeof newTravelSchema>;

interface NewTravelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewTravelForm & { _selectedImage?: File }) => void;
  isLoading?: boolean;
  travel?: Travel | null;
}

export function NewTravelModal({ travel = null, isOpen, onClose, onSubmit, isLoading }: NewTravelModalProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  

  console.info("Travel", travel?.clientId);
  const form = useForm<NewTravelForm>({
    resolver: zodResolver(newTravelSchema),
    defaultValues: {
      name: "",
      clientName: "",
      clientEmail: "",
      startDate: "",
      endDate: "",
      travelers: 1,
    },
  });

  // Consulta para obtener la información del usuario si estamos editando un viaje
  const { data: travelInfoUser, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ["user", travel?.clientId],
    queryFn: () => fetch(`/api/users/${travel?.clientId}`).then(res => res.json()),
    enabled: !!travel?.clientId && isOpen,
    staleTime: 5 * 60 * 1000, // 5 minutos 
  });
  
  // Efecto para resetear el formulario cuando se abre el modal o cambia la información del usuario
  useEffect(() => {
    if (!isOpen) return;
    
    if (travel) {
      // Solo actualizamos el formulario si tenemos la información del usuario o si estamos editando
      // Esto evita que se sobrescriba el email con un valor vacío mientras se carga la información
      if (travel.clientId && !travelInfoUser && isLoadingUser) {
        return; // Esperamos a que cargue la información del usuario
      }
      
      const initialValues = {
        name: travel.name,
        clientName: travel.clientName,
        clientEmail: travelInfoUser?.username || "", // Usamos el username del usuario como email
        startDate: travel.startDate
          ? new Date(travel.startDate).toISOString().substring(0, 10)
          : "",
        endDate: travel.endDate
          ? new Date(travel.endDate).toISOString().substring(0, 10)
          : "",
        travelers: travel.travelers,
      };
      
      form.reset(initialValues);
      setIsEditing(true);
    } else {
      form.reset({
        name: "",
        clientName: "",
        clientEmail: "",
        startDate: "",
        endDate: "",
        travelers: 1,
      });
      setIsEditing(false);
    }
    
    // Limpiar la imagen seleccionada al abrir/cerrar el modal
    setSelectedImage(null);
    setImagePreview(null);
  }, [isOpen, travel, travelInfoUser]);

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };
  const travelers = form.watch("travelers"); // observa el valor actual del formulario


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Verificar el tamaño (10MB máximo)
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo es demasiado grande. El tamaño máximo es 10MB');
        return;
      }

      setSelectedImage(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (data: NewTravelForm) => {
    // Force blur on any active input to ensure values are captured
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      activeElement.blur();
      // Wait a bit for the blur event to process
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Get the most current form values
    const currentValues = form.getValues();
    
    // Pass the selected image separately for handling after travel creation
    onSubmit({ 
      ...currentValues, 
      _selectedImage: selectedImage || undefined 
    });
    form.reset();
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {isEditing ? "Editar Viaje" : "Crear Nuevo Viaje"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Viaje *</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Ej: Riviera Maya 2024"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="clientEmail">Correo Electrónico del Cliente *</Label>
                <Input 
                  id="clientEmail" 
                  type="email" 
                  {...form.register("clientEmail")} 
                  placeholder="cliente@ejemplo.com" 
                />
                {form.formState.errors.clientEmail && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.clientEmail.message}
                  </p>
                )}
              </div>
            
      
              <div className="space-y-2">
                <Label htmlFor="clientName">Nombre del Cliente *</Label>
                <Input id="clientName" {...form.register("clientName")} placeholder="Ej: Juan Pérez" />
                {form.formState.errors.clientName && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.clientName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2"> 
                <Label htmlFor="travelers">Número de Viajeros *</Label>
                <Select
                  value={travelers.toString()}
                  onValueChange={(value) => {
                    const numValue = parseInt(value, 10);
                    console.log("Setting travelers to:", numValue);
                    form.setValue("travelers", numValue);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 viajero</SelectItem>
                    <SelectItem value="2">2 viajeros</SelectItem>
                    <SelectItem value="3">3 viajeros</SelectItem>
                    <SelectItem value="4">4 viajeros</SelectItem>
                    <SelectItem value="5">5+ viajeros</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.travelers && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.travelers.message}
                  </p>
                )}
          </div>

    
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="startDate">Fecha de Inicio *</Label>
              <Input
                id="startDate"
                type="date"
                {...form.register("startDate")}
              />
              {form.formState.errors.startDate && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.startDate.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="endDate">Fecha de Fin *</Label>
              <Input
                id="endDate"
                type="date"
                {...form.register("endDate")}
              />
              {form.formState.errors.endDate && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.endDate.message}
                </p>
              )}
            </div>
          </div>
          
         
          
          <div>
            <Label>Imagen de Portada</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            
            {imagePreview ? (
              <div className="border-2 border-border rounded-lg p-4 text-center">
                <div className="relative inline-block">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-32 rounded-lg mx-auto mb-4"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedImage?.name}
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleImageSelect}
                  className="mt-2"
                >
                  Cambiar Imagen
                </Button>
              </div>
            ) : (
              <div 
                className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors duration-200 cursor-pointer"
                onClick={handleImageSelect}
              >
                <Image className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Arrastra una imagen o haz clic para seleccionar</p>
                <p className="text-sm text-muted-foreground">PNG, JPG hasta 10MB</p>
                <Button type="button" variant="outline" className="mt-3" onClick={handleImageSelect}>
                  <Upload className="w-4 h-4 mr-2" />
                  Seleccionar Imagen
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90" disabled={isLoading}>
              {isLoading ? "Guardando..." : isEditing ? "Editar Viaje" : "Crear Viaje"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
