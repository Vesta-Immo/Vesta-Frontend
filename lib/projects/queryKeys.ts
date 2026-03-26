// filepath: lib/projects/queryKeys.ts
// Typed query key factories — refactor-safe, type-safe

export const queryKeys = {
  projects: () => ['projects'] as const,

  project: (id: string) => ['projects', id] as const,

  scenarios: (projectId: string) => ['projects', projectId, 'scenarios'] as const,

  scenario: (projectId: string, scenarioId: string) =>
    ['projects', projectId, 'scenarios', scenarioId] as const,

  compare: (projectId: string, scenarioIds: string[]) =>
    ['projects', projectId, 'compare', ...[...scenarioIds].sort()] as const,
} as const;

export type QueryKeys = typeof queryKeys;
