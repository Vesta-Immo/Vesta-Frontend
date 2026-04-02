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

const SCENARIOS_BASE = '/api/scenarios';

export async function getScenarios(): Promise<Scenario[]> {
  return requestJson<Scenario[]>(SCENARIOS_BASE, { method: 'GET' });
}

export async function getScenario(scenarioId: string): Promise<Scenario> {
  return requestJson<Scenario>(`${SCENARIOS_BASE}/${scenarioId}`, { method: 'GET' });
}

export async function createScenario(
  data: CreateScenarioInput,
): Promise<Scenario> {
  return requestJson<Scenario>(SCENARIOS_BASE, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function updateScenario(
  scenarioId: string,
  data: UpdateScenarioInput,
): Promise<Scenario> {
  return requestJson<Scenario>(`${SCENARIOS_BASE}/${scenarioId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function deleteScenario(scenarioId: string): Promise<void> {
  return requestJson<void>(`${SCENARIOS_BASE}/${scenarioId}`, { method: 'DELETE' });
}

export async function copyScenario(scenarioId: string): Promise<Scenario> {
  return requestJson<Scenario>(
    `${SCENARIOS_BASE}/${scenarioId}/copy`,
    { method: 'POST' },
  );
}

export async function recomputeScenario(scenarioId: string): Promise<Scenario> {
  return requestJson<Scenario>(
    `${SCENARIOS_BASE}/${scenarioId}/compute`,
    { method: 'POST' },
  );
}

// ─── Compare ──────────────────────────────────────────────────────────────────

export async function compareScenarios(
  scenarioIds: string[],
): Promise<CompareScenariosResponse> {
  // Backend expects comma-separated single value: ?ids=sc1,sc2,sc3
  const query = `ids=${scenarioIds.map((id) => encodeURIComponent(id)).join(',')}`;
  return requestJson<CompareScenariosResponse>(
    `${SCENARIOS_BASE}/compare?${query}`,
    { method: 'GET' },
  );
}
