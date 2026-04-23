"use client";

import Badge from "@/components/ui/Badge";
import { useTranslations } from "next-intl";
import type { PropertyWithResults } from "@/types/simulation";
import { useFormat } from "@/lib/format";

interface PropertyResultsProps {
  results: PropertyWithResults[];
}

export default function PropertyResults({ results }: PropertyResultsProps) {
  const t = useTranslations("propertyList");
  const { formatEuros } = useFormat();

  function debtLevelVariant(level: PropertyWithResults["debtRatioLevel"]) {
    if (level === "LOW") {
      return "accent" as const;
    }
    if (level === "OK") {
      return "default" as const;
    }
    return "outline" as const;
  }

  if (results.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-[var(--muted-foreground)]">
        {t("noResults")}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <h3 className="text-lg font-bold text-[var(--foreground)]">
        {t("resultsTitle")}
      </h3>

      <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--foreground)]/5">
              <th className="px-4 py-3 text-left font-semibold text-[var(--foreground)]">
                {t("table.property")}
              </th>
              <th className="px-4 py-3 text-right font-semibold text-[var(--foreground)]">
                {t("table.purchasePrice")}
              </th>
              <th className="px-4 py-3 text-right font-semibold text-[var(--foreground)]">
                {t("table.notaryFees")}
              </th>
              <th className="px-4 py-3 text-right font-semibold text-[var(--foreground)]">
                {t("table.renovations")}
              </th>
              <th className="px-4 py-3 text-right font-semibold text-[var(--foreground)]">
                {t("table.requiredLoan")}
              </th>
              <th className="px-4 py-3 text-right font-semibold text-[var(--foreground)]">
                {t("table.monthlyCredit")}
              </th>
              <th className="px-4 py-3 text-right font-semibold text-[var(--foreground)]">
                {t("table.monthlyWithCharges")}
              </th>
              <th className="px-4 py-3 text-right font-semibold text-[var(--foreground)]">
                {t("table.debtRatio")}
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((property) => (
              <tr
                key={property.id}
                className="border-b border-[var(--border)] last:border-b-0"
              >
                <td className="px-4 py-3">
                  <div className="grid gap-1">
                    <span className="font-semibold text-[var(--foreground)]">
                      {property.addressOrSector}
                    </span>
                    {property.listingUrl && (
                      <a
                        href={property.listingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--accent)] hover:underline"
                      >
                        {t("viewListing")}
                      </a>
                    )}
                    <Badge variant="outline" className="mt-0.5 w-fit">
                      {property.status === "wanted"
                        ? t("status.wanted")
                        : t("status.visited")}
                    </Badge>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  {formatEuros(property.price)}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatEuros(property.notaryFees)}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatEuros(property.totalRenovationBudget)}
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  {formatEuros(property.requiredLoanAmount)}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatEuros(property.monthlyCreditPayment)}
                </td>
                <td className="px-4 py-3 text-right font-bold text-[var(--accent)]">
                  {formatEuros(property.monthlyPaymentWithCharges)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="font-semibold text-[var(--foreground)]">
                      {property.debtRatioPercent.toFixed(1)}%
                    </span>
                    <Badge
                      variant={debtLevelVariant(property.debtRatioLevel)}
                      className={
                        property.debtRatioLevel === "HIGH"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : ""
                      }
                    >
                      {property.debtRatioLevel}
                    </Badge>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
