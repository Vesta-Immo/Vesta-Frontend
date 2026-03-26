// filepath: components/projects/StalenessBadge.tsx
"use client";

import Chip from "@mui/material/Chip";
import RefreshIcon from "@mui/icons-material/Refresh";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";

interface StalenessBadgeProps {
  onRecalculate: () => void;
  isRecomputing?: boolean;
}

export default function StalenessBadge({ onRecalculate, isRecomputing }: StalenessBadgeProps) {
  if (isRecomputing) {
    return (
      <Chip
        icon={<CircularProgress size={12} />}
        label="Recalcul..."
        size="small"
        color="warning"
        variant="outlined"
      />
    );
  }

  return (
    <Tooltip title="Les règles de calcul ont peut-être changé. Cliquez pour recalculer.">
      <Chip
        icon={<RefreshIcon sx={{ fontSize: 14 }} />}
        label="Stale"
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
