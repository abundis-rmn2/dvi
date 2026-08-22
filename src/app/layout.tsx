import 'bootstrap/dist/css/bootstrap.min.css';
import '@/app/globals.css';
import React from 'react';
import { Navigation } from '@/components/Navigation';

export const metadata = {
  title: 'DVI - Data Visualization Interface',
  description: 'Data visualization interface for social network mining and graphs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="container pb-5">{children}</main>
      </body>
    </html>
  );
}
