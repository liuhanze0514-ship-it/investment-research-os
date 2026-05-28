import { createContact, createMeeting } from "@/app/actions/projects";
import type React from "react";
import { Button } from "@/components/ui/button";
import type { ProjectDetail } from "@/lib/db/projects";

export function MeetingCreateForm({ project, redirectTo }: { project: ProjectDetail; redirectTo: string }) {
  return (
    <form action={createMeeting} className="rounded-lg border bg-card p-4">
      <input type="hidden" name="projectId" value={project.id} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div className="grid gap-3">
        <Input label="Title" name="title" required />
        <Input label="Time" name="startsAt" type="datetime-local" required />
        <label>
          <span className="text-xs font-medium text-muted-foreground">Contact</span>
          <select name="contactId" className="mt-1 h-9 w-full rounded-md border bg-background px-2 text-sm">
            <option value="">No contact</option>
            {project.projectContacts.map(({ contact }) => (
              <option key={contact.id} value={contact.id}>
                {contact.name}
              </option>
            ))}
          </select>
        </label>
        <Textarea label="Agenda" name="agenda" />
        <Textarea label="Notes" name="notes" />
      </div>
      <div className="mt-3 flex justify-end">
        <Button type="submit" size="sm">
          Add meeting
        </Button>
      </div>
    </form>
  );
}

export function ContactCreateForm({ project, redirectTo }: { project: ProjectDetail; redirectTo: string }) {
  return (
    <form action={createContact} className="rounded-lg border bg-card p-4">
      <input type="hidden" name="projectId" value={project.id} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div className="grid gap-3">
        <Input label="Name" name="name" required />
        <Input label="Title" name="title" required />
        <Input label="Email" name="email" type="email" />
        <Input label="Phone" name="phone" />
        <Input label="Relationship" name="relationship" required />
        <Input label="Project role" name="projectRole" />
      </div>
      <div className="mt-3 flex justify-end">
        <Button type="submit" size="sm">
          Add contact
        </Button>
      </div>
    </form>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...inputProps } = props;
  return (
    <label>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input {...inputProps} className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm" />
    </label>
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const { label, ...textareaProps } = props;
  return (
    <label>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <textarea {...textareaProps} className="mt-1 min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm" />
    </label>
  );
}
