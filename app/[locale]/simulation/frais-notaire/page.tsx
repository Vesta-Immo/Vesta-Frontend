"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { computeNotaryFees } from "@/lib/simulate";
import { useFormat } from "@/lib/format";
import type { NotaryFeesResult, PropertyType } from "@/types/simulation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function FraisNotairePage() {
  const t = useTranslations("fraisNotaire");
  const { formatEuros, formatPercent } = useFormat();
  const [form, setForm] = useState({
    propertyPrice: "",
    propertyType: "OLD" as PropertyType,
    departmentCode: "",
  });
  const [result, setResult] = useState<NotaryFeesResult | null>(null);
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
      const data = await computeNotaryFees({
        propertyPrice: Number(form.propertyPrice),
        propertyType: form.propertyType,
        ...(form.departmentCode.trim() && {
          departmentCode: form.departmentCode.trim(),
        }),
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  const totalCost = result
    ? Number(form.propertyPrice) + result.notaryFees
    : null;

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
            href="/simulation/budget-cible"
            className="font-semibold text-[var(--accent)] underline underline-offset-4"
          >
            {t("helperLink")}
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label={t("fields.propertyPrice.label")}
          hint={t("fields.propertyPrice.helperText")}
          type="number"
          required
          placeholder="280 000"
          value={form.propertyPrice}
          onChange={field("propertyPrice")}
          unit="€"
          min={0}
          step={1000}
        />

        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">
            {t("fields.propertyType.label")}
          </label>
          <select
            className="w-full rounded-[var(--radius)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--foreground)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            value={form.propertyType}
            onChange={field("propertyType")}
          >
            <option value="OLD">
              {t("fields.propertyType.options.OLD")}
            </option>
            <option value="NEW">
              {t("fields.propertyType.options.NEW")}
            </option>
          </select>
        </div>

        <Input
          label={t("fields.departmentCode.label")}
          hint={t("fields.departmentCode.helperText")}
          placeholder="75"
          value={form.departmentCode}
          onChange={field("departmentCode")}
          maxLength={3}
          pattern="[0-9]{2,3}|2[AB]"
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
                  {t("result.notaryFeesLabel")}
                </div>
                <div className="text-xl font-semibold">
                  {formatEuros(result.notaryFees)}
                </div>
              </div>
            </Card>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Card>
                <div className="p-4">
                  <div className="mb-1 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
                    {t("result.appliedRateLabel")}
                  </div>
                  <div className="text-lg font-semibold text-[var(--foreground)]">
                    {formatPercent(result.appliedRatePercent)}
                  </div>
                </div>
              </Card>
              {totalCost !== null && (
                <Card>
                  <div className="p-4">
                    <div className="mb-1 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
                      {t("result.totalCostLabel")}
                    </div>
                    <div className="text-lg font-semibold text-[var(--foreground)]">
                      {formatEuros(totalCost)}
                    </div>
                  </div>
                </Card>
              )}
            </div>
            <p className="text-xs text-[var(--muted)]">
              {t("result.disclaimer")}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
