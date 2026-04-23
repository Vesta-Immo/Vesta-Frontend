"use client";

import { useState, useRef, useEffect } from "react";
import { Star, MoreVertical, Pencil, Copy, Trash2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import type { Scenario } from "@/types/project";
import { isStale } from "@/types/project";
import { useDeleteScenario, useCopyScenario, useRecomputeScenario } from "@/lib/projects";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import StalenessBadge from "./StalenessBadge";

interface ScenarioCardProps {
  scenario: Scenario;
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: () => void;
}

function useFormatComputedAt() {
  const t = useTranslations("projectsComp");
  const locale = useLocale();

  return (computedAt: string | null): string => {
    if (!computedAt) return t("notComputed");
    const date = new Date(computedAt);
    const diffMs = Date.now() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return t("computedToday");
    if (diffDays === 1) return t("computedYesterday");
    if (diffDays < 7) return t("computedDaysAgo", { days: diffDays });
    if (diffDays < 30) return t("computedWeeksAgo", { weeks: Math.floor(diffDays / 7) });
    return t("computedOnDate", { date: date.toLocaleDateString(locale) });
  };
}

export default function ScenarioCard({
  scenario,
  isSelected,
  onToggleSelect,
  onEdit,
}: ScenarioCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const deleteMutation = useDeleteScenario();
  const copyMutation = useCopyScenario();
  const recomputeMutation = useRecomputeScenario();
  const t = useTranslations("projectsComp");
  const locale = useLocale();
  const formatComputedAt = useFormatComputedAt();

  const hasResult = Boolean(scenario.outputResult);
  const stale = isStale(scenario.computedAt);

  const fmt = (n: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Card
      className={`transition-colors ${isSelected ? "border-[var(--accent)]" : "border-[var(--border)]"} hover:border-[var(--accent)]/30`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="mt-1 h-4 w-4 shrink-0 rounded border-[var(--border-strong)] accent-[var(--accent)]"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate text-sm font-semibold text-[var(--foreground)]">
                {scenario.name}
              </span>
              {scenario.isBaseline && (
                <Badge variant="accent">
                  <Star className="mr-1 h-3 w-3" />
                  {t("baseline")}
                </Badge>
              )}
              {stale && hasResult && (
                <StalenessBadge
                  onRecalculate={() => recomputeMutation.mutate(scenario.id)}
                  isRecomputing={recomputeMutation.isPending}
                />
              )}
            </div>

            <p className="mt-1 text-sm text-[var(--foreground)]/60">
              {t("scenarioSubtitle", {
                years: scenario.inputParams.durationMonths / 12,
                rate: scenario.inputParams.annualRatePercent,
                downPayment: fmt(scenario.inputParams.downPayment),
              })}
            </p>

            {hasResult && scenario.outputResult && (
              <div className="mt-4 flex flex-wrap gap-6">
                <div>
                  <p className="text-xs text-[var(--foreground)]/50">{t("table.borrowingCapacity")}</p>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {fmt(scenario.outputResult.borrowingCapacity)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--foreground)]/50">{t("table.monthlyPayment")}</p>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {fmt(scenario.outputResult.monthlyCreditPayment)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--foreground)]/50">{t("table.totalBudget")}</p>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {fmt(scenario.outputResult.totalBudget)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--foreground)]/50">{t("computed")}</p>
                  <p className="text-sm text-[var(--foreground)]/60">
                    {formatComputedAt(scenario.computedAt)}
                  </p>
                </div>
              </div>
            )}

            {!hasResult && (
              <p className="mt-2 text-sm text-[var(--foreground)]/60">{t("notComputed")}</p>
            )}
          </div>

          <div className="relative shrink-0" ref={menuRef}>
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius)] text-[var(--foreground)]/60 transition-colors hover:bg-[var(--foreground)]/5 hover:text-[var(--foreground)]"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-[var(--radius)] border border-[var(--border)] bg-white py-1">
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--background)]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onEdit();
                  }}
                >
                  <Pencil className="h-4 w-4 text-[var(--foreground)]/60" />
                  {t("action.edit")}
                </button>
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--background)]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    copyMutation.mutate(scenario.id);
                  }}
                >
                  <Copy className="h-4 w-4 text-[var(--foreground)]/60" />
                  {t("action.duplicate")}
                </button>
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    if (confirm(t("confirmDelete", { name: scenario.name }))) {
                      deleteMutation.mutate(scenario.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  {t("action.delete")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
