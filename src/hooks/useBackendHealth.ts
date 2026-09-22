import { useQuery } from "@tanstack/react-query";
import { fetchHealth } from "@/lib/soc/api";
import type { HealthResponse } from "@/lib/soc/types";

export function useBackendHealth() {
  return useQuery<HealthResponse>({
    queryKey: ["soc", "health"],
    queryFn: fetchHealth,
    refetchInterval: 30_000,
    retry: 2,
    retryDelay: 1000,
    staleTime: 30_000,
  });
}

