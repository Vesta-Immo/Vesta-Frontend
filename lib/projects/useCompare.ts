// filepath: lib/projects/useCompare.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { compareScenarios } from './api';

export function useCompareScenarios(scenarioIds: string[]) {
  return useQuery({
    queryKey: queryKeys.compare(scenarioIds),
    queryFn: () => compareScenarios(scenarioIds),
    staleTime: 0, // never cache comparison results
    enabled: scenarioIds.length >= 2,
  });
}
