"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AppNav from "@/components/AppNav";
import { computeBorrowingCapacity } from "@/lib/simulate";
import { formatEuros } from "@/lib/format";

interface SimulationResult {
  monthlyPaymentCapacity: number;
  borrowingCapacity: number;
}

export default function CapaciteEmpruntPage() {
  const [revenus, setRevenus] = useState("");
  const [charges, setCharges] = useState("");
  const [duree, setDuree] = useState("20");
  const [taux, setTaux] = useState("3.5");
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async () => {
    setError(null);

    const revenusNum = parseFloat(revenus) || 0;
    const chargesNum = parseFloat(charges) || 0;
    const dureeNum = parseInt(duree, 10) || 20;
    const tauxNum = parseFloat(taux) || 3.5;

    if (revenusNum <= 0) {
      setError("Veuillez saisir un montant de revenus valide");
      return;
    }

    try {
      const simulation = await computeBorrowingCapacity({
        annualHouseholdIncome: revenusNum * 12,
        monthlyDebtPayments: chargesNum,
        durationMonths: dureeNum * 12,
        annualRatePercent: tauxNum,
        maxDebtRatioPercent: 35,
      });

      setResult(simulation);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la simulation"
      );
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
          {/* Header */}
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
              Capacité d&apos;emprunt
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 1.5, fontSize: "1.08rem", lineHeight: 1.75 }}
            >
              Calculez le montant maximum que vous pouvez emprunter selon vos
              revenus, vos crédits en cours et la durée souhaitée.
            </Typography>
          </Box>

          {/* Simulation form */}
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
                    label="Revenus mensuels nets"
                    type="number"
                    inputProps={{ step: 100 }}
                    value={revenus}
                    onChange={(e) => setRevenus(e.target.value)}
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: (
                          <Box sx={{ color: "text.secondary" }}>€</Box>
                        ),
                      },
                    }}
                  />
                  <TextField
                    label="Charges mensuelles"
                    type="number"
                    inputProps={{ step: 100 }}
                    value={charges}
                    onChange={(e) => setCharges(e.target.value)}
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: (
                          <Box sx={{ color: "text.secondary" }}>€</Box>
                        ),
                      },
                    }}
                  />
                </Stack>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ width: "100%" }}
                >
                  <TextField
                    label="Durée"
                    type="number"
                    value={duree}
                    onChange={(e) => setDuree(e.target.value)}
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: (
                          <Box sx={{ color: "text.secondary" }}>ans</Box>
                        ),
                      },
                    }}
                  />
                  <TextField
                    label="Taux d'intérêt"
                    type="number"
                    inputProps={{ step: 0.1 }}
                    value={taux}
                    onChange={(e) => setTaux(e.target.value)}
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: (
                          <Box sx={{ color: "text.secondary" }}>%</Box>
                        ),
                      },
                    }}
                  />
                </Stack>

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSimulate}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Simuler
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
                      Résultats de la simulation
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
                          Mensualité maximale
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "white" }}>
                          {formatEuros(result.monthlyPaymentCapacity)}
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
                          Montant empruntable
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
