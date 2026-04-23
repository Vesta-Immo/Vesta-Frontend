"use client";

import { useTranslations, useLocale } from "next-intl";
import type { ScenarioInput } from "@/types/project";

const PARIS_DEPARTMENTS = [
  { code: "75", name: "Paris" },
  { code: "92", name: "Hauts-de-Seine" },
  { code: "93", name: "Seine-Saint-Denis" },
  { code: "94", name: "Val-de-Marne" },
];

interface ScenarioFormFieldsProps {
  values: Partial<ScenarioInput>;
  onChange: (field: keyof ScenarioInput, value: string | number) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
}

export default function ScenarioFormFields({
  values,
  onChange,
  errors = {},
  disabled = false,
}: ScenarioFormFieldsProps) {
  const t = useTranslations("projectsComp");
  const locale = useLocale();
  const fmt = (n: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  const debtRatioOptions = [
    { value: 30, label: t("debtRatio.30") },
    { value: 33, label: t("debtRatio.33") },
    { value: 35, label: t("debtRatio.35") },
    { value: 40, label: t("debtRatio.40") },
  ];

  const durationMonthsOptions = [
    { value: 120, label: t("duration.120") },
    { value: 180, label: t("duration.180") },
    { value: 240, label: t("duration.240") },
    { value: 300, label: t("duration.300") },
    { value: 360, label: t("duration.360") },
  ];

  const propertyTypeOptions = [
    { value: "OLD", label: t("propertyType.old") },
    { value: "NEW", label: t("propertyType.new") },
  ];

  const inputClass = `w-full rounded-[var(--radius)] border bg-white px-3 py-2 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-50`;
  const labelClass = "mb-1 block text-sm font-medium text-[var(--foreground)]";
  const errorClass = "mt-1 text-xs text-red-600";
  const hintClass = "mt-1 text-xs text-[var(--foreground)]/50";

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--foreground)]/60">
          {t("section.financialSituation")}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>{t("field.annualIncome")}</label>
            <input
              type="number"
              min={0}
              step={1000}
              value={values.annualHouseholdIncome ?? ""}
              onChange={(e) => onChange("annualHouseholdIncome", Number(e.target.value))}
              disabled={disabled}
              className={`${inputClass} ${errors.annualHouseholdIncome ? "border-red-300" : "border-[var(--border-strong)]"}`}
            />
            {errors.annualHouseholdIncome ? (
              <p className={errorClass}>{errors.annualHouseholdIncome}</p>
            ) : (
              <p className={hintClass}>{t("field.annualIncomeHint")}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>{t("field.monthlyDebt")}</label>
            <input
              type="number"
              min={0}
              step={50}
              value={values.monthlyCurrentDebtPayments ?? ""}
              onChange={(e) => onChange("monthlyCurrentDebtPayments", Number(e.target.value))}
              disabled={disabled}
              className={`${inputClass} ${errors.monthlyCurrentDebtPayments ? "border-red-300" : "border-[var(--border-strong)]"}`}
            />
            {errors.monthlyCurrentDebtPayments ? (
              <p className={errorClass}>{errors.monthlyCurrentDebtPayments}</p>
            ) : (
              <p className={hintClass}>{t("field.monthlyDebtHint")}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--foreground)]/60">
          {t("section.credit")}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>{t("field.annualRate")}</label>
            <input
              type="number"
              min={0.1}
              max={20}
              step={0.1}
              value={values.annualRatePercent ?? ""}
              onChange={(e) => onChange("annualRatePercent", Number(e.target.value))}
              disabled={disabled}
              className={`${inputClass} ${errors.annualRatePercent ? "border-red-300" : "border-[var(--border-strong)]"}`}
            />
            {errors.annualRatePercent ? (
              <p className={errorClass}>{errors.annualRatePercent}</p>
            ) : (
              <p className={hintClass}>{t("field.annualRateHint")}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>{t("field.loanDuration")}</label>
            <select
              value={values.durationMonths ?? 240}
              onChange={(e) => onChange("durationMonths", Number(e.target.value))}
              disabled={disabled}
              className={`${inputClass} ${errors.durationMonths ? "border-red-300" : "border-[var(--border-strong)]"}`}
            >
              {durationMonthsOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.durationMonths && <p className={errorClass}>{errors.durationMonths}</p>}
          </div>
          <div>
            <label className={labelClass}>{t("field.maxDebtRatio")}</label>
            <select
              value={values.maxDebtRatioPercent ?? 35}
              onChange={(e) => onChange("maxDebtRatioPercent", Number(e.target.value))}
              disabled={disabled}
              className={`${inputClass} ${errors.maxDebtRatioPercent ? "border-red-300" : "border-[var(--border-strong)]"}`}
            >
              {debtRatioOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.maxDebtRatioPercent && <p className={errorClass}>{errors.maxDebtRatioPercent}</p>}
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--foreground)]/60">
          {t("section.downPayment")}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>{t("field.downPayment")}</label>
            <input
              type="number"
              min={0}
              step={1000}
              value={values.downPayment ?? ""}
              onChange={(e) => onChange("downPayment", Number(e.target.value))}
              disabled={disabled}
              className={`${inputClass} ${errors.downPayment ? "border-red-300" : "border-[var(--border-strong)]"}`}
            />
            {errors.downPayment ? (
              <p className={errorClass}>{errors.downPayment}</p>
            ) : (
              <p className={hintClass}>{t("field.downPaymentHint")}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--foreground)]/60">
          {t("section.notaryFees")}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>{t("field.propertyType")}</label>
            <select
              value={values.propertyType ?? "OLD"}
              onChange={(e) => onChange("propertyType", e.target.value as "NEW" | "OLD")}
              disabled={disabled}
              className={`${inputClass} ${errors.propertyType ? "border-red-300" : "border-[var(--border-strong)]"}`}
            >
              {propertyTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>{t("field.department")}</label>
            <select
              value={values.departmentCode ?? ""}
              onChange={(e) => onChange("departmentCode", e.target.value)}
              disabled={disabled}
              className={`${inputClass} ${errors.departmentCode ? "border-red-300" : "border-[var(--border-strong)]"}`}
            >
              <option value="">{t("field.departmentNone")}</option>
              {PARIS_DEPARTMENTS.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.code} — {d.name}
                </option>
              ))}
            </select>
            <p className={hintClass}>
              {values.departmentCode && PARIS_DEPARTMENTS.some((d) => d.code === values.departmentCode)
                ? t("field.departmentParisHint")
                : errors.departmentCode ?? t("field.departmentHint")}
            </p>
          </div>
        </div>
      </div>

      {errors._form && (
        <div className="rounded-[var(--radius)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errors._form}
        </div>
      )}
    </div>
  );
}
