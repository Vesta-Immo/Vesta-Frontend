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
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import type { Scenario } from '@/types/project';
import { isStale, formatComputedAt } from '@/types/project';
import { useDeleteScenario, useCopyScenario, useRecomputeScenario } from "@/lib/projects";
import { useCreateOrUpdateProfileFromScenario, useActiveFinancingProfile } from "@/lib/financingProfile";
import StalenessBadge from "./StalenessBadge";

interface ScenarioCardProps {
  scenario: Scenario;
  projectId: string;
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: () => void;
}

export default function ScenarioCard({
  scenario,
  projectId,
  isSelected,
  onToggleSelect,
  onEdit,
}: ScenarioCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const deleteMutation = useDeleteScenario();
  const copyMutation = useCopyScenario();
  const recomputeMutation = useRecomputeScenario();
  const createOrUpdateProfileMutation = useCreateOrUpdateProfileFromScenario();
  const { data: activeProfile } = useActiveFinancingProfile();

  const isActiveProfile = activeProfile?.sourceScenarioId === scenario.id;

  const hasResult = Boolean(scenario.outputResult);
  const stale = isStale(scenario.computedAt);

  const fmt = (n: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

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
                    label="Baseline"
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {isActiveProfile && (
                  <Chip
                    icon={<AccountBalanceWalletIcon sx={{ fontSize: 14 }} />}
                    label="Profil actif"
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                )}
                {stale && hasResult && (
                  <StalenessBadge
                    onRecalculate={() =>
                      recomputeMutation.mutate({ projectId, scenarioId: scenario.id })
                    }
                    isRecomputing={recomputeMutation.isPending}
                  />
                )}
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {scenario.inputParams.durationMonths / 12} ans · {scenario.inputParams.annualRatePercent}% ·{" "}
                {fmt(scenario.inputParams.downPayment)} d'apport
              </Typography>

              {hasResult && scenario.outputResult && (
                <Stack direction="row" gap={3} sx={{ mt: 1.5 }} flexWrap="wrap">
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Capacité d&apos;emprunt
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {fmt(scenario.outputResult.borrowingCapacity)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Mensualité
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {fmt(scenario.outputResult.monthlyCreditPayment)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Budget total
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {fmt(scenario.outputResult.totalBudget)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Calculé
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatComputedAt(scenario.computedAt)}
                    </Typography>
                  </Box>
                </Stack>
              )}

              {!hasResult && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Non calculé — ouvrez pour calculer
                </Typography>
              )}

              {/* Bouton définir comme profil */}
              {hasResult && !isActiveProfile && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={createOrUpdateProfileMutation.isPending ? undefined : <AccountBalanceWalletIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      createOrUpdateProfileMutation.mutate({
                        projectId,
                        scenarioId: scenario.id,
                        scenarioName: scenario.name,
                      });
                    }}
                    disabled={createOrUpdateProfileMutation.isPending}
                  >
                    {createOrUpdateProfileMutation.isPending ? 'Mise à jour...' : 'Définir comme profil par défaut'}
                  </Button>
                </Box>
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
          Modifier
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            copyMutation.mutate({ projectId, scenarioId: scenario.id });
          }}
        >
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          Dupliquer
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            if (confirm(`Supprimer "${scenario.name}" ?`)) {
              deleteMutation.mutate({ projectId, scenarioId: scenario.id });
            }
          }}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Supprimer
        </MenuItem>
      </Menu>
    </>
  );
}
