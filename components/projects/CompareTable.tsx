"use client";

import { ArrowUp, ArrowDown } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

import type {
  ScenarioComparisonRow,
  ScenarioDelta,
  CompareScenariosInsight,
} from "@/types/project";
import Badge from "@/components/ui/Badge";

interface CompareTableProps {
  scenarios: ScenarioComparisonRow[];
  deltas: Record<string, ScenarioDelta>;
  insights: CompareScenariosInsight;
}

function DeltaBadge({ value, locale }: { value: number; locale: string }) {
  if (value === 0) return null;
  const isPositive = value > 0;
  const fmt = (n: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  return (
    <Badge variant={isPositive ? "accent" : "outline"} className="ml-1 text-[0.65rem]">
      {isPositive ? <ArrowUp className="mr-0.5 h-3 w-3" /> : <ArrowDown className="mr-0.5 h-3 w-3" />}
      {fmt(Math.abs(value))}
    </Badge>
  );
}

export default function CompareTable({
  scenarios,
  deltas,
  insights,
}: CompareTableProps) {
  const t = useTranslations("projectsComp");
  const locale = useLocale();
  const fmt = (n: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  const fmtYears = (months: number) => t("years", { years: months / 12 });

  return (
    <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--background)]">
            <th className="px-4 py-3 text-left font-semibold text-[var(--foreground)]">{t("table.parameter")}</th>
            {scenarios.map((s) => (
              <th key={s.scenarioId} className="px-4 py-3 text-center font-semibold text-[var(--foreground)]">
                {s.scenarioName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          <tr className="bg-[var(--foreground)]/[0.03]">
            <td colSpan={scenarios.length + 1} className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--foreground)]/70">
              {t("table.inputsHeader")}
            </td>
          </tr>
          <tr className="even:bg-[var(--background)]">
            <td className="px-4 py-2.5 font-medium text-[var(--foreground)]">{t("table.annualIncome")}</td>
            {scenarios.map((s) => (
              <td key={s.scenarioId} className="px-4 py-2.5 text-center text-[var(--foreground)]/80">
                {fmt(s.annualHouseholdIncome)}
              </td>
            ))}
          </tr>
          <tr className="even:bg-[var(--background)]">
            <td className="px-4 py-2.5 font-medium text-[var(--foreground)]">{t("table.duration")}</td>
            {scenarios.map((s) => (
              <td key={s.scenarioId} className="px-4 py-2.5 text-center text-[var(--foreground)]/80">
                {fmtYears(s.durationMonths)}
              </td>
            ))}
          </tr>
          <tr className="even:bg-[var(--background)]">
            <td className="px-4 py-2.5 font-medium text-[var(--foreground)]">{t("table.annualRate")}</td>
            {scenarios.map((s) => (
              <td key={s.scenarioId} className="px-4 py-2.5 text-center text-[var(--foreground)]/80">
                {s.annualRatePercent.toFixed(2)}%
              </td>
            ))}
          </tr>
          <tr className="even:bg-[var(--background)]">
            <td className="px-4 py-2.5 font-medium text-[var(--foreground)]">{t("table.downPayment")}</td>
            {scenarios.map((s) => (
              <td key={s.scenarioId} className="px-4 py-2.5 text-center text-[var(--foreground)]/80">
                {fmt(s.downPayment)}
              </td>
            ))}
          </tr>

          <tr className="bg-[var(--foreground)]/[0.03]">
            <td colSpan={scenarios.length + 1} className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--foreground)]/70">
              {t("table.outputsHeader")}
            </td>
          </tr>
          <tr className="even:bg-[var(--background)]">
            <td className="px-4 py-2.5 font-medium text-[var(--foreground)]">{t("table.borrowingCapacity")}</td>
            {scenarios.map((s) => {
              const isBest = s.scenarioId === insights.highestBorrowingCapacity.scenarioId;
              const delta = deltas[s.scenarioId];
              return (
                <td key={s.scenarioId} className="px-4 py-2.5 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className={`text-[var(--foreground)] ${isBest ? "font-bold" : ""}`}>
                      {fmt(s.borrowingCapacity)}
                    </span>
                    {delta && !s.isBaseline && <DeltaBadge value={delta.borrowingCapacityDelta} locale={locale} />}
                  </div>
                </td>
              );
            })}
          </tr>
          <tr className="even:bg-[var(--background)]">
            <td className="px-4 py-2.5 font-medium text-[var(--foreground)]">{t("table.monthlyPayment")}</td>
            {scenarios.map((s) => {
              const isBest = s.scenarioId === insights.bestMonthlyPayment.scenarioId;
              const delta = deltas[s.scenarioId];
              return (
                <td key={s.scenarioId} className="px-4 py-2.5 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className={`text-[var(--foreground)] ${isBest ? "font-bold" : ""}`}>
                      {fmt(s.monthlyCreditPayment)}
                    </span>
                    {delta && !s.isBaseline && <DeltaBadge value={delta.monthlyPaymentDelta} locale={locale} />}
                  </div>
                </td>
              );
            })}
          </tr>
          <tr className="even:bg-[var(--background)]">
            <td className="px-4 py-2.5 font-medium text-[var(--foreground)]">{t("table.totalBudget")}</td>
            {scenarios.map((s) => {
              const isBest = s.scenarioId === insights.highestTotalBudget.scenarioId;
              const delta = deltas[s.scenarioId];
              return (
                <td key={s.scenarioId} className="px-4 py-2.5 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className={`text-[var(--foreground)] ${isBest ? "font-bold" : ""}`}>
                      {fmt(s.totalBudget)}
                    </span>
                    {delta && !s.isBaseline && <DeltaBadge value={delta.totalBudgetDelta} locale={locale} />}
                  </div>
                </td>
              );
            })}
          </tr>
          <tr className="even:bg-[var(--background)]">
            <td className="px-4 py-2.5 font-medium text-[var(--foreground)]">{t("table.notaryFees")}</td>
            {scenarios.map((s) => (
              <td key={s.scenarioId} className="px-4 py-2.5 text-center text-[var(--foreground)]/80">
                {fmt(s.notaryFees)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
