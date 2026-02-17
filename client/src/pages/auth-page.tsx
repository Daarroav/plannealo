import { useState, useEffect } from "react";
import { Link, Redirect } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { Airplane, Pin, People, Calendar as DateIcon, Star, ToRight } from "@icon-park/react";

const loginSchema = z.object({
  username: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
  rememberMe: z.boolean().optional().default(false),
});

const registerSchema = z.object({
  username: z.string().email("Debes ingresar un correo válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  name: z.string().min(1, "El nombre es requerido"),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: localStorage.getItem("savedUsername") || "",
      password: "",
      rememberMe: localStorage.getItem("rememberMe") === "true",
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

  // Set random background image from static covers
  useEffect(() => {
    const fetchCoverImages = async () => {
      try {
        // Intenta obtener la lista de archivos de la carpeta covers
        const response = await fetch("/api/covers-list");
        if (response.ok) {
          const files = await response.json();
          if (files && files.length > 0) {
            const randomImage = files[Math.floor(Math.random() * files.length)];
            setBackgroundImage(`/uploads/covers/${randomImage}`);
          } else {
            // Fallback: usa una imagen específica si existe
            setBackgroundImage("/uploads/covers/travel1.jpg");
          }
        } else {
          // Fallback si el endpoint no existe
          setBackgroundImage("/uploads/covers/travel1.jpg");
        }
      } catch (error) {
        console.error("Error fetching cover images:", error);
        // Fallback a una imagen por defecto
        setBackgroundImage("/uploads/covers/travel1.jpg");
      }
    };

    fetchCoverImages();
  }, []);

  // Redirect if already authenticated
  if (user) {
    return <Redirect to="/" />;
  }

  const handleLogin = (data: LoginForm) => {
    const { rememberMe, ...loginData } = data;
    
    if (rememberMe) {
      localStorage.setItem("savedUsername", data.username);
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("savedUsername");
      localStorage.removeItem("rememberMe");
    }
    
    loginMutation.mutate(loginData);
  };

  const handleRegister = (data: RegisterForm) => {
    registerMutation.mutate({ ...data, role: "traveler" }, {
      onError: (error: any) => {
        alert(error?.message || "No se pudo registrar. Verifica los datos.");
      },
    });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail) {
      setForgotPasswordMessage("Por favor ingresa tu correo electrónico");
      return;
    }
    
    setForgotPasswordLoading(true);
    setForgotPasswordMessage("");
    
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setForgotPasswordMessage("Se ha enviado un enlace de recuperación a tu correo. Revisa tu bandeja de entrada.");
        setTimeout(() => {
          setShowForgotPasswordModal(false);
          setForgotPasswordEmail("");
          setForgotPasswordMessage("");
        }, 3000);
      } else {
        setForgotPasswordMessage(data.message || "No se pudo enviar el enlace de recuperación. Intenta de nuevo.");
      }
    } catch (error) {
      setForgotPasswordMessage("Error al procesar la solicitud");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    setForgotPasswordEmail("");
    setForgotPasswordMessage("");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image - Full screen */}
      {backgroundImage && backgroundImage !== "gradient" ? (
        <img
          src={backgroundImage}
          alt="Travel background"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            console.error("Error loading image:", backgroundImage);
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, #083B6F 0%, #FDC311 50%, #98C037 100%)",
          }}
        />
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/40 to-black/30"></div>

      {/* Content Grid */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        {/* Left side - Welcome Section (Hidden on all sizes) */}
        <div className="hidden"></div>

        {/* Center - Form Section */}
        <div className="flex items-center justify-center p-4 sm:p-8 w-full">
          <div className="w-full max-w-md space-y-6">
            {/* App Logo with Animation - Top */}
            <div className="flex flex-col items-center gap-4 text-center mb-8 animate-fade-in justify-center">
              <div className="w-52 h-52 sm:w-64 sm:h-64 flex items-center justify-center">
                <img 
                  src="/uploads/itineralia-logo.png" 
                  alt="Itineralia"
                  className="w-full h-full object-contain drop-shadow-lg"
                  onError={(e) => {
                    console.error("Error loading plane image");
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <p className="text-base sm:text-lg font-semibold text-white/85">Gestión Profesional de Viajes</p>
            </div>

            {/* Form Card */}
            <div className="backdrop-blur-sm bg-black/50 rounded-2xl p-8 border border-white/20 space-y-6">
              {/* Encabezado de Inicio de Sesión */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Iniciar Sesión</h2>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20 rounded-lg mb-6">
                  <TabsTrigger 
                    value="login"
                    className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/60"
                  >
                    Iniciar Sesión
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register"
                    className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/60"
                  >
                    Registrarse
                  </TabsTrigger>
                </TabsList>

              <TabsContent value="login" className="space-y-4 mt-0">
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <div>
                    <Label htmlFor="login-username" className="text-sm font-medium text-white/90">
                      Correo Electrónico
                    </Label>
                    <Input
                      id="login-username"
                      {...loginForm.register("username")}
                      placeholder="tu@email.com"
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:bg-white/20"
                    />
                    {loginForm.formState.errors.username && (
                      <p className="text-sm text-red-400 mt-1">
                        {loginForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="login-password" className="text-sm font-medium text-white/90">
                      Contraseña
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      {...loginForm.register("password")}
                      placeholder="••••••••"
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:bg-white/20"
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-400 mt-1">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 py-2">
                    <input
                      type="checkbox"
                      id="remember"
                      {...loginForm.register("rememberMe")}
                      className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary cursor-pointer"
                    />
                    <label htmlFor="remember" className="text-sm text-white/70 cursor-pointer">
                      Recuérdame
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-white font-semibold mt-4 rounded-lg hover:opacity-90 transition-opacity animate-gradient-flow"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        Iniciar Sesión
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-0">
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  <div>
                    <Label htmlFor="register-name" className="text-sm font-medium text-white/90">
                      Nombre Completo
                    </Label>
                    <Input
                      id="register-name"
                      {...registerForm.register("name")}
                      placeholder="Tu nombre completo"
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:bg-white/20"
                    />
                    {registerForm.formState.errors.name && (
                      <p className="text-sm text-red-400 mt-1">
                        {registerForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="register-username" className="text-sm font-medium text-white/90">
                      Correo electrónico
                    </Label>
                    <Input
                      id="register-username"
                      type="email"
                      {...registerForm.register("username")}
                      placeholder="tu@email.com"
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:bg-white/20"
                    />
                    {registerForm.formState.errors.username && (
                      <p className="text-sm text-red-400 mt-1">
                        {registerForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="register-password" className="text-sm font-medium text-white/90">
                      Contraseña
                    </Label>
                    <Input
                      id="register-password"
                      type="password"
                      {...registerForm.register("password")}
                      placeholder="••••••••"
                      className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:bg-white/20"
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-400 mt-1">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-white font-semibold mt-4 rounded-lg hover:opacity-90 transition-opacity animate-gradient-flow"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Registrando...
                      </>
                    ) : (
                      <>
                        Registrarse
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Footer */}
            <div className="pt-4 border-t border-white/10 text-center text-xs text-white/60 space-y-1">
              <p>
                <a href="#" className="hover:text-white/90 transition">Términos de Servicio</a>
                {' '}| {' '}
                <a href="#" className="hover:text-white/90 transition">Política de Privacidad</a>
              </p>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
