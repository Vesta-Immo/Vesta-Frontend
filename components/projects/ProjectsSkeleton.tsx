export default function ProjectsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-28 animate-pulse rounded-[var(--radius)] bg-[var(--muted)]"
        />
      ))}
    </div>
  );
}
