'use client';

import React from 'react';
import { AIGraphViewer } from '@/components/AIGraphViewer';

export function AIGraphPageClient({ muid }: { muid: string }) {
  return <AIGraphViewer muid={muid} />;
}
