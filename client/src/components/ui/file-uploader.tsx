import React, { useState, useEffect } from "react";
import { Upload, Paperclip, Close } from "@icon-park/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  name: string;
  defaultFiles?: (File | string)[]; // strings pueden ser URLs
  onFilesChange?: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  name,
  defaultFiles = [],
  onFilesChange,
  maxFiles = 10,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt",
}) => {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    // Si vienen URLs en defaultFiles, conviértelas en File
    if (defaultFiles.length > 0) {
      Promise.all(
        defaultFiles.map(async (item) => {
          if (typeof item === "string") {
            const response = await fetch(item);
            const blob = await response.blob();
            const filename = item.split("/").pop() || "archivo";
            return new File([blob], filename, { type: blob.type });
          }
          return item as File;
        })
      )
        .then((loadedFiles) => setFiles(loadedFiles))
        .catch((err) => console.error("Error cargando archivos:", err));
    }
  }, [defaultFiles]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const updated = [...files, ...selected].slice(0, maxFiles);
    setFiles(updated);
    onFilesChange?.(updated);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange?.(updated);
  };

  return (
    <div className="border-2 border-dashed border-border rounded-lg p-6">
      <div className="text-center">
        <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <div className="space-y-2">
          <Label htmlFor={name} className="cursor-pointer">
            <span className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md inline-block">
              Seleccionar Documentos
            </span>
          </Label>
          <Input
            id={name}
            type="file"
            multiple
            accept={accept}
            onChange={handleFileUpload}
            className="hidden"
          />
          <p className="text-sm text-muted-foreground">
            Archivos permitidos: {accept} - Máximo {maxFiles}
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-foreground">Documentos seleccionados:</h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-muted p-2 rounded"
            >
              <div className="flex items-center space-x-2">
                <a
                  href={URL.createObjectURL(file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <Paperclip className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{file.name}</span>
                </a>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
              >
                <Close className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
