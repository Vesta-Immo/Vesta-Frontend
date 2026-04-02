"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import SettingsIcon from "@mui/icons-material/Settings";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import type { FinancingProfile } from "@/types/financingProfile";
import { formatEuros } from "@/lib/format";

interface ActiveProfileBannerProps {
  profile: FinancingProfile | null | undefined;
  isLoading: boolean;
  isError: boolean;
  onOpenDrawer: () => void;
}

export default function ActiveProfileBanner({
  profile,
  isLoading,
  isError,
  onOpenDrawer,
}: ActiveProfileBannerProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (isLoading) {
    return (
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Skeleton variant="text" width={200} height={24} />
        <Skeleton variant="text" width="80%" height={20} />
      </Paper>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Impossible de charger votre profil de financement.
      </Alert>
    );
  }

  if (!profile) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 3,
          bgcolor: "warning.light",
          border: 1,
          borderColor: "warning.main",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <WarningAmberIcon color="warning" />
          <Typography variant="subtitle1" fontWeight="medium">
            Aucun profil de financement défini
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Pour calculer vos pistes d&apos;achat, vous devez d&apos;abord définir un profil
          depuis un scénario de financement.
        </Typography>
        <Button
          variant="outlined"
          size="small"
          href="/simulation/projects"
          startIcon={<SettingsIcon />}
        >
          Créer un scénario
        </Button>
      </Paper>
    );
  }

  const settings = profile.settings;
  const downPayment = settings?.downPayment;
  const durationMonths = settings?.durationMonths;
  const loanDurationYears =
    typeof durationMonths === "number" ? durationMonths / 12 : undefined;
  const maxMonthlyPayment =
    typeof settings?.annualHouseholdIncome === "number" &&
    typeof settings?.maxDebtRatioPercent === "number" &&
    typeof settings?.monthlyCurrentDebtPayments === "number"
      ? (settings.annualHouseholdIncome / 12) * (settings.maxDebtRatioPercent / 100) -
        settings.monthlyCurrentDebtPayments
      : undefined;

  const contributionLabel =
    typeof downPayment === "number" && Number.isFinite(downPayment)
      ? formatEuros(downPayment)
      : "—";

  const durationLabel =
    typeof loanDurationYears === "number" && Number.isFinite(loanDurationYears)
      ? `${loanDurationYears} ans`
      : "—";

  const maxMonthlyPaymentLabel =
    typeof maxMonthlyPayment === "number" && Number.isFinite(maxMonthlyPayment)
      ? formatEuros(maxMonthlyPayment)
      : "—";
  const isIncomplete = !profile.isComplete;

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 3,
        ...(isIncomplete && {
          bgcolor: "warning.light",
          border: 1,
          borderColor: "warning.main",
        }),
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography variant="h6" component="h2">
              💰 Profil actif : {profile.name}
            </Typography>
            {isIncomplete && (
              <Chip
                size="small"
                color="warning"
                icon={<WarningAmberIcon />}
                label="Incomplet"
              />
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Basé sur le scénario :{" "}
            <Box
              component="a"
              href={`/simulation/projects/${profile.sourceProjectId}?scenario=${profile.sourceScenarioId}`}
              sx={{
                color: "primary.main",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Voir le scénario →
            </Box>
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              typography: "body2",
              color: "text.secondary",
            }}
          >
            <span>Apport : {contributionLabel}</span>
            <span>•</span>
            <span>Durée : {durationLabel}</span>
            <span>•</span>
            <span>Max/mois : {maxMonthlyPaymentLabel}</span>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={onOpenDrawer}
            startIcon={<SwapHorizIcon />}
          >
            Changer de profil
          </Button>
        </Box>
      </Box>

      {isIncomplete && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Ce profil est incomplet car le scénario source a été modifié.
          Veuillez mettre à jour le scénario ou sélectionner un autre profil.
        </Alert>
      )}
    </Paper>
  );
}
