import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import type { Travel } from "@shared/schema";

interface TravelCardProps {
  travel: Travel;
  onEdit: (travelId: string) => void;
  onDelete?: (travelId: string) => void;
}

export function TravelCard({ travel, onEdit, onDelete }: TravelCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const statusCard  = travel.status === "published" ? "" :  "opacity-50";
  const statusButton = travel.status === "published" ? "" :  "bg-yellow-100 text-yellow-800";
  const statusColor = travel.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  const statusText = travel.status === "published" ? "Publicado" : "Borrador";

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return format(new Date(date), "dd MMM", { locale: es });
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(travel.id);
    }
    setShowDeleteDialog(false);
  };

  // If the travel status is 'delete', do not render the card at all
  if (travel.status === "delete") {
    return null;
  }

  return (
    <div className={`border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 ${statusCard}`}>
      <img
        src={travel.coverImage && travel.coverImage.startsWith('/objects/') ? `/api${travel.coverImage}` : travel.coverImage || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250"}
        alt={travel.name}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250";
        }}
      />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-foreground">{travel.name}</h4>
          <Badge className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>
            {statusText}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">Cliente: {travel.clientName}</p>
        <div className="flex items-center text-xs text-muted-foreground space-x-4 mb-3">
          <span className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            {formatDate(travel.startDate)}-{formatDate(travel.endDate)}
          </span>
          <span className="flex items-center">
            <Users className="mr-1 h-3 w-3" />
            {travel.travelers} viajero{travel.travelers !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex gap-2">
            <Button
              onClick={() => onEdit(travel.id)}
              variant="outline"
              size="sm"
              className={`w-full ${statusButton}`}
            >
              {travel.status === "draft" ? "Continuar Editando" : "Editar Viaje"}
            </Button>
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar viaje?</AlertDialogTitle>
            <AlertDialogDescription>
              Este viaje será eliminado de forma permanente. No podrá editarlo ni volver a verlo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}