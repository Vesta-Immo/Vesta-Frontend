// filepath: components/projects/ProjectForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { useCreateProject, useUpdateProject } from "@/lib/projects";
import type { CreateProjectInput } from "@/types/project";
import Button from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/Dialog";

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  initialValues?: CreateProjectInput & { id?: string };
}

export default function ProjectForm({ open, onClose, initialValues }: ProjectFormProps) {
  const t = useTranslations("projectsComp");
  const [name, setName] = useState(initialValues?.name ?? "");
  const [location, setLocation] = useState(initialValues?.location ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setName(initialValues?.name ?? "");
    setLocation(initialValues?.location ?? "");
    setFieldErrors({});
  }, [initialValues]);

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const isEdit = Boolean(initialValues?.id);
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const inputClass = `w-full rounded-[var(--radius)] border bg-white px-3 py-2 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-50`;
  const labelClass = "mb-1 block text-sm font-medium text-[var(--foreground)]";
  const errorClass = "mt-1 text-xs text-red-600";

  const handleSubmit = async () => {
    const payload: CreateProjectInput = { name: name.trim(), location: location.trim() || undefined };

    const errors: Record<string, string> = {};
    if (!payload.name) errors.name = t("validation.nameRequired");
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
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("dialog.editTitle") : t("dialog.newTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className={labelClass}>{t("field.name")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              autoFocus
              className={`${inputClass} ${fieldErrors.name ? "border-red-300" : "border-[var(--border-strong)]"}`}
            />
            {fieldErrors.name && <p className={errorClass}>{fieldErrors.name}</p>}
          </div>
          <div>
            <label className={labelClass}>{t("field.location")}</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isLoading}
              className={`${inputClass} ${fieldErrors.location ? "border-red-300" : "border-[var(--border-strong)]"}`}
            />
            {fieldErrors.location && <p className={errorClass}>{fieldErrors.location}</p>}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
              {t("action.cancel")}
            </Button>
          </DialogClose>
          <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isEdit ? (
              t("action.save")
            ) : (
              t("action.create")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
