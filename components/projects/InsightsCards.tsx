"use client";

import { TrendingUp, Wallet, Landmark } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

import type { CompareScenariosInsight, ScenarioComparisonRow } from "@/types/project";
import Card from "@/components/ui/Card";

interface InsightsCardsProps {
  insights: CompareScenariosInsight;
  scenarios: ScenarioComparisonRow[];
}

export default function InsightsCards({ insights, scenarios }: InsightsCardsProps) {
  const t = useTranslations("projectsComp");
  const locale = useLocale();
  const fmt = (n: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  const findScenario = (id: string) => scenarios.find((s) => s.scenarioId === id);

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Card className="flex-1 p-5">
        <div className="mb-2 flex items-center gap-2">
          <Wallet className="h-4 w-4 text-[var(--accent)]" />
          <span className="text-xs text-[var(--foreground)]/60">{t("insight.bestMonthlyPayment")}</span>
        </div>
        <p className="text-xl font-bold text-[var(--foreground)]">{fmt(insights.bestMonthlyPayment.value)}</p>
        <p className="text-sm text-[var(--foreground)]/60">
          {findScenario(insights.bestMonthlyPayment.scenarioId)?.scenarioName}
        </p>
      </Card>

      <Card className="flex-1 p-5">
        <div className="mb-2 flex items-center gap-2">
          <Landmark className="h-4 w-4 text-[var(--accent)]" />
          <span className="text-xs text-[var(--foreground)]/60">{t("insight.highestBorrowingCapacity")}</span>
        </div>
        <p className="text-xl font-bold text-[var(--foreground)]">{fmt(insights.highestBorrowingCapacity.value)}</p>
        <p className="text-sm text-[var(--foreground)]/60">
          {findScenario(insights.highestBorrowingCapacity.scenarioId)?.scenarioName}
        </p>
      </Card>

      {insights.highestTotalBudget && (
        <Card className="flex-1 p-5">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[var(--accent)]" />
            <span className="text-xs text-[var(--foreground)]/60">{t("insight.totalBudget")}</span>
          </div>
          <p className="text-xl font-bold text-[var(--foreground)]">{fmt(insights.highestTotalBudget.value)}</p>
          <p className="text-sm text-[var(--foreground)]/60">
            {findScenario(insights.highestTotalBudget.scenarioId)?.scenarioName}
          </p>
        </Card>
      )}
    </div>
  );
}
