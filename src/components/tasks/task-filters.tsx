"use client";

import type React from "react";
import { useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { taskPriorityText, taskPriorityValues, taskStatusText, taskStatusValues } from "@/lib/filter-options";
import type { ProjectWithRelations, TaskFilters } from "@/lib/db/projects";

export function TaskFiltersBar({ filters, projects }: { filters: TaskFilters; projects: ProjectWithRelations[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const q = firstValue(filters.q);
  const status = firstValue(filters.status);
  const priority = firstValue(filters.priority);
  const due = firstValue(filters.due);
  const projectId = firstValue(filters.projectId);

  function updateUrl() {
    if (!formRef.current) {
      return;
    }

    const params = new URLSearchParams();
    const formData = new FormData(formRef.current);

    for (const [key, value] of formData.entries()) {
      const text = String(value).trim();
      if (text) {
        params.set(key, text);
      }
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function submitFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateUrl();
  }

  return (
    <form id="task-filters" ref={formRef} onSubmit={submitFilters} className="rounded-lg border bg-card p-3">
      <div className="grid gap-3 md:grid-cols-[1.4fr_repeat(4,1fr)_auto_auto]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search task or project"
            className="h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <Select name="status" value={status} placeholder="All status" onChange={updateUrl}>
          {taskStatusValues.map((status) => (
            <option key={status} value={status}>
              {taskStatusText[status]}
            </option>
          ))}
        </Select>
        <Select name="priority" value={priority} placeholder="All priority" onChange={updateUrl}>
          {taskPriorityValues.map((priority) => (
            <option key={priority} value={priority}>
              {taskPriorityText[priority]}
            </option>
          ))}
        </Select>
        <Select name="due" value={due} placeholder="Any due date" onChange={updateUrl}>
          <option value="overdue">Overdue</option>
          <option value="today">Today</option>
          <option value="upcoming">Upcoming</option>
          <option value="none">No due date</option>
        </Select>
        <Select name="projectId" value={projectId} placeholder="All projects" onChange={updateUrl}>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.company.name}
            </option>
          ))}
        </Select>
        <Button type="submit" variant="outline">
          Apply
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push(pathname)}>
          <X className="h-4 w-4" />
          Clear
        </Button>
      </div>
    </form>
  );
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function Select({
  name,
  value,
  placeholder,
  onChange,
  children,
}: {
  name: string;
  value?: string;
  placeholder: string;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <select
      name={name}
      defaultValue={value ?? ""}
      onChange={onChange}
      className="h-9 rounded-md border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  );
}
