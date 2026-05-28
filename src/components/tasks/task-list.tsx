import { TaskStatus } from "@prisma/client";
import { AlertCircle, Ban, CheckCircle2, Circle, CircleDotDashed } from "lucide-react";

import { TaskStatusButton } from "@/components/forms/task-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { taskPriorityLabels, taskStatusLabels } from "@/lib/db/options";

type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: Date | null;
  assignee?: { name: string } | null;
  project?: { company: { name: string } } | null;
};

const statusIcons: Record<TaskStatus, typeof Circle> = {
  TODO: Circle,
  IN_PROGRESS: CircleDotDashed,
  DONE: CheckCircle2,
  BLOCKED: AlertCircle,
  CANCELED: Ban,
};

const statusOrder: TaskStatus[] = ["IN_PROGRESS", "TODO", "BLOCKED", "DONE", "CANCELED"];

export function TaskList({ tasks, redirectTo = "/tasks" }: { tasks: TaskRow[]; redirectTo?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks yet.</p>
        ) : (
          statusOrder.map((status) => {
            const groupedTasks = tasks.filter((task) => task.status === status);
            const Icon = statusIcons[status];

            if (groupedTasks.length === 0) {
              return null;
            }

            return (
              <section key={status}>
                <div className="mb-3 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold">{taskStatusLabels[status]}</h2>
                  <Badge variant="outline">{groupedTasks.length}</Badge>
                </div>
                <div className="space-y-2">
                  {groupedTasks.map((task) => (
                    <div key={task.id} className="grid gap-3 rounded-md border bg-background p-3 md:grid-cols-[1fr_140px_180px] md:items-center">
                      <div>
                        <div className="text-sm font-medium">{task.title}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{task.description ?? "No description"}</div>
                        <div className="mt-2 text-xs text-muted-foreground">{task.project?.company.name ?? "Current project"}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <div>{task.assignee?.name ?? "Unassigned"}</div>
                        <div className="mt-1">{task.dueDate ? `Due ${task.dueDate.toLocaleDateString()}` : "No due date"}</div>
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <Badge
                          variant={task.priority === "URGENT" ? "danger" : task.priority === "HIGH" ? "warning" : "secondary"}
                          className="w-fit"
                        >
                          {taskPriorityLabels[task.priority]}
                        </Badge>
                        {task.status !== "DONE" && task.status !== "CANCELED" ? (
                          <>
                            <TaskStatusButton taskId={task.id} status="DONE" redirectTo={redirectTo}>
                              Complete
                            </TaskStatusButton>
                            <TaskStatusButton taskId={task.id} status="CANCELED" redirectTo={redirectTo}>
                              Cancel
                            </TaskStatusButton>
                          </>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
