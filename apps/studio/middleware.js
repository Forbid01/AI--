import { NextResponse } from 'next/server';

const LOCALES = ['mn', 'en'];
const DEFAULT_LOCALE = 'mn';

function detectLocale(request) {
  const cookie = request.cookies.get('locale')?.value;
  if (cookie && LOCALES.includes(cookie)) return cookie;
  const accept = request.headers.get('accept-language') || '';
  if (/^en/i.test(accept)) return 'en';
  return DEFAULT_LOCALE;
}

export function middleware(request) {
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
  if (LOCALES.includes(first)) return NextResponse.next();

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
