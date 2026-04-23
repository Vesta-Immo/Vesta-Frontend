"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, ChevronDown } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import Button from "@/components/ui/Button";
import vestaHouseLogo from "@/img/vesta-house-no-bg.png";
import { useTranslations } from "next-intl";

type NavLink = {
  href: string;
  labelKey: string;
  flagship?: boolean;
};

function useNavLinks(): { nav: NavLink[]; outils: NavLink[] } {
  const t = useTranslations("nav");
  return {
    nav: [
      { href: "/simulation/property-list", labelKey: t("buyingTrack") },
      { href: "/simulation/projects", labelKey: t("financingScenarios") },
    ],
    outils: [
      { href: "/outils/capacite-emprunt", labelKey: t("borrowingCapacity") },
      { href: "/outils/prix-immobilier", labelKey: t("propertyPrice") },
      { href: "/simulation/ptz", labelKey: t("ptzSimulator"), flagship: true },
    ],
  };
}

export default function AppNav() {
  const pathname = usePathname();
  const [hideOnScroll, setHideOnScroll] = useState(false);
  const { authLoading, signInWithGoogle, signOut, user } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [outilMenuOpen, setOutilMenuOpen] = useState(false);
  const outilMenuRef = useRef<HTMLDivElement>(null);
  const { nav: NAV_LINKS, outils: OUTILS_LINKS } = useNavLinks();
  const tNav = useTranslations("nav");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleScroll() {
      setHideOnScroll(window.scrollY > 72);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (outilMenuRef.current && !outilMenuRef.current.contains(event.target as Node)) {
        setOutilMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isOutilActive = OUTILS_LINKS.some(
    ({ href }) => pathname === href || pathname.startsWith(href)
  );

  const authButtonLabel = authLoading
    ? "Session"
    : authBusy
      ? user
        ? "Sortie"
        : "Connexion"
      : user
        ? "Deconnexion"
        : "Connexion";

  async function handleSignIn() {
    setAuthBusy(true);
    setAuthError(null);

    const returnTo = typeof window === "undefined"
      ? pathname
      : `${window.location.pathname}${window.location.search}`;

    const { error } = await signInWithGoogle(returnTo);
    if (error) {
      setAuthError(error);
      setAuthBusy(false);
    }
  }

  async function handleSignOut() {
    setAuthBusy(true);
    setAuthError(null);

    try {
      await signOut();
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Deconnexion impossible pour le moment."
      );
    } finally {
      setAuthBusy(false);
    }
  }

  const navLinkClass = (active: boolean, flagship?: boolean) =>
    `relative px-3 py-1.5 text-sm font-medium rounded-[var(--radius)] transition-colors ${
      active || flagship
        ? flagship
          ? active
            ? "bg-[var(--accent)] text-white hover:bg-[#1a3d2f]"
            : "bg-[var(--accent)]/80 text-white hover:bg-[var(--accent)]"
          : "bg-[var(--accent)] text-white hover:bg-[#1a3d2f]"
        : "text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5"
    }`;

  const navLinks = (
    <>
      {NAV_LINKS.map(({ href, labelKey, flagship }) => {
        const active = pathname === href || pathname.startsWith(href);
        return (
          <Link key={href} href={href} className={navLinkClass(active, flagship)}>
            {labelKey}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      <header
        className={`bg-[var(--background)] border-b border-[var(--border)] z-50 transition-transform duration-300 ${
          hideOnScroll ? "-translate-y-full" : "translate-y-0"
        } md:sticky md:top-0 fixed top-0 left-0 right-0`}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-2 sm:gap-4 py-1 sm:py-2 min-h-[56px] sm:min-h-[68px]">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-bold text-[var(--accent)] tracking-tight text-[1.3rem] sm:text-[2rem] shrink-0"
            >
              <Image
                src={vestaHouseLogo}
                alt="Logo Vesta"
                width={30}
                height={30}
                className="h-[1.35rem] sm:h-[1.7rem] w-auto"
              />
              Vesta
            </Link>

            <nav className="hidden md:flex items-center gap-2 flex-wrap flex-1">
              {navLinks}
              <div className="relative" ref={outilMenuRef}>
                <button
                  onClick={() => setOutilMenuOpen((prev) => !prev)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-[var(--radius)] transition-colors ${
                    isOutilActive
                      ? "bg-[var(--accent)] text-white hover:bg-[#1a3d2f]"
                      : "text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5"
                  }`}
                  aria-haspopup="true"
                  aria-expanded={outilMenuOpen}
                >
                  {tNav("tools")}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {outilMenuOpen && (
                  <div className="absolute left-0 mt-1.5 w-56 rounded-[var(--radius)] border border-[var(--border)] bg-white shadow-lg py-1 z-50">
                    {OUTILS_LINKS.map(({ href, labelKey }) => {
                      const active = pathname === href || pathname.startsWith(href);
                      return (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setOutilMenuOpen(false)}
                          className={`block px-3 py-2 text-sm transition-colors ${
                            active
                              ? "bg-[var(--accent)]/10 text-[var(--accent)] font-semibold"
                              : "text-[var(--foreground)] hover:bg-[var(--foreground)]/5"
                          }`}
                        >
                          {labelKey}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>

            <div className="hidden md:flex items-center gap-2 ml-auto">
              <LocaleSwitcher />

              {mounted && user?.email ? (
                  <span className="max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap text-[0.79rem] font-medium tracking-tight text-[var(--muted-foreground)]">
                  {user.email}
                </span>
              ) : null}

              {mounted ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={user ? handleSignOut : handleSignIn}
                  disabled={authLoading || authBusy}
                  className="min-h-[36px] text-[0.84rem] font-semibold tracking-tight"
                >
                  {authButtonLabel}
                </Button>
              ) : null}
            </div>

            <button
              aria-label="Ouvrir le menu"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex md:hidden items-center justify-center p-2 rounded-[var(--radius)] text-[var(--accent)] hover:bg-[var(--foreground)]/5 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {authError ? (
            <div className="mb-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {authError}
            </div>
          ) : null}
        </div>
      </header>

      <div className="md:hidden h-14" />

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[min(88vw,360px)] bg-white shadow-xl p-4 flex flex-col overflow-y-auto">
            <div className="text-xs font-bold text-[var(--foreground)]/60 uppercase tracking-wider px-2 pb-2">
              Navigation
            </div>

            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map(({ href, labelKey }) => {
                const active = pathname === href || pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-[var(--radius)] text-[0.95rem] transition-colors ${
                      active
                        ? "bg-[var(--accent)]/10 text-[var(--accent)] font-bold"
                        : "text-[var(--foreground)] hover:bg-[var(--foreground)]/5 font-medium"
                    }`}
                  >
                    {labelKey}
                  </Link>
                );
              })}
            </nav>

            <div className="text-xs font-bold text-[var(--foreground)]/60 uppercase tracking-wider px-2 pt-4 pb-2">
              {tNav("tools")}
            </div>

            <nav className="flex flex-col gap-1">
              {OUTILS_LINKS.map(({ href, labelKey }) => {
                const active = pathname === href || pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-[var(--radius)] text-[0.95rem] transition-colors ${
                      active
                        ? "bg-[var(--accent)]/10 text-[var(--accent)] font-bold"
                        : "text-[var(--foreground)] hover:bg-[var(--foreground)]/5 font-medium"
                    }`}
                  >
                    {labelKey}
                  </Link>
                );
              })}
            </nav>

            <hr className="my-3 border-[var(--border)]" />

            {mounted && user?.email ? (
              <p className="px-2 pb-2 text-sm text-[var(--foreground)]/60 break-words">
                {user.email}
              </p>
            ) : null}

            {mounted ? (
              <Button
                variant="outline"
                size="sm"
                onClick={user ? handleSignOut : handleSignIn}
                disabled={authLoading || authBusy}
                className="w-full mt-1"
              >
                {authButtonLabel}
              </Button>
            ) : null}

            <div className="mt-3 px-2">
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
