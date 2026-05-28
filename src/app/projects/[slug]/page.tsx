import { ArrowLeft, Building2, CalendarDays, FileText, Mail, NotebookText, Target, Users } from "lucide-react";
import Link from "next/link";

import { ErrorBanner } from "@/components/common/error-banner";
import { DocumentSection } from "@/components/documents/document-section";
import { ContactCreateForm, MeetingCreateForm } from "@/components/forms/activity-forms";
import { ProjectEditForm } from "@/components/forms/project-edit-form";
import { TaskCreateForm } from "@/components/forms/task-form";
import { TaskList } from "@/components/tasks/task-list";
import { Timeline } from "@/components/timeline/timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projectStatusLabels } from "@/lib/db/options";
import { getProjectBySlug } from "@/lib/db/projects";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ slug }, { error }] = await Promise.all([params, searchParams]);
  const project = await getProjectBySlug(slug);
  const round = project.financingRounds[0];
  const redirectTo = `/projects/${project.slug}`;

  return (
    <div className="space-y-6">
      <ErrorBanner message={error} />
      <div className="flex items-center justify-between gap-3">
        <Button asChild variant="ghost" className="px-2">
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <Badge variant="outline">{projectStatusLabels[project.status]}</Badge>
      </div>

      <header className="rounded-lg border bg-card p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-sm text-muted-foreground">{project.name}</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">{project.company.name}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{project.summary}</p>
          </div>
          <div className="grid min-w-[280px] grid-cols-2 gap-3 text-sm">
            <Metric label="Round" value={round ? formatCurrency(round.amount) : "No round"} />
            <Metric label="Valuation" value={round?.valuation ? formatCurrency(round.valuation) : "n/a"} />
            <Metric label="Expected check" value={project.expectedCheck ? formatCurrency(project.expectedCheck) : "n/a"} />
            <Metric label="Conviction" value={`${project.probability}%`} />
          </div>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
        </div>
      </header>

      <ProjectEditForm project={project} redirectTo={redirectTo} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Investment Memo</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${project.slug}/memo`}>
              <NotebookText className="h-4 w-4" />
              Open memo
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-muted-foreground">
          Generate a template-based markdown memo from company, financing, tasks, meetings, contacts, and files.
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Investment thesis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>{project.thesis}</p>
            <div className="rounded-md border bg-background p-3">
              <div className="mb-1 text-xs font-medium text-foreground">Key risk</div>
              {project.risk ?? "No risk note yet."}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <DetailRow icon={Building2} label="Sector" value={`${project.company.sector} / ${project.company.subsector ?? "General"}`} />
            <DetailRow icon={Target} label="Source" value={project.source} />
            <DetailRow icon={Users} label="Owner" value={project.owner} />
            <DetailRow icon={CalendarDays} label="Next step" value={project.nextStep} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {project.financingRounds.length === 0 ? (
              <p className="text-sm text-muted-foreground">No financing round recorded.</p>
            ) : (
              project.financingRounds.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-md border bg-background p-3">
                  <div>
                    <div className="text-xs text-muted-foreground">{item.stage.replace("_", " ")}</div>
                    <div className="mt-1 text-sm font-semibold">{formatCurrency(item.amount)}</div>
                  </div>
                  <Badge variant="secondary">{item.valuation ? formatCurrency(item.valuation) : "No valuation"}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <DocumentSection project={project} redirectTo={redirectTo} />

      <section className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <Timeline project={project} />
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {project.activityLogs.slice(0, 5).map((item) => (
              <div key={item.id} className="rounded-md border bg-background p-3">
                <div className="text-sm font-medium">{item.action}</div>
                <div className="mt-1 text-xs text-muted-foreground">{item.detail}</div>
                <div className="mt-2 text-xs text-muted-foreground">{formatDate(item.createdAt)}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <TaskCreateForm projectId={project.id} redirectTo={redirectTo} />
          <TaskList tasks={project.tasks} redirectTo={redirectTo} />
        </div>
        <div className="space-y-4">
          <ContactCreateForm project={project} redirectTo={redirectTo} />
          <MeetingCreateForm project={project} redirectTo={redirectTo} />
          <Card>
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.projectContacts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No contacts yet.</p>
              ) : (
                project.projectContacts.map(({ contact, role }) => (
                  <div key={contact.id} className="rounded-md border bg-background p-3">
                    <div className="font-medium">{contact.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {contact.title} / {role}
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      {contact.email ?? "No email"}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meetings and files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {project.meetings.map((meeting) => (
                <div key={meeting.id} className="rounded-md border bg-background p-3">
                  <div className="flex items-center gap-2 font-medium">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    {meeting.title}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{formatDate(meeting.startsAt)}</div>
                  <div className="mt-2 text-xs text-muted-foreground">{meeting.notes ?? meeting.agenda ?? "No notes yet."}</div>
                </div>
              ))}
              <div className="rounded-md border bg-background p-3">
                <div className="flex items-center gap-2 font-medium">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {project.documents.length} file records
                </div>
                <div className="mt-1 text-xs text-muted-foreground">See the Documents section for grouped metadata.</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border bg-background p-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-1 font-medium">{value}</div>
      </div>
    </div>
  );
}
