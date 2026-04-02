// filepath: lib/projects/useScenarios.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { queryKeys } from './queryKeys';
import * as api from './api';
import type { CreateScenarioInput, UpdateScenarioInput, Scenario } from '@/types/project';
import type { ApiError } from '@/types/project';

export function useScenarios() {
  return useQuery({
    queryKey: queryKeys.scenarios(),
    queryFn: api.getScenarios,
    staleTime: 0,
  });
}

export function useScenario(scenarioId: string) {
  return useQuery({
    queryKey: queryKeys.scenario(scenarioId),
    queryFn: () => api.getScenario(scenarioId),
    staleTime: 0,
    enabled: !!scenarioId,
  });
}

export function useCreateScenario() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateScenarioInput) => api.createScenario(data),
    onSuccess: (_scenario: Scenario) => {
      qc.invalidateQueries({ queryKey: queryKeys.scenarios() });
      qc.invalidateQueries({ queryKey: queryKeys.projects() });
    },
    onError: (err: ApiError) => {
      if (err.statusCode === 403 || err.statusCode === 404) {
        router.push('/simulation/projects');
      }
    },
  });
}

export function useUpdateScenario() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      scenarioId,
      data,
    }: {
      scenarioId: string;
      data: UpdateScenarioInput;
    }) => api.updateScenario(scenarioId, data),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.scenarios() });
      qc.invalidateQueries({ queryKey: queryKeys.scenario(vars.scenarioId) });
      qc.invalidateQueries({ queryKey: queryKeys.projects() });
    },
  });
}

export function useDeleteScenario() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (scenarioId: string) => api.deleteScenario(scenarioId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.scenarios() });
      qc.invalidateQueries({ queryKey: queryKeys.projects() });
    },
  });
}

export function useCopyScenario() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (scenarioId: string) => api.copyScenario(scenarioId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.scenarios() });
      qc.invalidateQueries({ queryKey: queryKeys.projects() });
    },
  });
}

export function useRecomputeScenario() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (scenarioId: string) => api.recomputeScenario(scenarioId),
    onSuccess: (updated: Scenario) => {
      qc.setQueryData(queryKeys.scenario(updated.id), updated);
      qc.invalidateQueries({ queryKey: queryKeys.scenarios() });
    },
  });
}
