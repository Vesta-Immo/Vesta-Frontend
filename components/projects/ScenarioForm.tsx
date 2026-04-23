// filepath: components/projects/ScenarioForm.tsx
"use client";

import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslations } from "next-intl";

import { useCreateScenario, useUpdateScenario } from "@/lib/projects";
import ScenarioFormFields from "./ScenarioFormFields";
import type { CreateScenarioInput, ScenarioInput } from '@/types/project';

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
    // Clear error on change
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? t("dialog.editScenarioTitle") : t("dialog.newScenarioTitle")}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <TextField
            label={t("field.scenarioName")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={Boolean(fieldErrors.name)}
            helperText={fieldErrors.name ?? t("field.scenarioNamePlaceholder")}
            fullWidth
            autoFocus
            disabled={isLoading}
          />
          <ScenarioFormFields
            values={inputParams}
            onChange={handleFieldChange}
            errors={fieldErrors}
            disabled={isLoading}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          {t("action.cancel")}
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <CircularProgress size={20} />
          ) : isEdit ? (
            t("action.save")
          ) : (
            t("action.createAndCalculate")
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
