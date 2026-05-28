import { ProjectStatus, RoundStage, TaskPriority, TaskStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

export const projectInclude = {
  company: true,
  financingRounds: {
    orderBy: { createdAt: "desc" },
  },
  tasks: {
    include: { assignee: true },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  },
  meetings: {
    include: { contact: true, owner: true },
    orderBy: { startsAt: "asc" },
  },
  projectContacts: {
    include: {
      contact: {
        include: { organization: true, company: true },
      },
    },
    orderBy: { createdAt: "desc" },
  },
  documents: true,
  activityLogs: {
    include: { user: true },
    orderBy: { createdAt: "desc" },
  },
} satisfies Prisma.ProjectInclude;

export async function getProjects() {
  return prisma.project.findMany({
    include: projectInclude,
    orderBy: [{ priority: "asc" }, { updatedAt: "desc" }],
  });
}

export async function getProjectBySlug(slug: string) {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: projectInclude,
  });

  if (!project) {
    notFound();
  }

  return project;
}

export async function getDashboardData() {
  const [projects, tasks, meetings, activities] = await Promise.all([
    getProjects(),
    prisma.task.findMany({
      include: { project: { include: { company: true } }, assignee: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.meeting.findMany({
      include: { project: { include: { company: true } }, contact: true },
      orderBy: { startsAt: "asc" },
      take: 8,
    }),
    prisma.activityLog.findMany({
      include: { user: true, project: { include: { company: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return { projects, tasks, meetings, activities };
}

export async function getTasks() {
  return prisma.task.findMany({
    include: {
      assignee: true,
      project: {
        include: { company: true },
      },
    },
    orderBy: [{ status: "asc" }, { priority: "desc" }, { updatedAt: "desc" }],
  });
}

export async function getUsers() {
  return prisma.user.findMany({ orderBy: { name: "asc" } });
}

export type ProjectWithRelations = Prisma.ProjectGetPayload<{ include: typeof projectInclude }>;
export type ProjectDetail = ProjectWithRelations;
export type TaskWithProject = Awaited<ReturnType<typeof getTasks>>[number];

export type ProjectFilters = {
  q?: string | string[];
  status?: string | string[];
  priority?: string | string[];
  sector?: string | string[];
  round?: string | string[];
  geography?: string | string[];
};

export type TaskFilters = {
  q?: string | string[];
  status?: string | string[];
  priority?: string | string[];
  due?: string | string[];
  projectId?: string | string[];
};

function hasEnumValue<T extends Record<string, string>>(source: T, value: string | undefined): value is T[keyof T] {
  return Boolean(value && Object.prototype.hasOwnProperty.call(source, value));
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function clean(value: string | string[] | undefined) {
  return firstValue(value)?.trim() || undefined;
}

function numberFilter(value: string | string[] | undefined, allowed: number[]) {
  const text = clean(value);
  if (!text) {
    return undefined;
  }

  const parsed = Number(text);
  return Number.isInteger(parsed) && allowed.includes(parsed) ? parsed : undefined;
}

export async function getFilteredProjects(filters: ProjectFilters) {
  const q = clean(filters.q);
  const qStatus = q?.toUpperCase();
  const qOr: Prisma.ProjectWhereInput[] = q
    ? [
        { name: { contains: q } },
        { owner: { contains: q } },
        { source: { contains: q } },
        { company: { name: { contains: q } } },
        { company: { sector: { contains: q } } },
        { company: { subsector: { contains: q } } },
        { company: { geography: { contains: q } } },
      ]
    : [];

  if (hasEnumValue(ProjectStatus, qStatus)) {
    qOr.push({ status: qStatus });
  }

  const priority = numberFilter(filters.priority, [1, 2, 3, 4]);
  const status = clean(filters.status);
  const sector = clean(filters.sector);
  const round = clean(filters.round);
  const geography = clean(filters.geography);

  const where: Prisma.ProjectWhereInput = {
    AND: [
      q ? { OR: qOr } : {},
      hasEnumValue(ProjectStatus, status) ? { status } : {},
      priority ? { priority } : {},
      sector ? { company: { sector: { contains: sector } } } : {},
      hasEnumValue(RoundStage, round) ? { financingRounds: { some: { stage: round } } } : {},
      geography ? { company: { geography: { contains: geography } } } : {},
    ],
  };

  return prisma.project.findMany({
    where,
    include: projectInclude,
    orderBy: [{ priority: "asc" }, { updatedAt: "desc" }],
  });
}

export async function getProjectFilterOptions() {
  const [sectors, geographies] = await Promise.all([
    prisma.company.findMany({ distinct: ["sector"], select: { sector: true }, orderBy: { sector: "asc" } }),
    prisma.company.findMany({ distinct: ["geography"], select: { geography: true }, orderBy: { geography: "asc" } }),
  ]);

  return {
    sectors: sectors.map((item) => item.sector).filter(Boolean),
    geographies: geographies.map((item) => item.geography).filter(Boolean),
  };
}

export async function getFilteredTasks(filters: TaskFilters) {
  const q = clean(filters.q);
  const due = clean(filters.due);
  const status = clean(filters.status);
  const priority = clean(filters.priority);
  const projectId = clean(filters.projectId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dueWhere: Prisma.TaskWhereInput =
    due === "overdue"
      ? { dueDate: { lt: today } }
      : due === "today"
        ? { dueDate: { gte: today, lt: tomorrow } }
        : due === "upcoming"
          ? { dueDate: { gte: tomorrow } }
          : due === "none"
            ? { dueDate: null }
            : {};

  return prisma.task.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { title: { contains: q } },
                { description: { contains: q } },
                { project: { name: { contains: q } } },
                { project: { company: { name: { contains: q } } } },
              ],
            }
          : {},
        hasEnumValue(TaskStatus, status) ? { status } : {},
        hasEnumValue(TaskPriority, priority) ? { priority } : {},
        projectId ? { projectId } : {},
        dueWhere,
      ],
    },
    include: {
      assignee: true,
      project: {
        include: { company: true },
      },
    },
    orderBy: [{ status: "asc" }, { priority: "desc" }, { updatedAt: "desc" }],
  });
}
