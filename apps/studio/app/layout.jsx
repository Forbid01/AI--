import './globals.css';

export const metadata = {
  title: 'AiWeb — AI-powered small business websites',
  description: 'AI-аар бизнесийн вэбсайтаа хэдхэн минутад',
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
