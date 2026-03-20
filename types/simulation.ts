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
