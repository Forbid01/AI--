'use client';

import { useEffect, useState, useMemo } from 'react';

let enginePromise = null;

async function ensureEngine() {
  if (enginePromise) return enginePromise;
  enginePromise = (async () => {
    const [reactMod, slimMod] = await Promise.all([
      import('@tsparticles/react'),
      import('@tsparticles/slim'),
    ]);
    await reactMod.initParticlesEngine(async (engine) => {
      await slimMod.loadSlim(engine);
    });
    return reactMod.default;
  })();
  return enginePromise;
}

const CONFIGS = {
  landing: {
    fullScreen: { enable: false },
    fpsLimit: 60,
    detectRetina: true,
    background: { color: { value: 'transparent' } },
    particles: {
      number: { value: 55, density: { enable: true, area: 1100 } },
      color: { value: ['#7c5cff', '#22d3ee', '#a855f7', '#ec4899'] },
      shape: { type: 'circle' },
      opacity: { value: { min: 0.15, max: 0.5 }, animation: { enable: true, speed: 0.3 } },
      size: { value: { min: 0.8, max: 2.2 } },
      move: {
        enable: true,
        speed: 0.4,
        direction: 'none',
        random: true,
        outModes: { default: 'out' },
      },
      links: {
        enable: true,
        distance: 150,
        color: '#7c5cff',
        opacity: 0.18,
        width: 1,
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'grab' },
        onClick: { enable: false },
      },
      modes: {
        grab: { distance: 180, links: { opacity: 0.4 } },
      },
    },
  },
  subtle: {
    fullScreen: { enable: false },
    fpsLimit: 60,
    detectRetina: true,
    background: { color: { value: 'transparent' } },
    particles: {
      number: { value: 30 },
      color: { value: '#7c5cff' },
      shape: { type: 'circle' },
      opacity: { value: { min: 0.1, max: 0.3 } },
      size: { value: { min: 1, max: 2 } },
      move: { enable: true, speed: 0.3, direction: 'top', straight: false, outModes: { default: 'out' } },
    },
  },
};

export default function ParticleBackground({ variant = 'landing', className = '' }) {
  const [Particles, setParticles] = useState(null);
  const config = useMemo(() => CONFIGS[variant] ?? CONFIGS.landing, [variant]);

  useEffect(() => {
    let mounted = true;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    ensureEngine()
      .then((P) => mounted && setParticles(() => P))
      .catch((err) => console.warn('[ParticleBackground] init failed:', err));

    return () => {
      mounted = false;
    };
  }, []);

  if (!Particles) return null;

  return (
    <Particles
      id={`tsparticles-${variant}`}
      options={config}
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  );
}
