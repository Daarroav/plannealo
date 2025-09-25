import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Handle FormData differently from regular JSON data
  const isFormData = data instanceof FormData;
  
  const res = await fetch(url, {
    method,
    headers: !isFormData && data ? { "Content-Type": "application/json" } : {},
    body: isFormData ? data as FormData : (data ? JSON.stringify(data) : undefined),
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// Helper function to invalidate related travel queries
export const invalidateTravelQueries = (travelId: string) => {
  const keysToInvalidate = [
    ["/api/travels", travelId],
    ["/api/travels", travelId, "full"],
    ["/api/travels"],
    ["/api/stats"],
    ["/api/travels", travelId, "accommodations"],
    ["/api/travels", travelId, "activities"],
    ["/api/travels", travelId, "flights"],
    ["/api/travels", travelId, "transports"],
    ["/api/travels", travelId, "cruises"],
    ["/api/travels", travelId, "insurances"],
    ["/api/travels", travelId, "notes"],
  ];

  keysToInvalidate.forEach(key => {
    queryClient.invalidateQueries({ queryKey: key });
  });
};

// Helper function to optimistically update travel data
export const optimisticallyUpdateTravel = (travelId: string, updater: (oldData: any) => any) => {
  // Update main travel query
  queryClient.setQueryData(["/api/travels", travelId], updater);
  
  // Update full travel query
  queryClient.setQueryData(["/api/travels", travelId, "full"], (oldData: any) => {
    if (!oldData) return oldData;
    return {
      ...oldData,
      travel: updater(oldData.travel)
    };
  });

  // Update travels list
  queryClient.setQueryData(["/api/travels"], (oldData: any) => {
    if (!Array.isArray(oldData)) return oldData;
    return oldData.map((travel: any) => 
      travel.id === travelId ? updater(travel) : travel
    );
  });
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes instead of Infinity
      gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
      retry: false,
    },
    mutations: {
      retry: false,
      // Global onSuccess for all mutations to ensure cache invalidation
      onSuccess: (data, variables, context: any) => {
        // If the mutation context includes a travelId, invalidate related queries
        if (context?.travelId) {
          invalidateTravelQueries(context.travelId);
        }
      },
    },
  },
});
