const LOOPBACK_HOSTS = new Set(['127.0.0.1', '::1', '[::1]']);

export function normalizeHost(host = '') {
  const value = host.toLowerCase();

  if (value.startsWith('[')) {
    const closing = value.indexOf(']');
    return closing === -1 ? value : value.slice(0, closing + 1);
  }

  const lastColon = value.lastIndexOf(':');
  if (lastColon === -1) {
    return value;
  }

  return value.slice(0, lastColon);
}

export function isRootHost(host, rootDomain) {
  return (
    host === 'localhost' ||
    host === 'localhost:3001' ||
    LOOPBACK_HOSTS.has(host) ||
    LOOPBACK_HOSTS.has(normalizeHost(host)) ||
    host === rootDomain ||
    normalizeHost(host) === rootDomain
  );
}

export function resolveSitePathname(host, pathname, rootDomain) {
  const normalizedHost = normalizeHost(host);

  if (isRootHost(host, rootDomain)) {
    return pathname;
  }

  if (normalizedHost.endsWith(`.${rootDomain}`)) {
    const subdomain = normalizedHost.replace(`.${rootDomain}`, '');
    return `/sites/sub/${subdomain}${pathname}`;
  }

  return `/sites/domain/${normalizedHost}${pathname}`;
}
