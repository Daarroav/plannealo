
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient, invalidateTravelQueries } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export const useTravelMutations = (travelId: string) => {
  const { toast } = useToast();

  const updateTravelItemMutation = useMutation({
    mutationFn: async ({ 
      endpoint, 
      method = "POST", 
      data, 
      itemType 
    }: { 
      endpoint: string;
      method?: string;
      data: FormData | any;
      itemType: string;
    }) => {
      const response = await apiRequest(method, endpoint, data);
      return { data: await response.json(), itemType, method };
    },
    onSuccess: ({ data: newItem, itemType, method }) => {
      // Update the full travel data optimistically
      queryClient.setQueryData(["/api/travels", travelId, "full"], (oldData: any) => {
        if (!oldData) return oldData;
        
        const items = oldData[itemType] || [];
        
        if (method === "PUT") {
          // Update existing item
          return {
            ...oldData,
            [itemType]: items.map((item: any) => 
              item.id === newItem.id ? newItem : item
            )
          };
        } else {
          // Add new item
          return {
            ...oldData,
            [itemType]: [...items, newItem]
          };
        }
      });

      invalidateTravelQueries(travelId);
      
      const actionText = method === "PUT" ? "actualizado" : "agregado";
      toast({
        title: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} ${actionText}`,
        description: `El ${itemType} ha sido ${actionText} exitosamente.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTravelItemMutation = useMutation({
    mutationFn: async ({ 
      endpoint, 
      itemId, 
      itemType 
    }: { 
      endpoint: string;
      itemId: string;
      itemType: string;
    }) => {
      await apiRequest("DELETE", endpoint, {});
      return { itemId, itemType };
    },
    onSuccess: ({ itemId, itemType }) => {
      // Remove item from cache optimistically
      queryClient.setQueryData(["/api/travels", travelId, "full"], (oldData: any) => {
        if (!oldData) return oldData;
        
        const items = oldData[itemType] || [];
        
        return {
          ...oldData,
          [itemType]: items.filter((item: any) => item.id !== itemId)
        };
      });

      invalidateTravelQueries(travelId);
      
      toast({
        title: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} eliminado`,
        description: `El ${itemType} ha sido eliminado exitosamente.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    updateTravelItemMutation,
    deleteTravelItemMutation,
  };
};
