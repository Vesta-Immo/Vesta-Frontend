// filepath: lib/financingProfile/useFinancingProfiles.ts
// React Query hooks for Financing Profiles

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { queryKeys } from './queryKeys';
import * as api from './api';
import type {
  FinancingProfile,
  CreateFinancingProfileInput,
  UpdateFinancingProfileInput,
  ListFinancingProfilesResponse,
  UserPreferences,
} from '@/types/financingProfile';

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useFinancingProfiles() {
  return useQuery<ListFinancingProfilesResponse>({
    queryKey: queryKeys.list(),
    queryFn: () => api.getFinancingProfiles(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useActiveFinancingProfile() {
  return useQuery<FinancingProfile | null>({
    queryKey: queryKeys.active(),
    queryFn: () => api.getActiveFinancingProfile(),
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateFinancingProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFinancingProfileInput) =>
      api.createFinancingProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
      qc.invalidateQueries({ queryKey: queryKeys.active() });
    },
  });
}

export function useUpdateFinancingProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      profileId,
      data,
    }: {
      profileId: string;
      data: UpdateFinancingProfileInput;
    }) => api.updateFinancingProfile(profileId, data),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.detail(vars.profileId) });
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
    },
  });
}

export function useSyncFinancingProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (profileId: string) => api.syncFinancingProfile(profileId),
    onSuccess: (_res, profileId) => {
      qc.invalidateQueries({ queryKey: queryKeys.detail(profileId) });
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
      qc.invalidateQueries({ queryKey: queryKeys.active() });
    },
  });
}

export function useSetActiveFinancingProfile() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (profileId: string) => {
      const normalizedProfileId = profileId?.trim();

      if (!normalizedProfileId) {
        throw new Error('Veuillez selectionner un profil valide.');
      }

      return api.setActiveFinancingProfile(normalizedProfileId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
      qc.invalidateQueries({ queryKey: queryKeys.active() });
      // Force refresh to update all components using active profile
      router.refresh();
    },
  });
}

export function useDeleteFinancingProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (profileId: string) => api.deleteFinancingProfile(profileId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
      qc.invalidateQueries({ queryKey: queryKeys.active() });
    },
  });
}

// ─── Convenience Hook ─────────────────────────────────────────────────────────

/**
 * Hook pour créer ou mettre à jour un profil depuis un scénario.
 * Si un profil existe déjà pour ce scénario, il est mis à jour.
 * Sinon, un nouveau profil est créé.
 */
export function useCreateOrUpdateProfileFromScenario() {
  const qc = useQueryClient();
  const profilesQuery = useFinancingProfiles();
  const createMutation = useCreateFinancingProfile();
  const updateMutation = useUpdateFinancingProfile();
  const setActiveMutation = useSetActiveFinancingProfile();

  return useMutation({
    mutationFn: async ({
      projectId,
      scenarioId,
      scenarioName,
    }: {
      projectId: string;
      scenarioId: string;
      scenarioName: string;
    }) => {
      // Wait for profiles to load
      const profilesData = await qc.fetchQuery({
        queryKey: queryKeys.list(),
        queryFn: () => api.getFinancingProfiles(),
      });

      // Check if profile already exists for this scenario
      const existingProfile = profilesData.profiles.find(
        (p) => p.sourceScenarioId === scenarioId
      );

      if (existingProfile) {
        // Update existing profile (trigger sync)
        const updated = await api.syncFinancingProfile(existingProfile.id);
        // Set as active
        await api.setActiveFinancingProfile(updated.profileId);
        return { profileId: updated.profileId, isNew: false };
      } else {
        // Create new profile
        const created = await api.createFinancingProfile({
          scenarioId,
          projectId,
          name: scenarioName,
        });
        // Set as active
        await api.setActiveFinancingProfile(created.id);
        return { profileId: created.id, isNew: true };
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.lists() });
      qc.invalidateQueries({ queryKey: queryKeys.active() });
    },
  });
}
