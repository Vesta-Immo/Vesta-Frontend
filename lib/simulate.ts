import type {
  BorrowingCapacityRequest,
  BorrowingCapacityResult,
  TargetBudgetRequest,
  TargetBudgetResult,
  NotaryFeesRequest,
  NotaryFeesResult,
} from "@/types/simulation";
import { requestJson } from "@/lib/apiFetch";

async function post<TReq, TRes>(path: string, body: TReq): Promise<TRes> {
  return requestJson<TRes>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
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
