export default function AppLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-md bg-secondary" />
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-lg border bg-card" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-lg border bg-card" />
    </div>
  );
}
