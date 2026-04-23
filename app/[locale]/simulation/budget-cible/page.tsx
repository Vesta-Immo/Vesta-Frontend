"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { computeTargetBudget } from "@/lib/simulate";
import { useFormat } from "@/lib/format";
import type { TargetBudgetResult } from "@/types/simulation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function BudgetCiblePage() {
  const t = useTranslations("budgetCible");
  const { formatEuros } = useFormat();
  const [form, setForm] = useState({
    borrowingCapacity: "",
    downPayment: "",
    estimatedRenovationCosts: "",
  });
  const [result, setResult] = useState<TargetBudgetResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function field(key: keyof typeof form) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value as typeof prev[typeof key],
      }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await computeTargetBudget({
        borrowingCapacity: Number(form.borrowingCapacity),
        downPayment: Number(form.downPayment),
        estimatedRenovationCosts: Number(form.estimatedRenovationCosts),
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
          {t("overline")}
        </span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-[var(--muted)]">{t("description")}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {t("helperText")}{" "}
          <Link
            href="/simulation/capacite-emprunt"
            className="font-semibold text-[var(--accent)] underline underline-offset-4"
          >
            {t("helperLink")}
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label={t("fields.borrowingCapacity.label")}
          hint={t("fields.borrowingCapacity.helperText")}
          type="number"
          required
          placeholder="250 000"
          value={form.borrowingCapacity}
          onChange={field("borrowingCapacity")}
          unit="€"
          min={0}
          step={1000}
        />

        <Input
          label={t("fields.downPayment.label")}
          hint={t("fields.downPayment.helperText")}
          type="number"
          required
          placeholder="30 000"
          value={form.downPayment}
          onChange={field("downPayment")}
          unit="€"
          min={0}
          step={1000}
        />

        <Input
          label={t("fields.estimatedRenovationCosts.label")}
          hint={t("fields.estimatedRenovationCosts.helperText")}
          type="number"
          required
          placeholder="0"
          value={form.estimatedRenovationCosts}
          onChange={field("estimatedRenovationCosts")}
          unit="€"
          min={0}
          step={1000}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          className="mt-1"
        >
          {loading && (
            <svg
              className="mr-2 h-4 w-4 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {loading ? t("button.loading") : t("button.submit")}
        </Button>
      </form>

      {error && (
        <div className="mt-6 rounded-[var(--radius)] border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {result && (
        <section aria-live="polite" className="mt-8">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
            {t("result.title")}
          </span>
          <div className="mt-3 flex flex-col gap-3">
            <Card className="bg-[var(--accent)] text-white">
              <div className="p-4">
                <div className="mb-1 text-xs font-bold uppercase tracking-widest text-white/70">
                  {t("result.targetBudgetLabel")}
                </div>
                <div className="text-xl font-semibold">
                  {formatEuros(result.targetBudget)}
                </div>
              </div>
            </Card>
            <p className="text-xs text-[var(--muted)]">
              {t("result.disclaimer")}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
