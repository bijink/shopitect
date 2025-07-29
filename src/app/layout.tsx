import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Shopitect',
  description: 'An architect of shop management application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
