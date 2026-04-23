"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCompareScenarios } from "@/lib/projects";
import CompareTable from "@/components/projects/CompareTable";
import InsightsCards from "@/components/projects/InsightsCards";
import Button from "@/components/ui/Button";

function CompareContent() {
  const t = useTranslations("compare");
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") ?? "";
  const scenarioIds = idsParam ? idsParam.split(",").filter(Boolean) : [];

  const { data, isLoading, isError, error } = useCompareScenarios(scenarioIds);

  if (isError) {
    return (
      <div className="rounded-[var(--radius)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {error instanceof Error ? error.message : t("errors.comparison")}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-[300px] animate-pulse rounded-[var(--radius)] bg-[var(--muted)]" />
        <div className="h-[100px] animate-pulse rounded-[var(--radius)] bg-[var(--muted)]" />
      </div>
    );
  }

  if (!data || data.scenarios.length === 0) {
    return (
      <div className="rounded-[var(--radius)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        {t("selectAtLeastTwo")}
      </div>
    );
  }

  return (
    <>
      <InsightsCards insights={data.insights} scenarios={data.scenarios} />
      <div className="mt-6">
        <CompareTable
          scenarios={data.scenarios}
          deltas={data.deltas}
          insights={data.insights}
        />
      </div>
    </>
  );
}

export default function ComparePage() {
  const router = useRouter();
  const t = useTranslations("compare");

  return (
    <div className="mx-auto max-w-5xl px-6 pt-20 pb-12">
      <div className="mb-6 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/simulation/projects")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToScenarios")}
        </Button>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-[2rem] font-bold leading-tight text-[var(--foreground)]">
          {t("title")}
        </h1>
      </div>

      <Suspense
        fallback={
          <div className="h-[400px] animate-pulse rounded-[var(--radius)] bg-[var(--muted)]" />
        }
      >
        <CompareContent />
      </Suspense>
    </div>
  );
}
