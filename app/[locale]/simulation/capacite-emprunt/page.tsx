"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { computeBorrowingCapacity } from "@/lib/simulate";
import { useFormat } from "@/lib/format";
import type { BorrowingCapacityResult } from "@/types/simulation";
import { useTranslations } from "next-intl";

const DURATION_VALUES = ["84", "120", "180", "240", "300", "360"];

export default function CapaciteEmpruntPage() {
  const t = useTranslations("capaciteEmprunt");
  const { formatEuros } = useFormat();
  const [form, setForm] = useState({
    annualHouseholdIncome: "",
    monthlyDebtPayments: "",
    annualRatePercent: "3.6",
    durationMonths: "240",
    maxDebtRatioPercent: "35",
  });
  const [result, setResult] = useState<BorrowingCapacityResult | null>(null);
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await computeBorrowingCapacity({
        annualHouseholdIncome: Number(form.annualHouseholdIncome),
        monthlyDebtPayments: Number(form.monthlyDebtPayments),
        annualRatePercent: Number(form.annualRatePercent),
        durationMonths: Number(form.durationMonths),
        maxDebtRatioPercent: Number(form.maxDebtRatioPercent),
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
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label={t("fields.annualHouseholdIncome.label")}
          hint={t("fields.annualHouseholdIncome.helperText")}
          type="number"
          required
          placeholder="60 000"
          value={form.annualHouseholdIncome}
          onChange={field("annualHouseholdIncome")}
          unit="€ / an"
          min={0}
          step={1000}
        />

        <Input
          label={t("fields.monthlyDebtPayments.label")}
          hint={t("fields.monthlyDebtPayments.helperText")}
          type="number"
          required
          placeholder="0"
          value={form.monthlyDebtPayments}
          onChange={field("monthlyDebtPayments")}
          unit="€ / mois"
          min={0}
          step={50}
        />

        <Input
          label={t("fields.annualRatePercent.label")}
          hint={t("fields.annualRatePercent.helperText")}
          type="number"
          required
          placeholder="3.6"
          value={form.annualRatePercent}
          onChange={field("annualRatePercent")}
          unit="%"
          min={0}
          max={20}
          step={0.01}
        />

        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">
            {t("fields.durationMonths.label")}
          </label>
          <select
            className="w-full rounded-[var(--radius)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--foreground)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            value={form.durationMonths}
            onChange={field("durationMonths")}
          >
            {DURATION_VALUES.map((value) => (
              <option key={value} value={value}>
                {t(`fields.durationMonths.options.${value}`)}
              </option>
            ))}
          </select>
        </div>

        <Input
          label={t("fields.maxDebtRatioPercent.label")}
          hint={t("fields.maxDebtRatioPercent.helperText")}
          type="number"
          required
          placeholder="35"
          value={form.maxDebtRatioPercent}
          onChange={field("maxDebtRatioPercent")}
          unit="%"
          min={1}
          max={50}
          step={0.5}
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
                  {t("result.borrowingCapacityLabel")}
                </div>
                <div className="text-xl font-semibold">
                  {formatEuros(result.borrowingCapacity)}
                </div>
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <div className="mb-1 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
                  {t("result.monthlyPaymentLabel")}
                </div>
                <div className="text-lg font-semibold text-[var(--foreground)]">
                  {t("result.monthlyPaymentValue", {
                    value: formatEuros(result.monthlyPaymentCapacity),
                  })}
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}
