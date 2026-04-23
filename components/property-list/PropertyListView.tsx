"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useTranslations } from "next-intl";
import type { PropertyItem, PropertyWithResults } from "@/types/simulation";
import { useFormat } from "@/lib/format";
import { Pencil, Trash2, ExternalLink } from "lucide-react";

interface PropertyListViewProps {
  properties: PropertyItem[];
  resultsByPropertyId?: Record<string, PropertyWithResults>;
  onEdit: (property: PropertyItem) => void;
  onDelete: (propertyId: string) => Promise<void>;
  loading?: boolean;
}

export default function PropertyListView({
  properties,
  resultsByPropertyId,
  onEdit,
  onDelete,
  loading,
}: PropertyListViewProps) {
  const t = useTranslations("propertyList");
  const { formatEuros } = useFormat();

  if (properties.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-[var(--muted-foreground)]">
        {t("noProperties")}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <h3 className="text-lg font-bold text-[var(--foreground)]">
        {t("title", { count: properties.length })}
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => {
          const result = resultsByPropertyId?.[property.id];
          const totalRenovation = property.renovationWorkItems.reduce(
            (sum, item) => sum + item.cost,
            0
          );

          return (
            <Card key={property.id} className="flex flex-col">
              <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-start gap-2">
                  <h4 className="flex-1 text-base font-bold text-[var(--foreground)]">
                    {property.addressOrSector}
                  </h4>
                  <Badge
                    variant={property.status === "wanted" ? "default" : "accent"}
                  >
                    {property.status === "wanted"
                      ? t("status.wanted")
                      : t("status.visited")}
                  </Badge>
                </div>

                {result && (
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default" className="w-fit">
                      {t("chip.monthlyCredit", {
                        amount: formatEuros(result.monthlyCreditPayment),
                      })}
                    </Badge>
                    <Badge
                      variant={
                        result.debtRatioLevel === "LOW"
                          ? "accent"
                          : result.debtRatioLevel === "OK"
                            ? "default"
                            : "outline"
                      }
                      className={
                        result.debtRatioLevel === "HIGH"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "w-fit"
                      }
                    >
                      {t("chip.debtRatio", {
                        ratio: result.debtRatioPercent.toFixed(1),
                      })}
                    </Badge>
                    <Badge variant="accent" className="w-fit">
                      {t("chip.monthlyWithCharges", {
                        amount: formatEuros(result.monthlyPaymentWithCharges),
                      })}
                    </Badge>
                  </div>
                )}

                <p className="text-sm text-[var(--muted-foreground)]">
                  {property.propertyType === "NEW"
                    ? t("propertyType.new")
                    : t("propertyType.old")}
                  {property.departmentCode && ` • ${property.departmentCode}`}
                </p>

                {property.listingUrl && (
                  <a
                    href={property.listingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:underline"
                  >
                    {t("viewListing")}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}

                <hr className="border-[var(--border)]" />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {t("label.purchasePrice")}
                    </p>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {formatEuros(property.price)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {t("label.annualTaxes")}
                    </p>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {formatEuros(property.propertyTaxAnnual)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {t("label.coOwnershipFees")}
                    </p>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {formatEuros(property.coOwnershipFeesAnnual)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {t("label.renovations")}
                    </p>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {formatEuros(totalRenovation)}
                    </p>
                  </div>

                  {result && (
                    <>
                      <div>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {t("label.requiredLoan")}
                        </p>
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          {formatEuros(result.requiredLoanAmount)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {t("label.notaryFees")}
                        </p>
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          {formatEuros(result.notaryFees)}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {property.renovationWorkItems.length > 0 && (
                  <>
                    <hr className="border-[var(--border)]" />
                    <div>
                      <p className="text-xs font-semibold text-[var(--foreground)]">
                        {t("label.works")}
                      </p>
                      <div className="mt-1 grid gap-1">
                        {property.renovationWorkItems.map((item, idx) => (
                          <p
                            key={idx}
                            className="text-sm text-[var(--muted-foreground)]"
                          >
                            • {item.name}
                            {item.details && ` - ${item.details}`}:{" "}
                            {formatEuros(item.cost)}
                          </p>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <hr className="border-[var(--border)]" />

              <div className="flex gap-2 p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(property)}
                  className="flex-1"
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" />
                  {t("action.edit")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(property.id)}
                  disabled={loading}
                  className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  {t("action.delete")}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
