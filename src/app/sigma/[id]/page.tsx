import React from 'react';
import { Metadata } from 'next';
import { GraphAnalysisView } from '@/components/GraphAnalysisView';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freight-graffiti.abundis.com.mx';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return {
    title: `User Graph Analysis | Freight Graffiti DVI`,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${SITE_URL}/tasks/${params.id}`,
    },
  };
}

export default function SigmaPage() {
  return <GraphAnalysisView />;
}
