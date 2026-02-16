import { useEffect, useMemo, useState, useRef } from "react";
import { NavigationHeader } from "@/components/ui/navigation-header";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Plus, Delete } from "@icon-park/react";

interface User {
  id: string;
  username: string;
  name: string;
  role: "master" | "admin" | "traveler" | string;
}

export default function UsersAdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formState, setFormState] = useState({
    id: "",
    name: "",
    username: "",
    password: "",
    role: "traveler",
  });

  const roleLabels = useMemo<Record<string, string>>(
    () => ({
      master: "Maestro",
      admin: "Administrador",
      traveler: "Viajero",
    }),
    []
  );

  const isMaster = user?.role === "master";

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;
    return users.filter((entry) => {
      return (
        entry.name.toLowerCase().includes(term) ||
        entry.username.toLowerCase().includes(term) ||
        (roleLabels[entry.role] || entry.role).toLowerCase().includes(term)
      );
    });
  }, [roleLabels, searchTerm, users]);

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "master":
        return "bg-accent/15 text-accent border-accent/30";
      case "admin":
        return "bg-emerald-500/15 text-emerald-700 border-emerald-500/30";
      case "traveler":
        return "bg-slate-500/15 text-slate-700 border-slate-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Error al cargar usuarios");
        }
        const data = (await response.json()) as User[];
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const refreshUsers = async () => {
    const response = await fetch("/api/users");
    if (!response.ok) {
      throw new Error("Error al cargar usuarios");
    }
    const data = (await response.json()) as User[];
    setUsers(data);
  };

  const openCreateDialog = () => {
    setIsEditing(false);
    setFormState({ id: "", name: "", username: "", password: "", role: "traveler" });
    setError(null);
    setDialogOpen(true);
  };

  const openEditDialog = (selected: User) => {
    setIsEditing(true);
    setFormState({
      id: selected.id,
      name: selected.name,
      username: selected.username,
      password: "",
      role: selected.role || "traveler",
    });
    setError(null);
    setDialogOpen(true);
  };

  const handleDelete = async (selected: User) => {
    try {
      if (!window.confirm(`Eliminar el usuario ${selected.name}?`)) return;

      const response = await fetch(`/api/users/${selected.id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Error al eliminar usuario");
      }
      await refreshUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  // Validación de email simple
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      if (!formState.name || !formState.role || (!isEditing && (!formState.username || !formState.password))) {
        setError("Completa todos los campos requeridos");
        return;
      }
      if (!isEditing && !isValidEmail(formState.username)) {
        setError("El correo electrónico no es válido");
        return;
      }
      const payload = isEditing
        ? { name: formState.name, role: formState.role }
        : {
            username: formState.username,
            password: formState.password,
            name: formState.name,
            role: formState.role,
          };
      const response = await fetch(isEditing ? `/api/users/${formState.id}` : "/api/users", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const message = (await response.json().catch(() => null))?.error || "Error al guardar usuario";
        throw new Error(message);
      }
      await refreshUsers();
      setDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <NavigationHeader />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Usuarios</h2>
            <p className="text-muted-foreground">Gestiona los usuarios y sus roles</p>
          </div>
          {isMaster && (
            <Button onClick={openCreateDialog} className="gap-2 bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4" />
              Nuevo usuario
            </Button>
          )}
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Usuarios registrados</p>
              <p className="text-xs text-muted-foreground">{filteredUsers.length} usuarios</p>
            </div>
            <div className="w-full sm:w-64">
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por nombre, correo o rol"
              />
            </div>
          </div>
          <div className="max-h-[60vh] overflow-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Correo</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rol</th>
                  {isMaster && (
                    <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getRoleBadgeClass(user.role)}`}>
                        {roleLabels[user.role] || user.role}
                      </span>
                    </td>
                    {isMaster && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(user)}
                            className="hover:bg-accent/10 hover:text-accent"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(user)}
                            className="hover:bg-accent/10 hover:text-accent"
                          >
                            <Delete className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
              {isEditing && (
                <DialogDescription>
                  Actualiza el nombre y rol del usuario
                </DialogDescription>
              )}
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formState.name}
                  onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role-input">Rol</Label>
                <Select
                  value={formState.role}
                  onValueChange={(value) => setFormState((prev) => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="master">Maestro</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="traveler">Viajero</SelectItem>
                  </SelectContent>
                </Select>
                {/* Input oculto para accesibilidad y autofill */}
                <input id="role-input" name="role" value={formState.role} readOnly hidden tabIndex={-1} aria-hidden="true" />
              </div>
              {!isEditing && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Correo electrónico</Label>
                    <Input
                      id="username"
                      value={formState.username}
                      onChange={(event) => setFormState((prev) => ({ ...prev, username: event.target.value }))}
                      required
                      type="email"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formState.password}
                      onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
                      required
                    />
                  </div>
                </>
              )}
            </div>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mt-2 text-sm">
                {error}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)} className="border-accent text-accent hover:bg-accent/10">
                Cancelar
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90">
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
