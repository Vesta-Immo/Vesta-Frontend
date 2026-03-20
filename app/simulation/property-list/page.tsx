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
import { usePropertyListStore } from "@/lib/usePropertyListStore";
import PropertyForm from "@/components/property-list/PropertyForm";
import PropertyListView from "@/components/property-list/PropertyListView";
import type { PropertyItem, PropertyWithResults } from "@/types/simulation";

const FinancingSettingsForm = dynamic(
  () => import("@/components/property-list/FinancingSettingsForm"),
  { ssr: false }
);

export default function PropertyListPage() {
  const store = usePropertyListStore();
  const [editingProperty, setEditingProperty] = useState<PropertyItem | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [showFinancingProfile, setShowFinancingProfile] = useState(false);

  // Load initial data
  useEffect(() => {
    store.loadPropertyList();
  }, []);

  async function handleSaveSettings(settings: typeof store.financingSettings) {
    if (!settings) return;
    await store.updateFinancingSettings(settings);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  }

  async function handleAddProperty(property: PropertyItem) {
    await store.updateProperty(property);
    setShowAddDialog(false);
    setEditingProperty(null);
  }

  async function handleEditProperty(property: PropertyItem) {
    setEditingProperty(property);
    setShowAddDialog(true);
  }

  const resultsByPropertyId = (store.results || []).reduce<Record<string, PropertyWithResults>>(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {}
  );

  const riskyPropertiesCount = (store.results || []).filter(
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
          <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
            <Chip color="primary" label="Outil principal" size="small" />
            <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: "0.1em" }}>
              Pilotage immobilier Vesta
            </Typography>
          </Stack>

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
            <Chip label={`Biens: ${store.properties.length}`} variant="outlined" />
            <Chip
              label={`Biens a risque: ${riskyPropertiesCount}`}
              color={riskyPropertiesCount > 0 ? "error" : "success"}
              variant="outlined"
            />
          </Stack>
        </Stack>
      </Paper>

      <Stack spacing={3}>
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
              {store.financingSettings && (
                <Chip
                  size="small"
                  variant="outlined"
                  label={`${store.financingSettings.annualRatePercent}% • ${store.financingSettings.durationMonths} mois`}
                />
              )}
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <FinancingSettingsForm
              initialValues={store.financingSettings || undefined}
              onSubmit={handleSaveSettings}
              loading={store.loading}
              error={store.error}
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

            {store.error && <Alert severity="error">{store.error}</Alert>}

            {!store.financingSettings && (
              <Alert severity="info">
                Renseignez d'abord votre profil financement pour voir les calculs consolidés.
              </Alert>
            )}

            {store.financingSettings && !store.results && (
              <Alert severity="info">
                Ajoutez ou modifiez une piste d'achat pour afficher les résultats recalcules automatiquement.
              </Alert>
            )}

            {store.loading ? (
              <Typography color="text.secondary">Chargement...</Typography>
            ) : (
              <PropertyListView
                properties={store.properties}
                resultsByPropertyId={resultsByPropertyId}
                onEdit={handleEditProperty}
                onDelete={store.removeProperty}
                loading={store.loading}
              />
            )}
          </Stack>
        </Paper>
      </Stack>

      {/* Add/Edit Property Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProperty ? "Éditer la piste" : "Ajouter une piste"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <PropertyForm
            initialValues={editingProperty || undefined}
            onSubmit={handleAddProperty}
            loading={store.loading}
            error={store.error}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
}
