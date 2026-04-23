// filepath: components/projects/ScenarioFormFields.tsx
"use client";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { useTranslations, useLocale } from "next-intl";
import type { ScenarioInput } from '@/types/project';

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

  return (
    <Stack spacing={2}>
      {/* Income */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
        {t("section.financialSituation")}
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        <TextField
          label={t("field.annualIncome")}
          type="number"
          value={values.annualHouseholdIncome ?? ""}
          onChange={(e) => onChange("annualHouseholdIncome", Number(e.target.value))}
          error={Boolean(errors.annualHouseholdIncome)}
          helperText={errors.annualHouseholdIncome ?? t("field.annualIncomeHint")}
          fullWidth
          disabled={disabled}
          inputProps={{ min: 0, step: 1000 }}
        />
        <TextField
          label={t("field.monthlyDebt")}
          type="number"
          value={values.monthlyCurrentDebtPayments ?? ""}
          onChange={(e) => onChange("monthlyCurrentDebtPayments", Number(e.target.value))}
          error={Boolean(errors.monthlyCurrentDebtPayments)}
          helperText={errors.monthlyCurrentDebtPayments ?? t("field.monthlyDebtHint")}
          fullWidth
          disabled={disabled}
          inputProps={{ min: 0, step: 50 }}
        />
      </Box>

      {/* Credit */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
        {t("section.credit")}
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2 }}>
        <TextField
          label={t("field.annualRate")}
          type="number"
          value={values.annualRatePercent ?? ""}
          onChange={(e) => onChange("annualRatePercent", Number(e.target.value))}
          error={Boolean(errors.annualRatePercent)}
          helperText={errors.annualRatePercent ?? t("field.annualRateHint")}
          fullWidth
          disabled={disabled}
          inputProps={{ min: 0.1, max: 20, step: 0.1 }}
        />
        <TextField
          select
          label={t("field.loanDuration")}
          value={values.durationMonths ?? 240}
          onChange={(e) => onChange("durationMonths", Number(e.target.value))}
          error={Boolean(errors.durationMonths)}
          helperText={errors.durationMonths}
          fullWidth
          disabled={disabled}
        >
          {durationMonthsOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label={t("field.maxDebtRatio")}
          value={values.maxDebtRatioPercent ?? 35}
          onChange={(e) => onChange("maxDebtRatioPercent", Number(e.target.value))}
          error={Boolean(errors.maxDebtRatioPercent)}
          helperText={errors.maxDebtRatioPercent}
          fullWidth
          disabled={disabled}
        >
          {debtRatioOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Down payment */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
        {t("section.downPayment")}
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        <TextField
          label={t("field.downPayment")}
          type="number"
          value={values.downPayment ?? ""}
          onChange={(e) => onChange("downPayment", Number(e.target.value))}
          error={Boolean(errors.downPayment)}
          helperText={errors.downPayment ?? t("field.downPaymentHint")}
          fullWidth
          disabled={disabled}
          inputProps={{ min: 0, step: 1000 }}
        />
      </Box>

      {/* Property type */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
        {t("section.notaryFees")}
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        <TextField
          select
          label={t("field.propertyType")}
          value={values.propertyType ?? "OLD"}
          onChange={(e) => onChange("propertyType", e.target.value as "NEW" | "OLD")}
          error={Boolean(errors.propertyType)}
          fullWidth
          disabled={disabled}
        >
          {propertyTypeOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label={t("field.department")}
          value={values.departmentCode ?? ""}
          onChange={(e) => onChange("departmentCode", e.target.value)}
          error={Boolean(errors.departmentCode)}
          helperText={
            values.departmentCode && PARIS_DEPARTMENTS.some((d) => d.code === values.departmentCode)
              ? t("field.departmentParisHint")
              : errors.departmentCode ?? t("field.departmentHint")
          }
          fullWidth
          disabled={disabled}
        >
          <MenuItem value="">{t("field.departmentNone")}</MenuItem>
          {PARIS_DEPARTMENTS.map((d) => (
            <MenuItem key={d.code} value={d.code}>
              {d.code} — {d.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {errors._form && (
        <Alert severity="error">{errors._form}</Alert>
      )}
    </Stack>
  );
}
