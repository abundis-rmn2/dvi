import { Metadata } from 'next';
import React from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freight-graffiti.abundis.com.mx';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const muid = params.id;
  return {
    title: `Sigma User Interaction Graph MUID ${muid}`,
    description: `User interaction and follower network visualization using Sigma.js engine for MUID ${muid}.`,
    alternates: {
      canonical: `${SITE_URL}/sigma/${muid}`,
    },
    openGraph: {
      title: `User Graph Visualization (MUID ${muid}) | Freight Graffiti DVI`,
      description: `Explore user-to-user interactions and follower networks for freight graffiti MUID ${muid}.`,
      url: `${SITE_URL}/sigma/${muid}`,
    },
  };
}

export default function SigmaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
