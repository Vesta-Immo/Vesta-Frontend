"use client";
"use client";

import { useState } from "react";
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
import MuiLink from "@mui/material/Link";
import ResultBadge from "@/components/ui/ResultBadge";
import { computeNotaryFees } from "@/lib/simulate";
import { formatEuros, formatPercent } from "@/lib/format";
import type { NotaryFeesResult, PropertyType } from "@/types/simulation";
import Link from "next/link";

export default function FraisNotairePage() {
  const [form, setForm] = useState({
    propertyPrice: "",
    propertyType: "OLD" as PropertyType,
    departmentCode: "",
  });
  const [result, setResult] = useState<NotaryFeesResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value as typeof prev[typeof key] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await computeNotaryFees({
        propertyPrice: Number(form.propertyPrice),
        propertyType: form.propertyType,
        ...(form.departmentCode.trim() && {
          departmentCode: form.departmentCode.trim(),
        }),
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  const totalCost =
    result
      ? Number(form.propertyPrice) + result.notaryFees
      : null;

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
          Frais de notaire
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5 }}>
          Estimez les frais annexes liés à votre acquisition selon le type et
          le prix du bien.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Vous souhaitez partir du budget total ?{" "}
          <MuiLink
            component={Link}
            href="/simulation/budget-cible"
            color="primary"
            underline="always"
            sx={{ fontWeight: 600 }}
          >
            Calculez votre budget cible
          </MuiLink>
        </Typography>
      </Box>

      <Stack component="form" onSubmit={handleSubmit} spacing={3}>
        <TextField
          label="Prix du bien"
          helperText="Prix de vente net vendeur"
          type="number"
          required
          placeholder="280 000"
          value={form.propertyPrice}
          onChange={field("propertyPrice")}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">€</InputAdornment>,
            },
            htmlInput: { min: 0, step: 1000 },
          }}
        />

        <TextField
          select
          label="Type de bien"
          value={form.propertyType}
          onChange={field("propertyType")}
        >
          <MenuItem value="OLD">Ancien</MenuItem>
          <MenuItem value="NEW">Neuf</MenuItem>
        </TextField>

        <TextField
          label="Code département (facultatif)"
          helperText="Les taux varient selon les départements pour les biens anciens"
          placeholder="75"
          value={form.departmentCode}
          onChange={field("departmentCode")}
          slotProps={{
            htmlInput: { maxLength: 3, pattern: "[0-9]{2,3}|2[AB]" },
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
          {loading ? "Calcul en cours…" : "Calculer les frais de notaire"}
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
              label="Frais de notaire estimés"
              value={formatEuros(result.notaryFees)}
              prominent
            />
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <ResultBadge
                label="Taux appliqué"
                value={formatPercent(result.appliedRatePercent)}
              />
              {totalCost !== null && (
                <ResultBadge label="Coût total" value={formatEuros(totalCost)} />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              Estimation indicative. Les frais réels peuvent légèrement varier
              selon le notaire et les émoluments annexes.
            </Typography>
          </Stack>
        </Paper>
      )}
    </Container>
  );
}
