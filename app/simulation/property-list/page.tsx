"use client";

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Chip from "@mui/material/Chip";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePropertyListStore } from "@/lib/usePropertyListStore";
import PropertyForm from "@/components/property-list/PropertyForm";
import PropertyListView from "@/components/property-list/PropertyListView";
import type { PropertyItem, PropertyWithResults } from "@/types/simulation";

const FinancingSettingsForm = dynamic(
  () => import("@/components/property-list/FinancingSettingsForm"),
  { ssr: false }
);

export default function PropertyListPage() {
  const pathname = usePathname();
  const {
    financingSettings,
    properties,
    results,
    loading,
    error,
    loadPropertyList,
    updateFinancingSettings,
    updateProperty,
    removeProperty,
  } = usePropertyListStore();
  const { authLoading, signInWithGoogle, user } = useAuth();
  const [editingProperty, setEditingProperty] = useState<PropertyItem | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [showFinancingProfile, setShowFinancingProfile] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load initial data
  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    loadPropertyList();
  }, [authLoading, loadPropertyList, user]);

  async function handleSaveSettings(settings: typeof financingSettings) {
    if (!settings) return;
    await updateFinancingSettings(settings);
    setShowFinancingProfile(false);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  }

  async function handleAddProperty(property: PropertyItem) {
    await updateProperty(property);
    setShowAddDialog(false);
    setEditingProperty(null);
  }

  async function handleEditProperty(property: PropertyItem) {
    setEditingProperty(property);
    setShowAddDialog(true);
  }

  async function handleSignIn() {
    setAuthBusy(true);
    setAuthError(null);

    const returnTo = typeof window === "undefined"
      ? pathname
      : `${window.location.pathname}${window.location.search}`;

    const { error: signInError } = await signInWithGoogle(returnTo);
    if (signInError) {
      setAuthError(signInError);
      setAuthBusy(false);
    }
  }

  const resultsByPropertyId = (results || []).reduce<Record<string, PropertyWithResults>>(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {}
  );

  const riskyPropertiesCount = (results || []).filter(
    (item) => item.debtRatioLevel === "HIGH"
  ).length;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          background:
            "linear-gradient(120deg, rgba(245,124,0,0.10) 0%, rgba(25,118,210,0.08) 100%)",
        }}
      >
        <Stack spacing={1.25}>
          <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: "0.1em" }}>
            Pilotage immobilier
          </Typography>

          <Typography
            variant="h3"
            sx={{ fontSize: { xs: "2rem", sm: "2.6rem" }, lineHeight: 1.1 }}
          >
            Mes pistes d'achat
          </Typography>

          <Typography variant="body1" color="text.secondary">
            L'espace central pour comparer vos opportunites, suivre les risques
            et decider plus vite avec une vision financement claire.
          </Typography>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ pt: 0.5 }}>
            {user ? (
              <>
                <Chip label={`Biens: ${properties.length}`} variant="outlined" />
                <Chip
                  label={`Biens a risque: ${riskyPropertiesCount}`}
                  color={riskyPropertiesCount > 0 ? "error" : "success"}
                  variant="outlined"
                />
              </>
            ) : null}
          </Stack>

          <Button
            component={Link}
            href="/#mes-pistes-dachat"
            variant="text"
            color="primary"
            size="small"
            sx={{
              alignSelf: "flex-end",
              mt: 0.5,
              px: 1.5,
              py: 0.6,
              minHeight: 36,
              borderRadius: 999,
              fontSize: "0.84rem",
              fontWeight: 600,
              textTransform: "none",
              color: "text.secondary",
              bgcolor: "transparent",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "rgba(25, 118, 210, 0.05)",
                boxShadow: "none",
              },
            }}
          >
            Pourquoi cet outil ?
          </Button>
        </Stack>
      </Paper>

      <Stack spacing={3}>
        {authError && <Alert severity="error">{authError}</Alert>}

        {mounted && authLoading ? (
          <Paper sx={{ p: 3.5 }}>
            <Typography color="text.secondary">Verification de votre session...</Typography>
          </Paper>
        ) : mounted && !user ? (
          <Paper sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={2.5} alignItems="flex-start">
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Connectez-vous pour retrouver vos pistes d'achat
                </Typography>
                <Typography color="text.secondary">
                  Vos biens suivis, votre profil de financement et vos resultats consolides
                  sont disponibles apres connexion.
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={handleSignIn}
                disabled={authBusy}
              >
                {authBusy ? "Connexion..." : "Se connecter avec Google"}
              </Button>
            </Stack>
          </Paper>
        ) : (
          <>
        {settingsSuccess && (
          <Alert severity="success">
            Paramètres enregistrés avec succès
          </Alert>
        )}

        <Accordion
          expanded={showFinancingProfile}
          onChange={(_, expanded) => setShowFinancingProfile(expanded)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 0.5, sm: 1.5 }}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Profil financement
              </Typography>
              {financingSettings && (
                <Chip
                  size="small"
                  variant="outlined"
                  label={`${financingSettings.annualRatePercent}% • ${financingSettings.durationMonths} mois`}
                />
              )}
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <FinancingSettingsForm
              initialValues={financingSettings || undefined}
              onSubmit={handleSaveSettings}
              loading={loading}
              error={error}
            />
          </AccordionDetails>
        </Accordion>

        <Paper sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              spacing={2}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Vue d'ensemble de vos pistes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Consultez chaque piste d'achat avec ses chiffres cles de financement.
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={() => {
                  setEditingProperty(null);
                  setShowAddDialog(true);
                }}
              >
                + Ajouter une piste
              </Button>
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            {!financingSettings && (
              <Alert severity="info">
                Renseignez d'abord votre profil financement pour voir les calculs consolidés.
              </Alert>
            )}

            {financingSettings && !results && (
              <Alert severity="info">
                Ajoutez ou modifiez une piste d'achat pour afficher les résultats recalcules automatiquement.
              </Alert>
            )}

            {loading ? (
              <Typography color="text.secondary">Chargement...</Typography>
            ) : (
              <PropertyListView
                properties={properties}
                resultsByPropertyId={resultsByPropertyId}
                onEdit={handleEditProperty}
                onDelete={removeProperty}
                loading={loading}
              />
            )}
          </Stack>
        </Paper>
          </>
        )}
      </Stack>

      {/* Add/Edit Property Dialog */}
      <Dialog open={user ? showAddDialog : false} onClose={() => setShowAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProperty ? "Éditer la piste" : "Ajouter une piste"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <PropertyForm
            initialValues={editingProperty || undefined}
            onSubmit={handleAddProperty}
            loading={loading}
            error={error}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
}
