"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import AppNav from "@/components/AppNav";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
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
  });
  const [result, setResult] = useState<BorrowingCapacityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  const handleSimulate = async () => {
    setError(null);
    setResult(null);

    const annualHouseholdIncome = Number(form.annualHouseholdIncome);
    const monthlyDebtPayments = Number(form.monthlyDebtPayments);
    const annualRatePercent = Number(form.annualRatePercent);
    const durationMonths = Number(form.durationMonths);

    if (annualHouseholdIncome <= 0) {
      setError(t("errors.generic"));
      return;
    }

    setLoading(true);

    try {
      const simulation = await computeBorrowingCapacity({
        annualHouseholdIncome,
        monthlyDebtPayments,
        durationMonths,
        annualRatePercent,
        maxDebtRatioPercent: 35,
      });

      setResult(simulation);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("errors.generic")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <AppNav />

      <div className="mx-auto max-w-5xl flex-1 px-4 py-8 md:py-12">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-[var(--muted-foreground)]">
              {t("description")}
            </p>
          </div>

          <Card className="p-6 md:p-10">
            <div className="flex flex-col gap-6">
              {error && (
                <div className="rounded-[var(--radius)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4 sm:flex-row">
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
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="grid gap-1.5 flex-1">
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
              </div>

              <Button
                size="lg"
                onClick={handleSimulate}
                disabled={loading}
                className="self-start"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("button.loading")}
                  </span>
                ) : (
                  t("button.submit")
                )}
              </Button>

              {result && (
                <div className="mt-3 rounded-[var(--radius)] border-2 border-[#1a3d2f] bg-[var(--accent)] p-6 text-white">
                  <h3 className="mb-4 text-lg font-bold">
                    {t("result.title")}
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white/90">
                        {t("result.monthlyPaymentLabel")}
                      </span>
                      <span className="text-xl font-bold">
                        {t("result.monthlyPaymentValue", {
                          value: formatEuros(result.monthlyPaymentCapacity),
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white/90">
                        {t("result.borrowingCapacityLabel")}
                      </span>
                      <span className="text-xl font-bold">
                        {formatEuros(result.borrowingCapacity)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
