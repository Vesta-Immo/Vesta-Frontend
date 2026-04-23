"use client";

import { useEffect, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePropertyListStore } from "@/lib/usePropertyListStore";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import PropertyForm from "@/components/property-list/PropertyForm";
import PropertyListView from "@/components/property-list/PropertyListView";
import type { PropertyItem, PropertyWithResults } from "@/types/simulation";

const FinancingSettingsForm = dynamic(
  () => import("@/components/property-list/FinancingSettingsForm"),
  { ssr: false }
);

export default function PropertyListPage() {
  const t = useTranslations("propertyList");
  const pathname = usePathname();
  const {
    financingSettings,
    properties,
    results,
    loading,
    error,
    loadPropertyList,
    updateFinancingSettings,
    updateProperty,
    removeProperty,
  } = usePropertyListStore();
  const { authLoading, signInWithGoogle, user } = useAuth();
  const [editingProperty, setEditingProperty] = useState<PropertyItem | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [showFinancingProfile, setShowFinancingProfile] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load initial data
  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    loadPropertyList();
  }, [authLoading, loadPropertyList, user]);

  async function handleSaveSettings(settings: typeof financingSettings) {
    if (!settings) return;
    await updateFinancingSettings(settings);
    setShowFinancingProfile(false);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  }

  async function handleAddProperty(property: PropertyItem) {
    await updateProperty(property);
    setShowAddDialog(false);
    setEditingProperty(null);
  }

  async function handleEditProperty(property: PropertyItem) {
    setEditingProperty(property);
    setShowAddDialog(true);
  }

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

  const resultsByPropertyId = (results || []).reduce<Record<string, PropertyWithResults>>(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {}
  );

  const riskyPropertiesCount = (results || []).filter(
    (item) => item.debtRatioLevel === "HIGH"
  ).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-[var(--radius)] border border-[var(--border)] bg-white p-6 sm:p-8">
        <div className="grid gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
            {t("header.overline")}
          </span>

          <h1 className="text-3xl font-bold leading-tight text-[var(--foreground)] sm:text-4xl">
            {t("title", { count: properties.length })}
          </h1>

          <p className="text-[var(--muted-foreground)]">
            {t("header.description")}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {user ? (
              <>
                <Badge variant="outline">
                  {t("chip.propertiesCount", { count: properties.length })}
                </Badge>
                <Badge
                  variant={riskyPropertiesCount > 0 ? "outline" : "accent"}
                  className={
                    riskyPropertiesCount > 0
                      ? "border-red-200 bg-red-50 text-red-700"
                      : ""
                  }
                >
                  {t("chip.riskyPropertiesCount", { count: riskyPropertiesCount })}
                </Badge>
              </>
            ) : null}
          </div>

          <Link
            href="/#mes-pistes-dachat"
            className="self-end rounded-full px-4 py-2 text-xs font-semibold text-[var(--muted-foreground)] transition-colors hover:bg-[var(--foreground)]/5"
          >
            {t("whyThisTool")}
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        {authError && (
          <div className="rounded-[var(--radius)] border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {authError}
          </div>
        )}

        {mounted && authLoading ? (
          <div className="rounded-[var(--radius)] border border-[var(--border)] bg-white p-6">
            <p className="text-[var(--muted-foreground)]">{t("auth.loading")}</p>
          </div>
        ) : mounted && !user ? (
          <div className="rounded-[var(--radius)] border border-[var(--border)] bg-white p-6 sm:p-8">
            <div className="grid gap-4">
              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">
                  {t("authPrompt.title")}
                </h2>
                <p className="text-[var(--muted-foreground)]">
                  {t("authPrompt.description")}
                </p>
              </div>

              <Button onClick={handleSignIn} disabled={authBusy}>
                {authBusy ? t("auth.signingIn") : t("auth.signInWithGoogle")}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {settingsSuccess && (
              <div className="rounded-[var(--radius)] border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                {t("settingsSaved")}
              </div>
            )}

            <Accordion.Root
              type="single"
              collapsible
              value={showFinancingProfile ? "financing" : ""}
              onValueChange={(val) => setShowFinancingProfile(val === "financing")}
            >
              <Accordion.Item
                value="financing"
                className="rounded-[var(--radius)] border border-[var(--border)] bg-white"
              >
                <Accordion.Trigger className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-[var(--foreground)]/5 [&[data-state=open]>svg]:rotate-180">
                  <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
                    <h2 className="text-lg font-bold text-[var(--foreground)]">
                      {t("financingProfile")}
                    </h2>
                    {financingSettings && (
                      <Badge variant="outline">
                        {`${financingSettings.annualRatePercent}% • ${financingSettings.durationMonths} ${t("unit.months")}`}
                      </Badge>
                    )}
                  </div>
                  <ChevronDown className="h-5 w-5 shrink-0 text-[var(--muted-foreground)] transition-transform duration-200" />
                </Accordion.Trigger>
                <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <div className="border-t border-[var(--border)] p-4">
                    <FinancingSettingsForm
                      initialValues={financingSettings || undefined}
                      onSubmit={handleSaveSettings}
                      loading={loading}
                      error={error}
                    />
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>

            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-white p-6">
              <div className="grid gap-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--foreground)]">
                      {t("overview.title")}
                    </h2>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {t("overview.description")}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingProperty(null);
                      setShowAddDialog(true);
                    }}
                  >
                    {t("action.addTrack")}
                  </Button>
                </div>

                {error && (
                  <div className="rounded-[var(--radius)] border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                    {error}
                  </div>
                )}

                {!financingSettings && (
                  <div className="rounded-[var(--radius)] border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                    {t("info.configureFinancing")}
                  </div>
                )}

                {financingSettings && !results && (
                  <div className="rounded-[var(--radius)] border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                    {t("info.addOrEditTrack")}
                  </div>
                )}

                {loading ? (
                  <p className="text-[var(--muted-foreground)]">{t("loading")}</p>
                ) : (
                  <PropertyListView
                    properties={properties}
                    resultsByPropertyId={resultsByPropertyId}
                    onEdit={handleEditProperty}
                    onDelete={removeProperty}
                    loading={loading}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <Dialog
        open={user ? showAddDialog : false}
        onOpenChange={setShowAddDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProperty ? t("dialog.editTrack") : t("dialog.addTrack")}
            </DialogTitle>
          </DialogHeader>
          <PropertyForm
            initialValues={editingProperty || undefined}
            onSubmit={handleAddProperty}
            loading={loading}
            error={error}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
