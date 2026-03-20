import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface ResultBadgeProps {
  label: string;
  value: string;
  /** Makes the card visually prominent (dark background). */
  prominent?: boolean;
}

export default function ResultBadge({ label, value, prominent }: ResultBadgeProps) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: prominent ? "primary.main" : "background.paper",
        border: prominent ? "none" : "1px solid",
        borderColor: "divider",
        color: prominent ? "common.white" : "text.primary",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontSize: "0.68rem",
          color: prominent ? "rgba(255,255,255,0.7)" : "text.secondary",
          mb: 0.75,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontFamily: "var(--font-fraunces)",
          fontWeight: 600,
          color: "inherit",
          lineHeight: 1.2,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
