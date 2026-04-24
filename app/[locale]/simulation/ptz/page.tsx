"use client";

import { useState, type FormEvent } from "react";
import { Link } from "@/i18n/navigation";
import {
  Loader2,
  Calculator,
  Home,
  Users,
  UserCheck,
  Building2,
  Wallet,
  FileText,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Toggle from "@/components/ui/Toggle";
import ResultBadge from "@/components/ui/ResultBadge";
import { checkPtzEligibility, computePtzAmount } from "@/lib/simulate";
import { useFormat } from "@/lib/format";
import type {
  CheckPtzEligibilityRequest,
  CheckPtzEligibilityResult,
  ComputePtzResult,
  PtzZone,
  PtzPropertyType,
  PtzOperationType,
} from "@/types/simulation";
import { ComplementaryLoanType, PrimoAccedantException } from "@/types/simulation";
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

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="sm:col-span-2 flex items-center gap-3 pt-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
        <Icon className="h-4 w-4" />
      </div>
      <h2 className="text-sm font-semibold text-[var(--foreground)]">{title}</h2>
    </div>
  );
}

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
  const [eligibilityResult, setEligibilityResult] =
    useState<CheckPtzEligibilityResult | null>(null);
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

  const showWorkPercentage = form.operationType === "ANCIEN_AVEC_TRAVAUX";

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
        className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2"
      >
        <SectionHeader icon={Home} title={t("sections.property")} />
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
        <Select
          label={t("fields.propertyZone.label")}
          hint={t("fields.propertyZone.helperText")}
          value={form.propertyZone}
          onChange={field("propertyZone")}
        >
          {ZONE_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {t(`fields.propertyZone.options.${value}`)}
            </option>
          ))}
        </Select>

        <div className="sm:col-span-2">
          <hr className="border-dashed border-[var(--border)]" />
        </div>
        <SectionHeader icon={Users} title={t("sections.household")} />
        <Select
          label={t("fields.householdSize.label")}
          hint={t("fields.householdSize.helperText")}
          value={String(form.householdSize)}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, householdSize: Number(e.target.value) }))
          }
        >
          {HOUSEHOLD_SIZES.map((value) => (
            <option key={value} value={value}>
              {value === 8
                ? t("fields.householdSize.options.8plus")
                : t("fields.householdSize.options.n", { count: value })}
            </option>
          ))}
        </Select>
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
          <hr className="border-dashed border-[var(--border)]" />
        </div>
        <SectionHeader icon={UserCheck} title={t("sections.buyerStatus")} />
        <Toggle
          label={t("fields.isPrimoAccedant.label")}
          hint={t("fields.isPrimoAccedant.helperText")}
          value={form.isPrimoAccedant}
          onChange={(value) => setForm((prev) => ({ ...prev, isPrimoAccedant: value }))}
          trueLabel={t("yes")}
          falseLabel={t("no")}
        />
        {!form.isPrimoAccedant && (
          <Select
            label={t("fields.primoAccedantException.label")}
            hint={t("fields.primoAccedantException.helperText")}
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
          </Select>
        )}

        <div className="sm:col-span-2">
          <hr className="border-dashed border-[var(--border)]" />
        </div>
        <SectionHeader icon={Building2} title={t("sections.project")} />
        <Select
          label={t("fields.propertyType.label")}
          hint={t("fields.propertyType.helperText")}
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
        </Select>
        <Select
          label={t("fields.operationType.label")}
          hint={t("fields.operationType.helperText")}
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
        </Select>
        {showWorkPercentage && (
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
        )}

        <div className="sm:col-span-2">
          <hr className="border-dashed border-[var(--border)]" />
        </div>
        <SectionHeader icon={Wallet} title={t("sections.financing")} />
        <Toggle
          label={t("fields.hasComplementaryLoan.label")}
          hint={t("fields.hasComplementaryLoan.helperText")}
          value={form.hasComplementaryLoan}
          onChange={(value) => setForm((prev) => ({ ...prev, hasComplementaryLoan: value }))}
          trueLabel={t("yes")}
          falseLabel={t("no")}
        />
        {form.hasComplementaryLoan && (
          <Select
            label={t("fields.complementaryLoanType.label")}
            hint={t("fields.complementaryLoanType.helperText")}
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
          </Select>
        )}

        <div className="sm:col-span-2">
          <hr className="border-dashed border-[var(--border)]" />
        </div>
        <SectionHeader icon={FileText} title={t("sections.metadata")} />
        <Toggle
          label={t("fields.hasDependencies.label")}
          hint={t("fields.hasDependencies.helperText")}
          value={form.hasDependencies}
          onChange={(value) => setForm((prev) => ({ ...prev, hasDependencies: value }))}
          trueLabel={t("yes")}
          falseLabel={t("no")}
        />
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
              <span className="inline-flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                {t("button.submit")}
              </span>
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

          {(() => {
            const isEligible =
              computeResult?.isEligible ?? eligibilityResult?.isEligible ?? false;
            const maxPtzAmount =
              computeResult?.maxPtzAmount ?? eligibilityResult?.maxPtzAmount;
            const ptzDuration =
              computeResult?.ptzDuration ?? eligibilityResult?.ptzDuration;
            const loanPercentage = computeResult?.loanPercentage;
            const durationInfo =
              computeResult?.durationInfo ?? eligibilityResult?.durationInfo;
            const reasons = computeResult?.reasons ?? eligibilityResult?.reasons;

            return (
              <div className="mt-4 space-y-4">
                {/* Éligibilité */}
                <div
                  className={`flex items-center gap-3 rounded-[var(--radius)] p-4 ${
                    isEligible
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {isEligible ? (
                    <CheckCircle2 className="h-6 w-6 shrink-0" />
                  ) : (
                    <XCircle className="h-6 w-6 shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.08em] opacity-70">
                      {t("result.eligibleLabel")}
                    </p>
                    <p className="text-lg font-semibold">
                      {isEligible ? t("result.eligibleYes") : t("result.eligibleNo")}
                    </p>
                  </div>
                </div>

                {/* Montant principal */}
                {maxPtzAmount !== undefined && (
                  <div className="rounded-[var(--radius)] border border-[var(--border)] bg-white p-6 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                      {t("result.amountLabel")}
                    </p>
                    <p className="mt-2 text-4xl font-bold text-[var(--accent)]">
                      {formatEuros(maxPtzAmount)}
                    </p>
                  </div>
                )}

                {/* Détails secondaires */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {loanPercentage !== undefined && (
                    <ResultBadge
                      label={t("result.loanPercentageLabel")}
                      value={t("result.loanPercentageValue", {
                        percentage: loanPercentage,
                      })}
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
                        value={t("result.totalDurationValue", {
                          months: durationInfo.totalDurationMonths,
                        })}
                      />
                      <ResultBadge
                        label={t("result.deferredPeriodLabel")}
                        value={t("result.deferredPeriodValue", {
                          months: durationInfo.deferredPeriodMonths,
                        })}
                      />
                      <ResultBadge
                        label={t("result.repaymentPeriodLabel")}
                        value={t("result.repaymentPeriodValue", {
                          months: durationInfo.repaymentPeriodMonths,
                        })}
                      />
                      <ResultBadge
                        label={t("result.rfrPercentageLabel")}
                        value={t("result.rfrPercentageValue", {
                          value: (durationInfo.rfrPercentage / 100).toFixed(2),
                        })}
                      />
                    </>
                  )}
                </div>

                {/* Raisons */}
                {reasons && reasons.length > 0 && (
                  <div className="rounded-[var(--radius)] border border-blue-200 bg-blue-50 px-4 py-3">
                    <ul className="list-disc space-y-1 pl-4 text-sm text-blue-700">
                      {reasons.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })()}
        </Card>
      )}
    </div>
  );
}
