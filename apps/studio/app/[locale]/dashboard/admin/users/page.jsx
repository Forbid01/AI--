import { prisma } from '@aiweb/db';
import UsersTable from './UsersTable.jsx';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage({ params, searchParams }) {
  const locale = params.locale;
  const q = searchParams?.q ?? '';

  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
      ...(q ? { email: { contains: q, mode: 'insensitive' } } : {}),
    },
    take: 100,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, email: true, name: true, role: true, createdAt: true,
      emailVerified: true, marketingOptIn: true,
      _count: { select: { sites: true } },
    },
  });

  return <UsersTable users={users} locale={locale} initialQuery={q} />;
}
