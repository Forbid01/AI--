import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Providers from './providers.jsx';
import ScrollReveal from '@/components/ScrollReveal.jsx';
import SmoothScroll from '@/components/SmoothScroll.jsx';

const sans = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

const display = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
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
  title: 'AiWeb — AI Website Builder',
  description: 'Describe your business. AI builds your website. Launch in minutes.',
};

export default function RootLayout({ children }) {
  return (
    <html
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
        <ScrollReveal />
        <SmoothScroll />
      </body>
    </html>
  );
}
