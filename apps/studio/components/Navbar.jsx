'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import LanguageToggle from '@/components/LanguageToggle.jsx';
import UserMenu from '@/components/UserMenu.jsx';

/* ── Logo mark: hexagon SVG with animated inner shimmer ── */
function LogoMark({ scrolled }) {
  return (
    <motion.div
      className="relative h-9 w-9 rounded-xl overflow-hidden grid place-items-center shrink-0"
      style={{
        background: 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-mid) 50%, var(--gradient-end) 100%)',
        boxShadow: scrolled
          ? '0 0 0 1px rgba(124,92,255,0.3), 0 4px 16px rgba(124,92,255,0.25)'
          : '0 0 0 1px rgba(124,92,255,0.2), 0 2px 8px rgba(124,92,255,0.15)',
      }}
      whileHover={{ scale: 1.1, rotate: 8 }}
      transition={{ type: 'spring', stiffness: 340, damping: 20 }}
    >
      {/* Shimmer sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
      />
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" fill="white" fillOpacity="0.95" />
      </svg>
    </motion.div>
  );
}

/* ── Scroll progress bar ── */
function ScrollProgress() {
  const progress = useMotionValue(0);
  const smoothProgress = useSpring(progress, { stiffness: 80, damping: 18 });

  useEffect(() => {
    function update() {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      if (scrollable <= 0) { progress.set(0); return; }
      progress.set(el.scrollTop / scrollable);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, [progress]);

  return (
    <motion.div
      className="absolute bottom-0 left-0 h-[1.5px] origin-left"
      style={{
        scaleX: smoothProgress,
        background: 'linear-gradient(90deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end))',
        boxShadow: '0 0 6px var(--gradient-mid)',
      }}
    />
  );
}

/* ── Main Navbar ── */
export default function Navbar({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const [scrolled, setScrolled] = useState(false);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setAtTop(y < 10);
      setScrolled(y > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      className="sticky top-0 z-50 w-full"
      animate={{
        backgroundColor: scrolled
          ? 'rgba(10,8,20,0.82)'
          : 'rgba(10,8,20,0.0)',
        borderBottomColor: scrolled
          ? 'rgba(255,255,255,0.08)'
          : 'rgba(255,255,255,0.0)',
        backdropFilter: scrolled ? 'blur(20px) saturate(1.6)' : 'blur(0px)',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.6)' : 'blur(0px)',
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ borderBottomWidth: 1, borderBottomStyle: 'solid' }}
    >
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between relative">

        {/* Brand */}
        <Link href={`/${locale}`} className="flex items-center gap-2.5 group" aria-label="AiWeb">
          <LogoMark scrolled={scrolled} />
          <div className="flex flex-col leading-none">
            <motion.span
              className="font-display text-lg font-bold tracking-[-0.02em]"
              animate={{ opacity: 1 }}
            >
              AiWeb
            </motion.span>
            <span className="text-[10px] font-mono text-[var(--text-muted)] tracking-widest">
              AI · STUDIO
            </span>
          </div>
        </Link>

        {/* Center nav links (desktop) */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1">
          {[
            { href: `/${locale}/dashboard`, label: L('Хяналтын самбар', 'Dashboard') },
            { href: `/${locale}/dashboard/sites/new`, label: L('Шинэ сайт', 'New site') },
            { href: `/${locale}/dashboard/billing`, label: L('Төлбөр', 'Billing') },
          ].map(({ href, label }) => (
            <NavLink key={href} href={href}>{label}</NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageToggle current={locale} />
          <UserMenu locale={locale} />
        </div>
      </div>

      {/* Scroll progress line */}
      <ScrollProgress />
    </motion.header>
  );
}

/* Pill-style nav link with hover bg */
function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="relative px-3.5 py-1.5 rounded-full text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity"
        layoutId="nav-hover"
      />
      <span className="relative">{children}</span>
    </Link>
  );
}
