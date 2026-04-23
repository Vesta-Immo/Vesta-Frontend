"use client";

import { useState } from "react";
import AppNav from "@/components/AppNav";
import Card from "@/components/ui/Card";
import RegionList from "./RegionList";
import { useTranslations } from "next-intl";

export default function PrixImmobilierPage() {
  const t = useTranslations("prixImmobilier");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <AppNav />

      <div className="mx-auto max-w-5xl flex-1 px-4 py-8 md:py-12">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-[var(--muted-foreground)]">
              {t("description")}
            </p>
          </div>

          <Card className="p-6 md:p-10">
            <RegionList
              selectedRegion={selectedRegion}
              onRegionSelect={setSelectedRegion}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
