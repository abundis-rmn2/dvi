import { Metadata } from 'next';
import React from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freight-graffiti.abundis.com.mx';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const muid = params.id;
  return {
    title: `Task Details & Dataset MUID ${muid}`,
    description: `Detailed social network mining task metadata, post counts, hashtag distributions, and user interactions for MUID ${muid}.`,
    alternates: {
      canonical: `${SITE_URL}/tasks/${muid}`,
    },
    openGraph: {
      title: `Task Details (MUID ${muid}) | Freight Graffiti DVI`,
      description: `Explore mined posts, hashtags, and network metrics for task ${muid}.`,
      url: `${SITE_URL}/tasks/${muid}`,
    },
  };
}

export default function TaskDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
