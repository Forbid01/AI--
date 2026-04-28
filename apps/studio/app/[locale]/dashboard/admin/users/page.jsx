import { prisma } from '@aiweb/db';
import { requireUser } from '@/lib/auth.js';
import UsersTable from './UsersTable.jsx';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage({ params, searchParams }) {
  const locale = params.locale;
  const q = searchParams?.q ?? '';
  const showDeleted = searchParams?.deleted === '1';

  const authed = await requireUser();
  const [currentUser, users] = await Promise.all([
    prisma.user.findUnique({ where: { id: authed.id }, select: { id: true, role: true } }),
    prisma.user.findMany({
      where: {
        ...(showDeleted ? { deletedAt: { not: null } } : { deletedAt: null }),
        ...(q ? { email: { contains: q, mode: 'insensitive' } } : {}),
      },
      take: 100,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, email: true, name: true, role: true, createdAt: true,
        emailVerified: true, deletedAt: true,
        _count: { select: { sites: true } },
      },
    }),
  ]);

  return (
    <UsersTable
      users={users}
      locale={locale}
      initialQuery={q}
      showDeleted={showDeleted}
      currentUserId={currentUser?.id}
      currentUserRole={currentUser?.role}
    />
  );
}
