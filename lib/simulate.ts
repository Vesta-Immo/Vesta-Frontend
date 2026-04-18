import type {
  BorrowingCapacityRequest,
  BorrowingCapacityResult,
  TargetBudgetRequest,
  TargetBudgetResult,
  NotaryFeesRequest,
  NotaryFeesResult,
  CheckPtzEligibilityRequest,
  CheckPtzEligibilityResult,
  ComputePtzRequest,
  ComputePtzResult,
  GetPtzConditionsResult,
} from "@/types/simulation";
import { apiFetch, requestJson } from "@/lib/apiFetch";

async function post<TReq, TRes>(path: string, body: TReq): Promise<TRes> {
  return apiFetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(async (res) => {
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json() as Promise<TRes>;
  });
}

export function computeBorrowingCapacity(
  req: BorrowingCapacityRequest
): Promise<BorrowingCapacityResult> {
  return post("/api/simulate/borrowing-capacity", req);
}

export function computeTargetBudget(
  req: TargetBudgetRequest
): Promise<TargetBudgetResult> {
  return post("/api/simulate/target-budget", req);
}

export function computeNotaryFees(
  req: NotaryFeesRequest
): Promise<NotaryFeesResult> {
  return post("/api/simulate/notary-fees", req);
}

// --- PTZ (Prêt à Taux Zéro) ---

export function checkPtzEligibility(
  req: CheckPtzEligibilityRequest
): Promise<CheckPtzEligibilityResult> {
  return post("/api/ptz/check-eligibility", req);
}

export function computePtzAmount(
  req: ComputePtzRequest
): Promise<ComputePtzResult> {
  return post("/api/ptz/compute", req);
}

export function getPtzConditions(): Promise<GetPtzConditionsResult> {
  return requestJson("/api/ptz/conditions", { method: "GET" });
}
