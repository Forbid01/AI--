import { NextResponse } from 'next/server';
import { isRootHost, normalizeHost, resolveSitePathname } from '@/lib/hostRouting.js';

/**
 * Host-ыг шалган rewrite хийнэ:
 *   <sub>.platform.mn         -> /sites/sub/<sub>[path]
 *   custom.example.com         -> /sites/domain/<host>[path]
 *   platform.mn эсвэл localhost -> /_landing (эсвэл эхний хуудас)
 */

export function middleware(request) {
  const host = (request.headers.get('host') || '').toLowerCase();
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/sites') || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const rootDomain = process.env.PLATFORM_ROOT_DOMAIN || 'platform.mn';

  // Platform root — landing
  if (isRootHost(host, rootDomain)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = resolveSitePathname(normalizeHost(host), pathname, rootDomain);
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api).*)'],
};
