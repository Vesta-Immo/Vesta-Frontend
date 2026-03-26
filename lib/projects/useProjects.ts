// filepath: lib/projects/useProjects.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { queryKeys } from './queryKeys';
import * as api from './api';
import type { CreateProjectInput, UpdateProjectInput, Project } from '@/types/project';
import type { ApiError } from '@/types/project';

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects(),
    queryFn: api.getProjects,
    staleTime: 30_000,
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: queryKeys.project(projectId),
    queryFn: () => api.getProject(projectId),
    staleTime: 0, // always fresh
    enabled: !!projectId,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateProjectInput) => api.createProject(data),
    onSuccess: (project: Project) => {
      qc.invalidateQueries({ queryKey: queryKeys.projects() });
      router.push(`/simulation/projects/${project.id}`);
    },
    onError: (err: ApiError) => {
      if (err.statusCode === 403 || err.statusCode === 404) {
        router.push('/simulation/projects');
      }
    },
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: UpdateProjectInput;
    }) => api.updateProject(projectId, data),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.project(vars.projectId) });
      qc.invalidateQueries({ queryKey: queryKeys.projects() });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (projectId: string) => api.deleteProject(projectId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.projects() });
      router.push('/simulation/projects');
    },
  });
}
