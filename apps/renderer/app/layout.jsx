import './globals.css';

export const metadata = {
  title: 'AiWeb site',
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
