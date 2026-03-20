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
import { formatEuros } from "@/lib/format";
import type { BorrowingCapacityResult } from "@/types/simulation";

const DURATION_OPTIONS = [
  { value: "84", label: "7 ans" },
  { value: "120", label: "10 ans" },
  { value: "180", label: "15 ans" },
  { value: "240", label: "20 ans" },
  { value: "300", label: "25 ans" },
  { value: "360", label: "30 ans" },
];

export default function CapaciteEmpruntPage() {
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
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
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
          Simulation
        </Typography>
        <Typography
          variant="h3"
          sx={{ mt: 1, fontSize: { xs: "2rem", sm: "2.5rem" } }}
        >
          Capacité d&apos;emprunt
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5 }}>
          Estimez le montant maximum que vous pouvez emprunter selon vos
          revenus et votre situation.
        </Typography>
      </Box>

      <Stack component="form" onSubmit={handleSubmit} spacing={3}>
        <TextField
          label="Revenus annuels du foyer"
          helperText="Revenus nets annuels de tous les membres du foyer"
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
          label="Mensualités de crédits en cours"
          helperText="Total des remboursements de crédits existants"
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
          label="Taux d'intérêt annuel"
          helperText="Taux proposé par votre établissement bancaire"
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
          label="Durée de l'emprunt"
          value={form.durationMonths}
          onChange={field("durationMonths")}
        >
          {DURATION_OPTIONS.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Taux d'endettement maximum"
          helperText="35 % est la limite recommandée par le HCSF"
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
          {loading ? "Calcul en cours…" : "Calculer ma capacité d'emprunt"}
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
            Résultat
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <ResultBadge
              label="Capacité d'emprunt"
              value={formatEuros(result.borrowingCapacity)}
              prominent
            />
            <ResultBadge
              label="Mensualité maximale"
              value={`${formatEuros(result.monthlyPaymentCapacity)}\u00a0/ mois`}
            />
          </Stack>
        </Paper>
      )}
    </Container>
  );
}
