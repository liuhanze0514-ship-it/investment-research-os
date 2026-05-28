import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projectStatusLabels } from "@/lib/db/options";
import type { ProjectWithRelations } from "@/lib/db/projects";
import { formatCurrency } from "@/lib/utils";

export function ProjectTable({ projects }: { projects: ProjectWithRelations[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active opportunities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Company</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Round</th>
                <th className="px-3 py-2 font-medium">Owner</th>
                <th className="px-3 py-2 font-medium">Next step</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-t bg-card">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2 font-medium">
                      <Link href={`/projects/${project.slug}`} className="hover:underline">
                        {project.company.name}
                      </Link>
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {project.company.sector} · {project.company.geography}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant="outline">{projectStatusLabels[project.status]}</Badge>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">
                    {project.financingRounds[0]
                      ? `${formatCurrency(project.financingRounds[0].amount)} at ${
                          project.financingRounds[0].valuation ? formatCurrency(project.financingRounds[0].valuation) : "n/a"
                        }`
                      : "No round"}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{project.owner}</td>
                  <td className="px-3 py-3">
                    <div className="text-muted-foreground">{project.nextStep}</div>
                    <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
