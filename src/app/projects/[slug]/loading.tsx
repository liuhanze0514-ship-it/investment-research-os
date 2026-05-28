export default function ProjectDetailLoading() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-24 animate-pulse rounded-md bg-secondary" />
      <div className="h-48 animate-pulse rounded-lg border bg-card" />
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-52 animate-pulse rounded-lg border bg-card" />
        ))}
      </div>
    </div>
  );
}
