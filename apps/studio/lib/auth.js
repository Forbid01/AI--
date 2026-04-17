import CredentialsProviderImport from 'next-auth/providers/credentials';
import { getServerSession } from 'next-auth/next';
import bcrypt from 'bcryptjs';
import { prisma } from '@aiweb/db';

const CredentialsProvider = CredentialsProviderImport.default ?? CredentialsProviderImport;

export const authOptions = {
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 30 },
  pages: { signIn: '/signin' }, // middleware adds locale prefix automatically
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name, preferredLocale: user.preferredLocale };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.preferredLocale = user.preferredLocale;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.uid) {
        session.user.id = token.uid;
        session.user.preferredLocale = token.preferredLocale;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return prisma.user.findUnique({ where: { id: session.user.id } });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}
