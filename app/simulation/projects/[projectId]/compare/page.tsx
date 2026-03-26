// filepath: app/simulation/projects/[projectId]/compare/page.tsx
"use client";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

import { useCompareScenarios } from "@/lib/projects";
import CompareTable from "@/components/projects/CompareTable";
import InsightsCards from "@/components/projects/InsightsCards";

function CompareContent() {
  const { projectId } = useParams<{ projectId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const idsParam = searchParams.get("ids") ?? "";
  const scenarioIds = idsParam ? idsParam.split(",").filter(Boolean) : [];

  const { data, isLoading, isError, error } = useCompareScenarios(projectId, scenarioIds);

  if (isError) {
    return (
      <Alert severity="error">
        {error instanceof Error ? error.message : "Erreur lors de la comparaison"}
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
      </Stack>
    );
  }

  if (!data || data.scenarios.length === 0) {
    return (
      <Alert severity="warning">
        Sélectionnez au moins 2 scénarios à comparer.
      </Alert>
    );
  }

  return (
    <>
      <InsightsCards insights={data.insights} scenarios={data.scenarios} />
      <Box sx={{ mt: 3 }}>
        <CompareTable
          scenarios={data.scenarios}
          deltas={data.deltas}
          insights={data.insights}
        />
      </Box>
    </>
  );
}

export default function ComparePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push(`/simulation/projects/${projectId}`)}
          variant="text"
          size="small"
        >
          Projet
        </Button>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          Comparaison de scénarios
        </Typography>
      </Stack>

      <Suspense fallback={<Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />}>
        <CompareContent />
      </Suspense>
    </Container>
  );
}
