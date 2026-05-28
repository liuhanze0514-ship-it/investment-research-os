export const projectStatusValues = [
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
] as const;

export const projectStatusText: Record<(typeof projectStatusValues)[number], string> = {
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

export const roundStageValues = ["ANGEL", "SEED", "SERIES_A", "SERIES_B", "SERIES_C", "GROWTH", "PRE_IPO", "BUYOUT"] as const;

export const roundStageText: Record<(typeof roundStageValues)[number], string> = {
  ANGEL: "Angel",
  SEED: "Seed",
  SERIES_A: "Series A",
  SERIES_B: "Series B",
  SERIES_C: "Series C",
  GROWTH: "Growth",
  PRE_IPO: "Pre-IPO",
  BUYOUT: "Buyout",
};

export const taskStatusValues = ["TODO", "IN_PROGRESS", "DONE", "BLOCKED", "CANCELED"] as const;

export const taskStatusText: Record<(typeof taskStatusValues)[number], string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
  BLOCKED: "Blocked",
  CANCELED: "Canceled",
};

export const taskPriorityValues = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export const taskPriorityText: Record<(typeof taskPriorityValues)[number], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};
