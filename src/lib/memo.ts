import { documentTypeLabels, projectStatusLabels, roundStageLabels, taskPriorityLabels, taskStatusLabels } from "@/lib/db/options";
import type { ProjectDetail } from "@/lib/db/projects";
import { formatCurrency, formatDate } from "@/lib/utils";

function line(value: string | null | undefined, fallback = "n/a") {
  return value && value.trim().length > 0 ? value : fallback;
}

export function buildInvestmentMemo(project: ProjectDetail) {
  const company = project.company;
  const latestRound = project.financingRounds[0];
  const contacts = project.projectContacts.map(({ contact, role }) => `- ${contact.name}, ${contact.title} (${role})`);
  const tasks = project.tasks.map(
    (task) => `- [${task.status === "DONE" ? "x" : " "}] ${task.title} - ${taskStatusLabels[task.status]}, ${taskPriorityLabels[task.priority]}`,
  );
  const meetings = project.meetings.map(
    (meeting) => `- ${formatDate(meeting.startsAt)} - ${meeting.title}${meeting.notes ? `: ${meeting.notes}` : ""}`,
  );
  const documents = project.documents.map((document) => `- ${documentTypeLabels[document.type]} - ${document.name}: ${document.url}`);

  return `# Investment Memo: ${company.name}

## 1. Executive Summary

${line(project.summary)}

## 2. Company Overview

- Company: ${company.name}
- Legal name: ${line(company.legalName)}
- Sector: ${company.sector}${company.subsector ? ` / ${company.subsector}` : ""}
- Geography: ${company.geography}
- Website: ${line(company.website)}
- Description: ${line(company.description)}

## 3. Project Snapshot

- Project: ${project.name}
- Status: ${projectStatusLabels[project.status]}
- Owner: ${project.owner}
- Source: ${project.source}
- Priority: P${project.priority}
- Conviction: ${project.probability}%
- Diligence progress: ${project.progress}%
- Next step: ${project.nextStep}

## 4. Financing

- Stage: ${latestRound ? roundStageLabels[latestRound.stage] : "n/a"}
- Amount: ${latestRound ? formatCurrency(latestRound.amount) : "n/a"}
- Valuation: ${latestRound?.valuation ? formatCurrency(latestRound.valuation) : "n/a"}
- Currency: ${latestRound?.currency ?? "n/a"}
- Lead investor: ${line(latestRound?.leadInvestor)}
- Expected check: ${project.expectedCheck ? formatCurrency(project.expectedCheck) : "n/a"}
- Target ownership: ${project.targetOwnership ? `${(project.targetOwnership * 100).toFixed(1)}%` : "n/a"}

## 5. Investment Thesis

${line(project.thesis)}

## 6. Key Risks

${line(project.risk, "No risk note recorded.")}

## 7. Contacts

${contacts.length > 0 ? contacts.join("\n") : "- No contacts recorded."}

## 8. Diligence Tasks

${tasks.length > 0 ? tasks.join("\n") : "- No tasks recorded."}

## 9. Meetings

${meetings.length > 0 ? meetings.join("\n") : "- No meetings recorded."}

## 10. Documents

${documents.length > 0 ? documents.join("\n") : "- No documents recorded."}

## 11. Recommendation

- Decision: TBD
- IC owner: ${project.owner}
- Required follow-ups: ${project.nextStep}
`;
}
