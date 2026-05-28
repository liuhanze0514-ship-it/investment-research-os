import { ProjectStatus, RoundStage } from "@prisma/client";
import type React from "react";

import { createProject } from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projectStatusLabels, roundStageLabels } from "@/lib/db/options";

export function ProjectCreateForm() {
  return (
    <form action={createProject} className="space-y-4">
      <input type="hidden" name="redirectTo" value="/projects/new" />
      <Card>
        <CardHeader>
          <CardTitle>Company and project</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field label="Company name" name="companyName" required />
          <Field label="Legal name" name="legalName" />
          <Field label="Sector" name="sector" required />
          <Field label="Subsector" name="subsector" />
          <Field label="Geography" name="geography" required />
          <Field label="Website" name="website" type="url" />
          <Field label="Source" name="source" required />
          <Field label="Owner" name="owner" required defaultValue="Alice Chen" />
          <Select label="Status" name="status" values={ProjectStatus} labels={projectStatusLabels} defaultValue="NEW" />
          <Field label="Priority" name="priority" type="number" min="1" max="4" defaultValue="2" required />
          <Field label="Probability" name="probability" type="number" min="0" max="100" defaultValue="25" required />
          <Field label="Progress" name="progress" type="number" min="0" max="100" defaultValue="0" required />
          <Textarea label="Company description" name="description" required className="md:col-span-2" />
          <Textarea label="Summary" name="summary" required className="md:col-span-2" />
          <Textarea label="Investment thesis" name="thesis" required className="md:col-span-2" />
          <Textarea label="Key risk" name="risk" className="md:col-span-2" />
          <Field label="Next step" name="nextStep" required className="md:col-span-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financing round</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Select label="Round stage" name="roundStage" values={RoundStage} labels={roundStageLabels} defaultValue="SEED" />
          <Field label="Currency" name="currency" defaultValue="USD" required />
          <Field label="Round amount" name="amount" type="number" min="0" required />
          <Field label="Valuation" name="valuation" type="number" min="0" />
          <Field label="Expected check" name="expectedCheck" type="number" min="0" />
          <Field label="Target ownership %" name="targetOwnership" type="number" min="0" max="100" />
          <Field label="Lead investor" name="leadInvestor" />
          <Textarea label="Round notes" name="roundNotes" className="md:col-span-2" />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">Create project</Button>
      </div>
    </form>
  );
}

export function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; className?: string }) {
  const { label, className, ...inputProps } = props;
  return (
    <label className={className}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        {...inputProps}
        className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; className?: string }) {
  const { label, className, ...textareaProps } = props;
  return (
    <label className={className}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <textarea
        {...textareaProps}
        className="mt-1 min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

function Select<T extends Record<string, string>>({
  label,
  name,
  values,
  labels,
  defaultValue,
}: {
  label: string;
  name: string;
  values: T;
  labels: Record<T[keyof T], string>;
  defaultValue: T[keyof T];
}) {
  return (
    <label>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      >
        {Object.values(values).map((value) => (
          <option key={value} value={value}>
            {labels[value as T[keyof T]]}
          </option>
        ))}
      </select>
    </label>
  );
}
