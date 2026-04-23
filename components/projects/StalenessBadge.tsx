// filepath: components/projects/StalenessBadge.tsx
"use client";

import Chip from "@mui/material/Chip";
import RefreshIcon from "@mui/icons-material/Refresh";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import { useTranslations } from "next-intl";

interface StalenessBadgeProps {
  onRecalculate: () => void;
  isRecomputing?: boolean;
}

export default function StalenessBadge({ onRecalculate, isRecomputing }: StalenessBadgeProps) {
  const t = useTranslations("projectsComp");

  if (isRecomputing) {
    return (
      <Chip
        icon={<CircularProgress size={12} />}
        label={t("badge.recalculating")}
        size="small"
        color="warning"
        variant="outlined"
      />
    );
  }

  return (
    <Tooltip title={t("badge.tooltip")}>
      <Chip
        icon={<RefreshIcon sx={{ fontSize: 14 }} />}
        label={t("badge.stale")}
        size="small"
        color="warning"
        variant="outlined"
        onClick={(e) => {
          e.stopPropagation();
          onRecalculate();
        }}
        sx={{ cursor: "pointer" }}
      />
    </Tooltip>
  );
}
