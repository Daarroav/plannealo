import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Loading } from "@icon-park/react";
import { useToast } from "@/hooks/use-toast";

interface CoverImageUploaderProps {
  onUploadComplete: (objectPath: string) => void;
  buttonClassName?: string;
  children?: React.ReactNode;
}

export function CoverImageUploader({
  onUploadComplete,
  buttonClassName,
  children,
}: CoverImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de imagen válido.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen no debe superar los 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading cover image...');

      // Upload file
      const response = await fetch('/api/travels/upload-cover-direct', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        // Try to read the response as text first to see what we're getting
        const responseText = await response.text();
        console.error('Error response:', responseText);
        
        // Try to parse as JSON if possible
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.error || errorData.message || 'Error al subir la imagen');
        } catch {
          // If not JSON, show the status
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Expected JSON but got:', contentType, responseText);
        throw new Error('El servidor no respondió con JSON. Verifica los logs del servidor.');
      }

      const data = await response.json();
      console.log('Upload response:', data);
      
      if (data.uploadURL) {
        onUploadComplete(data.uploadURL);
      } else {
        throw new Error('No se recibió la URL de la imagen subida');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al subir la imagen",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={buttonClassName}
      >
        {isUploading ? (
          <>
            <Loading className="w-4 h-4 mr-2 animate-spin" />
            Subiendo...
          </>
        ) : (
          children || (
            <>
              <Camera className="w-4 h-4 mr-2" />
              Cambiar Imagen
            </>
          )
        )}
      </Button>
    </>
  );
}
