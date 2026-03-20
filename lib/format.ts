export function formatEuros(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(rate: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(rate) + "\u00a0%";
}

export function formatMonths(months: number): string {
  const years = months / 12;
  return `${years}\u00a0ans (${months}\u00a0mois)`;
}
