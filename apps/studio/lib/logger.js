/**
 * Structured logger with pino when available, falls back to console.
 * Redacts PII fields automatically.
 */

let pinoInstance = null;

async function ensurePino() {
  if (pinoInstance) return pinoInstance;
  try {
    const pino = (await import('pino')).default;
    pinoInstance = pino({
      level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
      redact: {
        paths: ['password', 'passwordHash', 'token', '*.token', '*.password', 'authorization', 'cookie', 'headers.authorization', 'headers.cookie'],
        censor: '[redacted]',
      },
      base: { app: process.env.APP_NAME || 'studio', env: process.env.NODE_ENV || 'development' },
    });
  } catch {
    pinoInstance = null;
  }
  return pinoInstance;
}

function stringify(obj) {
  try {
    return JSON.stringify(obj);
  } catch {
    return '[unserializable]';
  }
}

function fallback(level) {
  return (msg, meta) => {
    const line = meta ? `[${level}] ${msg} ${stringify(meta)}` : `[${level}] ${msg}`;
    const fn = level === 'error' || level === 'fatal' ? console.error : level === 'warn' ? console.warn : console.log;
    fn(line);
  };
}

const log = {
  debug: fallback('debug'),
  info:  fallback('info'),
  warn:  fallback('warn'),
  error: fallback('error'),
  fatal: fallback('fatal'),
};

// Replace with real pino once loaded
ensurePino().then((p) => {
  if (!p) return;
  for (const level of ['debug', 'info', 'warn', 'error', 'fatal']) {
    log[level] = (msg, meta) => (meta ? p[level](meta, msg) : p[level](msg));
  }
});

export { log };
export default log;

/** Generate a request id for tracing. */
export function requestId() {
  return `req_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
