import { Metadata } from 'next';
import React from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freight-graffiti.abundis.com.mx';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const hashtag = params.id;
  return {
    title: `Hashtag Network Analysis: #${hashtag}`,
    description: `Hashtag co-occurrence and network graph analysis for #${hashtag} in North American freight train graffiti communalities.`,
    alternates: {
      canonical: `${SITE_URL}/hashtags/${hashtag}`,
    },
    openGraph: {
      title: `Hashtag Analysis #${hashtag} | Freight Graffiti DVI`,
      description: `Social network co-occurrence and visual graph metrics for hashtag #${hashtag}.`,
      url: `${SITE_URL}/hashtags/${hashtag}`,
    },
  };
}

export default function HashtagLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
