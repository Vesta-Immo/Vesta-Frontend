"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Plus, ArrowLeftRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { useAuth } from "@/components/auth/AuthProvider";
import AuthPrompt from "@/components/auth/AuthPrompt";
import type { Scenario } from "@/types/project";
import { useScenarios } from "@/lib/projects";
import ScenarioCard from "@/components/projects/ScenarioCard";
import ScenarioForm from "@/components/projects/ScenarioForm";
import EmptyState from "@/components/projects/EmptyState";
import ProjectsSkeleton from "@/components/projects/ProjectsSkeleton";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

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
    <div className="max-w-5xl mx-auto px-6 pt-20 pb-12">
      {authError && (
        <div className="mb-6 rounded-[var(--radius)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {authError}
        </div>
      )}

      <Card className="mb-8 p-6 sm:p-8">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--accent)]">
            {t("header.overline")}
          </span>
          <h1 className="text-[2rem] sm:text-[2.6rem] font-bold leading-tight text-[var(--foreground)]">
            {t("header.title")}
          </h1>
          <p className="text-[var(--foreground)]/70">
            {t("header.description")}
          </p>
          <p className="text-sm text-[var(--foreground)]/60">
            {t("header.helper")}
          </p>
        </div>
      </Card>

      <div className="space-y-6">
        {mounted && authLoading ? (
          <Card className="p-6">
            <p className="text-[var(--foreground)]/60">{t("authLoading")}</p>
          </Card>
        ) : mounted && !user ? (
          <AuthPrompt
            title={t("authPrompt.title")}
            description={t("authPrompt.description")}
          />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={selectedScenarioIds.length < 2}
                onClick={() => {
                  const ids = selectedScenarioIds.join(",");
                  router.push(`/simulation/projects/compare?ids=${ids}`);
                }}
              >
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                {t("compare")} ({selectedScenarioIds.length})
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setScenarioFormOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("newScenario")}
              </Button>
            </div>

            {scenariosLoading && <ProjectsSkeleton />}

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
              <div className="space-y-5">
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
              </div>
            )}
          </>
        )}
      </div>

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
    </div>
  );
}
