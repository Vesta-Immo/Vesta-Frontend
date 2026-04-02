// filepath: lib/financingProfile/queryKeys.ts
// React Query keys for Financing Profile cache

export const queryKeys = {
  all: ['financingProfiles'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: () => [...queryKeys.lists()] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
  active: () => [...queryKeys.all, 'active'] as const,
} as const;
