"use client";

import { RefreshCw, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Badge from "@/components/ui/Badge";

interface StalenessBadgeProps {
  onRecalculate: () => void;
  isRecomputing?: boolean;
}

export default function StalenessBadge({ onRecalculate, isRecomputing }: StalenessBadgeProps) {
  const t = useTranslations("projectsComp");

  if (isRecomputing) {
    return (
      <Badge variant="outline" className="cursor-default">
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
        {t("badge.recalculating")}
      </Badge>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onRecalculate();
      }}
      title={t("badge.tooltip")}
      className="inline-flex cursor-pointer items-center border-0 bg-transparent p-0"
    >
      <Badge variant="outline" className="hover:bg-[var(--background)]">
        <RefreshCw className="mr-1 h-3 w-3" />
        {t("badge.stale")}
      </Badge>
    </button>
  );
}
