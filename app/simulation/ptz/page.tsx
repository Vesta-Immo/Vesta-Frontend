"use client";

import { useState, type FormEvent } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import ResultBadge from "@/components/ui/ResultBadge";
import MuiLink from "@mui/material/Link";
import Link from "next/link";
import {
  checkPtzEligibility,
  computePtzAmount,
  getPtzConditions,
} from "@/lib/simulate";
import { formatEuros } from "@/lib/format";
import type {
  CheckPtzEligibilityRequest,
  CheckPtzEligibilityResult,
  ComputePtzResult,
  PtzZone,
  PtzPropertyType,
  PtzOperationType,
} from "@/types/simulation";
import {
  ComplementaryLoanType,
  PrimoAccedantException,
} from "@/types/simulation";

const ZONE_OPTIONS: { value: PtzZone; label: string }[] = [
  { value: "A_BIS", label: "Zone A bis - Paris et 29 communes de la petite couronne" },
  { value: "A", label: "Zone A - Agglomération parisienne, Lyon, Marseille, Lille, Nice, Montpellier, Bordeaux..." },
  { value: "B1", label: "Zone B1 - Grandes agglomérations" },
  { value: "B2", label: "Zone B2 - Villes moyennes" },
  { value: "C", label: "Zone C - Zones rurales" },
];

const HOUSEHOLD_OPTIONS = [
  { value: 1, label: "1 personne" },
  { value: 2, label: "2 personnes" },
  { value: 3, label: "3 personnes" },
  { value: 4, label: "4 personnes" },
  { value: 5, label: "5 personnes" },
  { value: 6, label: "6 personnes" },
  { value: 7, label: "7 personnes" },
  { value: 8, label: "8 personnes ou plus" },
];

const COMPLEMENTARY_LOAN_OPTIONS: { value: ComplementaryLoanType; label: string }[] = [
  { value: ComplementaryLoanType.PAS, label: "PAS (Prêt d'Accession Sociale)" },
  { value: ComplementaryLoanType.CONVENTIONNE, label: "Prêt conventionné" },
  { value: ComplementaryLoanType.CLASSIQUE, label: "Prêt classique" },
  { value: ComplementaryLoanType.PEL, label: "PEL (Prêt Épargne Logement)" },
  { value: ComplementaryLoanType.COMPLEMENTAIRE, label: "Autre prêt complémentaire" },
];

const PRIMO_EXCEPTION_OPTIONS: { value: PrimoAccedantException; label: string }[] = [
  { value: PrimoAccedantException.DIVORCE_SEPARATION, label: "Divorce ou séparation" },
  { value: PrimoAccedantException.CATASTROPHE_NATURELLE, label: "Catastrophe naturelle" },
  { value: PrimoAccedantException.CARTE_INVALIDITE, label: "Titulaire d'une carte d'invalidité" },
];

const PROPERTY_TYPE_OPTIONS: { value: PtzPropertyType; label: string }[] = [
  { value: "COLLECTIF", label: "Logement collectif (appartement)" },
  { value: "MAISON_INDIVIDUELLE", label: "Maison individuelle" },
];

const OPERATION_TYPE_OPTIONS: { value: PtzOperationType; label: string }[] = [
  { value: "NEUF", label: "Neuf ou VEFA" },
  { value: "ANCIEN_AVEC_TRAVAUX", label: "Ancien avec travaux (≥25%)" },
];

