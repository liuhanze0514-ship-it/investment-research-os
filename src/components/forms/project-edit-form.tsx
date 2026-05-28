import { ProjectStatus } from "@prisma/client";

import { updateProjectBasics } from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import { projectStatusLabels } from "@/lib/db/options";
import type { ProjectDetail } from "@/lib/db/projects";

export function ProjectEditForm({ project, redirectTo }: { project: ProjectDetail; redirectTo: string }) {
  return (
    <form action={updateProjectBasics} className="rounded-lg border bg-card p-4">
      <input type="hidden" name="projectId" value={project.id} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div className="grid gap-3 md:grid-cols-5">
        <label>
          <span className="text-xs font-medium text-muted-foreground">Status</span>
          <select name="status" defaultValue={project.status} className="mt-1 h-9 w-full rounded-md border bg-background px-2 text-sm">
            {Object.values(ProjectStatus).map((status) => (
              <option key={status} value={status}>
                {projectStatusLabels[status]}
              </option>
            ))}
          </select>
        </label>
        <SmallNumber label="Priority" name="priority" value={project.priority} min={1} max={4} />
        <SmallNumber label="Probability" name="probability" value={project.probability} min={0} max={100} />
        <SmallNumber label="Progress" name="progress" value={project.progress} min={0} max={100} />
        <label className="md:col-span-5">
          <span className="text-xs font-medium text-muted-foreground">Next step</span>
          <input
            name="nextStep"
            defaultValue={project.nextStep}
            required
            className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
      </div>
      <div className="mt-3 flex justify-end">
        <Button type="submit" size="sm">
          Save changes
        </Button>
      </div>
    </form>
  );
}

function SmallNumber({ label, name, value, min, max }: { label: string; name: string; value: number; min: number; max: number }) {
  return (
    <label>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        name={name}
        type="number"
        min={min}
        max={max}
        defaultValue={value}
        required
        className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}
