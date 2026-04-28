import { prisma } from '@aiweb/db';

const QUOTAS = {
  free:    { sites: 1,      aiPerDay: 3 },
  starter: { sites: 5,      aiPerDay: 30 },
  pro:     { sites: Infinity, aiPerDay: Infinity },
};

async function getPlan(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      role: true, 
      subscription: {
        select: { plan: true }
      }
    }
  });

  if (user?.role === 'superadmin' || user?.role === 'admin') {
    return 'pro';
  }

  return user?.subscription?.plan ?? 'free';
}

export async function checkSiteQuota(userId) {
  const plan = await getPlan(userId);
  const quota = QUOTAS[plan] ?? QUOTAS.free;
  if (quota.sites === Infinity) return { ok: true };
  const count = await prisma.site.count({ where: { userId, deletedAt: null } });
  if (count >= quota.sites) {
    return {
      ok: false,
      code: 'SITE_QUOTA_EXCEEDED',
      message: `Та ${plan} багцад ${quota.sites} сайт хүртэл үүсгэж болно. Багцаа шинэчлэх үү?`,
      quota: quota.sites,
      used: count,
    };
  }
  return { ok: true };
}

export async function checkAiQuota(userId) {
  const plan = await getPlan(userId);
  const quota = QUOTAS[plan] ?? QUOTAS.free;
  if (quota.aiPerDay === Infinity) return { ok: true };

  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const count = await prisma.aiJob.count({
    where: {
      site: { userId },
      createdAt: { gte: startOfDay },
    },
  });
  if (count >= quota.aiPerDay) {
    return {
      ok: false,
      code: 'AI_QUOTA_EXCEEDED',
      message: `Өнөөдрийн AI generation хязгаар (${quota.aiPerDay}) дууссан. Маргааш дахин оролдоорой.`,
      quota: quota.aiPerDay,
      used: count,
    };
  }
  return { ok: true };
}
