"use client";

import Button from "@/components/ui/Button";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">{title}</h2>
      <p className="mb-6 max-w-sm text-sm text-[var(--foreground)]/60">{description}</p>
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
