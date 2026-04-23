// filepath: app/simulation/projects/[projectId]/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function ProjectDashboardPage() {
  const router = useRouter();
  const t = useTranslations("projects");

  useEffect(() => {
    router.replace("/simulation/projects");
  }, [router]);

  return (
    <div className="mx-auto max-w-3xl px-6 pt-20 pb-12">
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-6">
        <p className="text-sm text-[var(--muted-foreground)]">
          {t("redirecting")}
        </p>
      </div>
    </div>
  );
}
