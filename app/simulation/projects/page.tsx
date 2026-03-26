// filepath: app/simulation/projects/page.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";

import { useAuth } from "@/components/auth/AuthProvider";
import type { Project } from "@/types/project";
import { useProjects } from "@/lib/projects";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectForm from "@/components/projects/ProjectForm";
import ProjectsSkeleton from "@/components/projects/ProjectsSkeleton";
import EmptyState from "@/components/projects/EmptyState";

export default function ProjectsPage() {
  const pathname = usePathname();
  const { authLoading, signInWithGoogle, user } = useAuth();
  const { data: projects, isLoading, isError, error } = useProjects();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            Simulation financement
          </Typography>

          <Typography
            variant="h3"
            sx={{ fontSize: { xs: "2rem", sm: "2.6rem" }, lineHeight: 1.1 }}
          >
            Scénarios financement
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Créez des projets et comparez différents scénarios de financement pour trouver
            la configuration qui correspond le mieux à votre situation.
          </Typography>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ pt: 0.5 }}>
            {user ? (
              <Chip label={`Projets: ${projects?.length ?? 0}`} variant="outlined" />
            ) : null}
          </Stack>

          <Button
            component={Link}
            href="/#scenarios-financement"
            variant="text"
            color="primary"
            size="small"
            sx={{
              alignSelf: "flex-end",
              mt: 0.5,
              px: 1.5,
              py: 0.6,
              minHeight: 36,
              borderRadius: 999,
              fontSize: "0.84rem",
              fontWeight: 600,
              textTransform: "none",
              color: "text.secondary",
              bgcolor: "transparent",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "rgba(25, 118, 210, 0.05)",
                boxShadow: "none",
              },
            }}
          >
            Pourquoi cet outil ?
          </Button>
        </Stack>
      </Paper>

      <Stack spacing={3}>
        {mounted && authLoading ? (
          <Paper sx={{ p: 3.5 }}>
            <Typography color="text.secondary">Vérification de votre session...</Typography>
          </Paper>
        ) : mounted && !user ? (
          <Paper sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={2.5} alignItems="flex-start">
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Connectez-vous pour accéder à vos projets
                </Typography>
                <Typography color="text.secondary">
                  Vos projets et scénarios de financement sont disponibles après connexion.
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
        ) : (
          <>
            <Stack direction="row" justifyContent="flex-end" alignItems="center">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateOpen(true)}
              >
                Nouveau projet
              </Button>
            </Stack>

            {isLoading && <ProjectsSkeleton />}

            {isError && !isLoading && (
              <EmptyState
                title="Erreur de chargement"
                description={error instanceof Error ? error.message : "Impossible de charger vos projets."}
                action={{
                  label: "Réessayer",
                  onClick: () => window.location.reload(),
                }}
              />
            )}

            {!isLoading && !isError && projects?.length === 0 && (
              <EmptyState
                title="Aucun projet"
                description="Créez votre premier projet pour comparer des scénarios de financement."
                action={{
                  label: "Créer un projet",
                  onClick: () => setCreateOpen(true),
                }}
              />
            )}

            {!isLoading && !isError && projects && projects.length > 0 && (
              <Stack spacing={2}>
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onRename={(p) => {
                      setEditingProject(p);
                      setCreateOpen(true);
                    }}
                  />
                ))}
              </Stack>
            )}
          </>
        )}
      </Stack>

      <ProjectForm
        open={createOpen || Boolean(editingProject)}
        onClose={() => {
          setCreateOpen(false);
          setEditingProject(null);
        }}
        initialValues={editingProject ?? undefined}
      />
    </Container>
  );
}
