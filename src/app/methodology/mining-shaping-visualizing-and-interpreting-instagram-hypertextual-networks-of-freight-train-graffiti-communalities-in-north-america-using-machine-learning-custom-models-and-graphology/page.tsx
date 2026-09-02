import React from 'react';
import { Metadata } from 'next';
import { MethodologyPaper } from '@/components/MethodologyPaper';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freight-graffiti.abundis.com.mx';

const PAPER_PATH =
  '/methodology/mining-shaping-visualizing-and-interpreting-instagram-hypertextual-networks-of-freight-train-graffiti-communalities-in-north-america-using-machine-learning-custom-models-and-graphology';

export const metadata: Metadata = {
  title:
    'Mining, Shaping, Visualizing, and Interpreting Instagram Hypertextual Networks of Freight Train Graffiti',
  description:
    'Full academic paper published in UXUC Journal V5 - N2. Research on freight train graffiti communalities in North America using custom machine learning models (TensorFlow, spaCy) and graphology.',
  keywords: [
    'Freight Train Graffiti',
    'Scholarly Paper',
    'UXUC Journal',
    'Graphology Visualization',
    'Instagram Data Mining',
    'Triad of Self-Announcement',
    'Angel Abundis',
  ],
  alternates: {
    canonical: `${SITE_URL}${PAPER_PATH}`,
  },
  openGraph: {
    title:
      'Mining, Shaping, Visualizing, and Interpreting Instagram Hypertextual Networks of Freight Train Graffiti',
    description:
      'Full academic paper published in UXUC Journal V5 - N2 by Angel R. Abundis.',
    url: `${SITE_URL}${PAPER_PATH}`,
    type: 'article',
    siteName: 'Freight Graffiti DVI',
  },
};

export default function LongSlugMethodologyPage() {
  return <MethodologyPaper />;
}
