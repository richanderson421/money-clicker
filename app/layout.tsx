import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Money Clicker',
  description: 'A money-themed incremental game with offline progression.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-emeraldDark text-white antialiased">{children}</body>
    </html>
  );
}
