// filepath: lib/projects/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30s for project list
      retry: 1,
      throwOnError: false, // Handle errors in component
    },
    mutations: {
      retry: 0,
    },
  },
});
