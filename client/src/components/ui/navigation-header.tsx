import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Bell, User } from "lucide-react";
import logoPng from "@assets/LOGO_PNG_NEGRO-min_1755552589565.png";
import { Link, useLocation } from "wouter";


export function NavigationHeader() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img src={logoPng} alt="PLANNEALO Logo" className="h-10 w-auto" />
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-foreground">PLANNEALO</h1>
                <p className="text-xs text-muted-foreground">Gestión de Viajes</p>
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`text-foreground hover:text-accent px-3 py-2 text-sm font-medium ${location === "/" ? "border-b-2 border-accent" : ""}`}
            >
              Viajes
            </Link>
            <Link
              to="/clients"
              className={`text-foreground hover:text-accent px-3 py-2 text-sm font-medium ${location === "/clients" ? "border-b-2 border-accent" : ""}`}
            >
              Clientes

            </NavLink>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `text-foreground hover:text-accent px-3 py-2 text-sm font-medium ${isActive ? "border-b-2 border-accent" : ""}`
              }

            >
              Reportes
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
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
