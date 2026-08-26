import 'bootstrap/dist/css/bootstrap.min.css';
import '@/app/globals.css';
import React from 'react';
import { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freight-graffiti.abundis.com.mx';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Freight Graffiti DVI | Multimodal AI Network Visualization',
    template: '%s | Freight Graffiti DVI',
  },
  description:
    'Data Visualization Interface (DVI) for North American Freight Train Graffiti Networks using Multimodal Machine Learning Classification Models (TensorFlow, spaCy) and Graphology.',
  keywords: [
    'Freight Train Graffiti',
    'North America Railroad Graffiti',
    'Data Visualization Interface',
    'Graphology',
    'Multimodal Machine Learning',
    'Social Network Mining',
    'Instagram Network Analysis',
    'Triad of Self-Announcement',
    'Wildstyle Classification',
    'Angel Abundis',
    'Universidad de Guadalajara',
    'UXUC Journal',
  ],
  authors: [{ name: 'Angel R. Abundis', url: 'https://www.abundis.com.mx' }],
  creator: 'Angel R. Abundis',
  publisher: 'Universidad de Guadalajara — CADS',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${SITE_URL}/`,
    siteName: 'Freight Graffiti DVI',
    title: 'Freight Train Graffiti Network Visualization & Multimodal AI Research',
    description:
      'Mining, shaping, visualizing, and interpreting Instagram hypertextual networks of freight train graffiti communalities in North America using machine learning and graphology.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Freight Train Graffiti Network Visualization & Multimodal AI Research',
    description:
      'Mining, shaping, visualizing, and interpreting Instagram hypertextual networks of freight train graffiti communalities in North America.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'Freight Graffiti DVI',
        description: 'Data Visualization Interface for Freight Train Graffiti Networks in North America',
        inLanguage: 'en',
      },
      {
        '@type': 'ResearchProject',
        '@id': `${SITE_URL}/#project`,
        name: 'Use of Machine Learning Classification Models in Freight Graffiti Network Graphing',
        url: `${SITE_URL}/`,
        author: {
          '@type': 'Person',
          name: 'Angel R. Abundis',
          'sameAs': [
            'https://www.abundis.com.mx',
            'https://www.abundis.com.mx/en/thesis/visualization-of-a-hypertextual-interaction-field-in-the-form-of-a-network-graph-using-computational-processes-case-study-graffiti-on-freight-trains-in-north-america',
          ],
        },
        parentOrganization: {
          '@type': 'EducationalOrganization',
          name: 'Universidad de Guadalajara',
          alternateName: 'UDG - CADS',
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="d-flex flex-column min-vh-100">
        <Navigation />
        <main className="container pb-5 flex-grow-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

