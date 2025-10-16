
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { User, Menu, Database } from "lucide-react";
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

  const navItems = [
    { path: "/", label: "Viajes" },
    { path: "/clients", label: "Clientes" },
    { path: "/airports", label: "Aeropuertos" },
    { path: "/reports", label: "Reportes" },
  ];

  if (user?.role === "admin") {
    navItems.push({ path: "/backups", label: "Respaldos", icon: Database });
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
          </nav>

          {/* Menú dropdown para pantallas medianas y pequeñas */}
          <nav className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
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
                  {user?.role === "admin" ? "Administrador" : "Agente de Viajes"}
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
