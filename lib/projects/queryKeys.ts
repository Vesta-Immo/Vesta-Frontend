// filepath: lib/projects/queryKeys.ts
// Typed query key factories — refactor-safe, type-safe

export const queryKeys = {
  projects: () => ['projects'] as const,

  project: (id: string) => ['projects', id] as const,

  scenarios: () => ['scenarios'] as const,

  scenario: (scenarioId: string) => ['scenarios', scenarioId] as const,

  compare: (scenarioIds: string[]) =>
    ['scenarios', 'compare', ...[...scenarioIds].sort()] as const,
} as const;

export type QueryKeys = typeof queryKeys;
