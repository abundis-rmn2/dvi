import { Metadata } from 'next';
import React from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freight-graffiti.abundis.com.mx';

export const metadata: Metadata = {
  title: 'Methodology Paper: Instagram Hypertextual Networks of Freight Train Graffiti',
  description:
    'Academic methodology paper published in UXUC Journal (V5 N2): Mining, shaping, visualizing, and interpreting Instagram hypertextual networks of freight train graffiti using machine learning and graphology.',
  keywords: [
    'UXUC Journal Paper',
    'Freight Train Graffiti Methodology',
    'Graphology Social Network',
    'Multimodal Machine Learning',
    'Triad of Self-Announcement',
    'Angel R. Abundis',
  ],
  alternates: {
    canonical: `${SITE_URL}/methodology`,
  },
  openGraph: {
    title: 'Methodology Paper: Freight Train Graffiti Networks & Multimodal AI',
    description:
      'Academic methodology paper on mining, shaping, visualizing, and interpreting Instagram hypertextual networks of freight train graffiti in North America.',
    url: `${SITE_URL}/methodology`,
  },
};

export default function MethodologyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
