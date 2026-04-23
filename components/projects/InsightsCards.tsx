// filepath: components/projects/InsightsCards.tsx
"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useTranslations, useLocale } from "next-intl";

import type { CompareScenariosInsight, ScenarioComparisonRow } from '@/types/project';

interface InsightsCardsProps {
  insights: CompareScenariosInsight;
  scenarios: ScenarioComparisonRow[];
}

export default function InsightsCards({ insights, scenarios }: InsightsCardsProps) {
  const t = useTranslations("projectsComp");
  const locale = useLocale();
  const fmt = (n: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  const findScenario = (id: string) => scenarios.find((s) => s.scenarioId === id);

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
      {/* Best monthly payment */}
      <Card sx={{ flex: 1 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
            <PaymentsIcon color="success" fontSize="small" />
            <Typography variant="caption" color="text.secondary">
              {t("insight.bestMonthlyPayment")}
            </Typography>
          </Stack>
          <Typography variant="h6" fontWeight={700}>
            {fmt(insights.bestMonthlyPayment.value)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {findScenario(insights.bestMonthlyPayment.scenarioId)?.scenarioName}
          </Typography>
        </CardContent>
      </Card>

      {/* Highest borrowing capacity */}
      <Card sx={{ flex: 1 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
            <AccountBalanceIcon color="primary" fontSize="small" />
            <Typography variant="caption" color="text.secondary">
              {t("insight.highestBorrowingCapacity")}
            </Typography>
          </Stack>
          <Typography variant="h6" fontWeight={700}>
            {fmt(insights.highestBorrowingCapacity.value)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {findScenario(insights.highestBorrowingCapacity.scenarioId)?.scenarioName}
          </Typography>
        </CardContent>
      </Card>

      {/* Budget achat */}
      {insights.highestTotalBudget && (
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
              <TrendingUpIcon color="success" fontSize="small" />
              <Typography variant="caption" color="text.secondary">
                {t("insight.totalBudget")}
              </Typography>
            </Stack>
            <Typography variant="h6" fontWeight={700}>
              {fmt(insights.highestTotalBudget.value)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {findScenario(insights.highestTotalBudget.scenarioId)?.scenarioName}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
