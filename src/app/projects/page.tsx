import { BriefcaseBusiness, Filter, Plus } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorBanner } from "@/components/common/error-banner";
import { KanbanBoard } from "@/components/projects/kanban-board";
import { ProjectFiltersBar } from "@/components/projects/project-filters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFilteredProjects, getProjectFilterOptions, type ProjectFilters } from "@/lib/db/projects";
import { formatCurrency } from "@/lib/utils";

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<ProjectFilters & { error?: string }> }) {
  const params = await searchParams;
  const [{ sectors, geographies }, projects] = await Promise.all([getProjectFilterOptions(), getFilteredProjects(params)]);
  const error = params.error;
  const activePipeline = projects.filter((project) => !["PASSED", "ON_HOLD"].includes(project.status));
  const expectedCheck = activePipeline.reduce((sum, project) => sum + (project.expectedCheck ?? 0), 0);
  const openTasks = activePipeline.reduce(
    (sum, project) => sum + project.tasks.filter((task) => task.status !== "DONE" && task.status !== "CANCELED").length,
    0,
  );

  return (
    <div className="space-y-6">
      <ErrorBanner message={error} />
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-sm text-muted-foreground">Pipeline management</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal">Project Kanban</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <a href="#project-filters">
              <Filter className="h-4 w-4" />
              Filter
            </a>
          </Button>
          <Button asChild>
            <Link href="/projects/new">
              <Plus className="h-4 w-4" />
              New project
            </Link>
          </Button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xl font-semibold">{activePipeline.length}</div>
            <div className="mt-1 text-xs text-muted-foreground">Active deals</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xl font-semibold">{formatCurrency(expectedCheck)}</div>
            <div className="mt-1 text-xs text-muted-foreground">Expected checks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xl font-semibold">{openTasks}</div>
            <div className="mt-1 text-xs text-muted-foreground">Open tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xl font-semibold">{projects.filter((project) => project.priority === 1).length}</div>
            <div className="mt-1 text-xs text-muted-foreground">Priority one</div>
          </CardContent>
        </Card>
      </section>

      <ProjectFiltersBar filters={params} sectors={sectors} geographies={geographies} />

      {projects.length === 0 ? (
        <EmptyState icon={BriefcaseBusiness} title="No projects found" description="Adjust search or filters, or create a new deal." />
      ) : (
        <KanbanBoard projects={projects} />
      )}
    </div>
  );
}
