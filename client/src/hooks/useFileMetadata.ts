import { useQuery } from "@tanstack/react-query";

interface FileMetadata {
  originalName: string;
  uploadedAt?: string;
  contentType?: string;
  size?: number;
}

export function useFileMetadata(filePath: string | null) {
  return useQuery<FileMetadata>({
    queryKey: ["file-metadata", filePath],
    enabled: !!filePath && filePath.startsWith("/objects/"),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: async () => {
      if (!filePath) throw new Error("No file path provided");
      
      const response = await fetch(`/api${filePath}/metadata`);
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.statusText}`);
      }
      
      return response.json();
    },
  });
}

// Bulk metadata fetching for multiple files
export function useBulkFileMetadata(filePaths: (string | null)[]) {
  const validPaths = filePaths.filter((path): path is string => 
    !!path && path.startsWith("/objects/")
  );
  
  const queries = useQuery({
    queryKey: ["bulk-file-metadata", validPaths],
    enabled: validPaths.length > 0,
    retry: false,
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<Record<string, FileMetadata>> => {
      const promises = validPaths.map(async (path) => {
        try {
          const response = await fetch(`/api${path}/metadata`);
          if (!response.ok) return null;
          const metadata = await response.json();
          return { path, metadata };
        } catch {
          return null;
        }
      });
      
      const results = await Promise.all(promises);
      const metadataMap: Record<string, FileMetadata> = {};
      
      results.forEach((result) => {
        if (result) {
          metadataMap[result.path] = result.metadata;
        }
      });
      
      return metadataMap;
    },
  });
  
  return queries;
}