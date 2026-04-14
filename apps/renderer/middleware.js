import { NextResponse } from 'next/server';

/**
 * Host-ыг шалган rewrite хийнэ:
 *   <sub>.platform.mn         -> /_sites/sub/<sub>[path]
 *   custom.example.com         -> /_sites/domain/<host>[path]
 *   platform.mn эсвэл localhost -> /_landing (эсвэл эхний хуудас)
 */

const ROOT_DOMAINS = new Set([
  process.env.PLATFORM_ROOT_DOMAIN || 'platform.mn',
  'localhost:3001',
  'localhost',
]);

export function middleware(request) {
  const host = (request.headers.get('host') || '').toLowerCase();
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_sites') || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const hostWithoutPort = host.split(':')[0];
  const rootDomain = process.env.PLATFORM_ROOT_DOMAIN || 'platform.mn';

  // Platform root — landing
  if (ROOT_DOMAINS.has(host) || hostWithoutPort === rootDomain) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();

  if (hostWithoutPort.endsWith(`.${rootDomain}`)) {
    const sub = hostWithoutPort.replace(`.${rootDomain}`, '');
    url.pathname = `/_sites/sub/${sub}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Custom domain
  url.pathname = `/_sites/domain/${hostWithoutPort}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api).*)'],
};
