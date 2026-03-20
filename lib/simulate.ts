import type {
  BorrowingCapacityRequest,
  BorrowingCapacityResult,
  TargetBudgetRequest,
  TargetBudgetResult,
  NotaryFeesRequest,
  NotaryFeesResult,
} from "@/types/simulation";

async function post<TReq, TRes>(path: string, body: TReq): Promise<TRes> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(error.message ?? "Une erreur est survenue.");
  }

  return response.json() as Promise<TRes>;
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
