// filepath: app/simulation/projects/page.tsx
"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";

import type { Project } from "@/types/project";
import { useProjects } from "@/lib/projects";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectForm from "@/components/projects/ProjectForm";
import ProjectsSkeleton from "@/components/projects/ProjectsSkeleton";
import EmptyState from "@/components/projects/EmptyState";

export default function ProjectsPage() {
  const { data: projects, isLoading, isError, error } = useProjects();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          Scénarios financement
        </Typography>
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
