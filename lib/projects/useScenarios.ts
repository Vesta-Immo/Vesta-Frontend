// filepath: lib/projects/useScenarios.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { queryKeys } from './queryKeys';
import * as api from './api';
import type { CreateScenarioInput, UpdateScenarioInput, Scenario } from '@/types/project';
import type { ApiError } from '@/types/project';

export function useScenarios(projectId: string) {
  return useQuery({
    queryKey: queryKeys.scenarios(projectId),
    queryFn: () => api.getScenarios(projectId),
    staleTime: 0,
    enabled: !!projectId,
  });
}

export function useScenario(projectId: string, scenarioId: string) {
  return useQuery({
    queryKey: queryKeys.scenario(projectId, scenarioId),
    queryFn: () => api.getScenario(projectId, scenarioId),
    staleTime: 0,
    enabled: !!projectId && !!scenarioId,
  });
}

export function useCreateScenario() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: CreateScenarioInput }) =>
      api.createScenario(projectId, data),
    onSuccess: (_scenario: Scenario, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.scenarios(vars.projectId) });
      qc.invalidateQueries({ queryKey: queryKeys.project(vars.projectId) });
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
      projectId,
      scenarioId,
      data,
    }: {
      projectId: string;
      scenarioId: string;
      data: UpdateScenarioInput;
    }) => api.updateScenario(projectId, scenarioId, data),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.scenarios(vars.projectId) });
      qc.invalidateQueries({ queryKey: queryKeys.scenario(vars.projectId, vars.scenarioId) });
      qc.invalidateQueries({ queryKey: queryKeys.project(vars.projectId) });
    },
  });
}

export function useDeleteScenario() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, scenarioId }: { projectId: string; scenarioId: string }) =>
      api.deleteScenario(projectId, scenarioId),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.scenarios(vars.projectId) });
      qc.invalidateQueries({ queryKey: queryKeys.project(vars.projectId) });
    },
  });
}

export function useCopyScenario() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, scenarioId }: { projectId: string; scenarioId: string }) =>
      api.copyScenario(projectId, scenarioId),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.scenarios(vars.projectId) });
      qc.invalidateQueries({ queryKey: queryKeys.project(vars.projectId) });
    },
  });
}

export function useRecomputeScenario() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, scenarioId }: { projectId: string; scenarioId: string }) =>
      api.recomputeScenario(projectId, scenarioId),
    onSuccess: (updated: Scenario, vars) => {
      qc.setQueryData(queryKeys.scenario(vars.projectId, vars.scenarioId), updated);
      qc.invalidateQueries({ queryKey: queryKeys.scenarios(vars.projectId) });
    },
  });
}
