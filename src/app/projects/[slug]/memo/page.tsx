import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { MemoViewer } from "@/components/memo/memo-viewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projectStatusLabels } from "@/lib/db/options";
import { getProjectBySlug } from "@/lib/db/projects";
import { buildInvestmentMemo } from "@/lib/memo";

export const dynamic = "force-dynamic";

export default async function InvestmentMemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const markdown = buildInvestmentMemo(project);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Button asChild variant="ghost" className="px-2">
          <Link href={`/projects/${project.slug}`}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <Badge variant="outline">{projectStatusLabels[project.status]}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Investment Memo</CardTitle>
        </CardHeader>
        <CardContent>
          <MemoViewer markdown={markdown} downloadHref={`/projects/${project.slug}/memo/download`} />
        </CardContent>
      </Card>
    </div>
  );
}
