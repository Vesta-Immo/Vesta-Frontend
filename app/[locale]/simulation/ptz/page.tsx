"use client";

import { useState, type FormEvent } from "react";
import { Link } from "@/i18n/navigation";
import { Loader2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ResultBadge from "@/components/ui/ResultBadge";
import {
  checkPtzEligibility,
  computePtzAmount,
} from "@/lib/simulate";
import { useFormat } from "@/lib/format";
import type {
  CheckPtzEligibilityRequest,
  CheckPtzEligibilityResult,
  ComputePtzResult,
  PtzZone,
  PtzPropertyType,
  PtzOperationType,
} from "@/types/simulation";
import {
  ComplementaryLoanType,
  PrimoAccedantException,
} from "@/types/simulation";
import { useTranslations } from "next-intl";

const ZONE_OPTIONS: PtzZone[] = ["A_BIS", "A", "B1", "B2", "C"];
const HOUSEHOLD_SIZES = [1, 2, 3, 4, 5, 6, 7, 8];
const COMPLEMENTARY_LOAN_OPTIONS: ComplementaryLoanType[] = [
  ComplementaryLoanType.PAS,
  ComplementaryLoanType.CONVENTIONNE,
  ComplementaryLoanType.CLASSIQUE,
  ComplementaryLoanType.PEL,
  ComplementaryLoanType.COMPLEMENTAIRE,
];
const PRIMO_EXCEPTION_OPTIONS: PrimoAccedantException[] = [
  PrimoAccedantException.DIVORCE_SEPARATION,
  PrimoAccedantException.CATASTROPHE_NATURELLE,
  PrimoAccedantException.CARTE_INVALIDITE,
];
const PROPERTY_TYPE_OPTIONS: PtzPropertyType[] = ["COLLECTIF", "MAISON_INDIVIDUELLE"];
const OPERATION_TYPE_OPTIONS: PtzOperationType[] = ["NEUF", "ANCIEN_AVEC_TRAVAUX"];

export default function PtzSimulateurPage() {
  const t = useTranslations("ptz");
  const { formatEuros } = useFormat();
  const [form, setForm] = useState<CheckPtzEligibilityRequest>({
    propertyPrice: 0,
    propertyZone: "B1",
    householdSize: 2,
    isPrimoAccedant: true,
    annualIncome: 0,
    workPercentage: undefined,
    hasComplementaryLoan: false,
    hasDependencies: false,
    isOldProperty: false,
    propertyType: "COLLECTIF",
    operationType: "NEUF",
  });
  const [eligibilityResult, setEligibilityResult] = useState<CheckPtzEligibilityResult | null>(null);
  const [computeResult, setComputeResult] = useState<ComputePtzResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
    };
  }

  async function handleCalculate(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setEligibilityResult(null);
    setComputeResult(null);
    try {
      const eligibilityResult = await checkPtzEligibility({
        propertyPrice: form.propertyPrice * 100,
        propertyZone: form.propertyZone,
        householdSize: form.householdSize,
        isPrimoAccedant: form.isPrimoAccedant,
        annualIncome: form.annualIncome * 100,
        workPercentage: form.workPercentage,
        hasComplementaryLoan: form.hasComplementaryLoan,
        complementaryLoanType: form.complementaryLoanType,
        hasDependencies: form.hasDependencies,
        operationId: form.operationId,
        primoAccedantException: form.primoAccedantException,
        isOldProperty: form.isOldProperty,
        propertyType: form.propertyType,
        operationType: form.operationType,
      });
      setEligibilityResult(eligibilityResult);

      if (eligibilityResult.isEligible) {
        const ptzResult = await computePtzAmount({
          propertyPrice: form.propertyPrice * 100,
          propertyZone: form.propertyZone,
          householdSize: form.householdSize,
          isPrimoAccedant: form.isPrimoAccedant,
          annualIncome: form.annualIncome * 100,
          workPercentage: form.workPercentage,
          hasComplementaryLoan: form.hasComplementaryLoan,
          complementaryLoanType: form.complementaryLoanType,
          hasDependencies: form.hasDependencies,
          operationId: form.operationId,
          primoAccedantException: form.primoAccedantException,
          isOldProperty: form.isOldProperty,
          propertyType: form.propertyType,
          operationType: form.operationType,
        });
        setComputeResult(ptzResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
          {t("overline")}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-base text-[var(--muted-foreground)]">
          {t("description")}
        </p>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          {t("helperText")}{" "}
          <Link
            href="/simulation/ptz/conditions"
            className="font-semibold text-[var(--accent)] underline underline-offset-2"
          >
            {t("helperLink")}
          </Link>
        </p>
      </div>

      <form
        onSubmit={handleCalculate}
        className="grid w-full max-w-[800px] grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
            {t("sections.property")}
          </p>
        </div>
        <Input
          label={t("fields.propertyPrice.label")}
          hint={t("fields.propertyPrice.helperText")}
          type="number"
          required
          placeholder="250 000"
          value={form.propertyPrice || ""}
          onChange={field("propertyPrice")}
          unit="€"
          min={0}
          step={1000}
        />
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">
            {t("fields.propertyZone.label")}
          </label>
          <span className="text-xs text-[var(--muted)]">
            {t("fields.propertyZone.helperText")}
          </span>
          <select
            className="w-full rounded-[var(--radius)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--foreground)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            value={form.propertyZone}
            onChange={field("propertyZone")}
          >
            {ZONE_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {t(`fields.propertyZone.options.${value}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
            {t("sections.household")}
          </p>
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">
            {t("fields.householdSize.label")}
          </label>
          <span className="text-xs text-[var(--muted)]">
            {t("fields.householdSize.helperText")}
          </span>
          <select
            className="w-full rounded-[var(--radius)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--foreground)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            value={form.householdSize}
            onChange={field("householdSize")}
          >
            {HOUSEHOLD_SIZES.map((value) => (
              <option key={value} value={value}>
                {value === 8
                  ? t("fields.householdSize.options.8plus")
                  : t("fields.householdSize.options.n", { count: value })}
              </option>
            ))}
          </select>
        </div>
        <Input
          label={t("fields.annualIncome.label")}
          hint={t("fields.annualIncome.helperText")}
          type="number"
          required
          placeholder="45 000"
          value={form.annualIncome || ""}
          onChange={field("annualIncome")}
          unit="€ / an"
          min={0}
          step={1000}
        />

        <div className="sm:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
            {t("sections.buyerStatus")}
          </p>
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">
            {t("fields.isPrimoAccedant.label")}
          </label>
          <span className="text-xs text-[var(--muted)]">
            {t("fields.isPrimoAccedant.helperText")}
          </span>
          <select
            className="w-full rounded-[var(--radius)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--foreground)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            value={form.isPrimoAccedant ? "yes" : "no"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                isPrimoAccedant: e.target.value === "yes",
              }))
            }
          >
            <option value="yes">{t("yes")}</option>
            <option value="no">{t("no")}</option>
          </select>
        </div>
        {!form.isPrimoAccedant && (
          <div className="grid gap-1.5">
            <label className="text-sm font-medium text-[var(--foreground)]">
              {t("fields.primoAccedantException.label")}
            </label>
            <span className="text-xs text-[var(--muted)]">
              {t("fields.primoAccedantException.helperText")}
            </span>
            <select
              className="w-full rounded-[var(--radius)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--foreground)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
              value={form.primoAccedantException || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  primoAccedantException: e.target.value as PrimoAccedantException,
                }))
              }
            >
              {PRIMO_EXCEPTION_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {t(`fields.primoAccedantException.options.${value}`)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="sm:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
            {t("sections.project")}
          </p>
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">
            {t("fields.propertyType.label")}
          </label>
          <span className="text-xs text-[var(--muted)]">
            {t("fields.propertyType.helperText")}
          </span>
          <select
            className="w-full rounded-[var(--radius)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--foreground)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            value={form.propertyType || "COLLECTIF"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                propertyType: e.target.value as PtzPropertyType,
              }))
            }
          >
            {PROPERTY_TYPE_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {t(`fields.propertyType.options.${value}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">
            {t("fields.operationType.label")}
          </label>
          <span className="text-xs text-[var(--muted)]">
            {t("fields.operationType.helperText")}
          </span>
          <select
            className="w-full rounded-[var(--radius)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--foreground)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            value={form.operationType || "NEUF"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                operationType: e.target.value as PtzOperationType,
                isOldProperty: e.target.value === "ANCIEN_AVEC_TRAVAUX",
              }))
            }
          >
            {OPERATION_TYPE_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {t(`fields.operationType.options.${value}`)}
              </option>
            ))}
          </select>
        </div>
        <Input
          label={t("fields.workPercentage.label")}
          hint={t("fields.workPercentage.helperText")}
          type="number"
          placeholder="25"
          value={form.workPercentage || ""}
          onChange={field("workPercentage")}
          unit="%"
          min={0}
          max={100}
          step={1}
        />

        <div className="sm:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
            {t("sections.financing")}
          </p>
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">
            {t("fields.hasComplementaryLoan.label")}
          </label>
          <span className="text-xs text-[var(--muted)]">
            {t("fields.hasComplementaryLoan.helperText")}
          </span>
          <select
            className="w-full rounded-[var(--radius)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--foreground)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            value={form.hasComplementaryLoan ? "yes" : "no"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                hasComplementaryLoan: e.target.value === "yes",
              }))
            }
          >
            <option value="yes">{t("yes")}</option>
            <option value="no">{t("no")}</option>
          </select>
        </div>
        {form.hasComplementaryLoan && (
          <div className="grid gap-1.5">
            <label className="text-sm font-medium text-[var(--foreground)]">
              {t("fields.complementaryLoanType.label")}
            </label>
            <span className="text-xs text-[var(--muted)]">
              {t("fields.complementaryLoanType.helperText")}
            </span>
            <select
              className="w-full rounded-[var(--radius)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--foreground)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
              value={form.complementaryLoanType || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  complementaryLoanType: e.target.value as ComplementaryLoanType,
                }))
              }
            >
              {COMPLEMENTARY_LOAN_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {t(`fields.complementaryLoanType.options.${value}`)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="sm:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
            {t("sections.metadata")}
          </p>
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">
            {t("fields.hasDependencies.label")}
          </label>
          <span className="text-xs text-[var(--muted)]">
            {t("fields.hasDependencies.helperText")}
          </span>
          <select
            className="w-full rounded-[var(--radius)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--foreground)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            value={form.hasDependencies ? "yes" : "no"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                hasDependencies: e.target.value === "yes",
              }))
            }
          >
            <option value="yes">{t("yes")}</option>
            <option value="no">{t("no")}</option>
          </select>
        </div>
        <Input
          label={t("fields.operationId.label")}
          hint={t("fields.operationId.helperText")}
          type="text"
          placeholder="OP-2024-001"
          value={form.operationId || ""}
          onChange={field("operationId")}
        />

        <div className="sm:col-span-2 mt-1">
          <Button type="submit" size="lg" disabled={loading} className="w-full">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("button.loading")}
              </span>
            ) : (
              t("button.submit")
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div className="mt-8 rounded-[var(--radius)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {(eligibilityResult || computeResult) && (
        <Card className="mt-10 p-6" aria-live="polite">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
            {t("result.title")}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(() => {
              const isEligible = computeResult?.isEligible ?? eligibilityResult?.isEligible ?? false;
              const maxPtzAmount = computeResult?.maxPtzAmount ?? eligibilityResult?.maxPtzAmount;
              const ptzDuration = computeResult?.ptzDuration ?? eligibilityResult?.ptzDuration;
              const loanPercentage = computeResult?.loanPercentage;
              const durationInfo = computeResult?.durationInfo ?? eligibilityResult?.durationInfo;
              const reasons = computeResult?.reasons ?? eligibilityResult?.reasons;

              return (
                <>
                  <ResultBadge
                    label={t("result.eligibleLabel")}
                    value={isEligible ? t("result.eligibleYes") : t("result.eligibleNo")}
                    prominent
                  />
                  {maxPtzAmount !== undefined && (
                    <ResultBadge
                      label={t("result.amountLabel")}
                      value={formatEuros(maxPtzAmount)}
                    />
                  )}
                  {loanPercentage !== undefined && (
                    <ResultBadge
                      label={t("result.loanPercentageLabel")}
                      value={t("result.loanPercentageValue", { percentage: loanPercentage })}
                    />
                  )}
                  {ptzDuration && (
                    <ResultBadge
                      label={t("result.durationLabel")}
                      value={t("result.durationValue", { months: ptzDuration })}
                    />
                  )}
                  {durationInfo && (
                    <>
                      <ResultBadge
                        label={t("result.totalDurationLabel")}
                        value={t("result.totalDurationValue", { months: durationInfo.totalDurationMonths })}
                      />
                      <ResultBadge
                        label={t("result.deferredPeriodLabel")}
                        value={t("result.deferredPeriodValue", { months: durationInfo.deferredPeriodMonths })}
                      />
                      <ResultBadge
                        label={t("result.repaymentPeriodLabel")}
                        value={t("result.repaymentPeriodValue", { months: durationInfo.repaymentPeriodMonths })}
                      />
                      <ResultBadge
                        label={t("result.rfrPercentageLabel")}
                        value={t("result.rfrPercentageValue", { value: (durationInfo.rfrPercentage / 100).toFixed(2) })}
                      />
                    </>
                  )}
                  {reasons && reasons.length > 0 && (
                    <div className="sm:col-span-2 rounded-[var(--radius)] border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                      {reasons.join(" • ")}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </Card>
      )}
    </div>
  );
}
