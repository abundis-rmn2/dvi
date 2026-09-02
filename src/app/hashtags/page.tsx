import React from 'react';
import { Metadata } from 'next';
import { getTasksServerPayload } from '@/lib/db';
import { HashtagsDashboardClient, Task } from '@/components/HashtagsDashboardClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freight-graffiti.abundis.com.mx';

export const metadata: Metadata = {
  title: 'Instagram Hashtags Data Mining Tasks & Network Graph Datasets',
  description:
    'Full index of Instagram data mining tasks, seed nodes, hashtag co-occurrences, user communalities, and multimodal machine learning inferences for freight train graffiti in North America.',
  keywords: [
    'Instagram Hashtags Data Mining',
    'Freight Train Graffiti',
    'Network Graph Datasets',
    'Graphology',
    'Machine Learning Inferences',
    'Seed Nodes',
  ],
  alternates: {
    canonical: `${SITE_URL}/hashtags`,
  },
  openGraph: {
    title: 'Instagram Hashtags Data Mining Tasks & Network Graph Datasets',
    description:
      'Full index of Instagram data mining tasks, seed nodes, hashtag co-occurrences, user communalities, and multimodal machine learning inferences.',
    url: `${SITE_URL}/hashtags`,
    type: 'website',
    siteName: 'Freight Graffiti DVI',
  },
};

export default async function HashtagsPage() {
  const tasks: Task[] = getTasksServerPayload();

  const totalHashtagTasks = tasks.filter(
    (t) =>
      t.mining_type?.toLowerCase().includes('hashtag') ||
      t.seed_node.startsWith('#') ||
      !t.mining_type?.toLowerCase().includes('user')
  ).length;

  const uniqueSeeds = new Set(tasks.map((t) => t.seed_node)).size;
  const totalPostsMined = tasks.reduce((sum, t) => sum + (t.p_count || 0), 0);
  const totalHashtagsExtracted = tasks.reduce((sum, t) => sum + (t.h_count || 0), 0);

  return (
    <div className="container py-3">
      {/* Top Banner Header */}
      <section className="bg-dark text-white p-4 p-md-5 rounded-4 shadow mb-4 border border-secondary">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <span className="badge bg-primary px-3 py-2 mb-2 font-monospace">
              📊 RELATIONAL DATA MINING DASHBOARD
            </span>
            <h1 className="display-6 fw-bold mb-2">
              Instagram Hashtag Mining Tasks &amp; AI Graphs
            </h1>
            <p className="lead text-light mb-0 fs-5 opacity-90">
              MUID Task Index of Freight Train Graffiti Networks, User Communalities &amp; Machine Learning Inferences
            </p>
          </div>
        </div>
      </section>

      {/* Summary Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm bg-primary text-white">
            <div className="card-body">
              <span className="text-white-50 font-monospace small d-block">TOTAL SEED TASKS</span>
              <div className="display-6 fw-bold my-1">{totalHashtagTasks}</div>
              <small className="text-white-50">Hashtag mining executions</small>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm bg-dark text-white">
            <div className="card-body">
              <span className="text-white-50 font-monospace small d-block">UNIQUE SEED NODES</span>
              <div className="display-6 fw-bold text-info my-1">{uniqueSeeds}</div>
              <small className="text-white-50">Unique targets</small>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm bg-success text-white">
            <div className="card-body">
              <span className="text-white-50 font-monospace small d-block">TOTAL POSTS MINED</span>
              <div className="display-6 fw-bold my-1">{totalPostsMined.toLocaleString()}</div>
              <small className="text-white-50">Instagram media records</small>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm bg-warning text-dark">
            <div className="card-body">
              <span className="text-dark-50 font-monospace small d-block">HASHTAGS EXTRACTED</span>
              <div className="display-6 fw-bold my-1">{totalHashtagsExtracted.toLocaleString()}</div>
              <small className="text-dark-50">Co-occurring tags</small>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Client Table */}
      <HashtagsDashboardClient initialTasks={tasks} />
    </div>
  );
}
