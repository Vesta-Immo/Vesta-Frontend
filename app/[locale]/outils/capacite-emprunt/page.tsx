"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import AppNav from "@/components/AppNav";
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
  });
  const [result, setResult] = useState<BorrowingCapacityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  const handleSimulate = async () => {
    setError(null);
    setResult(null);

    const annualHouseholdIncome = Number(form.annualHouseholdIncome);
    const monthlyDebtPayments = Number(form.monthlyDebtPayments);
    const annualRatePercent = Number(form.annualRatePercent);
    const durationMonths = Number(form.durationMonths);

    if (annualHouseholdIncome <= 0) {
      setError(t("errors.generic"));
      return;
    }

    setLoading(true);

    try {
      const simulation = await computeBorrowingCapacity({
        annualHouseholdIncome,
        monthlyDebtPayments,
        durationMonths,
        annualRatePercent,
        maxDebtRatioPercent: 35,
      });

      setResult(simulation);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("errors.generic")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <AppNav />

      <Container maxWidth="lg" sx={{ flex: 1, py: { xs: 4, md: 6 } }}>
        <Stack spacing={4}>
          <Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "1.8rem", sm: "2.4rem", md: "3rem" },
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                fontWeight: 700,
              }}
            >
              {t("title")}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 1.5, fontSize: "1.08rem", lineHeight: 1.75 }}
            >
              {t("description")}
            </Typography>
          </Box>

          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
              <Stack spacing={3}>
                {error && <Alert severity="error">{error}</Alert>}

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ width: "100%" }}
                >
                  <TextField
                    label={t("fields.annualHouseholdIncome.label")}
                    helperText={t("fields.annualHouseholdIncome.helperText")}
                    type="number"
                    required
                    placeholder="60 000"
                    value={form.annualHouseholdIncome}
                    onChange={field("annualHouseholdIncome")}
                    fullWidth
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
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">€ / mois</InputAdornment>
                        ),
                      },
                      htmlInput: { min: 0, step: 50 },
                    }}
                  />
                </Stack>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ width: "100%" }}
                >
                  <TextField
                    select
                    label={t("fields.durationMonths.label")}
                    value={form.durationMonths}
                    onChange={field("durationMonths")}
                    fullWidth
                  >
                    {DURATION_VALUES.map((value) => (
                      <MenuItem key={value} value={value}>
                        {t(`fields.durationMonths.options.${value}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label={t("fields.annualRatePercent.label")}
                    helperText={t("fields.annualRatePercent.helperText")}
                    type="number"
                    required
                    placeholder="3.6"
                    value={form.annualRatePercent}
                    onChange={field("annualRatePercent")}
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      },
                      htmlInput: { min: 0, max: 20, step: 0.01 },
                    }}
                  />
                </Stack>

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSimulate}
                  disabled={loading}
                  startIcon={
                    loading ? <CircularProgress size={16} color="inherit" /> : null
                  }
                  sx={{ alignSelf: "flex-start" }}
                >
                  {loading ? t("button.loading") : t("button.submit")}
                </Button>

                {result && (
                  <Box
                    sx={{
                      mt: 3,
                      p: 3,
                      bgcolor: "success.main",
                      borderRadius: 2,
                      border: "2px solid",
                      borderColor: "success.dark",
                      boxShadow: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: "white" }}>
                      {t("result.title")}
                    </Typography>
                    <Stack spacing={3}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography sx={{ color: "white", fontWeight: 500 }}>
                          {t("result.monthlyPaymentLabel")}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "white" }}>
                          {t("result.monthlyPaymentValue", {
                            value: formatEuros(result.monthlyPaymentCapacity),
                          })}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography sx={{ color: "white", fontWeight: 500 }}>
                          {t("result.borrowingCapacityLabel")}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "white" }}>
                          {formatEuros(result.borrowingCapacity)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
