import { Metadata } from 'next';
import React from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freight-graffiti.abundis.com.mx';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const muid = params.id;
  return {
    title: `Interactive AI Network Graph MUID ${muid}`,
    description: `Interactive Graphology and Sigma.js visual network graph showing AI inferences, hashtag links, and post nodes for MUID ${muid}.`,
    alternates: {
      canonical: `${SITE_URL}/graph/${muid}`,
    },
    openGraph: {
      title: `AI Network Graph (MUID ${muid}) | Freight Graffiti DVI`,
      description: `Interactive visual network graph enriched with Computer Vision and NLP classification for MUID ${muid}.`,
      url: `${SITE_URL}/graph/${muid}`,
    },
  };
}

export default function GraphLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
