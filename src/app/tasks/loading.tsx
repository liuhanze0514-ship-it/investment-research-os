export default function TasksLoading() {
  return (
    <div className="space-y-4">
      <div className="h-9 w-36 animate-pulse rounded-md bg-secondary" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-lg border bg-card" />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-lg border bg-card" />
    </div>
  );
}
