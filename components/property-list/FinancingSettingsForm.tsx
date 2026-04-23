"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import { useTranslations } from "next-intl";
import type { FinancingSettings } from "@/types/simulation";

interface FinancingSettingsFormProps {
  initialValues?: FinancingSettings;
  onSubmit: (settings: FinancingSettings) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

interface FinancingSettingsFormState {
  annualRatePercent: string;
  durationMonths: string;
  downPayment: string;
  annualHouseholdIncome: string;
  monthlyCurrentDebtPayments: string;
}

const DEFAULT_SETTINGS: FinancingSettings = {
  annualRatePercent: 3.6,
  durationMonths: 300,
  downPayment: 0,
  annualHouseholdIncome: 50000,
  monthlyCurrentDebtPayments: 0,
};

function normalizeSettings(
  settings?: Partial<FinancingSettings>
): FinancingSettingsFormState {
  const normalized: FinancingSettings = {
    annualRatePercent:
      settings?.annualRatePercent ?? DEFAULT_SETTINGS.annualRatePercent,
    durationMonths: settings?.durationMonths ?? DEFAULT_SETTINGS.durationMonths,
    downPayment: settings?.downPayment ?? DEFAULT_SETTINGS.downPayment,
    annualHouseholdIncome:
      settings?.annualHouseholdIncome ?? DEFAULT_SETTINGS.annualHouseholdIncome,
    monthlyCurrentDebtPayments:
      settings?.monthlyCurrentDebtPayments ??
      DEFAULT_SETTINGS.monthlyCurrentDebtPayments,
  };

  return {
    annualRatePercent: String(normalized.annualRatePercent),
    durationMonths: String(normalized.durationMonths),
    downPayment: String(normalized.downPayment),
    annualHouseholdIncome: String(normalized.annualHouseholdIncome),
    monthlyCurrentDebtPayments: String(normalized.monthlyCurrentDebtPayments),
  };
}

export default function FinancingSettingsForm({
  initialValues,
  onSubmit,
  loading,
  error,
}: FinancingSettingsFormProps) {
  const t = useTranslations("propertyList");
  const [form, setForm] = useState<FinancingSettingsFormState>(
    normalizeSettings(initialValues)
  );

  useEffect(() => {
    setForm(normalizeSettings(initialValues));
  }, [initialValues]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await onSubmit({
        annualRatePercent: Number(form.annualRatePercent || 0),
        durationMonths: Number(form.durationMonths || 0),
        downPayment: Number(form.downPayment || 0),
        annualHouseholdIncome: Number(form.annualHouseholdIncome || 0),
        monthlyCurrentDebtPayments: Number(form.monthlyCurrentDebtPayments || 0),
      });
    } catch {
      // Error is already set by the parent component
    }
  }

  function field(key: keyof FinancingSettingsFormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stack spacing={2.5}>
        <TextField
          label={t("field.annualRate")}
          type="number"
          inputProps={{ min: 0, max: 30, step: 0.01 }}
          value={form.annualRatePercent}
          onChange={field("annualRatePercent")}
          slotProps={{
            input: { endAdornment: <InputAdornment position="end">%</InputAdornment> },
          }}
          fullWidth
        />

        <TextField
          label={t("field.loanDuration")}
          type="number"
          inputProps={{ min: 12, max: 480, step: 1 }}
          value={form.durationMonths}
          onChange={field("durationMonths")}
          slotProps={{
            input: { endAdornment: <InputAdornment position="end">{t("unit.months")}</InputAdornment> },
          }}
          fullWidth
        />

        <TextField
          label={t("field.downPayment")}
          type="number"
          inputProps={{ min: 0, step: 1000 }}
          value={form.downPayment}
          onChange={field("downPayment")}
          slotProps={{
            input: { endAdornment: <InputAdornment position="end">€</InputAdornment> },
          }}
          fullWidth
        />

        <TextField
          label={t("field.annualIncome")}
          type="number"
          inputProps={{ min: 0, step: 1000 }}
          value={form.annualHouseholdIncome}
          onChange={field("annualHouseholdIncome")}
          slotProps={{
            input: { endAdornment: <InputAdornment position="end">€</InputAdornment> },
          }}
          fullWidth
        />

        <TextField
          label={t("field.monthlyDebt")}
          type="number"
          inputProps={{ min: 0, step: 50 }}
          value={form.monthlyCurrentDebtPayments}
          onChange={field("monthlyCurrentDebtPayments")}
          slotProps={{
            input: { endAdornment: <InputAdornment position="end">€</InputAdornment> },
          }}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
        >
          {loading ? t("action.saving") : t("action.saveSettings")}
        </Button>
      </Stack>
    </Box>
  );
}
