interface FieldGroupProps {
  label: string;
  hint?: string;
  unit?: string;
  children: React.ReactNode;
}

// Wraps an input or select inside a semantic <label> for accessibility.
export default function FieldGroup({ label, hint, unit, children }: FieldGroupProps) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-[var(--color-foreground)]">
      <span>{label}</span>
      {hint && (
        <span className="text-xs font-normal text-[var(--color-muted)]">
          {hint}
        </span>
      )}
      <div className="relative flex items-center">
        {children}
        {unit && (
          <span className="pointer-events-none absolute right-4 text-xs text-[var(--color-muted)]">
            {unit}
          </span>
        )}
      </div>
    </label>
  );
}
