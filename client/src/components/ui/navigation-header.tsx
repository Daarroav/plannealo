import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { User, Hamburger as MenuIcon, DataServer, Down, Airplane, People, Airplane as PlaneTicket, Shop, TakeOff } from "@icon-park/react";
import logoPng from "@assets/LOGO_PNG_NEGRO-min_1755552589565.png";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavigationHeader() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
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

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img src={logoPng} alt="Logo" className="h-10 w-auto" />
              <div className="flex-shrink-0">
                <p className="text-sm text-muted-foreground">Gestión de Viajes</p>
              </div>
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

          {/* Menú dropdown para pantallas medianas y pequeñas */}
          <nav className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
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

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
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
      </div>
    </header>
  );
}