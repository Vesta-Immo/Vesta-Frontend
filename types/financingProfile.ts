// filepath: types/financingProfile.ts
// Financing Profile types — mirrors backend domain types

import type { PropertyType } from './project';

/**
 * Paramètres financiers dénormalisés d'un profil.
 * Copie des valeurs du scénario source.
 * Les noms de champs correspondent exactement au backend FinancingProfileSettingsDto.
 */
export interface FinancingProfileSettings {
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
 * Profil de financement global du compte.
 * Peut être lié à un scénario source pour synchronisation.
 */
export interface FinancingProfile {
  id: string;
  userId: string;
  
  // Référence au scénario source
  sourceScenarioId: string;
  sourceProjectId: string;
  sourceScenarioName?: string;
  
  // Données dénormalisées
  settings: FinancingProfileSettings;
  
  // Métadonnées
  name: string;
  description?: string;
  isComplete: boolean;
  lastSyncedAt: string;
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Résumé d'un profil pour affichage dans les listes.
 */
export interface FinancingProfileSummary {
  id: string;
  name: string;
  sourceScenarioId: string;
  sourceProjectId: string;
  isComplete: boolean;
  lastSyncedAt: string;
  sourceScenarioName?: string;
  settings?: {
    downPayment?: number;
    durationMonths?: number;
    annualHouseholdIncome?: number;
    monthlyCurrentDebtPayments?: number;
    maxDebtRatioPercent?: number;
  };
}

/**
 * Réponse de l'API listant les profils avec indication du profil actif.
 */
export interface ListFinancingProfilesResponse {
  profiles: FinancingProfileSummary[];
  activeProfileId: string | null;
  activeProfile: FinancingProfile | null;
}

/**
 * Input pour créer un profil depuis un scénario.
 */
export interface CreateFinancingProfileInput {
  scenarioId: string;
  projectId: string;
  name: string;
  description?: string;
}

/**
 * Input pour mettre à jour un profil.
 */
export interface UpdateFinancingProfileInput {
  name?: string;
  description?: string;
}

/**
 * Réponse de synchronisation d'un profil.
 */
export interface SyncFinancingProfileResponse {
  profileId: string;
  wasActive: boolean;
  isComplete: boolean;
}

/**
 * Préférences utilisateur incluant le profil actif.
 */
export interface UserPreferences {
  userId: string;
  activeProfileId: string | null;
  createdAt: string;
  updatedAt: string;
}
