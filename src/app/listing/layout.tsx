import { Metadata } from 'next';
import React from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freight-graffiti.abundis.com.mx';

export const metadata: Metadata = {
  title: 'Data Mining Tasks Dashboard & Datasets',
  description:
    'Explore social network data mining tasks, MUID identifiers, hashtags depth, post counts, and machine learning inference datasets.',
  alternates: {
    canonical: `${SITE_URL}/hashtags`,
  },
  openGraph: {
    title: 'Data Mining Tasks Dashboard & Datasets | Freight Graffiti DVI',
    description:
      'Access mined tasks, MUIDs, network graph data, and AI inference counts for freight train graffiti communities in North America.',
    url: `${SITE_URL}/hashtags`,
  },
};

export default function ListingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
