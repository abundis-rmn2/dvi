import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { getTaskDetailServerPayload, getStaticTasks } from '@/lib/db';
import { AIGraphPageClient } from '@/components/AIGraphPageClient';
import { extractTopEntities } from '@/lib/nlp-parser';
import { generateTaskIntroduction } from '@/lib/task-introductions';

export async function generateStaticParams() {
  const tasks = getStaticTasks();
  return tasks.map((task: any) => ({
    id: task.MUID,
  }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freight-graffiti.abundis.com.mx';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const payload = await getTaskDetailServerPayload(params.id);
  if (!payload || !payload.task) {
    return {
      title: 'AI Graph Not Found | Freight Graffiti DVI',
    };
  }

  const { task, stats, posts } = payload;
  const { writers, crews } = extractTopEntities(posts || [], 3);
  
  const intro = generateTaskIntroduction({
    seedNode: task.seed_node,
    muid: task.MUID,
    miningDepth: task.mining_depth,
    miningType: task.mining_type,
    postCount: stats?.posts,
    hashtagCount: stats?.hashtags,
    userCount: stats?.users,
    writers,
    crews,
  });

  const pageTitle = `AI Network Graph Analysis: ${task.seed_node} (${task.MUID}) | Freight Graffiti`;
  const pageDescription = `Interactive multimodal AI network graph analysis for seed node ${task.seed_node}. ${intro.metaDescription}`;
  const canonicalUrl = `${SITE_URL}/graph/${task.MUID}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      task.seed_node,
      intro.categoryLabel,
      'AI Network Graph',
      'Graphology Visualization',
      'Freight Train Graffiti',
      'Instagram Hypertextual Network',
      'TensorFlow Machine Learning',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      type: 'article',
      siteName: 'Freight Graffiti DVI',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
    },
  };
}

export default async function AIGraphPage({
  params,
}: {
  params: { id: string };
}) {
  const payload = await getTaskDetailServerPayload(params.id);

  if (!payload || !payload.task) {
    return (
      <main>
        <Navigation />
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            Task not found for ID: {params.id}
          </div>
          <Link href="/" className="btn btn-secondary">
            Back to Tasks
          </Link>
        </div>
      </main>
    );
  }

  const { task, stats, posts } = payload;

  const { writers, crews } = extractTopEntities(posts, 5);
  const intro = generateTaskIntroduction({
    seedNode: task.seed_node,
    muid: task.MUID,
    miningDepth: task.mining_depth,
    miningType: task.mining_type,
    postCount: stats?.posts,
    hashtagCount: stats?.hashtags,
    userCount: stats?.users,
    writers,
    crews,
  });

  const entitiesData = [
    ...writers.map(w => ({
      '@type': 'Person',
      name: w.term,
      disambiguatingDescription: 'Freight train graffiti writer in North America'
    })),
    ...crews.map(c => ({
      '@type': 'Organization',
      name: c.term,
      disambiguatingDescription: 'Graffiti Crew'
    }))
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `Semantic Network Graph: ${task.seed_node} (${task.MUID})`,
    description: intro.jsonLdDescription,
    about: entitiesData
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <div className="container py-4">
        {/* Server-Rendered Header Section for Search Engines */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h1 className="h2 mb-1 fw-bold text-dark">
              🧠 Multimodal AI Network Graph Analysis
            </h1>
            <p className="text-muted mb-0 fs-6">
              Seed Node: <strong className="text-primary">{task.seed_node}</strong> | Task MUID: <code className="text-primary">{task.MUID}</code>
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link href="/" className="btn btn-outline-secondary">
              Dashboard
            </Link>
            <Link href={`/tasks/${task.MUID}`} className="btn btn-primary">
              📋 Task Details & Media Data
            </Link>
          </div>
        </div>

        {/* Editorial Context & Semantic Disambiguation Card */}
        <article className="mb-4 bg-white p-4 rounded-3 shadow-sm border border-info border-opacity-25">
          <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
            <span className="badge bg-info text-dark text-uppercase px-3 py-2 fw-bold">
              {intro.categoryLabel}
            </span>
            <span className="text-muted small font-monospace">
              MUID: {task.MUID}
            </span>
          </div>
          <h2 className="h5 fw-bold text-dark mb-2">
            Network Topology & Semantic Context
          </h2>
          <p className="text-muted mb-0" style={{ lineHeight: '1.6' }}>
            {intro.editorialParagraph}
          </p>
          {intro.entitiesSummary && (
            <div className="mt-3 pt-2 border-top d-flex align-items-center gap-2 flex-wrap">
              <span className="small fw-bold text-dark">🎯 Cluster Entities:</span>
              {writers.slice(0, 4).map(w => (
                <span key={w.term} className="badge bg-light text-dark border">
                  ✍️ {w.term}
                </span>
              ))}
              {crews.slice(0, 4).map(c => (
                <span key={c.term} className="badge bg-light text-primary border border-primary">
                  👥 {c.term}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Server HTML Summary Card */}
        <div className="card mb-4 shadow-sm border-0 bg-light">
          <div className="card-body p-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <span className="badge bg-dark me-2">Mining Type: {task.mining_type}</span>
                <span className="badge bg-info me-2">Posts: {stats.posts}</span>
                <span className="badge bg-success me-2">Hashtags: {stats.hashtags}</span>
                <span className="badge bg-warning text-dark me-2">Users: {stats.users}</span>
                <span className="badge text-white" style={{ backgroundColor: '#982AA5' }}>Inferences: {stats.inferences || 0}</span>
              </div>
              <small className="text-muted font-monospace">Created: {task.created_at}</small>
            </div>
          </div>
        </div>

        {/* Interactive WebGL / Sigma AI Graph Canvas Component */}
        <AIGraphPageClient muid={task.MUID} />
      </div>
    </main>
  );
}
