import React from "react";

interface ToggleProps {
  label?: string;
  hint?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  trueLabel?: string;
  falseLabel?: string;
}

export default function Toggle({
  label,
  hint,
  value,
  onChange,
  trueLabel = "Oui",
  falseLabel = "Non",
}: ToggleProps) {
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
      <div className="flex gap-1 rounded-[var(--radius)] border border-[var(--border-strong)] p-1">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            value
              ? "bg-[var(--accent)] text-white"
              : "bg-white text-[var(--muted-foreground)] hover:bg-[var(--muted)]/10"
          }`}
        >
          {trueLabel}
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            !value
              ? "bg-[var(--accent)] text-white"
              : "bg-white text-[var(--muted-foreground)] hover:bg-[var(--muted)]/10"
          }`}
        >
          {falseLabel}
        </button>
      </div>
    </div>
  );
}
