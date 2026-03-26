// filepath: components/projects/ScenarioFormFields.tsx
"use client";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import type { ScenarioInput } from '@/types/project';

const DEBT_RATIO_OPTIONS = [
  { value: 30, label: "30% — Saine" },
  { value: 33, label: "33% — Classique" },
  { value: 35, label: "35% — HCSF maximum recommandé" },
  { value: 40, label: "40% — Élevée (à éviter)" },
];

const DURATION_MONTHS_OPTIONS = [
  { value: 120, label: "10 ans" },
  { value: 180, label: "15 ans" },
  { value: 240, label: "20 ans" },
  { value: 300, label: "25 ans" },
  { value: 360, label: "30 ans" },
];

const PROPERTY_TYPE_OPTIONS = [
  { value: "OLD", label: "Ancien" },
  { value: "NEW", label: "Neuf" },
];

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
  const fmt = (n: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  return (
    <Stack spacing={2}>
      {/* Income */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
        Situation financière
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        <TextField
          label="Revenus annuels nets du ménage"
          type="number"
          value={values.annualHouseholdIncome ?? ""}
          onChange={(e) => onChange("annualHouseholdIncome", Number(e.target.value))}
          error={Boolean(errors.annualHouseholdIncome)}
          helperText={errors.annualHouseholdIncome ?? "Ex: 54 000 € pour 4 500 €/mois"}
          fullWidth
          disabled={disabled}
          inputProps={{ min: 0, step: 1000 }}
        />
        <TextField
          label="Charges de crédits existantes / mois"
          type="number"
          value={values.monthlyCurrentDebtPayments ?? ""}
          onChange={(e) => onChange("monthlyCurrentDebtPayments", Number(e.target.value))}
          error={Boolean(errors.monthlyCurrentDebtPayments)}
          helperText={errors.monthlyCurrentDebtPayments ?? "Ex: 200 €"}
          fullWidth
          disabled={disabled}
          inputProps={{ min: 0, step: 50 }}
        />
      </Box>

      {/* Credit */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
        Crédit
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2 }}>
        <TextField
          label="Taux d'intérêt annuel (%)"
          type="number"
          value={values.annualRatePercent ?? ""}
          onChange={(e) => onChange("annualRatePercent", Number(e.target.value))}
          error={Boolean(errors.annualRatePercent)}
          helperText={errors.annualRatePercent ?? "Ex: 3.5"}
          fullWidth
          disabled={disabled}
          inputProps={{ min: 0.1, max: 20, step: 0.1 }}
        />
        <TextField
          select
          label="Durée du crédit"
          value={values.durationMonths ?? 240}
          onChange={(e) => onChange("durationMonths", Number(e.target.value))}
          error={Boolean(errors.durationMonths)}
          helperText={errors.durationMonths}
          fullWidth
          disabled={disabled}
        >
          {DURATION_MONTHS_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Taux d'endettement max"
          value={values.maxDebtRatioPercent ?? 35}
          onChange={(e) => onChange("maxDebtRatioPercent", Number(e.target.value))}
          error={Boolean(errors.maxDebtRatioPercent)}
          helperText={errors.maxDebtRatioPercent}
          fullWidth
          disabled={disabled}
        >
          {DEBT_RATIO_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Down payment */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
        Apport
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        <TextField
          label="Apport personnel disponible"
          type="number"
          value={values.downPayment ?? ""}
          onChange={(e) => onChange("downPayment", Number(e.target.value))}
          error={Boolean(errors.downPayment)}
          helperText={errors.downPayment ?? "Ex: 15 000 €"}
          fullWidth
          disabled={disabled}
          inputProps={{ min: 0, step: 1000 }}
        />
      </Box>

      {/* Property type */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
        Frais de notaire
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        <TextField
          select
          label="Type de bien"
          value={values.propertyType ?? "OLD"}
          onChange={(e) => onChange("propertyType", e.target.value as "NEW" | "OLD")}
          error={Boolean(errors.propertyType)}
          fullWidth
          disabled={disabled}
        >
          {PROPERTY_TYPE_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Département (optionnel)"
          value={values.departmentCode ?? ""}
          onChange={(e) => onChange("departmentCode", e.target.value)}
          error={Boolean(errors.departmentCode)}
          helperText={
            values.departmentCode && PARIS_DEPARTMENTS.some((d) => d.code === values.departmentCode)
              ? "Majoration Paris applied (+0.2%)"
              : errors.departmentCode ?? "Laisser vide si inconnu"
          }
          fullWidth
          disabled={disabled}
        >
          <MenuItem value="">— Aucun —</MenuItem>
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
