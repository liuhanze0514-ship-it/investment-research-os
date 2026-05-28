import { prisma } from "@/lib/prisma";

export async function logActivity({
  action,
  detail,
  projectId,
  companyId,
  userId,
}: {
  action: string;
  detail: string;
  projectId?: string;
  companyId?: string;
  userId?: string;
}) {
  return prisma.activityLog.create({
    data: {
      action,
      detail,
      projectId,
      companyId,
      userId,
    },
  });
}
