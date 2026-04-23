// filepath: app/simulation/projects/[projectId]/compare/page.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("compare");

  useEffect(() => {
    const idsParam = searchParams.get("ids");
    const target = idsParam
      ? `/simulation/projects/compare?ids=${encodeURIComponent(idsParam)}`
      : "/simulation/projects/compare";
    router.replace(target);
  }, [router, searchParams]);

  return (
    <div className="mx-auto max-w-3xl px-6 pt-20 pb-12">
      <p className="text-sm text-[var(--muted-foreground)]">
        {t("redirecting")}
      </p>
    </div>
  );
}
