import { ListChecks, Plus } from "lucide-react";

import { ErrorBanner } from "@/components/common/error-banner";
import { TaskCreateForm } from "@/components/forms/task-form";
import { TaskFiltersBar } from "@/components/tasks/task-filters";
import { TaskList } from "@/components/tasks/task-list";
import { Card, CardContent } from "@/components/ui/card";
import { getFilteredTasks, getProjects, type TaskFilters } from "@/lib/db/projects";

export default async function TasksPage({ searchParams }: { searchParams: Promise<TaskFilters & { error?: string }> }) {
  const params = await searchParams;
  const [tasks, projects] = await Promise.all([getFilteredTasks(params), getProjects()]);
  const error = params.error;
  const openTasks = tasks.filter((task) => task.status !== "DONE" && task.status !== "CANCELED").length;
  const urgentTasks = tasks.filter((task) => task.priority === "URGENT" && task.status !== "DONE" && task.status !== "CANCELED").length;

  return (
    <div className="space-y-6">
      <ErrorBanner message={error} />
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-sm text-muted-foreground">Execution layer</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal">Tasks</h1>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <ListChecks className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-2xl font-semibold">{openTasks}</div>
              <div className="text-xs text-muted-foreground">Open tasks</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-2xl font-semibold">{urgentTasks}</div>
            <div className="text-xs text-muted-foreground">Urgent blockers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-2xl font-semibold">{tasks.length}</div>
            <div className="text-xs text-muted-foreground">Total tasks</div>
          </CardContent>
        </Card>
      </section>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Plus className="h-4 w-4" />
          Add task
        </div>
        <TaskCreateForm projects={projects} redirectTo="/tasks" />
        <TaskFiltersBar filters={params} projects={projects} />
        <TaskList tasks={tasks} redirectTo="/tasks" />
      </div>
    </div>
  );
}
