// filepath: lib/projects/useCompare.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { compareScenarios } from './api';

export function useCompareScenarios(projectId: string, scenarioIds: string[]) {
  return useQuery({
    queryKey: queryKeys.compare(projectId, scenarioIds),
    queryFn: () => compareScenarios(projectId, scenarioIds),
    staleTime: 0, // never cache comparison results
    enabled: !!projectId && scenarioIds.length >= 2,
  });
}
