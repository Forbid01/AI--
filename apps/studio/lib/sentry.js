/**
 * Sentry — only initializes if SENTRY_DSN is set.
 * Otherwise all capture calls no-op.
 */

let initialized = false;
let sentryMod = null;

async function init() {
  if (initialized) return sentryMod;
  initialized = true;

  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return null;

  try {
    const mod = await import('@sentry/nextjs');
    mod.init({
      dsn,
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
      environment: process.env.NODE_ENV,
      release: process.env.GIT_SHA,
    });
    sentryMod = mod;
    return mod;
  } catch {
    return null;
  }
}

export async function captureException(err, context) {
  const s = await init();
  if (s) {
    s.captureException(err, context ? { extra: context } : undefined);
  } else {
    console.error('[sentry:noop]', err, context);
  }
}

export async function captureMessage(msg, level = 'info', context) {
  const s = await init();
  if (s) {
    s.captureMessage(msg, { level, extra: context });
  }
}

export async function setUserContext(user) {
  const s = await init();
  if (s && user?.id) {
    s.setUser({ id: user.id });
  }
}
