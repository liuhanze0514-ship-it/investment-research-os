import { DocumentType, ProjectStatus, RoundStage, TaskPriority, TaskStatus } from "@prisma/client";

export const projectStatusLabels: Record<ProjectStatus, string> = {
  NEW: "New",
  SCREENING: "Screening",
  MEETING_SCHEDULED: "Meeting scheduled",
  DUE_DILIGENCE: "Due diligence",
  IC_PREPARATION: "IC preparation",
  IC_APPROVED: "IC approved",
  LEGAL: "Legal",
  INVESTED: "Invested",
  PASSED: "Passed",
  ON_HOLD: "On hold",
};

export const projectStatusOrder: ProjectStatus[] = [
  "NEW",
  "SCREENING",
  "MEETING_SCHEDULED",
  "DUE_DILIGENCE",
  "IC_PREPARATION",
  "IC_APPROVED",
  "LEGAL",
  "INVESTED",
  "PASSED",
  "ON_HOLD",
];

export const taskStatusLabels: Record<TaskStatus, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
  BLOCKED: "Blocked",
  CANCELED: "Canceled",
};

export const taskPriorityLabels: Record<TaskPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export const roundStageLabels: Record<RoundStage, string> = {
  ANGEL: "Angel",
  SEED: "Seed",
  SERIES_A: "Series A",
  SERIES_B: "Series B",
  SERIES_C: "Series C",
  GROWTH: "Growth",
  PRE_IPO: "Pre-IPO",
  BUYOUT: "Buyout",
};

export const documentTypeLabels: Record<DocumentType, string> = {
  PITCH_DECK: "BP",
  FINANCIAL_MODEL: "Financial Model",
  DD_REPORT: "DD Report",
  DATA_ROOM: "Data Room",
  TERM_SHEET: "Term Sheet",
  LEGAL: "Legal",
  MEMO: "Memo",
  OTHER: "Other",
};

export const documentTypeGroups: DocumentType[] = ["PITCH_DECK", "FINANCIAL_MODEL", "DD_REPORT", "TERM_SHEET", "LEGAL", "OTHER"];
