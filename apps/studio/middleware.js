import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const LOCALES = ['mn', 'en'];
const DEFAULT_LOCALE = 'mn';

function detectLocale(request) {
  const cookie = request.cookies.get('locale')?.value;
  if (cookie && LOCALES.includes(cookie)) return cookie;
  const accept = request.headers.get('accept-language') || '';
  if (/^en/i.test(accept)) return 'en';
  return DEFAULT_LOCALE;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/templates') ||
    /\.[a-z0-9]+$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  const first = pathname.split('/')[1];
  const hasLocale = LOCALES.includes(first);

  if (!hasLocale) {
    const locale = detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url);
  }

  const afterLocale = pathname.replace(/^\/(mn|en)/, '');
  if (afterLocale.startsWith('/dashboard')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = `/${first}/signin`;
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
