// filepath: app/simulation/projects/[projectId]/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

export default function ProjectDashboardPage() {
  const router = useRouter();
  const t = useTranslations("projects");

  useEffect(() => {
    router.replace("/simulation/projects");
  }, [router]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3.5 }}>
        <Typography color="text.secondary">
          {t("redirecting")}
        </Typography>
      </Paper>
    </Container>
  );
}
