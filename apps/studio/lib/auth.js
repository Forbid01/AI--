import CredentialsProviderImport from 'next-auth/providers/credentials';
import GoogleProviderImport from 'next-auth/providers/google';
import { getServerSession } from 'next-auth/next';
import bcrypt from 'bcryptjs';
import { prisma } from '@aiweb/db';
import log from '@/lib/logger.js';

const CredentialsProvider = CredentialsProviderImport.default ?? CredentialsProviderImport;
const GoogleProvider = GoogleProviderImport.default ?? GoogleProviderImport;

const providers = [
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
];

// Add Google provider only when credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

export const authOptions = {
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 30 },
  pages: { signIn: '/signin' }, // middleware adds locale prefix automatically
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const existing = await prisma.user.findUnique({ where: { email: user.email } });
          if (existing) {
            // Link googleId if not already linked
            if (!existing.googleId) {
              await prisma.user.update({
                where: { id: existing.id },
                data: { googleId: account.providerAccountId, emailVerified: existing.emailVerified ?? new Date() },
              });
            }
          } else {
            // Create new user from Google
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name ?? null,
                googleId: account.providerAccountId,
                emailVerified: new Date(),
              },
            });
            log.info('user.signup.google', { email: user.email });
          }
        } catch (e) {
          log.error('google signIn callback failed', { error: e.message });
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // Credentials login: user object is returned from authorize()
      if (user && account?.provider === 'credentials') {
        token.uid = user.id;
        token.preferredLocale = user.preferredLocale;
      }
      // Google login: look up the DB user by email to get the real id
      if (account?.provider === 'google' && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, preferredLocale: true },
        });
        if (dbUser) {
          token.uid = dbUser.id;
          token.preferredLocale = dbUser.preferredLocale;
        }
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
