import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
  adminOnly = false,
  masterOnly = false,
  travelerOnly = false,
}: {
  path: string;
  component: () => React.JSX.Element;
  adminOnly?: boolean;
  masterOnly?: boolean;
  travelerOnly?: boolean;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  if (masterOnly && user.role !== 'master') {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Acceso Denegado</h1>
            <p className="text-muted-foreground mb-4">Esta sección es solo para la cuenta maestra</p>
            <a href="/" className="text-primary hover:underline">Volver al inicio</a>
          </div>
        </div>
      </Route>
    );
  }

  if (adminOnly && user.role !== 'admin' && user.role !== 'master') {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Acceso Denegado</h1>
            <p className="text-muted-foreground mb-4">Esta sección es solo para administradores</p>
            <a href="/" className="text-primary hover:underline">Volver al inicio</a>
          </div>
        </div>
      </Route>
    );
  }

  if (travelerOnly && user.role !== 'traveler') {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Acceso Denegado</h1>
            <p className="text-muted-foreground mb-4">Esta sección es solo para viajeros</p>
            <a href="/" className="text-primary hover:underline">Volver al inicio</a>
          </div>
        </div>
      </Route>
    );
  }

  return <Component />;
}
