// filepath: components/projects/ScenarioCard.tsx
"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Scenario } from '@/types/project';
import { isStale } from '@/types/project';
import { useDeleteScenario, useCopyScenario, useRecomputeScenario } from "@/lib/projects";
import StalenessBadge from "./StalenessBadge";

interface ScenarioCardProps {
  scenario: Scenario;
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: () => void;
}

function useFormatComputedAt() {
  const t = useTranslations("projectsComp");
  const locale = useLocale();

  return (computedAt: string | null): string => {
    if (!computedAt) return t("notComputed");
    const date = new Date(computedAt);
    const diffMs = Date.now() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return t("computedToday");
    if (diffDays === 1) return t("computedYesterday");
    if (diffDays < 7) return t("computedDaysAgo", { days: diffDays });
    if (diffDays < 30) return t("computedWeeksAgo", { weeks: Math.floor(diffDays / 7) });
    return t("computedOnDate", { date: date.toLocaleDateString(locale) });
  };
}

export default function ScenarioCard({
  scenario,
  isSelected,
  onToggleSelect,
  onEdit,
}: ScenarioCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const deleteMutation = useDeleteScenario();
  const copyMutation = useCopyScenario();
  const recomputeMutation = useRecomputeScenario();
  const t = useTranslations("projectsComp");
  const locale = useLocale();
  const formatComputedAt = useFormatComputedAt();

  const hasResult = Boolean(scenario.outputResult);
  const stale = isStale(scenario.computedAt);

  const fmt = (n: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <Card
        sx={{
          border: isSelected ? "2px solid" : "1px solid",
          borderColor: isSelected ? "primary.main" : "divider",
          transition: "border-color 0.2s, box-shadow 0.2s",
          "&:hover": { boxShadow: 2 },
        }}
      >
        <CardContent sx={{ pb: "16px !important" }}>
          <Stack direction="row" alignItems="flex-start" gap={1}>
            <Checkbox
              checked={isSelected}
              onChange={onToggleSelect}
              sx={{ mt: -0.5, p: 0 }}
            />

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                <Typography variant="subtitle1" fontWeight={600} noWrap>
                  {scenario.name}
                </Typography>
                {scenario.isBaseline && (
                  <Chip
                    icon={<StarIcon sx={{ fontSize: 14 }} />}
                    label={t("baseline")}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {stale && hasResult && (
                  <StalenessBadge
                    onRecalculate={() => recomputeMutation.mutate(scenario.id)}
                    isRecomputing={recomputeMutation.isPending}
                  />
                )}
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {t("scenarioSubtitle", {
                  years: scenario.inputParams.durationMonths / 12,
                  rate: scenario.inputParams.annualRatePercent,
                  downPayment: fmt(scenario.inputParams.downPayment),
                })}
              </Typography>

              {hasResult && scenario.outputResult && (
                <Stack direction="row" gap={3} sx={{ mt: 1.5 }} flexWrap="wrap">
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t("table.borrowingCapacity")}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {fmt(scenario.outputResult.borrowingCapacity)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t("table.monthlyPayment")}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {fmt(scenario.outputResult.monthlyCreditPayment)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t("table.totalBudget")}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {fmt(scenario.outputResult.totalBudget)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t("computed")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatComputedAt(scenario.computedAt)}
                    </Typography>
                  </Box>
                </Stack>
              )}

              {!hasResult && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {t("notComputed")}
                </Typography>
              )}
            </Box>

            <IconButton
              edge="end"
              onClick={(e) => {
                e.stopPropagation();
                setAnchorEl(e.currentTarget);
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Stack>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onEdit();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          {t("action.edit")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            copyMutation.mutate(scenario.id);
          }}
        >
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          {t("action.duplicate")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            if (confirm(t("confirmDelete", { name: scenario.name }))) {
              deleteMutation.mutate(scenario.id);
            }
          }}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          {t("action.delete")}
        </MenuItem>
      </Menu>
    </>
  );
}
