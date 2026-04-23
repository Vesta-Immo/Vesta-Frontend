"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function handleSwitch(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
    setOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1 min-w-[36px] px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors rounded-[var(--radius)] hover:bg-[var(--foreground)]/5"
      >
        <Globe className="w-4 h-4" />
        {locale}
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-40 rounded-[var(--radius)] border border-[var(--border)] bg-white shadow-lg py-1 z-50">
          {routing.locales.map((l) => (
            <button
              key={l}
              onClick={() => handleSwitch(l)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                l === locale
                  ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                  : "text-[var(--foreground)] hover:bg-[var(--foreground)]/5"
              }`}
            >
              {l === "fr" ? "Fran\u00e7ais" : "English"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
