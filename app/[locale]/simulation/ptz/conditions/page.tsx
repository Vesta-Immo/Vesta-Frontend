"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Loader2 } from "lucide-react";
import Card from "@/components/ui/Card";
import { getPtzConditions } from "@/lib/simulate";
import { useFormat } from "@/lib/format";
import type { GetPtzConditionsResult, PtzZone } from "@/types/simulation";
import { useTranslations } from "next-intl";

const ZONES: PtzZone[] = ["A", "B1", "B2", "C"];

export default function PtzConditionsPage() {
  const t = useTranslations("ptzConditions");
  const { formatEuros } = useFormat();
  const [conditions, setConditions] = useState<GetPtzConditionsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConditions() {
      try {
        const data = await getPtzConditions();
        setConditions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("errors.generic"));
      } finally {
        setLoading(false);
      }
    }
    fetchConditions();
  }, [t]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="rounded-[var(--radius)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!conditions) {
    return null;
  }

  const exceptionItems = ["divorce", "catastrophe", "invalidite"] as const;
  const durationItems = ["rfr75", "rfr75to100", "rfr100plus"] as const;
  const loanItems = ["pas", "conventionne", "classique", "pel"] as const;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
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
            href="/simulation/ptz"
            className="font-semibold text-[var(--accent)] underline underline-offset-2"
          >
            {t("helperLink")}
          </Link>
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-[var(--accent)]">
            {t("characteristics.title")}
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between py-2">
              <span className="text-[var(--muted-foreground)]">
                {t("characteristics.interestRate")}
              </span>
              <span className="font-semibold text-[var(--foreground)]">
                {conditions.ptzRate === 0
                  ? t("characteristics.interestRateZero")
                  : t("characteristics.interestRateValue", { value: (conditions.ptzRate / 100).toFixed(2) })}
              </span>
            </div>
            <hr className="border-[var(--border)]" />
            <div className="flex justify-between py-2">
              <span className="text-[var(--muted-foreground)]">
                {t("characteristics.maxDuration")}
              </span>
              <span className="font-semibold text-[var(--foreground)]">
                {t("characteristics.maxDurationValue", { months: conditions.maxDurationMonths, years: conditions.maxDurationMonths / 12 })}
              </span>
            </div>
            <hr className="border-[var(--border)]" />
            <div className="flex justify-between py-2">
              <span className="text-[var(--muted-foreground)]">
                {t("characteristics.minWork")}
              </span>
              <span className="font-semibold text-[var(--foreground)]">
                {t("characteristics.minWorkValue", { percentage: conditions.minWorkPercentage })}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-[var(--accent)]">
            {t("exceptions.title")}
          </h2>
          <p className="mb-4 text-sm text-[var(--muted-foreground)]">
            {t("exceptions.description")}
          </p>
          <div className="flex flex-col gap-3">
            {exceptionItems.map((key) => (
              <div key={key} className="flex items-start gap-2">
                <span className="font-semibold text-[var(--foreground)]">
                  • {t(`exceptions.${key}.title`)}
                </span>
                <span className="text-[var(--muted-foreground)]">
                  {t(`exceptions.${key}.description`)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-[var(--accent)]">
            {t("duration.title")}
          </h2>
          <p className="mb-4 text-sm text-[var(--muted-foreground)]">
            {t("duration.description")}
          </p>
          <div className="flex flex-col gap-3">
            {durationItems.map((key) => (
              <div key={key} className="flex items-start gap-2">
                <span className="font-semibold text-[var(--foreground)]">
                  • {t(`duration.${key}.title`)}
                </span>
                <span className="text-[var(--muted-foreground)]">
                  {t(`duration.${key}.description`)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-[var(--accent)]">
            {t("loans.title")}
          </h2>
          <p className="mb-4 text-sm text-[var(--muted-foreground)]">
            {t("loans.description")}
          </p>
          <div className="flex flex-col gap-3">
            {loanItems.map((key) => (
              <div key={key} className="flex items-start gap-2">
                <span className="font-semibold text-[var(--foreground)]">
                  • {t(`loans.${key}.title`)}
                </span>
                <span className="text-[var(--muted-foreground)]">
                  {t(`loans.${key}.description`)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[var(--radius)] border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {t("loans.alert")}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-[var(--accent)]">
            {t("tables.priceCeilings.title")}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="py-2 pr-4 text-left font-bold text-[var(--foreground)]">
                    {t("tables.headers.zone")}
                  </th>
                  <th className="py-2 px-4 text-right font-bold text-[var(--foreground)]">
                    {t("tables.headers.person1")}
                  </th>
                  <th className="py-2 px-4 text-right font-bold text-[var(--foreground)]">
                    {t("tables.headers.person2")}
                  </th>
                  <th className="py-2 px-4 text-right font-bold text-[var(--foreground)]">
                    {t("tables.headers.person3")}
                  </th>
                  <th className="py-2 px-4 text-right font-bold text-[var(--foreground)]">
                    {t("tables.headers.person4")}
                  </th>
                  <th className="py-2 pl-4 text-right font-bold text-[var(--foreground)]">
                    {t("tables.headers.person5plus")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {ZONES.map((zone) => {
                  const zonePlafonds = conditions.plafonds.filter(
                    (p) => p.zone === zone
                  );
                  const getPrice = (size: number) => {
                    const plafond = zonePlafonds.find(
                      (p) => p.householdSize === size
                    );
                    return plafond ? formatEuros(plafond.maxPropertyPrice) : "-";
                  };
                  return (
                    <tr key={zone} className="border-b border-[var(--border)] hover:bg-gray-50">
                      <td className="py-2 pr-4">
                        <span className="text-sm font-semibold text-[var(--foreground)]">
                          {t(`zoneLabels.${zone}`)}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-right">{getPrice(1)}</td>
                      <td className="py-2 px-4 text-right">{getPrice(2)}</td>
                      <td className="py-2 px-4 text-right">{getPrice(3)}</td>
                      <td className="py-2 px-4 text-right">{getPrice(4)}</td>
                      <td className="py-2 pl-4 text-right">{getPrice(5)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-[var(--accent)]">
            {t("tables.financingCeilings.title")}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="py-2 pr-4 text-left font-bold text-[var(--foreground)]">
                    {t("tables.headers.zone")}
                  </th>
                  <th className="py-2 px-4 text-right font-bold text-[var(--foreground)]">
                    {t("tables.headers.person12")}
                  </th>
                  <th className="py-2 px-4 text-right font-bold text-[var(--foreground)]">
                    {t("tables.headers.person3")}
                  </th>
                  <th className="py-2 pl-4 text-right font-bold text-[var(--foreground)]">
                    {t("tables.headers.person4plus")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {ZONES.map((zone) => {
                  const zonePlafonds = conditions.plafonds.filter(
                    (p) => p.zone === zone
                  );
                  const getPercentage = (size: number) => {
                    const plafond = zonePlafonds.find(
                      (p) => p.householdSize === size
                    );
                    return plafond ? `${plafond.maxLoanPercentage} %` : "-";
                  };
                  return (
                    <tr key={zone} className="border-b border-[var(--border)] hover:bg-gray-50">
                      <td className="py-2 pr-4">
                        <span className="text-sm font-semibold text-[var(--foreground)]">
                          {t(`zoneLabels.${zone}`)}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-right">{getPercentage(2)}</td>
                      <td className="py-2 px-4 text-right">{getPercentage(3)}</td>
                      <td className="py-2 pl-4 text-right">{getPercentage(4)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-[var(--accent)]">
            {t("tables.incomeCeilings.title")}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="py-2 pr-4 text-left font-bold text-[var(--foreground)]">
                    {t("tables.headers.zone")}
                  </th>
                  <th className="py-2 px-4 text-right font-bold text-[var(--foreground)]">
                    {t("tables.headers.person1")}
                  </th>
                  <th className="py-2 px-4 text-right font-bold text-[var(--foreground)]">
                    {t("tables.headers.person2")}
                  </th>
                  <th className="py-2 px-4 text-right font-bold text-[var(--foreground)]">
                    {t("tables.headers.person3")}
                  </th>
                  <th className="py-2 px-4 text-right font-bold text-[var(--foreground)]">
                    {t("tables.headers.person4")}
                  </th>
                  <th className="py-2 pl-4 text-right font-bold text-[var(--foreground)]">
                    {t("tables.headers.person5plus")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {ZONES.map((zone) => {
                  const zonePlafonds = conditions.plafonds.filter(
                    (p) => p.zone === zone
                  );
                  const getRfr = (size: number) => {
                    const plafond = zonePlafonds.find(
                      (p) => p.householdSize === size
                    );
                    return plafond ? formatEuros(plafond.maxRfr) : "-";
                  };
                  return (
                    <tr key={zone} className="border-b border-[var(--border)] hover:bg-gray-50">
                      <td className="py-2 pr-4">
                        <span className="text-sm font-semibold text-[var(--foreground)]">
                          {t(`zoneLabels.${zone}`)}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-right">{getRfr(1)}</td>
                      <td className="py-2 px-4 text-right">{getRfr(2)}</td>
                      <td className="py-2 px-4 text-right">{getRfr(3)}</td>
                      <td className="py-2 px-4 text-right">{getRfr(4)}</td>
                      <td className="py-2 pl-4 text-right">{getRfr(5)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
