import { Metadata } from 'next';
import React from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freight-graffiti.abundis.com.mx';

export const metadata: Metadata = {
  title: 'Hashtag Networks & Data Mining Dashboard (/hashtags)',
  description:
    'Explore hashtag co-occurrence networks, hashtag data mining tasks, seed nodes, post counts, and graph visualizations for North American freight train graffiti communalities.',
  alternates: {
    canonical: `${SITE_URL}/hashtags`,
  },
  openGraph: {
    title: 'Hashtag Networks & Data Mining Dashboard | Freight Graffiti DVI',
    description:
      'Analyze Instagram hashtag co-occurrence networks, seed nodes, network metrics, and social network data mining tasks for freight train graffiti.',
    url: `${SITE_URL}/hashtags`,
    type: 'website',
    siteName: 'Freight Graffiti DVI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hashtag Networks & Data Mining Dashboard | Freight Graffiti DVI',
    description:
      'Explore hashtag co-occurrence networks, seed nodes, network metrics, and data mining tasks for North American freight train graffiti.',
  },
};

export default function HashtagsRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
