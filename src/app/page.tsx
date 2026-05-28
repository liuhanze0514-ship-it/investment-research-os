import { ArrowUpRight, BriefcaseBusiness, CircleDollarSign, Clock3, ListChecks, Plus, Search, TrendingUp } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorBanner } from "@/components/common/error-banner";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projectStatusLabels } from "@/lib/db/options";
import { getDashboardData } from "@/lib/db/projects";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, { projects, tasks, meetings }] = await Promise.all([searchParams, getDashboardData()]);
  const activeProjects = projects.filter((project) => !["PASSED", "ON_HOLD", "INVESTED"].includes(project.status));
  const totalCheck = activeProjects.reduce((sum, project) => sum + (project.expectedCheck ?? 0), 0);
  const weightedPipeline = activeProjects.reduce((sum, project) => sum + (project.expectedCheck ?? 0) * (project.probability / 100), 0);
  const openTasks = tasks.filter((task) => task.status !== "DONE" && task.status !== "CANCELED");
  const priorityProjects = [...activeProjects]
    .sort((a, b) => a.priority - b.priority || b.probability - a.probability)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <ErrorBanner message={error} />

      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-sm text-muted-foreground">Investment workspace</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal">Dashboard</h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <form action="/projects" className="w-full sm:w-72">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                name="q"
                placeholder="Search deals"
                className="h-9 w-full rounded-md border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          </form>
          <Button asChild>
            <Link href="/projects/new">
              <Plus className="h-4 w-4" />
              New project
            </Link>
          </Button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active projects" value={String(activeProjects.length)} helper="Across new to legal" icon={BriefcaseBusiness} />
        <StatCard label="Weighted pipeline" value={formatCurrency(weightedPipeline)} helper="Probability adjusted" icon={TrendingUp} />
        <StatCard label="Expected checks" value={formatCurrency(totalCheck)} helper="Indicative allocation" icon={CircleDollarSign} />
        <StatCard label="Open tasks" value={String(openTasks.length)} helper="Across diligence and IC prep" icon={ListChecks} />
      </section>

      {projects.length === 0 ? (
        <EmptyState icon={BriefcaseBusiness} title="No projects yet" description="Create your first deal to start building the local pipeline." />
      ) : (
        <section className="grid gap-4 xl:grid-cols-[1fr_380px]">
          <Card className="overflow-hidden">
            <CardHeader className="border-b">
              <CardTitle>Priority deal desk</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 p-4 md:grid-cols-3">
              {priorityProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="rounded-lg border bg-background p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">{project.company.name}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{project.company.subsector ?? project.company.sector}</div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">{project.summary}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{projectStatusLabels[project.status]}</span>
                    <span>{project.probability}% conviction</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming meetings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {meetings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No meetings scheduled.</p>
                ) : (
                  meetings.slice(0, 4).map((meeting) => (
                    <div key={meeting.id} className="rounded-md border bg-background p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-medium">{meeting.title}</div>
                        <Clock3 className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{formatDate(meeting.startsAt)}</div>
                      <div className="mt-2 text-xs text-muted-foreground">{meeting.project.company.name}</div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tasks overview</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <TaskSummary label="Open" value={openTasks.length} href="/tasks" />
                <TaskSummary label="In progress" value={tasks.filter((task) => task.status === "IN_PROGRESS").length} href="/tasks?status=IN_PROGRESS" />
                <TaskSummary label="Completed" value={tasks.filter((task) => task.status === "DONE").length} href="/tasks?status=DONE" />
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}

function TaskSummary({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="block rounded-md border bg-background p-3 transition-colors hover:bg-accent/50">
      <div className="text-xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </Link>
  );
}
