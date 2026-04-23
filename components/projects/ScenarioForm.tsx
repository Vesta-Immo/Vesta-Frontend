"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { useCreateScenario, useUpdateScenario } from "@/lib/projects";
import ScenarioFormFields from "./ScenarioFormFields";
import type { CreateScenarioInput, ScenarioInput } from "@/types/project";
import Button from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/Dialog";

interface ScenarioFormProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<CreateScenarioInput> & { id?: string };
}

export default function ScenarioForm({
  open,
  onClose,
  initialValues,
}: ScenarioFormProps) {
  const t = useTranslations("projectsComp");
  const [name, setName] = useState(initialValues?.name ?? "");
  const [inputParams, setInputParams] = useState<Partial<ScenarioInput>>(
    initialValues ?? {
      annualHouseholdIncome: 54000,
      monthlyCurrentDebtPayments: 0,
      annualRatePercent: 3.5,
      durationMonths: 240,
      maxDebtRatioPercent: 35,
      downPayment: 15000,
      propertyType: "OLD",
    },
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateScenario();
  const updateMutation = useUpdateScenario();
  const isEdit = Boolean(initialValues?.id);
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleFieldChange = (field: keyof ScenarioInput, value: string | number) => {
    setInputParams((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = t("validation.nameRequired");
    if (!inputParams.annualHouseholdIncome) errors.annualHouseholdIncome = t("validation.required");
    if (!inputParams.downPayment && inputParams.downPayment !== 0) errors.downPayment = t("validation.required");

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const payload: CreateScenarioInput = {
      name: name.trim(),
      annualHouseholdIncome: inputParams.annualHouseholdIncome!,
      monthlyCurrentDebtPayments: inputParams.monthlyCurrentDebtPayments ?? 0,
      annualRatePercent: inputParams.annualRatePercent!,
      durationMonths: inputParams.durationMonths!,
      maxDebtRatioPercent: inputParams.maxDebtRatioPercent!,
      downPayment: inputParams.downPayment!,
      propertyType: inputParams.propertyType!,
      departmentCode: inputParams.departmentCode,
    };

    try {
      if (isEdit && initialValues?.id) {
        await updateMutation.mutateAsync({
          scenarioId: initialValues.id,
          data: payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      handleClose();
    } catch (err: unknown) {
      const apiErr = err as { details?: Array<{ field: string; message: string }> };
      if (apiErr?.details) {
        const mapped: Record<string, string> = {};
        apiErr.details.forEach((d) => {
          mapped[d.field] = d.message;
        });
        setFieldErrors(mapped);
      } else {
        setFieldErrors({ _form: t("error.saveFailed") });
      }
    }
  };

  const handleClose = () => {
    setName("");
    setFieldErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("dialog.editScenarioTitle") : t("dialog.newScenarioTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
              {t("field.scenarioName")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              autoFocus
              className={`w-full rounded-[var(--radius)] border bg-white px-3 py-2 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--foreground)]/40 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] ${
                fieldErrors.name ? "border-red-300" : "border-[var(--border-strong)]"
              }`}
              placeholder={t("field.scenarioNamePlaceholder")}
            />
            {fieldErrors.name ? (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
            ) : (
              <p className="mt-1 text-xs text-[var(--foreground)]/50">{t("field.scenarioNamePlaceholder")}</p>
            )}
          </div>

          <ScenarioFormFields
            values={inputParams}
            onChange={handleFieldChange}
            errors={fieldErrors}
            disabled={isLoading}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
              {t("action.cancel")}
            </Button>
          </DialogClose>
          <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isEdit ? (
              t("action.save")
            ) : (
              t("action.createAndCalculate")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
