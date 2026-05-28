export default function ProjectsLoading() {
  return (
    <div className="space-y-4">
      <div className="h-9 w-52 animate-pulse rounded-md bg-secondary" />
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-lg border bg-card" />
        ))}
      </div>
      <div className="h-[520px] animate-pulse rounded-lg border bg-card" />
    </div>
  );
}
