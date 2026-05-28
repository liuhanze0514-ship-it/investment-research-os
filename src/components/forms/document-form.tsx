import { DocumentType } from "@prisma/client";

import { createDocument } from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import { documentTypeLabels } from "@/lib/db/options";

export function DocumentCreateForm({ projectId, redirectTo }: { projectId: string; redirectTo: string }) {
  return (
    <form action={createDocument} className="rounded-lg border bg-card p-4">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div className="grid gap-3 md:grid-cols-2">
        <label>
          <span className="text-xs font-medium text-muted-foreground">File name</span>
          <input name="name" required className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm" />
        </label>
        <label>
          <span className="text-xs font-medium text-muted-foreground">Type</span>
          <select name="type" defaultValue="OTHER" className="mt-1 h-9 w-full rounded-md border bg-background px-2 text-sm">
            {Object.values(DocumentType).map((type) => (
              <option key={type} value={type}>
                {documentTypeLabels[type]}
              </option>
            ))}
          </select>
        </label>
        <label className="md:col-span-2">
          <span className="text-xs font-medium text-muted-foreground">Local path</span>
          <input
            name="localPath"
            required
            placeholder="D:\\Deals\\AtlasBio\\deck.pdf"
            className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm"
          />
        </label>
        <label>
          <span className="text-xs font-medium text-muted-foreground">Sensitivity</span>
          <input name="sensitivity" defaultValue="Internal" className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm" />
        </label>
        <label className="md:col-span-2">
          <span className="text-xs font-medium text-muted-foreground">Notes</span>
          <textarea name="notes" className="mt-1 min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </label>
      </div>
      <div className="mt-3 flex justify-end">
        <Button type="submit" size="sm">
          Add file record
        </Button>
      </div>
    </form>
  );
}
