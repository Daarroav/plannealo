import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, HamburgerButton, DataServer, Down, Airplane, People, Airplane as PlaneTicket, Shop, TakeOff } from "@icon-park/react";
import logoPng from "@assets/LOGO_PNG_NEGRO-min_1755552589565.png";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function NavigationHeader() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    username: "",
  });
  const roleLabels: Record<string, string> = {
    master: "Maestro",
    admin: "Administrador",
    traveler: "Viajero",
  };


  // Opciones de navegación según el rol
  let catalogItems: Array<{ path: string; label: string; icon?: any }> = [];
  let navItems: Array<{ path: string; label: string; icon?: any }> = [];

  if (user?.role === "master") {
    navItems = [
      { path: "/", label: "Mis viajes", icon: Airplane },
      { path: "/reports", label: "Reportes" },
      { path: "/backups", label: "Respaldos", icon: DataServer },
      { path: "/users-admin", label: "Usuarios", icon: People },
    ];
    catalogItems = [
      { path: "/clients", label: "Viajeros", icon: People },
      { path: "/airports", label: "Aeropuertos", icon: TakeOff },
      { path: "/service-providers", label: "Proveedores", icon: Shop },
    ];
  } else if (user?.role === "admin") {
    navItems = [
      { path: "/", label: "Mis viajes", icon: Airplane },
      { path: "/reports", label: "Reportes" },
      { path: "/backups", label: "Respaldos", icon: DataServer },
    ];
    catalogItems = [
      { path: "/clients", label: "Viajeros", icon: People },
      { path: "/airports", label: "Aeropuertos", icon: TakeOff },
      { path: "/service-providers", label: "Proveedores", icon: Shop },
    ];
  } else if (user?.role === "traveler") {
    navItems = [
      { path: "/", label: "Mis viajes", icon: Airplane },
    ];
    catalogItems = [];
  }

  useEffect(() => {
    if (user && isProfileOpen) {
      setProfileForm({
        name: user.name || "",
        username: user.username || "",
      });
    }
  }, [user, isProfileOpen]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string; username: string }) => {
      const response = await apiRequest("PUT", "/api/profile", data);
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Error al actualizar perfil");
      }
      return response.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["/api/user"], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["/api/travels"], exact: false });
      toast({
        title: "Perfil actualizado",
        description: "Tus datos se guardaron correctamente.",
      });
      setIsProfileOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "No se pudo actualizar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          
          {/* Menú hamburguesa móvil - Izquierda */}
          <nav className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <HamburgerButton className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link
                      to={item.path}
                      className={`cursor-pointer flex items-center gap-2 ${
                        location === item.path ? "bg-accent text-accent-foreground" : ""
                      }`}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                {/* Mostrar menú de catálogos solo si hay items (no para traveler) */}
                {catalogItems.length > 0 && (
                  <>
                    <DropdownMenuItem disabled className="font-semibold text-xs text-muted-foreground">
                      Catálogos
                    </DropdownMenuItem>
                    {catalogItems.map((item) => (
                      <DropdownMenuItem key={item.path} asChild>
                        <Link
                          to={item.path}
                          className={`cursor-pointer pl-6 flex items-center gap-2 ${
                            location === item.path ? "bg-accent text-accent-foreground" : ""
                          }`}
                        >
                          {item.icon && <item.icon className="h-4 w-4" />}
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Logo y título - Centro (absoluto en móvil, izquierda en desktop) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 lg:relative lg:left-0 lg:transform-none flex items-center space-x-3">
            <img src={logoPng} alt="Logo" className="h-10 w-auto" />
            <div className="flex-shrink-0 hidden sm:block">
              <p className="text-sm text-muted-foreground">Gestión de Viajes</p>
            </div>
          </div>

          {/* Navegación desktop (pantallas grandes) */}
          <nav className="hidden lg:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-foreground hover:text-accent px-3 py-2 text-sm font-medium flex items-center gap-2 ${
                  location === item.path ? "border-b-2 border-accent" : ""
                }`}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </Link>
            ))}
            {/* Mostrar menú de catálogos solo si hay items (no para traveler) */}
            {catalogItems.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`text-foreground hover:text-accent px-3 py-2 text-sm font-medium flex items-center gap-2 ${
                      catalogItems.some(item => location === item.path) ? "border-b-2 border-accent" : ""
                    }`}
                  >
                    Catálogos
                    <Down className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {catalogItems.map((item) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link
                        to={item.path}
                        className={`cursor-pointer flex items-center gap-2 ${
                          location === item.path ? "bg-accent text-accent-foreground" : ""
                        }`}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Usuario - Derecha */}
          <div className="flex items-center space-x-3 z-10">
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="w-8 h-8 bg-muted rounded-full flex items-center justify-center ring-1 ring-border/60 hover:ring-accent/60 hover:bg-muted/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Editar perfil"
                  title="Editar perfil"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar perfil</DialogTitle>
                  <DialogDescription>
                    Actualiza tu nombre y correo asociado a tu cuenta.
                  </DialogDescription>
                </DialogHeader>
                <form
                  className="space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    updateProfileMutation.mutate(profileForm);
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="profile-name">Nombre</Label>
                    <Input
                      id="profile-name"
                      value={profileForm.name}
                      onChange={(event) =>
                        setProfileForm((prev) => ({ ...prev, name: event.target.value }))
                      }
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-email">Correo</Label>
                    <Input
                      id="profile-email"
                      type="email"
                      value={profileForm.username}
                      onChange={(event) =>
                        setProfileForm((prev) => ({ ...prev, username: event.target.value }))
                      }
                      placeholder="tu@correo.com"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? "Guardando..." : "Guardar cambios"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">
                {roleLabels[user?.role ?? ""] || "Usuario"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "..." : "Salir"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}