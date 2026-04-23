// filepath: app/simulation/projects/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import Skeleton from "@mui/material/Skeleton";

import { useTranslations } from "next-intl";

import { useAuth } from "@/components/auth/AuthProvider";
import AuthPrompt from "@/components/auth/AuthPrompt";
import type { Scenario } from "@/types/project";
import { useScenarios } from "@/lib/projects";
import ScenarioCard from "@/components/projects/ScenarioCard";
import ScenarioForm from "@/components/projects/ScenarioForm";
import EmptyState from "@/components/projects/EmptyState";

export default function ProjectsPage() {
  const t = useTranslations("projects");
  const router = useRouter();
  const { authLoading, user } = useAuth();
  const { data: scenarios, isLoading: scenariosLoading } = useScenarios();
  const [scenarioFormOpen, setScenarioFormOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [selectedScenarioIds, setSelectedScenarioIds] = useState<string[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleScenarioSelection = (id: string) => {
    setSelectedScenarioIds((prev) =>
      prev.includes(id) ? prev.filter((scenarioId) => scenarioId !== id) : [...prev, id],
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {authError && <Alert severity="error" sx={{ mb: 3 }}>{authError}</Alert>}

      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          background:
            "linear-gradient(120deg, rgba(245,124,0,0.10) 0%, rgba(25,118,210,0.08) 100%)",
        }}
      >
        <Stack spacing={1.25}>
          <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: "0.1em" }}>
            {t("header.overline")}
          </Typography>

          <Typography
            variant="h3"
            sx={{ fontSize: { xs: "2rem", sm: "2.6rem" }, lineHeight: 1.1 }}
          >
            {t("header.title")}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {t("header.description")}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {t("header.helper")}
          </Typography>
        </Stack>
      </Paper>

      <Stack spacing={3}>
        {mounted && authLoading ? (
          <Paper sx={{ p: 3.5 }}>
            <Typography color="text.secondary">{t("authLoading")}</Typography>
          </Paper>
        ) : mounted && !user ? (
          <AuthPrompt
            title={t("authPrompt.title")}
            description={t("authPrompt.description")}
          />
        ) : (
          <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" useFlexGap flexWrap="wrap" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<CompareArrowsIcon />}
                disabled={selectedScenarioIds.length < 2}
                onClick={() => {
                  const ids = selectedScenarioIds.join(",");
                  router.push(`/simulation/projects/compare?ids=${ids}`);
                }}
              >
                {t("compare")} ({selectedScenarioIds.length})
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setScenarioFormOpen(true)}
              >
                {t("newScenario")}
              </Button>
            </Stack>

            {scenariosLoading && (
              <Stack spacing={2}>
                {[1, 2, 3].map((index) => (
                  <Skeleton key={index} variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
                ))}
              </Stack>
            )}

            {!scenariosLoading && scenarios?.length === 0 && (
              <EmptyState
                title={t("emptyState.title")}
                description={t("emptyState.description")}
                action={{
                  label: t("emptyState.action"),
                  onClick: () => setScenarioFormOpen(true),
                }}
              />
            )}

            {!scenariosLoading && scenarios && scenarios.length > 0 && (
              <Stack spacing={2}>
                {scenarios.map((scenario) => (
                  <ScenarioCard
                    key={scenario.id}
                    scenario={scenario}
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
          </>
        )}
      </Stack>

      <ScenarioForm
        key={editingScenario?.id ?? "new"}
        open={scenarioFormOpen}
        onClose={() => {
          setScenarioFormOpen(false);
          setEditingScenario(null);
        }}
        initialValues={
          editingScenario
            ? {
                ...editingScenario.inputParams,
                id: editingScenario.id,
                name: editingScenario.name,
              }
            : undefined
        }
      />
    </Container>
  );
}
