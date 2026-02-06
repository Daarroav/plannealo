import UsersAdminPage from "@/pages/users-admin-page";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

// Importar componentes de rutas
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import TravelDetail from "@/pages/travel-detail";
import TravelPreview from "@/pages/travel-preview";
import NotFound from "@/pages/not-found";
import ClientsPage from "@/pages/clients-page";
import ReportsPage from "@/pages/reports-page";
import BackupsPage from "@/pages/backups-page";
// Importar AirportsPage (assuming it exists)
import AirportsPage from "@/pages/airports-page";
import ServiceProvidersPage from "@/pages/service-providers-page";


function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/travel/:id" component={TravelDetail} />
      <ProtectedRoute path="/clients" component={ClientsPage} adminOnly />
      <ProtectedRoute path="/airports" component={AirportsPage} adminOnly />
      <ProtectedRoute path="/service-providers" component={ServiceProvidersPage} adminOnly />
      <ProtectedRoute path="/reports" component={ReportsPage} adminOnly />
      <ProtectedRoute path="/backups" component={BackupsPage} adminOnly />
      {/* Ruta solo para master: gestión de usuarios */}
      <ProtectedRoute path="/users-admin" component={UsersAdminPage} masterOnly />
      {/* Ejemplo de ruta solo para viajeros */}
      {/* <ProtectedRoute path="/mis-viajes" component={MisViajesPage} travelerOnly /> */}
      <Route path="/travel/:id/preview" component={TravelPreview} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;