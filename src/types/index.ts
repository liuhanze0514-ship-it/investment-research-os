export type ProjectStatus =
  | "NEW"
  | "SCREENING"
  | "MEETING_SCHEDULED"
  | "DUE_DILIGENCE"
  | "IC_PREPARATION"
  | "IC_APPROVED"
  | "LEGAL"
  | "INVESTED"
  | "PASSED"
  | "ON_HOLD";

export type DashboardProject = {
  id: string;
  slug: string;
  name: string;
  company: string;
  sector: string;
  subsector: string;
  geography: string;
  status: ProjectStatus;
  owner: string;
  source: string;
  summary: string;
  thesis: string;
  risk: string;
  expectedCheck: number;
  amount: number;
  valuation: number;
  priority: number;
  nextStep: string;
  lastTouch: string;
  probability: number;
  progress: number;
  documents: number;
  contacts: ProjectContact[];
  tasks: DealTask[];
  meetings: DealMeeting[];
  metrics: DealMetric[];
};

export type ActivityItem = {
  id: string;
  action: string;
  detail: string;
  actor: string;
  time: string;
};

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type DealTask = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  owner: string;
  dueDate: string;
  projectId: string;
};

export type DealMeeting = {
  id: string;
  title: string;
  date: string;
  participants: string[];
  outcome: string;
};

export type ProjectContact = {
  id: string;
  name: string;
  title: string;
  organization: string;
  relationship: string;
  email: string;
};

export type DealMetric = {
  label: string;
  value: string;
  trend: string;
};
