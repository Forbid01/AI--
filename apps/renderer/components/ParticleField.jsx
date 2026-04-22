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
  tech: {
    fullScreen: { enable: false },
    fpsLimit: 60,
    detectRetina: true,
    background: { color: { value: 'transparent' } },
    particles: {
      number: { value: 48, density: { enable: true, area: 900 } },
      color: { value: ['#7c5cff', '#22d3ee', '#a855f7'] },
      shape: { type: 'circle' },
      opacity: { value: { min: 0.15, max: 0.55 } },
      size: { value: { min: 1, max: 2.5 } },
      move: {
        enable: true,
        speed: 0.55,
        direction: 'none',
        random: true,
        straight: false,
        outModes: { default: 'out' },
      },
      links: {
        enable: true,
        distance: 140,
        color: '#7c5cff',
        opacity: 0.22,
        width: 1,
      },
    },
    interactivity: {
      events: { onHover: { enable: true, mode: 'grab' } },
      modes: { grab: { distance: 160, links: { opacity: 0.5 } } },
    },
  },
  luxe: {
    fullScreen: { enable: false },
    fpsLimit: 60,
    detectRetina: true,
    background: { color: { value: 'transparent' } },
    particles: {
      number: { value: 55, density: { enable: true, area: 900 } },
      color: { value: ['#d4af37', '#f5e7a8', '#c9a227'] },
      shape: { type: 'circle' },
      opacity: { value: { min: 0.1, max: 0.45 }, animation: { enable: true, speed: 0.6, sync: false } },
      size: { value: { min: 0.8, max: 1.8 } },
      move: {
        enable: true,
        speed: 0.3,
        direction: 'top',
        straight: false,
        outModes: { default: 'out' },
      },
    },
  },
  playful: {
    fullScreen: { enable: false },
    fpsLimit: 60,
    detectRetina: true,
    background: { color: { value: 'transparent' } },
    particles: {
      number: { value: 35 },
      color: { value: ['#ec4899', '#f59e0b', '#10b981', '#8b5cf6'] },
      shape: { type: 'circle' },
      opacity: { value: { min: 0.3, max: 0.7 } },
      size: { value: { min: 3, max: 8 } },
      move: {
        enable: true,
        speed: 1.2,
        direction: 'none',
        random: true,
        outModes: { default: 'bounce' },
      },
    },
  },
};

export default function ParticleField({ vibe = 'tech', className = '' }) {
  const [Particles, setParticles] = useState(null);
  const config = useMemo(() => CONFIGS[vibe] ?? CONFIGS.tech, [vibe]);

  useEffect(() => {
    let mounted = true;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    ensureEngine()
      .then((P) => {
        if (mounted) setParticles(() => P);
      })
      .catch((err) => console.warn('[ParticleField] init failed:', err));

    return () => {
      mounted = false;
    };
  }, []);

  if (!Particles) return null;

  return (
    <Particles
      id={`tsparticles-${vibe}`}
      options={config}
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  );
}
