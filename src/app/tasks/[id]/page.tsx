import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { getTaskDetailServerPayload } from '@/lib/db';
import { TaskDetailClient } from '@/components/TaskDetailClient';
import { formatHashtags } from '@/utils/hashtags';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freight-graffiti.abundis.com.mx';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const payload = await getTaskDetailServerPayload(params.id);
  if (!payload || !payload.task) {
    return {
      title: 'Task Not Found | Freight Graffiti DVI',
    };
  }

  const { task, stats } = payload;
  const pageTitle = `${task.seed_node} (${task.MUID}) — Freight Graffiti Mining Task Data`;
  const pageDescription = `Instagram data mining network analysis for seed node ${task.seed_node} (MUID: ${task.MUID}). Dataset contains ${stats.posts} posts, ${stats.hashtags} hashtags, ${stats.users} target users, and ${stats.inferences || 0} AI inferences.`;
  const canonicalUrl = `${SITE_URL}/tasks/${task.MUID}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      task.seed_node,
      'Freight Train Graffiti',
      'Data Mining Task',
      'Instagram Network Graph',
      'Graphology',
      'North America Railroads',
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

export default async function TaskDetailPage({
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
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const { task, stats, hashtags, posts } = payload;

  return (
    <main>
      <Navigation />
      <div className="container py-4">
        {/* Header Title Section - Pure HTML for Search Crawlers */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h1 className="mb-1 fw-bold text-dark">{task.seed_node}</h1>
            <p className="text-muted font-monospace mb-0">
              Task MUID: <strong className="text-primary">{task.MUID}</strong> | Mining Depth: {task.mining_depth} | Type: {task.mining_type}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link href="/" className="btn btn-outline-secondary">
              Back to Tasks
            </Link>
            <Link href={`/graph/${task.MUID}`} className="btn btn-success">
              🧠 Open AI Network Graph
            </Link>
          </div>
        </div>

        {/* Server-Rendered Metrics Cards */}
        <div className="row mb-4 text-center">
          <div className="col-md-3">
            <div className="card border-info bg-light shadow-sm mb-3 mb-md-0">
              <div className="card-body py-3">
                <h6 className="text-muted mb-1">Network Posts</h6>
                <h3 className="mb-0 text-info fw-bold">{stats.posts}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-success bg-light shadow-sm mb-3 mb-md-0">
              <div className="card-body py-3">
                <h6 className="text-muted mb-1">Mined Hashtags</h6>
                <h3 className="mb-0 text-success fw-bold">{stats.hashtags}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-warning bg-light shadow-sm mb-3 mb-md-0">
              <div className="card-body py-3">
                <h6 className="text-muted mb-1">Target Users</h6>
                <h3 className="mb-0 text-warning fw-bold">{stats.users}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-purple bg-light shadow-sm" style={{ borderColor: '#982AA5' }}>
              <div className="card-body py-3">
                <h6 className="text-muted mb-1">AI Inferences</h6>
                <h3 className="mb-0 fw-bold" style={{ color: '#982AA5' }}>{stats.inferences || 0}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Server-Rendered Hashtags Table for SEO */}
        <div className="card mb-4 shadow-sm border-0">
          <div className="card-header bg-dark text-white fw-bold fs-5 d-flex justify-content-between align-items-center">
            <span>🏷️ Network Hashtags Co-occurrences ({hashtags.length})</span>
            <span className="badge bg-primary">SSR Rendered</span>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive" style={{ maxHeight: '320px', overflowY: 'auto' }}>
              <table className="table table-hover table-striped table-sm mb-0">
                <thead className="table-dark sticky-top">
                  <tr>
                    <th>Hashtag</th>
                    <th>Publications (IG Total)</th>
                    <th>Capture Date</th>
                  </tr>
                </thead>
                <tbody>
                  {hashtags.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center text-muted py-3">
                        No mined hashtags found for this task
                      </td>
                    </tr>
                  ) : (
                    hashtags.map((h) => (
                      <tr key={h.id}>
                        <td className="fw-bold text-primary">#{h.hashtag}</td>
                        <td>{h.no_publications?.toLocaleString() || 0}</td>
                        <td>
                          <small className="text-muted">{h.mined_at}</small>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Server-Rendered Posts Captions Section for Crawlers */}
        <div className="card mb-4 shadow-sm border-0">
          <div className="card-header bg-dark text-white fw-bold fs-5 d-flex justify-content-between align-items-center">
            <span>📝 Mined Social Posts Data ({posts.length} Items)</span>
            <span className="badge bg-info">Text Content Prerendered</span>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive" style={{ maxHeight: '350px', overflowY: 'auto' }}>
              <table className="table table-hover table-striped table-sm align-middle mb-0">
                <thead className="table-secondary sticky-top">
                  <tr>
                    <th>User</th>
                    <th>Caption Text</th>
                    <th>Likes</th>
                    <th>Comments</th>
                    <th>Hashtags</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-3">
                        No media posts found
                      </td>
                    </tr>
                  ) : (
                    posts.map((p) => (
                      <tr key={p.id}>
                        <td className="fw-bold">@{p.user_id}</td>
                        <td>{p.caption_text || <span className="text-muted italic">No caption</span>}</td>
                        <td><span className="badge bg-primary">{p.like_count || 0}</span></td>
                        <td><span className="badge bg-secondary">{p.comment_count || 0}</span></td>
                        <td><small className="text-muted">{formatHashtags(p.hashtags_used)}</small></td>
                        <td><small className="text-muted">{p.taken_at}</small></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Client Interactive Component (Gallery Grid & Image Modals) */}
        <TaskDetailClient initialData={payload} />
      </div>
    </main>
  );
}
