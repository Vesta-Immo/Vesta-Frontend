"use client";

import { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import MuiLink from "@mui/material/Link";
import ResultBadge from "@/components/ui/ResultBadge";
import { computeTargetBudget } from "@/lib/simulate";
import { formatEuros } from "@/lib/format";
import type { TargetBudgetResult } from "@/types/simulation";
import Link from "next/link";

export default function BudgetCiblePage() {
  const [form, setForm] = useState({
    borrowingCapacity: "",
    downPayment: "",
    estimatedRenovationCosts: "",
  });
  const [result, setResult] = useState<TargetBudgetResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await computeTargetBudget({
        borrowingCapacity: Number(form.borrowingCapacity),
        downPayment: Number(form.downPayment),
        estimatedRenovationCosts: Number(form.estimatedRenovationCosts),
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
          Budget cible
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5 }}>
          Calculez le budget disponible pour votre achat en combinant capacité
          d&apos;emprunt et apport personnel.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Vous ne connaissez pas encore votre capacité d&apos;emprunt ?{" "}
          <MuiLink
            component={Link}
            href="/simulation/capacite-emprunt"
            color="primary"
            underline="always"
            sx={{ fontWeight: 600 }}
          >
            Calculez-la d&apos;abord
          </MuiLink>
        </Typography>
      </Box>

      <Stack component="form" onSubmit={handleSubmit} spacing={3}>
        <TextField
          label="Capacité d'emprunt"
          helperText="Montant maximum que vous pouvez emprunter"
          type="number"
          required
          placeholder="250 000"
          value={form.borrowingCapacity}
          onChange={field("borrowingCapacity")}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">€</InputAdornment>,
            },
            htmlInput: { min: 0, step: 1000 },
          }}
        />

        <TextField
          label="Apport personnel"
          helperText="Somme disponible pour financer l'achat hors crédit"
          type="number"
          required
          placeholder="30 000"
          value={form.downPayment}
          onChange={field("downPayment")}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">€</InputAdornment>,
            },
            htmlInput: { min: 0, step: 1000 },
          }}
        />

        <TextField
          label="Budget de rénovation estimé"
          helperText="Travaux envisagés, déduits du budget disponible pour l'achat"
          type="number"
          required
          placeholder="0"
          value={form.estimatedRenovationCosts}
          onChange={field("estimatedRenovationCosts")}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">€</InputAdornment>,
            },
            htmlInput: { min: 0, step: 1000 },
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
          {loading ? "Calcul en cours…" : "Calculer mon budget cible"}
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
              label="Budget disponible pour l'achat"
              value={formatEuros(result.targetBudget)}
              prominent
            />
            <Typography variant="caption" color="text.secondary">
              Ce montant inclut votre apport et votre capacité d&apos;emprunt,
              déduction faite du budget travaux.
            </Typography>
          </Stack>
        </Paper>
      )}
    </Container>
  );
}
