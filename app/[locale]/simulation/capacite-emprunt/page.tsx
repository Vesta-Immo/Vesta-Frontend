"use client";

import { useState, type FormEvent } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import ResultBadge from "@/components/ui/ResultBadge";
import { computeBorrowingCapacity } from "@/lib/simulate";
import { useFormat } from "@/lib/format";
import type { BorrowingCapacityResult } from "@/types/simulation";
import { useTranslations } from "next-intl";

const DURATION_VALUES = ["84", "120", "180", "240", "300", "360"];

export default function CapaciteEmpruntPage() {
  const t = useTranslations("capaciteEmprunt");
  const { formatEuros } = useFormat();
  const [form, setForm] = useState({
    annualHouseholdIncome: "",
    monthlyDebtPayments: "",
    annualRatePercent: "3.6",
    durationMonths: "240",
    maxDebtRatioPercent: "35",
  });
  const [result, setResult] = useState<BorrowingCapacityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await computeBorrowingCapacity({
        annualHouseholdIncome: Number(form.annualHouseholdIncome),
        monthlyDebtPayments: Number(form.monthlyDebtPayments),
        annualRatePercent: Number(form.annualRatePercent),
        durationMonths: Number(form.durationMonths),
        maxDebtRatioPercent: Number(form.maxDebtRatioPercent),
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="overline"
          color="primary"
          sx={{ fontWeight: 700, letterSpacing: "0.12em" }}
        >
          {t("overline")}
        </Typography>
        <Typography
          variant="h3"
          sx={{ mt: 1, fontSize: { xs: "2rem", sm: "2.5rem" } }}
        >
          {t("title")}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5 }}>
          {t("description")}
        </Typography>
      </Box>

      <Stack component="form" onSubmit={handleSubmit} spacing={3}>
        <TextField
          label={t("fields.annualHouseholdIncome.label")}
          helperText={t("fields.annualHouseholdIncome.helperText")}
          type="number"
          required
          placeholder="60 000"
          value={form.annualHouseholdIncome}
          onChange={field("annualHouseholdIncome")}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">€ / an</InputAdornment>
              ),
            },
            htmlInput: { min: 0, step: 1000 },
          }}
        />

        <TextField
          label={t("fields.monthlyDebtPayments.label")}
          helperText={t("fields.monthlyDebtPayments.helperText")}
          type="number"
          required
          placeholder="0"
          value={form.monthlyDebtPayments}
          onChange={field("monthlyDebtPayments")}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">€ / mois</InputAdornment>
              ),
            },
            htmlInput: { min: 0, step: 50 },
          }}
        />

        <TextField
          label={t("fields.annualRatePercent.label")}
          helperText={t("fields.annualRatePercent.helperText")}
          type="number"
          required
          placeholder="3.6"
          value={form.annualRatePercent}
          onChange={field("annualRatePercent")}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            },
            htmlInput: { min: 0, max: 20, step: 0.01 },
          }}
        />

        <TextField
          select
          label={t("fields.durationMonths.label")}
          value={form.durationMonths}
          onChange={field("durationMonths")}
        >
          {DURATION_VALUES.map((value) => (
            <MenuItem key={value} value={value}>
              {t(`fields.durationMonths.options.${value}`)}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label={t("fields.maxDebtRatioPercent.label")}
          helperText={t("fields.maxDebtRatioPercent.helperText")}
          type="number"
          required
          placeholder="35"
          value={form.maxDebtRatioPercent}
          onChange={field("maxDebtRatioPercent")}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            },
            htmlInput: { min: 1, max: 50, step: 0.5 },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={16} color="inherit" /> : null
          }
          sx={{ mt: 1 }}
        >
          {loading ? t("button.loading") : t("button.submit")}
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Paper
          component="section"
          aria-live="polite"
          variant="outlined"
          sx={{ mt: 5, p: 3 }}
        >
          <Typography
            variant="overline"
            color="primary"
            sx={{ fontWeight: 700, letterSpacing: "0.12em" }}
          >
            {t("result.title")}
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <ResultBadge
              label={t("result.borrowingCapacityLabel")}
              value={formatEuros(result.borrowingCapacity)}
              prominent
            />
            <ResultBadge
              label={t("result.monthlyPaymentLabel")}
              value={t("result.monthlyPaymentValue", { value: formatEuros(result.monthlyPaymentCapacity) })}
            />
          </Stack>
        </Paper>
      )}
    </Container>
  );
}
