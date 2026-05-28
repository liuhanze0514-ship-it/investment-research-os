import { FileText } from "lucide-react";

import { DocumentCreateForm } from "@/components/forms/document-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { documentTypeGroups, documentTypeLabels } from "@/lib/db/options";
import type { ProjectDetail } from "@/lib/db/projects";

export function DocumentSection({ project, redirectTo }: { project: ProjectDetail; redirectTo: string }) {
  return (
    <section className="grid gap-4 xl:grid-cols-[380px_1fr]">
      <DocumentCreateForm projectId={project.id} redirectTo={redirectTo} />
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {documentTypeGroups.map((type) => {
            const documents =
              type === "OTHER"
                ? project.documents.filter((document) => document.type === "OTHER" || document.type === "DATA_ROOM" || document.type === "MEMO")
                : project.documents.filter((document) => document.type === type);

            return (
              <div key={type} className="rounded-lg border bg-background">
                <div className="flex items-center justify-between border-b px-3 py-2">
                  <div className="text-sm font-medium">{documentTypeLabels[type]}</div>
                  <Badge variant="outline">{documents.length}</Badge>
                </div>
                <div className="space-y-2 p-3">
                  {documents.length === 0 ? (
                    <div className="text-xs text-muted-foreground">No files recorded.</div>
                  ) : (
                    documents.map((document) => (
                      <div key={document.id} className="rounded-md border bg-card p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              {document.name}
                            </div>
                            <div className="mt-1 break-all text-xs text-muted-foreground">{document.url}</div>
                            {document.notes ? <div className="mt-2 text-xs text-muted-foreground">{document.notes}</div> : null}
                          </div>
                          <Badge variant="secondary">{document.sensitivity}</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </section>
  );
}
