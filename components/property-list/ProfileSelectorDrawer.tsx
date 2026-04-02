"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Radio from "@mui/material/Radio";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AddIcon from "@mui/icons-material/Add";
import type { FinancingProfileSummary } from "@/types/financingProfile";
import { formatEuros } from "@/lib/format";

interface ProfileSelectorDrawerProps {
  open: boolean;
  onClose: () => void;
  profiles: FinancingProfileSummary[] | undefined;
  activeProfileId: string | null | undefined;
  isLoading: boolean;
  isError: boolean;
  onSelectProfile: (profileId: string) => void;
  isSelecting: boolean;
}

export default function ProfileSelectorDrawer({
  open,
  onClose,
  profiles,
  activeProfileId,
  isLoading,
  isError,
  onSelectProfile,
  isSelecting,
}: ProfileSelectorDrawerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (profileId: string) => {
    setSelectedId(profileId);
    onSelectProfile(profileId);
  };

  const activeProfile = profiles?.find((p) => p.id === activeProfileId);
  const otherProfiles = profiles?.filter((p) => p.id !== activeProfileId) || [];

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: "100vw", sm: 400 }, p: 0 }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" component="h2">
            Mes profils de financement
          </Typography>
          <IconButton onClick={onClose} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 2 }}>
          {isLoading && (
            <>
              <Skeleton variant="rectangular" height={120} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={80} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={80} />
            </>
          )}

          {isError && (
            <Alert severity="error">
              Impossible de charger vos profils. Veuillez réessayer.
            </Alert>
          )}

          {!isLoading && !isError && profiles?.length === 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Vous n&apos;avez pas encore de profil de financement.
              Créez-en un depuis un scénario.
            </Alert>
          )}

          {!isLoading && !isError && profiles && profiles.length > 0 && (
            <>
              {/* Profil actif */}
              {activeProfile && (
                <>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Profil actif
                  </Typography>
                  <ProfileCard
                    profile={activeProfile}
                    isActive={true}
                    isSelected={false}
                    onSelect={() => {}}
                    disabled={true}
                  />
                </>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Autres profils */}
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Autres profils
              </Typography>

              <List sx={{ p: 0 }}>
                {otherProfiles.map((profile) => (
                  <ListItem key={profile.id} sx={{ px: 0, py: 0.5 }}>
                    <ProfileCard
                      profile={profile}
                      isActive={false}
                      isSelected={selectedId === profile.id && isSelecting}
                      onSelect={() => handleSelect(profile.id)}
                      disabled={isSelecting}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Créer un profil */}
          <Button
            fullWidth
            variant="outlined"
            href="/simulation/projects"
            startIcon={<AddIcon />}
            onClick={onClose}
          >
            Créer un profil depuis un scénario
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}

// Composant interne : carte de profil
interface ProfileCardProps {
  profile: FinancingProfileSummary;
  isActive: boolean;
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
}

function ProfileCard({
  profile,
  isActive,
  isSelected,
  onSelect,
  disabled,
}: ProfileCardProps) {
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

  const maxMonthlyPaymentLabel =
    typeof maxMonthlyPayment === "number" && Number.isFinite(maxMonthlyPayment)
      ? `${formatEuros(maxMonthlyPayment)}/mois`
      : "—";

  const durationLabel =
    typeof loanDurationYears === "number" && Number.isFinite(loanDurationYears)
      ? `${loanDurationYears} ans`
      : "—";

  const scenarioLabel = profile.sourceScenarioName || profile.sourceScenarioId || "Non nommé";

  return (
    <Paper
      elevation={isActive ? 2 : 1}
      sx={{
        p: 2,
        width: "100%",
        border: isActive ? 2 : 1,
        borderColor: isActive ? "primary.main" : "divider",
        opacity: disabled && !isActive ? 0.6 : 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
        {!isActive && (
          <Radio
            checked={isSelected}
            onChange={onSelect}
            disabled={disabled || !profile.isComplete}
            sx={{ mt: -0.5, ml: -1 }}
          />
        )}

        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 0.5,
            }}
          >
            <Typography variant="subtitle1" fontWeight="medium">
              {profile.name}
            </Typography>
            {!profile.isComplete && (
              <Chip
                size="small"
                color="warning"
                icon={<WarningAmberIcon fontSize="small" />}
                label="Incomplet"
              />
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Scénario : {scenarioLabel}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              typography: "caption",
              color: "text.secondary",
            }}
          >
            <span>Apport : {contributionLabel}</span>
            <span>•</span>
            <span>{durationLabel}</span>
            <span>•</span>
            <span>Max {maxMonthlyPaymentLabel}</span>
          </Box>
        </Box>
      </Box>

      {!isActive && !profile.isComplete && (
        <Alert severity="warning" sx={{ mt: 1.5, py: 0.5 }}>
          <Typography variant="caption">
            Ce profil est incomplet. Veuillez mettre à jour le scénario source.
          </Typography>
        </Alert>
      )}
    </Paper>
  );
}
