"use client";

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import MuiLink from "@mui/material/Link";
import Link from "next/link";
import { getPtzConditions } from "@/lib/simulate";
import { formatEuros } from "@/lib/format";
import type { GetPtzConditionsResult, PtzZone } from "@/types/simulation";
import {
  ComplementaryLoanType,
  PrimoAccedantException,
} from "@/types/simulation";

const ZONE_LABELS: Record<PtzZone, string> = {
  A: "Zone A - Paris et petite couronne",
  A_BIS: "Zone A bis - Paris et petite couronne (renforcée)",
  B1: "Zone B1 - Grandes agglomérations",
  B2: "Zone B2 - Villes moyennes",
  C: "Zone C - Zones rurales",
};

export default function PtzConditionsPage() {
  const [conditions, setConditions] = useState<GetPtzConditionsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConditions() {
      try {
        const data = await getPtzConditions();
        setConditions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    }
    fetchConditions();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!conditions) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="overline"
          color="primary"
          sx={{ fontWeight: 700, letterSpacing: "0.12em" }}
        >
          Conditions
        </Typography>
        <Typography
          variant="h3"
          sx={{ mt: 1, fontSize: { xs: "2rem", sm: "2.5rem" } }}
        >
          Conditions et plafonds du PTZ
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5 }}>
          Le Prêt à Taux Zéro (PTZ) est un prêt sans intérêts destiné aux
          primo-accédants pour l'achat de leur résidence principale.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Vous souhaitez vérifier votre éligibilité ou calculer votre PTZ ?{" "}
          <MuiLink
            component={Link}
            href="/simulation/ptz"
            color="primary"
            underline="always"
            sx={{ fontWeight: 600 }}
          >
            Accéder au simulateur
          </MuiLink>
        </Typography>
      </Box>

      <Stack spacing={4}>
        {/* Caractéristiques générales */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
          >
            Caractéristiques du PTZ
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
              <Typography variant="body1" color="text.secondary">
                Taux d'intérêt
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {conditions.ptzRate === 0 ? "0 % (taux zéro)" : `${(conditions.ptzRate / 100).toFixed(2)} %`}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", py: 1, borderTop: "1px solid", borderColor: "divider" }}>
              <Typography variant="body1" color="text.secondary">
                Durée maximale
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {conditions.maxDurationMonths} mois ({conditions.maxDurationMonths / 12} ans)
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", py: 1, borderTop: "1px solid", borderColor: "divider" }}>
              <Typography variant="body1" color="text.secondary">
                Travaux minimum (bien ancien)
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {conditions.minWorkPercentage} % du coût total
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Exceptions à la primo-accédance */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
          >
            Exceptions à la primo-accédance
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Vous n'êtes pas considéré comme primo-accédant si vous avez déjà été propriétaire de votre résidence principale.
            Cependant, certaines exceptions permettent de bénéficier du PTZ :
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Typography variant="body1" fontWeight={600}>
                • Divorce ou séparation :
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Vous avez divorcé ou vous êtes séparé(e) et vous n'avez plus de droits sur le logement que vous occupiez précédemment.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Typography variant="body1" fontWeight={600}>
                • Catastrophe naturelle :
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Votre précédent logement a été rendu inhabitable suite à une catastrophe naturelle reconnue par arrêté ministériel.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Typography variant="body1" fontWeight={600}>
                • Titulaire d'une carte d'invalidité :
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Vous êtes titulaire d'une carte d'invalidité (taux d'incapacité d'au moins 80 %).
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Durée avec différé selon le RFR */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
          >
            Durée et différé selon le RFR
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            La durée du PTZ et la période de différé dépendent de votre revenu fiscal de référence (RFR) par rapport au plafond de la zone.
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Typography variant="body1" fontWeight={600}>
                • RFR inférieur ou égal à 75 % du plafond :
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Durée totale de 30 ans (360 mois) avec différé de 15 ans (180 mois).
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Typography variant="body1" fontWeight={600}>
                • RFR entre 75 % et 100 % du plafond :
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Durée totale de 25 ans (300 mois) avec différé de 10 ans (120 mois).
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Typography variant="body1" fontWeight={600}>
                • RFR supérieur à 100 % du plafond :
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Durée totale de 20 ans (240 mois) avec différé de 7 ans (84 mois).
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Prêts complémentaires */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
          >
            Prêts complémentaires
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Le PTZ peut être complété par d'autres prêts pour financer votre acquisition.
            Les prêts complémentaires suivants sont possibles :
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Typography variant="body1" fontWeight={600}>
                • PAS (Prêt d'Accession Sociale) :
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Prêt aidé avec des conditions avantageuses, soumis à des plafonds de ressources.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Typography variant="body1" fontWeight={600}>
                • Prêt conventionné :
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Prêt sans plafond de ressources, pouvant bénéficier de l'aide personnalisée au logement (APL).
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Typography variant="body1" fontWeight={600}>
                • Prêt classique :
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Prêt bancaire classique proposé par les établissements de crédit.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Typography variant="body1" fontWeight={600}>
                • PEL (Prêt Épargne Logement) :
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Prêt issu d'un Plan Épargne Logement, avec un taux déterminé à l'ouverture du plan.
              </Typography>
            </Box>
          </Stack>
          <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
            <Typography variant="body2">
              La présence d'un prêt complémentaire peut influencer la durée du PTZ et les conditions de remboursement.
            </Typography>
          </Alert>
        </Paper>

        {/* Plafonds par zone */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
          >
            Plafonds de prix du logement par zone
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Zone</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    1 personne
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    2 personnes
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    3 personnes
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    4 personnes
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    5+ personnes
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(["A", "B1", "B2", "C"] as PtzZone[]).map((zone) => {
                  const zonePlafonds = conditions.plafonds.filter(
                    (p) => p.zone === zone
                  );
                  const getPrice = (size: number) => {
                    const plafond = zonePlafonds.find(
                      (p) => p.householdSize === size
                    );
                    return plafond ? formatEuros(plafond.maxPropertyPrice) : "-";
                  };
                  return (
                    <TableRow key={zone} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {ZONE_LABELS[zone]}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{getPrice(1)}</TableCell>
                      <TableCell align="right">{getPrice(2)}</TableCell>
                      <TableCell align="right">{getPrice(3)}</TableCell>
                      <TableCell align="right">{getPrice(4)}</TableCell>
                      <TableCell align="right">{getPrice(5)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Plafonds de financement */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
          >
            Plafonds de financement (pourcentage du prix)
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Zone</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    1-2 personnes
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    3 personnes
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    4+ personnes
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(["A", "B1", "B2", "C"] as PtzZone[]).map((zone) => {
                  const zonePlafonds = conditions.plafonds.filter(
                    (p) => p.zone === zone
                  );
                  const getPercentage = (size: number) => {
                    const plafond = zonePlafonds.find(
                      (p) => p.householdSize === size
                    );
                    return plafond ? `${plafond.maxLoanPercentage} %` : "-";
                  };
                  return (
                    <TableRow key={zone} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {ZONE_LABELS[zone]}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{getPercentage(2)}</TableCell>
                      <TableCell align="right">{getPercentage(3)}</TableCell>
                      <TableCell align="right">{getPercentage(4)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Plafonds de revenus */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
          >
            Plafonds de revenus fiscaux de référence (RFR)
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Zone</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    1 personne
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    2 personnes
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    3 personnes
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    4 personnes
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    5+ personnes
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(["A", "B1", "B2", "C"] as PtzZone[]).map((zone) => {
                  const zonePlafonds = conditions.plafonds.filter(
                    (p) => p.zone === zone
                  );
                  const getRfr = (size: number) => {
                    const plafond = zonePlafonds.find(
                      (p) => p.householdSize === size
                    );
                    return plafond ? formatEuros(plafond.maxRfr) : "-";
                  };
                  return (
                    <TableRow key={zone} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {ZONE_LABELS[zone]}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{getRfr(1)}</TableCell>
                      <TableCell align="right">{getRfr(2)}</TableCell>
                      <TableCell align="right">{getRfr(3)}</TableCell>
                      <TableCell align="right">{getRfr(4)}</TableCell>
                      <TableCell align="right">{getRfr(5)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>
    </Container>
  );
}
