// filepath: lib/financingProfile/api.ts
// API layer for Financing Profile endpoints

import { requestJson } from '@/lib/apiFetch';
import type {
  FinancingProfile,
  ListFinancingProfilesResponse,
  CreateFinancingProfileInput,
  UpdateFinancingProfileInput,
  SyncFinancingProfileResponse,
} from '@/types/financingProfile';

const BASE = '/api/financing-profiles';

// ─── Profiles ─────────────────────────────────────────────────────────────────

export async function getFinancingProfiles(): Promise<ListFinancingProfilesResponse> {
  return requestJson<ListFinancingProfilesResponse>(BASE, { method: 'GET' });
}

export async function getActiveFinancingProfile(): Promise<FinancingProfile | null> {
  return requestJson<FinancingProfile | null>(`${BASE}/active`, { method: 'GET' });
}

export async function createFinancingProfile(
  data: CreateFinancingProfileInput,
): Promise<FinancingProfile> {
  return requestJson<FinancingProfile>(BASE, {
    method: 'POST',
    body: JSON.stringify({
      scenarioId: data.scenarioId,
      projectId: data.projectId,
      name: data.name,
      description: data.description,
    }),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function updateFinancingProfile(
  profileId: string,
  data: UpdateFinancingProfileInput,
): Promise<FinancingProfile> {
  return requestJson<FinancingProfile>(`${BASE}/${profileId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function syncFinancingProfile(profileId: string): Promise<SyncFinancingProfileResponse> {
  return requestJson<SyncFinancingProfileResponse>(`${BASE}/${profileId}/sync`, {
    method: 'POST',
  });
}

export async function setActiveFinancingProfile(profileId: string): Promise<FinancingProfile> {
  const normalizedProfileId = profileId?.trim();

  if (!normalizedProfileId) {
    throw new Error('Impossible de definir le profil actif: profileId manquant.');
  }

  return requestJson<FinancingProfile>(`${BASE}/set-active`, {
    method: 'POST',
    body: JSON.stringify({ profileId: normalizedProfileId }),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function deleteFinancingProfile(profileId: string): Promise<void> {
  return requestJson<void>(`${BASE}/${profileId}`, { method: 'DELETE' });
}
