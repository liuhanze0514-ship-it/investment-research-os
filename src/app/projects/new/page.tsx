import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ErrorBanner } from "@/components/common/error-banner";
import { ProjectCreateForm } from "@/components/forms/project-create-form";
import { Button } from "@/components/ui/button";

export default async function NewProjectPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <div className="space-y-6">
      <ErrorBanner message={error} />
      <div className="flex items-center justify-between gap-3">
        <div>
          <Button asChild variant="ghost" className="px-2">
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="mt-3 text-2xl font-semibold tracking-normal">New project</h1>
        </div>
      </div>
      <ProjectCreateForm />
    </div>
  );
}
