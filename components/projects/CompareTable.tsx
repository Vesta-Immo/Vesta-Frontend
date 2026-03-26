// filepath: components/projects/CompareTable.tsx
"use client";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Stack from "@mui/material/Stack";

import type {
  ScenarioComparisonRow,
  ScenarioDelta,
  CompareScenariosInsight,
} from '@/types/project';

interface CompareTableProps {
  scenarios: ScenarioComparisonRow[];
  deltas: Record<string, ScenarioDelta>;
  insights: CompareScenariosInsight;
}

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function DeltaChip({ value }: { value: number }) {
  if (value === 0) return null;
  const isPositive = value > 0;
  return (
    <Chip
      icon={isPositive ? <ArrowUpwardIcon sx={{ fontSize: 12 }} /> : <ArrowDownwardIcon sx={{ fontSize: 12 }} />}
      label={fmt(Math.abs(value))}
      size="small"
      color={isPositive ? "success" : "error"}
      variant="outlined"
      sx={{ ml: 0.5, height: 20, fontSize: "0.7rem" }}
    />
  );
}

export default function CompareTable({
  scenarios,
  deltas,
  insights,
}: CompareTableProps) {
  const fmtYears = (months: number) => `${months / 12} ans`;

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow sx={{ "& th": { bgcolor: "grey.50", fontWeight: 600 } }}>
            <TableCell sx={{ minWidth: 140 }}>Paramètre</TableCell>
            {scenarios.map((s) => (
              <TableCell key={s.scenarioId} align="center" sx={{ minWidth: 140 }}>
                <Stack alignItems="center" gap={0.5}>
                  <Typography variant="body2" fontWeight={600}>
                    {s.scenarioName}
                  </Typography>
                </Stack>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* ── Inputs ── */}
          <TableRow>
            <TableCell colSpan={scenarios.length + 1} sx={{ py: 0.5, bgcolor: "grey.100", fontWeight: 700, fontSize: "0.75rem" }}>
              ENTRÉES
            </TableCell>
          </TableRow>
          <TableRow sx={{ "& td": { borderRight: "1px solid", borderColor: "divider" } }}>
            <TableCell sx={{ fontWeight: 500 }}>Revenus annuels</TableCell>
            {scenarios.map((s) => (
              <TableCell key={s.scenarioId} align="center">
                {fmt(s.annualHouseholdIncome)}
              </TableCell>
            ))}
          </TableRow>
          <TableRow sx={{ "& td": { borderRight: "1px solid", borderColor: "divider" } }}>
            <TableCell sx={{ fontWeight: 500 }}>Durée</TableCell>
            {scenarios.map((s) => (
              <TableCell key={s.scenarioId} align="center">
                {fmtYears(s.durationMonths)}
              </TableCell>
            ))}
          </TableRow>
          <TableRow sx={{ "& td": { borderRight: "1px solid", borderColor: "divider" } }}>
            <TableCell sx={{ fontWeight: 500 }}>Taux annuel</TableCell>
            {scenarios.map((s) => (
              <TableCell key={s.scenarioId} align="center">
                {s.annualRatePercent.toFixed(2)}%
              </TableCell>
            ))}
          </TableRow>
          <TableRow sx={{ "& td": { borderRight: "1px solid", borderColor: "divider" } }}>
            <TableCell sx={{ fontWeight: 500 }}>Apport</TableCell>
            {scenarios.map((s) => (
              <TableCell key={s.scenarioId} align="center">
                {fmt(s.downPayment)}
              </TableCell>
            ))}
          </TableRow>

          {/* ── Outputs ── */}
          <TableRow>
            <TableCell colSpan={scenarios.length + 1} sx={{ py: 0.5, bgcolor: "grey.100", fontWeight: 700, fontSize: "0.75rem" }}>
              RÉSULTATS
            </TableCell>
          </TableRow>
          <TableRow sx={{ "& td": { borderRight: "1px solid", borderColor: "divider" } }}>
            <TableCell sx={{ fontWeight: 500 }}>Capacité d&apos;emprunt</TableCell>
            {scenarios.map((s) => {
              const isBest = s.scenarioId === insights.highestBorrowingCapacity.scenarioId;
              const delta = deltas[s.scenarioId];
              return (
                <TableCell key={s.scenarioId} align="center">
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="body2" fontWeight={isBest ? 700 : 400}>
                      {fmt(s.borrowingCapacity)}
                    </Typography>
                    {delta && !s.isBaseline && <DeltaChip value={delta.borrowingCapacityDelta} />}
                  </Box>
                </TableCell>
              );
            })}
          </TableRow>
          <TableRow sx={{ "& td": { borderRight: "1px solid", borderColor: "divider" } }}>
            <TableCell sx={{ fontWeight: 500 }}>Mensualité</TableCell>
            {scenarios.map((s) => {
              const isBest = s.scenarioId === insights.bestMonthlyPayment.scenarioId;
              const delta = deltas[s.scenarioId];
              return (
                <TableCell key={s.scenarioId} align="center">
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="body2" fontWeight={isBest ? 700 : 400}>
                      {fmt(s.monthlyCreditPayment)}
                    </Typography>
                    {delta && !s.isBaseline && <DeltaChip value={delta.monthlyPaymentDelta} />}
                  </Box>
                </TableCell>
              );
            })}
          </TableRow>
          <TableRow sx={{ "& td": { borderRight: "1px solid", borderColor: "divider" } }}>
            <TableCell sx={{ fontWeight: 500 }}>Budget achat</TableCell>
            {scenarios.map((s) => {
              const isBest = s.scenarioId === insights.highestTotalBudget.scenarioId;
              const delta = deltas[s.scenarioId];
              return (
                <TableCell key={s.scenarioId} align="center">
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="body2" fontWeight={isBest ? 700 : 400}>
                      {fmt(s.totalBudget)}
                    </Typography>
                    {delta && !s.isBaseline && <DeltaChip value={delta.totalBudgetDelta} />}
                  </Box>
                </TableCell>
              );
            })}
          </TableRow>
          <TableRow sx={{ "& td": { borderRight: "1px solid", borderColor: "divider" } }}>
            <TableCell sx={{ fontWeight: 500 }}>Frais de notaire</TableCell>
            {scenarios.map((s) => (
              <TableCell key={s.scenarioId} align="center">
                {fmt(s.notaryFees)}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
