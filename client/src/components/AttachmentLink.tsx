import { FileText } from "lucide-react";
import { useFileMetadata } from "@/hooks/useFileMetadata";

interface AttachmentLinkProps {
  filePath: string;
  fallbackName?: string;
  className?: string;
}

export function AttachmentLink({ filePath, fallbackName = "Documento", className }: AttachmentLinkProps) {
  const { data: metadata, isLoading } = useFileMetadata(filePath);
  
  // Construir la URL correcta para descargar el archivo
  const downloadUrl = filePath.startsWith('/objects/') 
    ? `/api${filePath}` 
    : filePath.startsWith('/api/') 
      ? filePath 
      : `/api/objects/uploads/${filePath}`;
  
  const displayName = metadata?.originalName || fallbackName;
  
  return (
    <a
      href={downloadUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 
        hover:underline transition-colors ${className || ''}
      `}
      data-testid={`link-attachment-${filePath.split('/').pop()}`}
    >
      <FileText className="h-4 w-4 flex-shrink-0" />
      {isLoading ? "Cargando..." : displayName}
    </a>
  );
}

// Component for displaying multiple attachments
interface AttachmentListProps {
  attachments: string[];
  fallbackPrefix?: string;
}

export function AttachmentList({ attachments, fallbackPrefix = "Documento" }: AttachmentListProps) {
  if (!attachments || attachments.length === 0) return null;
  
  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <p className="text-sm font-medium text-gray-700 mb-2">
        Documentos Adjuntos
      </p>
      <div className="space-y-1">
        {attachments.map((attachment, index) => (
          <AttachmentLink
            key={`${attachment}-${index}`}
            filePath={attachment}
            fallbackName={`${fallbackPrefix} ${index + 1}.pdf`}
          />
        ))}
      </div>
    </div>
  );
}