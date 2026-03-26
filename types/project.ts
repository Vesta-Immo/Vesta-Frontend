// filepath: types/project.ts
// Project & Scenario types — mirrors backend domain types

export type PropertyType = 'NEW' | 'OLD';

/**
 * Paramètres d'entrée d'un scénario.
 * Représente la configuration financière complète d'une simulation.
 */
export interface ScenarioInput {
  annualHouseholdIncome: number;
  monthlyCurrentDebtPayments: number;
  annualRatePercent: number;
  durationMonths: number;
  maxDebtRatioPercent: number;
  downPayment: number;
  propertyType: PropertyType;
  departmentCode?: string;
}

/**
 * Résultat calculé d'un scénario.
 * Null si le scénario n'a pas encore été calculé.
 */
export interface ScenarioOutput {
  monthlyPaymentCapacity: number;
  borrowingCapacity: number;
  notaryFees: number;
  totalBudget: number;
  monthlyCreditPayment: number;
  computedAt: string;
  computationVersion: string;
}

export interface Scenario {
  id: string;
  projectId: string;
  name: string;
  inputParams: ScenarioInput;
  outputResult: ScenarioOutput | null;
  isBaseline: boolean;
  computedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  scenarios: Scenario[];
}

export interface CreateProjectInput {
  name: string;
  location?: string;
}

export interface UpdateProjectInput {
  name?: string;
  location?: string;
}

export interface CreateScenarioInput extends ScenarioInput {
  name: string;
}

export interface UpdateScenarioInput extends Partial<ScenarioInput> {
  name?: string;
}

// ─── Compare ─────────────────────────────────────────────────────────────────

export interface ScenarioComparisonRow {
  scenarioId: string;
  scenarioName: string;
  isBaseline: boolean;
  annualHouseholdIncome: number;
  durationMonths: number;
  annualRatePercent: number;
  downPayment: number;
  borrowingCapacity: number;
  monthlyPaymentCapacity: number;
  monthlyCreditPayment: number;
  totalBudget: number;
  notaryFees: number;
}

export interface ScenarioDelta {
  borrowingCapacityDelta: number;
  monthlyPaymentDelta: number;
  totalBudgetDelta: number;
}

export interface CompareScenariosInsight {
  bestMonthlyPayment: { scenarioId: string; value: number };
  highestBorrowingCapacity: { scenarioId: string; value: number };
  highestTotalBudget: { scenarioId: string; value: number };
}

export interface CompareScenariosResponse {
  scenarios: ScenarioComparisonRow[];
  insights: CompareScenariosInsight;
  deltas: Record<string, ScenarioDelta>;
}

// ─── API Error ───────────────────────────────────────────────────────────────

export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
  details?: Array<{ field: string; message: string }>;
  timestamp: string;
  traceId?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function isStale(computedAt: string | null): boolean {
  if (!computedAt) return false;
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(computedAt).getTime() > sevenDaysMs;
}

export function formatComputedAt(computedAt: string | null): string {
  if (!computedAt) return 'Non calculé';
  const date = new Date(computedAt);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
  return `Le ${date.toLocaleDateString('fr-FR')}`;
}
