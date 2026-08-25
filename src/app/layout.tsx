import 'bootstrap/dist/css/bootstrap.min.css';
import '@/app/globals.css';
import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

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
      <body className="d-flex flex-column min-vh-100">
        <Navigation />
        <main className="container pb-5 flex-grow-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
