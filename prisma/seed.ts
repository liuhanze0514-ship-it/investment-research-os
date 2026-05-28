import { PrismaClient, ProjectStatus } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  await prisma.activityLog.deleteMany();
  await prisma.document.deleteMany();
  await prisma.projectContact.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.task.deleteMany();
  await prisma.financingRound.deleteMany();
  await prisma.project.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.company.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  const alice = await prisma.user.create({
    data: {
      name: "Alice Chen",
      email: "alice@northstar.capital",
      role: "Partner",
    },
  });

  const ben = await prisma.user.create({
    data: {
      name: "Ben Wang",
      email: "ben@northstar.capital",
      role: "Investment Manager",
    },
  });

  const advisors = await prisma.organization.create({
    data: {
      name: "Harbor FA",
      type: "FA",
      website: "https://example.com",
      notes: "Cross-border growth and enterprise software mandates.",
    },
  });

  const companies = [
    {
      name: "Meridian Foods",
      sector: "Consumer",
      subsector: "Food supply chain",
      geography: "Jakarta",
      description: "B2B cold-chain marketplace for hotels and restaurant groups.",
      stage: "Growth",
      status: ProjectStatus.NEW,
      source: "Banker intro",
      owner: "Alice Chen",
      thesis: "Procurement fragmentation and freshness SLAs create room for workflow-led consolidation.",
      summary: "New inbound opportunity with working-capital and spoilage diligence questions.",
      risk: "Working capital intensity and spoilage control need deeper diligence.",
      nextStep: "Assign screening owner",
      probability: 22,
      progress: 8,
      amount: 28000000,
      valuation: 135000000,
    },
    {
      name: "CipherWorks",
      sector: "Security",
      subsector: "Application security",
      geography: "Seoul",
      description: "Developer-first application security posture management.",
      stage: "Seed",
      status: ProjectStatus.ON_HOLD,
      source: "Outbound",
      owner: "Ben Wang",
      thesis: "Security remediation workflows continue moving toward engineering teams.",
      summary: "On hold pending Q2 usage data and enterprise conversion proof.",
      risk: "Crowded market and unclear wedge against established platforms.",
      nextStep: "Wait for Q2 usage data",
      probability: 18,
      progress: 16,
      amount: 8000000,
      valuation: 36000000,
    },
    {
      name: "HelioGrid",
      sector: "Climate",
      subsector: "Energy infrastructure",
      geography: "Singapore",
      description: "Distributed energy orchestration platform for commercial buildings.",
      stage: "Series A",
      status: ProjectStatus.DUE_DILIGENCE,
      source: "Founder referral",
      owner: "Alice Chen",
      thesis: "Software layer for behind-the-meter energy assets.",
      summary: "Strong pilots with REIT customers and improving grid-flexibility revenue.",
      risk: "Pilot concentration with three REIT customers and still-evolving tariff regulation.",
      nextStep: "Commercial reference calls",
      probability: 68,
      progress: 52,
      amount: 18000000,
      valuation: 92000000,
    },
    {
      name: "NovaLedger",
      sector: "Fintech",
      subsector: "CFO automation",
      geography: "Hong Kong",
      description: "AI-free finance workflow automation for multi-entity accounting teams.",
      stage: "Seed",
      status: ProjectStatus.SCREENING,
      source: "FA inbound",
      owner: "Ben Wang",
      thesis: "Back-office automation for regional mid-market companies.",
      summary: "Early revenue traction, but channel dependency needs diligence.",
      risk: "Revenue quality is early and channel dependency may dilute go-to-market learning.",
      nextStep: "Clarify retention cohort",
      probability: 34,
      progress: 18,
      amount: 6000000,
      valuation: 28000000,
    },
    {
      name: "AtlasBio",
      sector: "Healthcare",
      subsector: "Diagnostics",
      geography: "Shanghai",
      description: "Point-of-care diagnostics platform for chronic disease monitoring.",
      stage: "Series B",
      status: ProjectStatus.IC_PREPARATION,
      source: "Co-investor",
      owner: "Alice Chen",
      thesis: "Consumables-led recurring revenue with hospital distribution.",
      summary: "Preparing IC memo after commercial and regulatory reference calls.",
      risk: "Regulatory timing and reimbursement coverage vary by province.",
      nextStep: "Draft IC memo",
      probability: 74,
      progress: 71,
      amount: 35000000,
      valuation: 180000000,
    },
    {
      name: "FoundryOps",
      sector: "Industrial",
      subsector: "Manufacturing software",
      geography: "Shenzhen",
      description: "Workflow system for precision manufacturing quote-to-cash.",
      stage: "Series A",
      status: ProjectStatus.MEETING_SCHEDULED,
      source: "Conference",
      owner: "Ben Wang",
      thesis: "Vertical SaaS opportunity in fragmented advanced manufacturing suppliers.",
      summary: "First founder meeting scheduled next week.",
      risk: "Buyer urgency can vary with factory utilization and export cycles.",
      nextStep: "Founder call",
      probability: 46,
      progress: 28,
      amount: 14000000,
      valuation: 76000000,
    },
  ];

  for (const item of companies) {
    const company = await prisma.company.create({
      data: {
        name: item.name,
        sector: item.sector,
        subsector: item.subsector,
        geography: item.geography,
        description: item.description,
        stage: item.stage,
        foundedYear: 2020,
        headcount: 86,
      },
    });

    const project = await prisma.project.create({
      data: {
        name: `${item.name} ${item.stage}`,
        slug: slugify(item.name),
        status: item.status,
        source: item.source,
        owner: item.owner,
        thesis: item.thesis,
        summary: item.summary,
        risk: item.risk,
        nextStep: item.nextStep,
        priority: item.status === ProjectStatus.IC_PREPARATION ? 1 : 2,
        probability: item.probability,
        progress: item.progress,
        expectedCheck: Math.round(item.amount * 0.12),
        targetOwnership: 0.08,
        companyId: company.id,
      },
    });

    const contact = await prisma.contact.create({
      data: {
        name: `${item.name} Founder`,
        title: "CEO",
        email: `founder@${item.name.toLowerCase()}.com`,
        relationship: "Founder",
        companyId: company.id,
      },
    });

    await prisma.projectContact.create({
      data: {
        role: "Founder",
        projectId: project.id,
        contactId: contact.id,
      },
    });

    await prisma.financingRound.create({
      data: {
        stage:
          item.stage === "Seed"
            ? "SEED"
            : item.stage === "Series B"
              ? "SERIES_B"
              : item.stage === "Growth"
                ? "GROWTH"
                : "SERIES_A",
        amount: item.amount,
        valuation: item.valuation,
        leadInvestor: "Northstar Capital",
        companyId: company.id,
        projectId: project.id,
        notes: "Demo financing round for MVP workflow.",
      },
    });

    await prisma.task.createMany({
      data: [
        {
          title: "Review data room index",
          description: "Confirm missing commercial and finance materials.",
          status: "TODO",
          priority: "HIGH",
          projectId: project.id,
          assigneeId: ben.id,
        },
        {
          title: "Update investment notes",
          status: item.status === ProjectStatus.IC_PREPARATION ? "IN_PROGRESS" : "TODO",
          priority: "MEDIUM",
          projectId: project.id,
          assigneeId: alice.id,
        },
      ],
    });

    await prisma.meeting.create({
      data: {
        title: `${item.name} founder call`,
        agenda: "Company overview, financing plan, diligence priorities.",
        startsAt: new Date("2026-06-03T09:30:00.000Z"),
        endsAt: new Date("2026-06-03T10:15:00.000Z"),
        projectId: project.id,
        ownerId: item.owner === "Alice Chen" ? alice.id : ben.id,
        contactId: contact.id,
      },
    });

    await prisma.document.create({
      data: {
        name: `${item.name} pitch deck.pdf`,
        type: "PITCH_DECK",
        url: `/documents/${item.name.toLowerCase()}-deck.pdf`,
        projectId: project.id,
        companyId: company.id,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "Project updated",
        detail: `${item.name} moved to ${item.status.replaceAll("_", " ").toLowerCase()}.`,
        projectId: project.id,
        companyId: company.id,
        userId: item.owner === "Alice Chen" ? alice.id : ben.id,
      },
    });
  }

  await prisma.contact.create({
    data: {
      name: "Mia Lau",
      title: "Managing Director",
      email: "mia@harborfa.example",
      relationship: "Deal source",
      organizationId: advisors.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
