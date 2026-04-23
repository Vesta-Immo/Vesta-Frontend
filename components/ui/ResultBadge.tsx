interface ResultBadgeProps {
  label: string;
  value: string;
  /** Makes the card visually prominent (dark background). */
  prominent?: boolean;
}

export default function ResultBadge({ label, value, prominent }: ResultBadgeProps) {
  return (
    <div
      className={`rounded-[var(--radius)] p-6 ${
        prominent
          ? "bg-[var(--accent)] text-white"
          : "border border-[var(--border)] bg-white text-[var(--foreground)]"
      }`}
    >
      <p
        className={`mb-1.5 text-[0.68rem] font-bold uppercase tracking-[0.08em] ${
          prominent ? "text-white/70" : "text-[var(--muted-foreground)]"
        }`}
      >
        {label}
      </p>
      <p
        className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold leading-tight"
      >
        {value}
      </p>
    </div>
  );
}
