import './globals.css';
import { Fraunces, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import ScrollReveal from '@/components/ScrollReveal.jsx';

const sans = Inter_Tight({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

const display = Fraunces({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata = {
  title: 'AiWeb',
};

export default function RootLayout({ children }) {
  return (
    <html
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
    >
      <body>
        {children}
        <ScrollReveal />
      </body>
    </html>
  );
}
