import { TaskPriority } from "@prisma/client";

import { createTask, setTaskStatus } from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import { taskPriorityLabels } from "@/lib/db/options";
import type { ProjectWithRelations } from "@/lib/db/projects";

export function TaskCreateForm({
  projects,
  projectId,
  redirectTo,
}: {
  projects?: ProjectWithRelations[];
  projectId?: string;
  redirectTo: string;
}) {
  return (
    <form action={createTask} className="rounded-lg border bg-card p-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      {projectId ? (
        <input type="hidden" name="projectId" value={projectId} />
      ) : (
        <label>
          <span className="text-xs font-medium text-muted-foreground">Project</span>
          <select name="projectId" required className="mt-1 h-9 w-full rounded-md border bg-background px-2 text-sm">
            {projects?.map((project) => (
              <option key={project.id} value={project.id}>
                {project.company.name}
              </option>
            ))}
          </select>
        </label>
      )}
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <label>
          <span className="text-xs font-medium text-muted-foreground">Title</span>
          <input name="title" required className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm" />
        </label>
        <label>
          <span className="text-xs font-medium text-muted-foreground">Priority</span>
          <select name="priority" defaultValue="MEDIUM" className="mt-1 h-9 w-full rounded-md border bg-background px-2 text-sm">
            {Object.values(TaskPriority).map((priority) => (
              <option key={priority} value={priority}>
                {taskPriorityLabels[priority]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-xs font-medium text-muted-foreground">Due date</span>
          <input name="dueDate" type="date" className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm" />
        </label>
        <label>
          <span className="text-xs font-medium text-muted-foreground">Assignee id</span>
          <input name="assigneeId" className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm" />
        </label>
        <label className="md:col-span-2">
          <span className="text-xs font-medium text-muted-foreground">Description</span>
          <textarea name="description" className="mt-1 min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </label>
      </div>
      <div className="mt-3 flex justify-end">
        <Button type="submit" size="sm">
          Add task
        </Button>
      </div>
    </form>
  );
}

export function TaskStatusButton({ taskId, status, redirectTo, children }: { taskId: string; status: string; redirectTo: string; children: string }) {
  return (
    <form action={setTaskStatus}>
      <input type="hidden" name="taskId" value={taskId} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <Button type="submit" size="sm" variant="outline">
        {children}
      </Button>
    </form>
  );
}
