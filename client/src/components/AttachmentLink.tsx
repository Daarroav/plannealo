import { Paperclip, Download, Picture } from "@icon-park/react";
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
  
  // Determine file type and appropriate icon
  const getFileIcon = () => {
    if (!metadata?.contentType && !displayName) {
      return <Paperclip className="h-4 w-4 flex-shrink-0" />;
    }
    
    const contentType = metadata?.contentType || '';
    const fileName = displayName.toLowerCase();
    
    // PDF files
    if (contentType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return <Paperclip className="h-4 w-4 flex-shrink-0 text-red-600" />;
    }
    
    // Image files
    if (contentType.startsWith('image/') || 
        ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].some(ext => fileName.endsWith(ext))) {
      return <Picture className="h-4 w-4 flex-shrink-0 text-green-600" />;
    }
    
    // Other files
    return <Paperclip className="h-4 w-4 flex-shrink-0" />;
  };
  
  // Special handling for PDF files
  const isPDF = metadata?.contentType === 'application/pdf' || 
                displayName.toLowerCase().endsWith('.pdf');
  
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
      title={isPDF ? "Click para ver PDF en nueva pestaña" : "Click para abrir archivo"}
    >
      {getFileIcon()}
      <span className="flex-1">
        {isLoading ? "Cargando..." : displayName}
        {isPDF && <span className="text-xs text-gray-500 ml-1">(PDF)</span>}
      </span>
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