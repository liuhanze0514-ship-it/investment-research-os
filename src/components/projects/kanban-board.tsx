import { CalendarDays, CircleDollarSign, FileText } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { projectStatusLabels, projectStatusOrder } from "@/lib/db/options";
import type { ProjectWithRelations } from "@/lib/db/projects";
import { formatCurrency } from "@/lib/utils";

export function KanbanBoard({ projects }: { projects: ProjectWithRelations[] }) {
  return (
    <div className="grid min-h-[640px] auto-cols-[312px] grid-flow-col gap-4 overflow-x-auto pb-4">
      {projectStatusOrder.map((status) => {
        const columnProjects = projects.filter((project) => project.status === status);

        return (
          <section key={status} className="rounded-lg border bg-muted/30">
            <div className="sticky top-0 z-10 flex h-12 items-center justify-between border-b bg-card/95 px-3 backdrop-blur">
              <div>
                <div className="text-sm font-medium">{projectStatusLabels[status]}</div>
                <div className="text-[11px] text-muted-foreground">
                  {formatCurrency(columnProjects.reduce((sum, project) => sum + (project.expectedCheck ?? 0), 0))}
                </div>
              </div>
              <Badge variant="outline">{columnProjects.length}</Badge>
            </div>
            <div className="space-y-3 p-3">
              {columnProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`} className="block">
                <Card className="p-4 shadow-none transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold leading-5">{project.company.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {project.company.sector} / {project.company.geography}
                      </p>
                    </div>
                    <Badge variant={project.priority === 1 ? "default" : "secondary"}>P{project.priority}</Badge>
                  </div>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{project.summary}</p>

                  <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CircleDollarSign className="h-3.5 w-3.5" />
                      {project.financingRounds[0] ? formatCurrency(project.financingRounds[0].amount) : "No round"} round
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {project.nextStep}
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5" />
                      {project.documents.length} docs / {project.tasks.filter((task) => task.status !== "DONE" && task.status !== "CANCELED").length} open tasks
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Diligence progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs">
                    <span className="text-muted-foreground">{project.owner}</span>
                    <span className="font-medium">{project.probability}% conviction</span>
                  </div>
                </Card>
                </Link>
              ))}
              {columnProjects.length === 0 ? (
                <div className="rounded-md border border-dashed bg-background/60 p-4 text-center text-xs text-muted-foreground">
                  No deals in this stage
                </div>
              ) : null}
            </div>
          </section>
        );
      })}
    </div>
  );
}
