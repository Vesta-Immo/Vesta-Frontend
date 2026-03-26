// filepath: lib/projects/api.ts
// API layer for Projects & Scenarios endpoints

import { requestJson } from '@/lib/apiFetch';
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  CreateScenarioInput,
  UpdateScenarioInput,
  Scenario,
  CompareScenariosResponse,
} from '@/types/project';

const BASE = '/api/projects';

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  return requestJson<Project[]>(BASE, { method: 'GET' });
}

export async function getProject(projectId: string): Promise<Project> {
  return requestJson<Project>(`${BASE}/${projectId}`, { method: 'GET' });
}

export async function createProject(data: CreateProjectInput): Promise<Project> {
  return requestJson<Project>(BASE, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function updateProject(
  projectId: string,
  data: UpdateProjectInput,
): Promise<Project> {
  return requestJson<Project>(`${BASE}/${projectId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function deleteProject(projectId: string): Promise<void> {
  return requestJson<void>(`${BASE}/${projectId}`, { method: 'DELETE' });
}

// ─── Scenarios ────────────────────────────────────────────────────────────────

export async function getScenarios(projectId: string): Promise<Scenario[]> {
  return requestJson<Scenario[]>(`${BASE}/${projectId}/scenarios`, { method: 'GET' });
}

export async function getScenario(
  projectId: string,
  scenarioId: string,
): Promise<Scenario> {
  return requestJson<Scenario>(
    `${BASE}/${projectId}/scenarios/${scenarioId}`,
    { method: 'GET' },
  );
}

export async function createScenario(
  projectId: string,
  data: CreateScenarioInput,
): Promise<Scenario> {
  return requestJson<Scenario>(`${BASE}/${projectId}/scenarios`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function updateScenario(
  projectId: string,
  scenarioId: string,
  data: UpdateScenarioInput,
): Promise<Scenario> {
  return requestJson<Scenario>(`${BASE}/${projectId}/scenarios/${scenarioId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function deleteScenario(
  projectId: string,
  scenarioId: string,
): Promise<void> {
  return requestJson<void>(
    `${BASE}/${projectId}/scenarios/${scenarioId}`,
    { method: 'DELETE' },
  );
}

export async function copyScenario(
  projectId: string,
  scenarioId: string,
): Promise<Scenario> {
  return requestJson<Scenario>(
    `${BASE}/${projectId}/scenarios/${scenarioId}/copy`,
    { method: 'POST' },
  );
}

export async function recomputeScenario(
  projectId: string,
  scenarioId: string,
): Promise<Scenario> {
  return requestJson<Scenario>(
    `${BASE}/${projectId}/scenarios/${scenarioId}/compute`,
    { method: 'POST' },
  );
}

// ─── Compare ──────────────────────────────────────────────────────────────────

export async function compareScenarios(
  projectId: string,
  scenarioIds: string[],
): Promise<CompareScenariosResponse> {
  // Backend expects comma-separated single value: ?ids=sc1,sc2,sc3
  const query = `ids=${scenarioIds.map((id) => encodeURIComponent(id)).join(',')}`;
  return requestJson<CompareScenariosResponse>(
    `${BASE}/${projectId}/scenarios/compare?${query}`,
    { method: 'GET' },
  );
}
