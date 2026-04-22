'use client';

import { useEffect, useState } from 'react';

export default function LottieScene({ src, className = '', loop = true, autoplay = true, style }) {
  const [Lottie, setLottie] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (typeof window === 'undefined') return;

    (async () => {
      try {
        const mod = await import('lottie-react');
        if (mounted) setLottie(() => mod.default);
      } catch (err) {
        console.warn('[LottieScene] failed to load lottie-react:', err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!src) return;

    if (typeof src === 'object') {
      setData(src);
      return;
    }

    (async () => {
      try {
        const res = await fetch(src);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        console.warn('[LottieScene] failed to fetch src:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!Lottie || !data) return null;

  return (
    <Lottie
      animationData={data}
      loop={loop}
      autoplay={autoplay}
      className={className}
      style={style}
    />
  );
}
