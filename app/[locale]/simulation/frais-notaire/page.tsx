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
import { useFormat } from "@/lib/format";
import type { NotaryFeesResult, PropertyType } from "@/types/simulation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function FraisNotairePage() {
  const t = useTranslations("fraisNotaire");
  const { formatEuros, formatPercent } = useFormat();
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
      setError(err instanceof Error ? err.message : t("errors.generic"));
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
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t("helperText")}{" "}
          <MuiLink
            component={Link}
            href="/simulation/budget-cible"
            color="primary"
            underline="always"
            sx={{ fontWeight: 600 }}
          >
            {t("helperLink")}
          </MuiLink>
        </Typography>
      </Box>

      <Stack component="form" onSubmit={handleSubmit} spacing={3}>
        <TextField
          label={t("fields.propertyPrice.label")}
          helperText={t("fields.propertyPrice.helperText")}
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
          label={t("fields.propertyType.label")}
          value={form.propertyType}
          onChange={field("propertyType")}
        >
          <MenuItem value="OLD">{t("fields.propertyType.options.OLD")}</MenuItem>
          <MenuItem value="NEW">{t("fields.propertyType.options.NEW")}</MenuItem>
        </TextField>

        <TextField
          label={t("fields.departmentCode.label")}
          helperText={t("fields.departmentCode.helperText")}
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
              label={t("result.notaryFeesLabel")}
              value={formatEuros(result.notaryFees)}
              prominent
            />
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <ResultBadge
                label={t("result.appliedRateLabel")}
                value={formatPercent(result.appliedRatePercent)}
              />
              {totalCost !== null && (
                <ResultBadge label={t("result.totalCostLabel")} value={formatEuros(totalCost)} />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {t("result.disclaimer")}
            </Typography>
          </Stack>
        </Paper>
      )}
    </Container>
  );
}
