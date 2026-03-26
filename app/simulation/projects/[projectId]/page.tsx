// filepath: app/simulation/projects/[projectId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";

import { useAuth } from "@/components/auth/AuthProvider";
import { useProject, useScenarios } from "@/lib/projects";
import ScenarioCard from "@/components/projects/ScenarioCard";
import ScenarioForm from "@/components/projects/ScenarioForm";
import StalenessBadge from "@/components/projects/StalenessBadge";
import EmptyState from "@/components/projects/EmptyState";
import type { Scenario } from '@/types/project';

export default function ProjectDashboardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const { authLoading, signInWithGoogle, user } = useAuth();
  const [scenarioFormOpen, setScenarioFormOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [selectedScenarioIds, setSelectedScenarioIds] = useState<string[]>([]);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    data: project,
    isLoading: projectLoading,
    isError: projectError,
  } = useProject(projectId);

  const {
    data: scenarios,
    isLoading: scenariosLoading,
  } = useScenarios(projectId);

  async function handleSignIn() {
    setAuthBusy(true);
    setAuthError(null);

    const returnTo = typeof window === "undefined"
      ? pathname
      : `${window.location.pathname}${window.location.search}`;

    const { error: signInError } = await signInWithGoogle(returnTo);
    if (signInError) {
      setAuthError(signInError);
      setAuthBusy(false);
    }
  }

  const toggleScenarioSelection = (id: string) => {
    setSelectedScenarioIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  if (projectError && !projectLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Projet introuvable ou accès non autorisé.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/simulation/projects")}
          sx={{ mt: 2 }}
        >
          Retour aux projets
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {authError && <Alert severity="error" sx={{ mb: 3 }}>{authError}</Alert>}

      {mounted && authLoading ? (
        <Paper sx={{ p: 3.5, mb: 3 }}>
          <Typography color="text.secondary">Vérification de votre session...</Typography>
        </Paper>
      ) : mounted && !user ? (
        <Paper sx={{ p: { xs: 3, sm: 4 }, mb: 3 }}>
          <Stack spacing={2.5} alignItems="flex-start">
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Connectez-vous pour accéder à vos scénarios
              </Typography>
              <Typography color="text.secondary">
                Vos scénarios de financement et vos projets sont disponibles après connexion.
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={handleSignIn}
              disabled={authBusy}
            >
              {authBusy ? "Connexion..." : "Se connecter avec Google"}
            </Button>
          </Stack>
        </Paper>
      ) : null}

      {/* Header */}
      <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/simulation/projects")}
          variant="text"
          size="small"
        >
          Projets
        </Button>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
        <Box>
          {projectLoading ? (
            <Skeleton width={200} />
          ) : (
            <>
              <Typography variant="h4" component="h1" fontWeight={700}>
                {project?.name}
              </Typography>
              {project?.location && (
                <Typography variant="body2" color="text.secondary">
                  {project.location}
                </Typography>
              )}
            </>
          )}
        </Box>
        <Stack direction="row" gap={1}>
          <Button
            variant="text"
            size="small"
            onClick={() => {
              if (selectedScenarioIds.length === scenarios?.length) {
                setSelectedScenarioIds([]);
              } else {
                setSelectedScenarioIds(scenarios?.map((s) => s.id) ?? []);
              }
            }}
          >
            {selectedScenarioIds.length === scenarios?.length ? "Tout désélectionner" : "Tout sélectionner"}
          </Button>
          <Button
            variant="outlined"
            startIcon={<CompareArrowsIcon />}
            disabled={selectedScenarioIds.length < 2}
            onClick={() => {
              const ids = selectedScenarioIds.join(",");
              router.push(`/simulation/projects/${projectId}/compare?ids=${ids}`);
            }}
          >
            Comparer ({selectedScenarioIds.length})
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setScenarioFormOpen(true)}
          >
            Nouveau scénario
          </Button>
        </Stack>
      </Stack>

      {/* Scenario list */}
      {scenariosLoading && (
        <Stack spacing={2}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ))}
        </Stack>
      )}

      {scenariosLoading === false && scenarios?.length === 0 && (
        <EmptyState
          title="Aucun scénario"
          description="Ajoutez un scénario pour calculer votre capacité d'emprunt et comparer différentes configurations."
          action={{
            label: "Créer un scénario",
            onClick: () => setScenarioFormOpen(true),
          }}
        />
      )}

      {scenariosLoading === false && scenarios && scenarios.length > 0 && (
        <Stack spacing={2}>
          {scenarios.map((scenario: Scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              projectId={projectId}
              isSelected={selectedScenarioIds.includes(scenario.id)}
              onToggleSelect={() => toggleScenarioSelection(scenario.id)}
              onEdit={() => {
                setEditingScenario(scenario);
                setScenarioFormOpen(true);
              }}
            />
          ))}
        </Stack>
      )}

      <ScenarioForm
        key={editingScenario?.id ?? "new"}
        open={scenarioFormOpen}
        onClose={() => {
          setScenarioFormOpen(false);
          setEditingScenario(null);
        }}
        projectId={projectId}
        initialValues={editingScenario ? { ...editingScenario.inputParams, id: editingScenario.id, name: editingScenario.name } : undefined}
      />
    </Container>
  );
}
