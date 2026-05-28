import { CalendarDays, CircleDot, FileText, GitCommitVertical, NotebookText, UserPlus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectDetail } from "@/lib/db/projects";
import { formatDate } from "@/lib/utils";

const iconMap = {
  "Project created": GitCommitVertical,
  "Project updated": GitCommitVertical,
  "Status changed": GitCommitVertical,
  "Task added": CircleDot,
  "Task completed": CircleDot,
  "Task canceled": CircleDot,
  "Meeting added": CalendarDays,
  "Contact added": UserPlus,
  "File added": FileText,
  "Memo exported": NotebookText,
};

export function Timeline({ project }: { project: ProjectDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {project.activityLogs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
        ) : (
          <div className="relative space-y-0">
            <div className="absolute bottom-3 left-[15px] top-3 w-px bg-border" />
            {project.activityLogs.map((item) => {
              const Icon = iconMap[item.action as keyof typeof iconMap] ?? GitCommitVertical;
              return (
                <div key={item.id} className="relative flex gap-3 pb-5 last:pb-0">
                  <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-card">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1 rounded-md border bg-background p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-sm font-medium">{item.action}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</div>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.detail}</p>
                    <div className="mt-2 text-xs text-muted-foreground">{item.user?.name ?? "System"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
