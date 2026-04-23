"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { FolderOpen, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Project } from "@/types/project";
import { useDeleteProject } from "@/lib/projects";
import Card from "@/components/ui/Card";

interface ProjectCardProps {
  project: Project;
  onRename?: (project: Project) => void;
}

export default function ProjectCard({ project, onRename }: ProjectCardProps) {
  const t = useTranslations("projectsComp");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const deleteMutation = useDeleteProject();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Card className="transition-colors hover:border-[var(--accent)]/30">
      <Link
        href={`/simulation/projects/${project.id}`}
        className="flex items-center gap-4 p-4 no-underline"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius)] bg-[var(--accent)] text-white">
          <FolderOpen className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[var(--foreground)]">
            {project.name}
          </p>
          {project.location && (
            <p className="truncate text-sm text-[var(--foreground)]/60">
              {project.location}
            </p>
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius)] text-[var(--foreground)]/60 transition-colors hover:bg-[var(--foreground)]/5 hover:text-[var(--foreground)]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-[var(--radius)] border border-[var(--border)] bg-white py-1">
              <Link
                href={`/simulation/projects/${project.id}`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--foreground)] no-underline transition-colors hover:bg-[var(--background)]"
                onClick={() => setMenuOpen(false)}
              >
                <FolderOpen className="h-4 w-4 text-[var(--foreground)]/60" />
                {t("action.open")}
              </Link>
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--background)]"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onRename?.(project);
                }}
              >
                <Pencil className="h-4 w-4 text-[var(--foreground)]/60" />
                {t("action.rename")}
              </button>
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  if (confirm(t("confirmDelete", { name: project.name }))) {
                    deleteMutation.mutate(project.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
                {t("action.delete")}
              </button>
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
}
