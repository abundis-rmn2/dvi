import React from 'react';
import { Metadata } from 'next';
import { MethodologyPaper } from '@/components/MethodologyPaper';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freight-graffiti.abundis.com.mx';

export const metadata: Metadata = {
  title: 'Research Methodology & Academic Paper | Freight Graffiti DVI',
  description:
    'Academic paper: Mining, Shaping, Visualizing, and Interpreting Instagram Hypertextual Networks of Freight Train Graffiti Communalities in North America using Machine Learning and Graphology.',
  keywords: [
    'Freight Train Graffiti',
    'Research Methodology',
    'UXUC Journal',
    'Graphology Paper',
    'Multimodal Machine Learning',
    'Instagram Hypertextual Networks',
    'Angel Abundis',
  ],
  alternates: {
    canonical: `${SITE_URL}/methodology`,
  },
  openGraph: {
    title: 'Research Methodology & Academic Paper | Freight Graffiti DVI',
    description:
      'Mining, shaping, visualizing, and interpreting Instagram hypertextual networks of freight train graffiti communalities in North America.',
    url: `${SITE_URL}/methodology`,
    type: 'article',
    siteName: 'Freight Graffiti DVI',
  },
};

export default function MethodologyPage() {
  return <MethodologyPaper />;
}