export default function PtzSimulateurPage() {
  const [form, setForm] = useState<CheckPtzEligibilityRequest>({
    propertyPrice: 0,
    propertyZone: "B1",
    householdSize: 2,
    isPrimoAccedant: true,
    annualIncome: 0,
    workPercentage: undefined,
    hasComplementaryLoan: false,
    hasDependencies: false,
    isOldProperty: false,
    propertyType: "COLLECTIF",
    operationType: "NEUF",
  });
  const [eligibilityResult, setEligibilityResult] = useState<CheckPtzEligibilityResult | null>(null);
  const [computeResult, setComputeResult] = useState<ComputePtzResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
    };
  }

  async function handleCalculate(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setEligibilityResult(null);
    setComputeResult(null);
    try {
      // 1. Vérifier éligibilité
      const eligibilityResult = await checkPtzEligibility({
        propertyPrice: form.propertyPrice * 100,
        propertyZone: form.propertyZone,
        householdSize: form.householdSize,
        isPrimoAccedant: form.isPrimoAccedant,
        annualIncome: form.annualIncome * 100,
        workPercentage: form.workPercentage,
        hasComplementaryLoan: form.hasComplementaryLoan,
        complementaryLoanType: form.complementaryLoanType,
        hasDependencies: form.hasDependencies,
        operationId: form.operationId,
        primoAccedantException: form.primoAccedantException,
        isOldProperty: form.isOldProperty,
        propertyType: form.propertyType,
        operationType: form.operationType,
      });
      setEligibilityResult(eligibilityResult);

      // 2. Si éligible, calculer le PTZ
      if (eligibilityResult.isEligible) {
        const ptzResult = await computePtzAmount({
          propertyPrice: form.propertyPrice * 100,
          propertyZone: form.propertyZone,
          householdSize: form.householdSize,
          isPrimoAccedant: form.isPrimoAccedant,
          annualIncome: form.annualIncome * 100,
          workPercentage: form.workPercentage,
          hasComplementaryLoan: form.hasComplementaryLoan,
          complementaryLoanType: form.complementaryLoanType,
          hasDependencies: form.hasDependencies,
          operationId: form.operationId,
          primoAccedantException: form.primoAccedantException,
          isOldProperty: form.isOldProperty,
          propertyType: form.propertyType,
          operationType: form.operationType,
        });
        setComputeResult(ptzResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
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
          Prêt à Taux Zéro (PTZ)
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5 }}>
          Vérifiez votre éligibilité au PTZ et calculez le montant dont vous
          pouvez bénéficier. Le PTZ est un prêt sans intérêts pour les
          primo-accédants.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Vous voulez connaître les conditions et plafonds ?{" "}
          <MuiLink
            component={Link}
            href="/simulation/ptz/conditions"
            color="primary"
            underline="always"
            sx={{ fontWeight: 600 }}
          >
            Voir les conditions PTZ
          </MuiLink>
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleCalculate}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "minmax(0, 1fr) minmax(0, 1fr)" },
          gap: 2,
          width: "100%",
          maxWidth: 800,
        }}
      >
        <Box sx={{ gridColumn: { xs: "1", sm: "span 2" } }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: "0.12em" }}>
            Caractéristiques du bien
          </Typography>
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Prix du logement"
            helperText="Prix d'achat du bien immobilier"
            type="number"
            required
            placeholder="250 000"
            value={form.propertyPrice || ""}
            onChange={field("propertyPrice")}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">€</InputAdornment>,
              },
              htmlInput: { min: 0, step: 1000 },
            }}
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            select
            label="Zone géographique"
            value={form.propertyZone}
            onChange={field("propertyZone")}
            helperText="Zone où se situe le bien immobilier"
          >
            {ZONE_OPTIONS.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ gridColumn: { xs: "1", sm: "span 2" } }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: "0.12em" }}>
            Foyer & Revenus
          </Typography>
        </Box>
        <Box>
          <TextField
            fullWidth
            select
            label="Nombre de personnes dans le foyer"
            value={form.householdSize}
            onChange={field("householdSize")}
            helperText="Vous + personnes à charge"
          >
            {HOUSEHOLD_OPTIONS.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Revenus annuels du foyer"
            helperText="Revenu fiscal de référence (N-2) de tous les membres du foyer"
            type="number"
            required
            placeholder="45 000"
            value={form.annualIncome || ""}
            onChange={field("annualIncome")}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">€ / an</InputAdornment>,
              },
              htmlInput: { min: 0, step: 1000 },
            }}
          />
        </Box>

        <Box sx={{ gridColumn: { xs: "1", sm: "span 2" } }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: "0.12em" }}>
            Statut acquéreur
          </Typography>
        </Box>
        <Box>
          <TextField
            fullWidth
            select
            label="Êtes-vous primo-accédant ?"
            helperText="Vous n'avez jamais été propriétaire de votre résidence principale"
            value={form.isPrimoAccedant ? "yes" : "no"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                isPrimoAccedant: e.target.value === "yes",
              }))
            }
          >
            <MenuItem value="yes">Oui</MenuItem>
            <MenuItem value="no">Non</MenuItem>
          </TextField>
        </Box>
        <Box>
          {!form.isPrimoAccedant && (
            <TextField
              fullWidth
              select
              label="Exception primo-accédance"
              value={form.primoAccedantException || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  primoAccedantException: e.target.value as PrimoAccedantException,
                }))
              }
              helperText="Si vous n'êtes pas primo-accédant, une exception peut s'appliquer"
            >
              {PRIMO_EXCEPTION_OPTIONS.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Box>

        <Box sx={{ gridColumn: { xs: "1", sm: "span 2" } }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: "0.12em" }}>
            Projet immobilier
          </Typography>
        </Box>
        <Box>
          <TextField
            fullWidth
            select
            label="Type de bien immobilier"
            value={form.propertyType || "COLLECTIF"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                propertyType: e.target.value as PtzPropertyType,
              }))
            }
            helperText="Logement collectif ou maison individuelle"
          >
            {PROPERTY_TYPE_OPTIONS.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box>
          <TextField
            fullWidth
            select
            label="Type d'opération"
            value={form.operationType || "NEUF"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                operationType: e.target.value as PtzOperationType,
                isOldProperty: e.target.value === "ANCIEN_AVEC_TRAVAUX",
              }))
            }
            helperText="Neuf ou ancien avec travaux"
          >
            {OPERATION_TYPE_OPTIONS.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Pourcentage de travaux (optionnel)"
            helperText="Pour un bien ancien, % du coût total représentant des travaux"
            type="number"
            placeholder="25"
            value={form.workPercentage || ""}
            onChange={field("workPercentage")}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              },
              htmlInput: { min: 0, max: 100, step: 1 },
            }}
          />
        </Box>

        <Box sx={{ gridColumn: { xs: "1", sm: "span 2" } }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: "0.12em" }}>
            Financement
          </Typography>
        </Box>
        <Box>
          <TextField
            fullWidth
            select
            label="Avez-vous un prêt complémentaire ?"
            value={form.hasComplementaryLoan ? "yes" : "no"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                hasComplementaryLoan: e.target.value === "yes",
              }))
            }
            helperText="Un prêt complémentaire peut influencer la durée du PTZ"
          >
            <MenuItem value="yes">Oui</MenuItem>
            <MenuItem value="no">Non</MenuItem>
          </TextField>
        </Box>
        <Box>
          {form.hasComplementaryLoan && (
            <TextField
              fullWidth
              select
              label="Type de prêt complémentaire"
              value={form.complementaryLoanType || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  complementaryLoanType: e.target.value as ComplementaryLoanType,
                }))
              }
              helperText="Sélectionnez le type de prêt complémentaire"
            >
              {COMPLEMENTARY_LOAN_OPTIONS.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Box>

        <Box sx={{ gridColumn: { xs: "1", sm: "span 2" } }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: "0.12em" }}>
            Métadonnées
          </Typography>
        </Box>
        <Box>
          <TextField
            fullWidth
            select
            label="L'opération inclut-elle des dépendances ?"
            value={form.hasDependencies ? "yes" : "no"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                hasDependencies: e.target.value === "yes",
              }))
            }
            helperText="Garage, parking, cave, etc."
          >
            <MenuItem value="yes">Oui</MenuItem>
            <MenuItem value="no">Non</MenuItem>
          </TextField>
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Identifiant d'opération (optionnel)"
            helperText="Identifiant unique pour l'unicité de l'opération"
            type="text"
            placeholder="OP-2024-001"
            value={form.operationId || ""}
            onChange={field("operationId")}
          />
        </Box>

        <Box sx={{ gridColumn: { xs: "1", sm: "span 2" } }}>
          <Stack direction="row" spacing={2} sx={{ mt: 1, width: "100%" }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ flex: 1 }}
          >
            {loading ? "Calcul…" : "Calculer le PTZ"}
          </Button>
          </Stack>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      )}

      {(eligibilityResult || computeResult) && (
        <Paper
          component="section"
          aria-live="polite"
          variant="outlined"
          sx={{ mt: 5, p: 3, width: "100%" }}
        >
          <Typography
            variant="overline"
            color="primary"
            sx={{ fontWeight: 700, letterSpacing: "0.12em" }}
          >
            Résultat de la simulation PTZ
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              mt: 2,
            }}
          >
            {(() => {
              // Use computeResult as primary source when available, fallback to eligibilityResult
              const isEligible = computeResult?.isEligible ?? eligibilityResult?.isEligible ?? false;
              const maxPtzAmount = computeResult?.maxPtzAmount ?? eligibilityResult?.maxPtzAmount;
              const ptzDuration = computeResult?.ptzDuration ?? eligibilityResult?.ptzDuration;
              const loanPercentage = computeResult?.loanPercentage;
              const durationInfo = computeResult?.durationInfo ?? eligibilityResult?.durationInfo;
              const reasons = computeResult?.reasons ?? eligibilityResult?.reasons;

              return (
                <>
                  <ResultBadge
                    label="Éligible au PTZ"
                    value={isEligible ? "Oui" : "Non"}
                    prominent
                  />
                  {maxPtzAmount !== undefined && (
                    <ResultBadge
                      label="Montant PTZ"
                      value={formatEuros(maxPtzAmount)}
                    />
                  )}
                  {loanPercentage !== undefined && (
                    <ResultBadge
                      label="Pourcentage de financement"
                      value={`${loanPercentage} %`}
                    />
                  )}
                  {ptzDuration && (
                    <ResultBadge
                      label="Durée du PTZ"
                      value={`${ptzDuration} mois`}
                    />
                  )}
                  {durationInfo && (
                    <>
                      <ResultBadge
                        label="Durée totale"
                        value={`${durationInfo.totalDurationMonths} mois`}
                      />
                      <ResultBadge
                        label="Période de différé"
                        value={`${durationInfo.deferredPeriodMonths} mois`}
                      />
                      <ResultBadge
                        label="Période de remboursement"
                        value={`${durationInfo.repaymentPeriodMonths} mois`}
                      />
                      <ResultBadge
                        label="Pourcentage RFR"
                        value={`${(durationInfo.rfrPercentage / 100).toFixed(2)} %`}
                      />
                    </>
                  )}
                  {reasons && reasons.length > 0 && (
                    <Box sx={{ gridColumn: { xs: "1", sm: "span 2" } }}>
                      <Alert severity="info" variant="outlined">
                        <Typography variant="body2">
                          {reasons.join(" • ")}
                        </Typography>
                      </Alert>
                    </Box>
                  )}
                </>
              );
            })()}
          </Box>
        </Paper>
      )}
    </Container>
  );
}
