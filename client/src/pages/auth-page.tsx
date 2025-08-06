import { useState } from "react";
import { Link, Redirect } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Plane, MapPin, Users, Calendar } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

const registerSchema = z.object({
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  name: z.string().min(1, "El nombre es requerido"),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
    },
  });

  // Redirect if already authenticated
  if (user) {
    return <Redirect to="/" />;
  }

  const handleLogin = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const handleRegister = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-muted/30 grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Forms */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">PLANNEALO</h1>
            <p className="text-muted-foreground mt-2">Gestión Profesional de Viajes</p>
          </div>

          <Card>
            <CardHeader>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                  <TabsTrigger value="register">Registrarse</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <div>
                      <Label htmlFor="login-username">Usuario</Label>
                      <Input
                        id="login-username"
                        {...loginForm.register("username")}
                        placeholder="Ingresa tu usuario"
                      />
                      {loginForm.formState.errors.username && (
                        <p className="text-sm text-destructive mt-1">
                          {loginForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="login-password">Contraseña</Label>
                      <Input
                        id="login-password"
                        type="password"
                        {...loginForm.register("password")}
                        placeholder="Ingresa tu contraseña"
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-destructive mt-1">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-accent hover:bg-accent/90"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                    <div>
                      <Label htmlFor="register-name">Nombre Completo</Label>
                      <Input
                        id="register-name"
                        {...registerForm.register("name")}
                        placeholder="Ingresa tu nombre completo"
                      />
                      {registerForm.formState.errors.name && (
                        <p className="text-sm text-destructive mt-1">
                          {registerForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="register-username">Usuario</Label>
                      <Input
                        id="register-username"
                        {...registerForm.register("username")}
                        placeholder="Elige un nombre de usuario"
                      />
                      {registerForm.formState.errors.username && (
                        <p className="text-sm text-destructive mt-1">
                          {registerForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="register-password">Contraseña</Label>
                      <Input
                        id="register-password"
                        type="password"
                        {...registerForm.register("password")}
                        placeholder="Crea una contraseña segura"
                      />
                      {registerForm.formState.errors.password && (
                        <p className="text-sm text-destructive mt-1">
                          {registerForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-accent hover:bg-accent/90"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Registrando..." : "Registrarse"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:flex items-center justify-center bg-accent/5 p-8">
        <div className="max-w-md text-center space-y-8">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
              <Plane className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Gestiona Viajes Como Un Profesional
            </h2>
            <p className="text-muted-foreground">
              PLANNEALO te permite crear, organizar y administrar itinerarios de viaje 
              completos para tus clientes de manera eficiente y profesional.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Itinerarios Completos</h3>
                <p className="text-sm text-muted-foreground">
                  Alojamientos, vuelos, actividades y transporte en un solo lugar
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Gestión de Clientes</h3>
                <p className="text-sm text-muted-foreground">
                  Organiza y administra las reservas de múltiples clientes
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Seguimiento Total</h3>
                <p className="text-sm text-muted-foreground">
                  Mantén el control de fechas, confirmaciones y detalles importantes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
