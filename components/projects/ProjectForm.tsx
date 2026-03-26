// filepath: components/projects/ProjectForm.tsx
"use client";

import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

import { useCreateProject, useUpdateProject } from "@/lib/projects";
import type { CreateProjectInput } from '@/types/project';

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  initialValues?: CreateProjectInput & { id?: string };
}

export default function ProjectForm({ open, onClose, initialValues }: ProjectFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [location, setLocation] = useState(initialValues?.location ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Re-sync state when initialValues changes (e.g., switching between edit targets)
  useEffect(() => {
    setName(initialValues?.name ?? "");
    setLocation(initialValues?.location ?? "");
    setFieldErrors({});
  }, [initialValues]);

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const isEdit = Boolean(initialValues?.id);

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async () => {
    const payload: CreateProjectInput = { name: name.trim(), location: location.trim() || undefined };

    // Basic validation
    const errors: Record<string, string> = {};
    if (!payload.name) errors.name = "Le nom est requis";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (isEdit && initialValues?.id) {
        await updateMutation.mutateAsync({ projectId: initialValues.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      handleClose();
    } catch (err: unknown) {
      const apiErr = err as { details?: Array<{ field: string; message: string }> };
      if (apiErr?.details) {
        const mapped: Record<string, string> = {};
        apiErr.details.forEach((d) => {
          mapped[d.field] = d.message;
        });
        setFieldErrors(mapped);
      }
    }
  };

  const handleClose = () => {
    setName("");
    setLocation("");
    setFieldErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{isEdit ? "Modifier le projet" : "Nouveau projet"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="Nom du projet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={Boolean(fieldErrors.name)}
            helperText={fieldErrors.name}
            fullWidth
            autoFocus
          />
          <TextField
            label="Localisation (optionnel)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            error={Boolean(fieldErrors.location)}
            helperText={fieldErrors.location}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Annuler
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <CircularProgress size={20} /> : isEdit ? "Enregistrer" : "Créer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
