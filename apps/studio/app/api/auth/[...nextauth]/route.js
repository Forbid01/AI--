import NextAuthImport from 'next-auth';
import { authOptions } from '@/lib/auth.js';

const NextAuth = NextAuthImport.default ?? NextAuthImport;
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
