"use client";

import { Button } from "@/components/ui/button";

export default function ProjectsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold">Could not load projects</h2>
      <p className="mt-2 text-sm text-muted-foreground">The local database request failed. Try again after checking the dev server logs.</p>
      <Button className="mt-4" onClick={reset}>
        Retry
      </Button>
    </div>
  );
}
