import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  unit?: string;
}

export default function Input({
  label,
  hint,
  unit,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="grid gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[var(--foreground)]">
          {label}
        </label>
      )}
      {hint && (
        <span className="text-xs text-[var(--muted)]">{hint}</span>
      )}
      <div className="relative flex items-center">
        <input
          className={`w-full rounded-[var(--radius)] border border-[var(--border-strong)] bg-white px-4 py-3 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 ${className}`}
          {...props}
        />
        {unit && (
          <span className="pointer-events-none absolute right-4 text-xs text-[var(--muted)]">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
