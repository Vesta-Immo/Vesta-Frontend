"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useTranslations } from "next-intl";
import type { PropertyItem, PropertyStatus, PropertyType } from "@/types/simulation";
import { Trash2, Plus } from "lucide-react";

export function isValidListingUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

interface PropertyFormProps {
  initialValues?: PropertyItem;
  onSubmit: (property: PropertyItem) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export default function PropertyForm({
  initialValues,
  onSubmit,
  loading,
  error,
}: PropertyFormProps) {
  const t = useTranslations("propertyList");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [form, setForm] = useState<PropertyItem>(
    initialValues || {
      id: "",
      status: "wanted",
      propertyType: "OLD",
      listingUrl: "",
      price: 0,
      addressOrSector: "",
      propertyTaxAnnual: 0,
      coOwnershipFeesAnnual: 0,
      renovationWorkItems: [],
    }
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const trimmedListingUrl = form.listingUrl?.trim() || "";

      if (trimmedListingUrl && !isValidListingUrl(trimmedListingUrl)) {
        setValidationError(t("validation.invalidUrl"));
        return;
      }

      setValidationError(null);
      const payload: PropertyItem = {
        ...form,
        id: form.id || `prop-${crypto.randomUUID()}`,
        listingUrl: trimmedListingUrl || undefined,
      };
      await onSubmit(payload);
    } catch {
      // Error is already set by parent
    }
  }

  function handleInputChange(
    key: keyof Omit<PropertyItem, "renovationWorkItems" | "status" | "propertyType">
  ) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({
        ...prev,
        [key]: typeof prev[key] === "number" ? Number(value) : value,
      }));
    };
  }

  function addRenovationItem() {
    setForm((prev) => ({
      ...prev,
      renovationWorkItems: [
        ...prev.renovationWorkItems,
        { name: "", cost: 0 },
      ],
    }));
  }

  function updateRenovationItem(
    index: number,
    key: "name" | "details" | "cost",
    value: string | number
  ) {
    setForm((prev) => ({
      ...prev,
      renovationWorkItems: prev.renovationWorkItems.map((item, i) =>
        i === index
          ? { ...item, [key]: key === "cost" ? Number(value) : value }
          : item
      ),
    }));
  }

  function removeRenovationItem(index: number) {
    setForm((prev) => ({
      ...prev,
      renovationWorkItems: prev.renovationWorkItems.filter((_, i) => i !== index),
    }));
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {(error || validationError) && (
        <div className="mb-4 rounded-[var(--radius)] border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error || validationError}
        </div>
      )}

      <div className="grid gap-4 pt-1">
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">
            {t("field.status.label")}
          </label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                status: e.target.value as PropertyStatus,
              }))
            }
            className="w-full rounded-[var(--radius)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--foreground)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          >
            <option value="wanted">{t("field.status.wanted")}</option>
            <option value="visited">{t("field.status.visited")}</option>
          </select>
        </div>

        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">
            {t("field.propertyType.label")}
          </label>
          <select
            value={form.propertyType}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                propertyType: e.target.value as PropertyType,
              }))
            }
            className="w-full rounded-[var(--radius)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--foreground)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          >
            <option value="NEW">{t("field.propertyType.new")}</option>
            <option value="OLD">{t("field.propertyType.old")}</option>
          </select>
        </div>

        <Input
          label={t("field.title")}
          placeholder={t("field.titlePlaceholder")}
          value={form.addressOrSector}
          onChange={handleInputChange("addressOrSector")}
          required
        />

        <Input
          label={t("field.departmentCode")}
          placeholder={t("field.departmentCodePlaceholder")}
          value={form.departmentCode || ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              departmentCode: e.target.value || undefined,
            }))
          }
        />

        <Input
          label={t("field.listingUrl")}
          placeholder={t("field.listingUrlPlaceholder")}
          type="url"
          value={form.listingUrl || ""}
          onChange={(e) => {
            const value = e.target.value;
            setValidationError(null);
            setForm((prev) => ({ ...prev, listingUrl: value }));
          }}
        />

        <Input
          label={t("field.purchasePrice")}
          type="number"
          min={0}
          step={1000}
          value={form.price}
          onChange={handleInputChange("price")}
          unit="€"
          required
        />

        <Input
          label={t("field.propertyTax")}
          type="number"
          min={0}
          step={100}
          value={form.propertyTaxAnnual}
          onChange={handleInputChange("propertyTaxAnnual")}
          unit="€"
        />

        <Input
          label={t("field.coOwnershipFees")}
          type="number"
          min={0}
          step={100}
          value={form.coOwnershipFeesAnnual}
          onChange={handleInputChange("coOwnershipFeesAnnual")}
          unit="€"
        />

        <div>
          <p className="mb-2 text-sm font-semibold text-[var(--foreground)]">
            {t("section.renovation")}
          </p>
          <div className="grid gap-3">
            {form.renovationWorkItems.map((item, idx) => (
              <Card key={idx} className="p-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <Input
                      label={t("field.renovationName")}
                      placeholder={t("field.renovationNamePlaceholder")}
                      value={item.name}
                      onChange={(e) =>
                        updateRenovationItem(idx, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      label={t("field.renovationDetails")}
                      placeholder={t("field.renovationDetailsPlaceholder")}
                      value={item.details || ""}
                      onChange={(e) =>
                        updateRenovationItem(idx, "details", e.target.value)
                      }
                    />
                  </div>
                  <div className="w-full sm:w-32">
                    <Input
                      label={t("field.renovationCost")}
                      type="number"
                      min={0}
                      step={500}
                      value={item.cost}
                      onChange={(e) =>
                        updateRenovationItem(idx, "cost", e.target.value)
                      }
                      unit="€"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRenovationItem(idx)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-[var(--radius)] text-red-600 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addRenovationItem}
              className="w-full"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              {t("action.addWork")}
            </Button>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading
            ? t("action.saving")
            : initialValues
              ? t("action.update")
              : t("action.addProperty")}
        </Button>
      </div>
    </form>
  );
}
