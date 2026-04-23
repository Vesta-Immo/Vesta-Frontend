import { useLocale } from "next-intl";

export function formatEuros(amount: number, locale?: string): string {
  return new Intl.NumberFormat(locale || "fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(rate: number, locale?: string): string {
  return new Intl.NumberFormat(locale || "fr-FR", {
    style: "decimal",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(rate) + "\u00a0%";
}

export function formatMonths(months: number, locale?: string): string {
  const years = months / 12;
  const isFr = (locale || "fr").startsWith("fr");
  if (isFr) {
    return `${years}\u00a0ans (${months}\u00a0mois)`;
  }
  return `${years}\u00a0years (${months}\u00a0months)`;
}

export function useFormat() {
  const locale = useLocale();
  return {
    formatEuros: (amount: number) => formatEuros(amount, locale),
    formatPercent: (rate: number) => formatPercent(rate, locale),
    formatMonths: (months: number) => formatMonths(months, locale),
  };
}
