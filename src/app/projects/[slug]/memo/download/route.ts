import { logActivity } from "@/lib/db/activity";
import { getProjectBySlug } from "@/lib/db/projects";
import { buildInvestmentMemo } from "@/lib/memo";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const markdown = buildInvestmentMemo(project);
  const filename = `${project.slug}-investment-memo.md`;

  await logActivity({
    action: "Memo exported",
    detail: `Investment memo exported as ${filename}.`,
    projectId: project.id,
    companyId: project.companyId,
  });

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
