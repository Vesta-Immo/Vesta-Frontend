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
