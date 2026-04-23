"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import AppNav from "@/components/AppNav";
import Card from "@/components/ui/Card";
import { ArrowRight, Calculator, MapPin } from "lucide-react";
import type { ReactNode } from "react";

export default function Home() {
  const t = useTranslations("home");

  const buyingTrackItems = t.raw("buyingTrack.items") as Array<{
    title: string;
    description: string;
  }>;

  const scenariosItems = t.raw("scenarios.items") as Array<{
    title: string;
    description: string;
  }>;

  const supportTools: Array<{
    href: string;
    key: string;
    icon: ReactNode;
  }> = [
    {
      href: "/outils/capacite-emprunt",
      key: "borrowingCapacity",
      icon: <Calculator className="h-5 w-5" />,
    },
    {
      href: "/outils/prix-immobilier",
      key: "propertyPrice",
      icon: <MapPin className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <AppNav />

      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 md:py-24">
        <Card className="mb-10 scroll-mt-20">
          <div className="p-6 sm:p-8 md:p-10">
            <div className="flex max-w-4xl flex-col gap-6">
              <h1 className="mt-1 text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[2.5rem] md:text-[2.75rem]">
                {t("hero.title")}
              </h1>

              <p className="text-[1.05rem] leading-[1.7] text-[var(--muted)] max-w-2xl">
                {t("hero.description")}
              </p>

              <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3 md:gap-8">
                {buyingTrackItems.map(({ title, description }) => (
                  <div key={title} className="flex flex-col gap-1.5">
                    <p className="text-sm font-bold text-[var(--foreground)]">
                      {title}
                    </p>
                    <p className="text-sm leading-[1.7] text-[var(--muted)]">
                      {description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Link
                  href="/simulation/property-list"
                  className="inline-flex items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-7 py-3 text-base font-semibold text-[var(--accent-foreground)] transition-colors hover:bg-[#1a3d2f]"
                >
                  {t("hero.cta")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Card>

        <Card className="mb-10 scroll-mt-20">
          <div className="p-6 sm:p-8 md:p-10">
            <div className="flex max-w-4xl flex-col gap-6">
              <h2 className="text-[1.6rem] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[2rem] md:text-[2.25rem]">
                {t("scenarios.title")}
              </h2>

              <p className="text-[1.05rem] leading-[1.7] text-[var(--muted)] max-w-2xl">
                {t("scenarios.description")}
              </p>

              <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3 md:gap-8">
                {scenariosItems.map(({ title, description }) => (
                  <div key={title} className="flex flex-col gap-1.5">
                    <p className="text-sm font-bold text-[var(--foreground)]">
                      {title}
                    </p>
                    <p className="text-sm leading-[1.7] text-[var(--muted)]">
                      {description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Link
                  href="/simulation/projects"
                  className="inline-flex items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-7 py-3 text-base font-semibold text-[var(--accent-foreground)] transition-colors hover:bg-[#1a3d2f]"
                >
                  {t("scenarios.cta")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Card>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--foreground)]">
            {t("tools.title")}
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {t("tools.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {supportTools.map(({ href, key, icon }) => {
            const tool = t.raw(`supportTools.${key}`) as {
              step: string;
              title: string;
              description: string;
              fields: string[];
            };
            return (
              <Card key={href}>
                <Link
                  href={href}
                  className="flex h-full flex-col items-start p-6 transition-colors hover:bg-[var(--foreground)]/5 md:p-8"
                >
                  <div className="flex w-full flex-1 flex-col">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                      {icon}
                    </div>

                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] opacity-45">
                      {tool.step}
                    </span>

                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.01em] text-[var(--foreground)]">
                      {tool.title}
                    </h3>

                    <p className="mt-3 flex-1 text-sm leading-[1.75] text-[var(--muted)]">
                      {tool.description}
                    </p>

                    <div className="mt-6 flex flex-col gap-2">
                      {tool.fields.map((f: string) => (
                        <div key={f} className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] opacity-50" />
                          <span className="text-sm text-[var(--muted)]">
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center gap-1 text-[var(--accent)]">
                      <span className="text-sm font-semibold">
                        {t("tools.simulate")}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
