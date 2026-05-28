"use server";

import { DocumentType, ProjectStatus, RoundStage, TaskPriority, TaskStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/db/activity";
import { boundedInt, optionalInt, optionalText, requiredText, slugify, textValue } from "@/lib/db/validation";

function safeRedirect(value: string | undefined, fallback: string) {
  return value?.startsWith("/") ? value : fallback;
}

async function uniqueSlug(name: string) {
  const base = slugify(name) || "project";
  let slug = base;
  let index = 2;

  while (await prisma.project.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${base}-${index}`;
    index += 1;
  }

  return slug;
}

function enumValue<T extends Record<string, string>>(source: T, value: string, label: string): T[keyof T] {
  if (!Object.prototype.hasOwnProperty.call(source, value)) {
    throw new Error(`${label} is invalid`);
  }
  return source[value as keyof T];
}

function redirectWithError(formData: FormData, fallback: string, error: unknown): never {
  const message = error instanceof Error ? error.message : "Something went wrong";
  const target = safeRedirect(textValue(formData, "redirectTo"), fallback);
  redirect(`${target}${target.includes("?") ? "&" : "?"}error=${encodeURIComponent(message)}`);
}

export async function createProject(formData: FormData) {
  let target = "/projects";
  try {
    const companyName = requiredText(formData, "companyName", "Company name");
    const roundStage = enumValue(RoundStage, requiredText(formData, "roundStage", "Round stage"), "Round stage");
    const amount = boundedInt(formData, "amount", 0, 10000000000, 0);
    const valuation = optionalInt(formData, "valuation");
    const expectedCheck = optionalInt(formData, "expectedCheck");
    const slug = await uniqueSlug(companyName);

    const project = await prisma.project.create({
      data: {
        slug,
        name: `${companyName} ${roundStage.replace("_", " ")}`,
        status: enumValue(ProjectStatus, textValue(formData, "status") || "NEW", "Status"),
        source: requiredText(formData, "source", "Source"),
        owner: requiredText(formData, "owner", "Owner"),
        thesis: requiredText(formData, "thesis", "Investment thesis"),
        summary: requiredText(formData, "summary", "Summary"),
        risk: optionalText(formData, "risk"),
        nextStep: requiredText(formData, "nextStep", "Next step"),
        priority: boundedInt(formData, "priority", 1, 4, 2),
        probability: boundedInt(formData, "probability", 0, 100, 25),
        progress: boundedInt(formData, "progress", 0, 100, 0),
        expectedCheck,
        targetOwnership: (optionalInt(formData, "targetOwnership") ?? 0) / 100,
        company: {
          create: {
            name: companyName,
            legalName: optionalText(formData, "legalName"),
            sector: requiredText(formData, "sector", "Sector"),
            subsector: optionalText(formData, "subsector"),
            geography: requiredText(formData, "geography", "Geography"),
            website: optionalText(formData, "website"),
            description: requiredText(formData, "description", "Company description"),
            stage: roundStage,
          },
        },
      },
    });

    await prisma.financingRound.create({
      data: {
        stage: roundStage,
        amount,
        valuation,
        currency: textValue(formData, "currency") || "USD",
        leadInvestor: optionalText(formData, "leadInvestor"),
        notes: optionalText(formData, "roundNotes"),
        companyId: project.companyId,
        projectId: project.id,
      },
    });

    await logActivity({
      action: "Project created",
      detail: `${companyName} was added to the pipeline.`,
      projectId: project.id,
      companyId: project.companyId,
    });

    revalidatePath("/");
    revalidatePath("/projects");
    target = `/projects/${project.slug}`;
  } catch (error) {
    redirectWithError(formData, "/projects/new", error);
  }

  redirect(target);
}

export async function updateProjectBasics(formData: FormData) {
  const redirectTo = safeRedirect(textValue(formData, "redirectTo"), "/projects");
  try {
    const projectId = requiredText(formData, "projectId", "Project id");

    const before = await prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      select: { status: true, priority: true, nextStep: true, companyId: true },
    });
    const nextStatus = enumValue(ProjectStatus, requiredText(formData, "status", "Status"), "Status");
    const nextPriority = boundedInt(formData, "priority", 1, 4, 2);
    const nextStep = requiredText(formData, "nextStep", "Next step");

    await prisma.project.update({
      where: { id: projectId },
      data: {
        status: nextStatus,
        priority: nextPriority,
        probability: boundedInt(formData, "probability", 0, 100, 25),
        progress: boundedInt(formData, "progress", 0, 100, 0),
        nextStep,
      },
    });

    await logActivity({
      action: before.status !== nextStatus ? "Status changed" : "Project updated",
      detail:
        before.status !== nextStatus
          ? `Status changed from ${before.status} to ${nextStatus}.`
          : `Priority changed from P${before.priority} to P${nextPriority}. Next step: ${nextStep}`,
      projectId,
      companyId: before.companyId,
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(redirectTo);
  } catch (error) {
    redirectWithError(formData, redirectTo, error);
  }

  redirect(redirectTo);
}

export async function createTask(formData: FormData) {
  const redirectTo = safeRedirect(textValue(formData, "redirectTo"), "/tasks");
  try {
    const projectId = requiredText(formData, "projectId", "Project");
    const assigneeId = optionalText(formData, "assigneeId");
    const dueDate = optionalText(formData, "dueDate");

    const task = await prisma.task.create({
      data: {
        title: requiredText(formData, "title", "Task title"),
        description: optionalText(formData, "description"),
        status: "TODO",
        priority: enumValue(TaskPriority, textValue(formData, "priority") || "MEDIUM", "Priority"),
        dueDate: dueDate ? new Date(`${dueDate}T00:00:00.000Z`) : undefined,
        projectId,
        assigneeId,
      },
    });

    const project = await prisma.project.findUnique({ where: { id: projectId }, select: { companyId: true } });
    await logActivity({
      action: "Task added",
      detail: `Task added: ${task.title}.`,
      projectId,
      companyId: project?.companyId,
    });

    revalidatePath("/");
    revalidatePath("/tasks");
    revalidatePath(redirectTo);
  } catch (error) {
    redirectWithError(formData, redirectTo, error);
  }

  redirect(redirectTo);
}

export async function setTaskStatus(formData: FormData) {
  const redirectTo = safeRedirect(textValue(formData, "redirectTo"), "/tasks");
  try {
    const status = enumValue(TaskStatus, requiredText(formData, "status", "Task status"), "Task status");
    const task = await prisma.task.update({
      where: { id: requiredText(formData, "taskId", "Task id") },
      data: {
        status,
      },
      include: { project: true },
    });

    await logActivity({
      action: status === "DONE" ? "Task completed" : status === "CANCELED" ? "Task canceled" : "Task updated",
      detail: `${task.title} marked ${status}.`,
      projectId: task.projectId,
      companyId: task.project.companyId,
    });

    revalidatePath("/");
    revalidatePath("/tasks");
    revalidatePath(redirectTo);
  } catch (error) {
    redirectWithError(formData, redirectTo, error);
  }

  redirect(redirectTo);
}

export async function createMeeting(formData: FormData) {
  const redirectTo = safeRedirect(textValue(formData, "redirectTo"), "/projects");
  try {
    const date = requiredText(formData, "startsAt", "Meeting time");

    const meeting = await prisma.meeting.create({
      data: {
        title: requiredText(formData, "title", "Meeting title"),
        agenda: optionalText(formData, "agenda"),
        notes: optionalText(formData, "notes"),
        startsAt: new Date(date),
        projectId: requiredText(formData, "projectId", "Project"),
        contactId: optionalText(formData, "contactId"),
      },
      include: { project: true },
    });

    await logActivity({
      action: "Meeting added",
      detail: `Meeting added: ${meeting.title}.`,
      projectId: meeting.projectId,
      companyId: meeting.project.companyId,
    });

    revalidatePath("/");
    revalidatePath(redirectTo);
  } catch (error) {
    redirectWithError(formData, redirectTo, error);
  }

  redirect(redirectTo);
}

export async function createContact(formData: FormData) {
  const redirectTo = safeRedirect(textValue(formData, "redirectTo"), "/projects");
  try {
    const projectId = requiredText(formData, "projectId", "Project");
    const project = await prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      select: { companyId: true },
    });

    const contact = await prisma.contact.create({
      data: {
        name: requiredText(formData, "name", "Contact name"),
        title: requiredText(formData, "title", "Title"),
        email: optionalText(formData, "email"),
        phone: optionalText(formData, "phone"),
        relationship: requiredText(formData, "relationship", "Relationship"),
        companyId: project.companyId,
      },
    });

    await prisma.projectContact.create({
      data: {
        projectId,
        contactId: contact.id,
        role: textValue(formData, "projectRole") || contact.relationship,
      },
    });

    await logActivity({
      action: "Contact added",
      detail: `Contact added: ${contact.name}.`,
      projectId,
      companyId: project.companyId,
    });

    revalidatePath(redirectTo);
  } catch (error) {
    redirectWithError(formData, redirectTo, error);
  }

  redirect(redirectTo);
}

export async function createDocument(formData: FormData) {
  const redirectTo = safeRedirect(textValue(formData, "redirectTo"), "/projects");
  try {
    const projectId = requiredText(formData, "projectId", "Project");
    const project = await prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      select: { companyId: true },
    });

    const document = await prisma.document.create({
      data: {
        name: requiredText(formData, "name", "File name"),
        type: enumValue(DocumentType, textValue(formData, "type") || "OTHER", "File type"),
        url: requiredText(formData, "localPath", "Local path"),
        notes: optionalText(formData, "notes"),
        sensitivity: textValue(formData, "sensitivity") || "Internal",
        projectId,
        companyId: project.companyId,
      },
    });

    await logActivity({
      action: "File added",
      detail: `File record added: ${document.name}.`,
      projectId,
      companyId: project.companyId,
    });

    revalidatePath(redirectTo);
  } catch (error) {
    redirectWithError(formData, redirectTo, error);
  }

  redirect(redirectTo);
}
