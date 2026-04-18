// --- Borrowing capacity ---

export interface BorrowingCapacityRequest {
  annualHouseholdIncome: number;
  monthlyDebtPayments: number;
  annualRatePercent: number;
  durationMonths: number;
  maxDebtRatioPercent: number;
}

export interface BorrowingCapacityResult {
  monthlyPaymentCapacity: number;
  borrowingCapacity: number;
}

// --- Target budget ---

export interface TargetBudgetRequest {
  borrowingCapacity: number;
  downPayment: number;
  estimatedRenovationCosts: number;
}

export interface TargetBudgetResult {
  targetBudget: number;
}

// --- Notary fees ---

export type PropertyType = "NEW" | "OLD";

export interface NotaryFeesRequest {
  propertyPrice: number;
  propertyType: PropertyType;
  departmentCode?: string;
}

export interface NotaryFeesResult {
  notaryFees: number;
  appliedRatePercent: number;
}

// --- Property List ---

export type PropertyStatus = "wanted" | "visited";

export interface RenovationWorkItem {
  name: string;
  details?: string;
  cost: number;
}

export interface FinancingSettings {
  annualRatePercent: number;
  durationMonths: number;
  downPayment: number;
  annualHouseholdIncome: number;
  monthlyCurrentDebtPayments: number;
}

export interface PropertyItem {
  id: string;
  status: PropertyStatus;
  propertyType: PropertyType;
  departmentCode?: string;
  listingUrl?: string;
  price: number;
  addressOrSector: string;
  propertyTaxAnnual: number;
  coOwnershipFeesAnnual: number;
  renovationWorkItems: RenovationWorkItem[];
}

export interface PropertyWithResults extends PropertyItem {
  notaryFees: number;
  totalRenovationBudget: number;
  requiredLoanAmount: number;
  monthlyCreditPayment: number;
  monthlyPaymentWithCharges: number;
  debtRatioPercent: number;
  debtRatioLevel: "LOW" | "OK" | "HIGH";
}

export interface PropertyListSimulation {
  results: PropertyWithResults[];
}

export interface PropertyListState {
  financingSettings: FinancingSettings | null;
  properties: PropertyItem[];
}

export interface PropertyListResponse {
  financingSettings?: FinancingSettings;
  properties: PropertyItem[];
  lastSimulation?: PropertyListSimulation | null;
}

// API Request types
export interface SaveSettingsRequest extends FinancingSettings {}

export interface AddPropertyRequest extends PropertyItem {}

// --- PTZ (Prêt à Taux Zéro) ---

export type PtzZone = 'A' | 'A_BIS' | 'B1' | 'B2' | 'C';

/**
 * Type de bien immobilier PTZ
 *
 * La distinction entre maison individuelle et logement collectif impacte
 * les quotités de financement applicables selon le RFR.
 */
export type PtzPropertyType = 'COLLECTIF' | 'MAISON_INDIVIDUELLE';

/**
 * Type d'opération PTZ
 *
 * - NEUF : Logement neuf ou en VEFA
 * - ANCIEN_AVEC_TRAVAUX: Old property with work (≥25% of total cost)
 */
export type PtzOperationType = 'NEUF' | 'ANCIEN_AVEC_TRAVAUX';

// Enums for complementary loans and first-time buyer exceptions
export enum ComplementaryLoanType {
  PAS = 'PAS',
  CONVENTIONNE = 'CONVENTIONNE',
  CLASSIQUE = 'CLASSIQUE',
  PEL = 'PEL',
  COMPLEMENTAIRE = 'COMPLEMENTAIRE'
}

export enum PrimoAccedantException {
  DIVORCE_SEPARATION = 'DIVORCE_SEPARATION',
  CATASTROPHE_NATURELLE = 'CATASTROPHE_NATURELLE',
  CARTE_INVALIDITE = 'CARTE_INVALIDITE'
}

// PtzDurationInfo - duration information with deferral
export interface PtzDurationInfo {
  totalDurationMonths: number;
  deferredPeriodMonths: number;
  repaymentPeriodMonths: number;
  rfrPercentage: number;
}

export interface CheckPtzEligibilityRequest {
  propertyPrice: number;        // in cents
  propertyZone: PtzZone;
  householdSize: number;
  isPrimoAccedant: boolean;
  annualIncome: number;         // in cents
  workPercentage?: number;      // work % if old property
  hasComplementaryLoan?: boolean;
  complementaryLoanType?: ComplementaryLoanType;
  hasDependencies?: boolean;
  operationId?: string;
  primoAccedantException?: PrimoAccedantException;
  isOldProperty?: boolean;
  propertyType?: PtzPropertyType;
  operationType?: PtzOperationType;
}

export interface CheckPtzEligibilityResult {
  isEligible: boolean;
  reasons?: string[];
  maxPtzAmount?: number;
  ptzRate?: number;
  ptzDuration?: number;
  durationInfo?: PtzDurationInfo;
}

export interface ComputePtzRequest {
  propertyPrice: number;
  propertyZone: PtzZone;
  householdSize: number;
  isPrimoAccedant: boolean;
  annualIncome: number;
  workPercentage?: number;
  hasComplementaryLoan?: boolean;
  complementaryLoanType?: ComplementaryLoanType;
  hasDependencies?: boolean;
  operationId?: string;
  primoAccedantException?: PrimoAccedantException;
  isOldProperty?: boolean;
  propertyType?: PtzPropertyType;
  operationType?: PtzOperationType;
}

export interface ComputePtzResult {
  isEligible: boolean;
  reasons?: string[];
  maxPtzAmount: number;
  ptzRate: number;
  ptzDuration: number;
  loanPercentage: number;
  durationInfo?: PtzDurationInfo;
}

export interface PtzPlafond {
  zone: PtzZone;
  householdSize: number;
  maxPropertyPrice: number;
  maxLoanPercentage: number;
  maxRfr: number;
}

export interface GetPtzConditionsResult {
  plafonds: PtzPlafond[];
  minWorkPercentage: number;
  ptzRate: number;
  maxDurationMonths: number;
}
