'use client';

import React, { useEffect, useState } from 'react';
import { Card, Table, Badge, Spinner, Alert, Button, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';

interface TaskDetailData {
  task: {
    id: number;
    MUID: string;
    seed_node: string;
    mining_depth: number;
    mining_type: string;
    hashtag_media_amount: number;
    created_at: string;
  };
  stats: {
    posts: number;
    hashtags: number;
    users: number;
    inferences?: number;
  };
  hashtags: Array<{
    id: number;
    hashtag: string;
    no_publications: number;
    mined_at: string;
  }>;
  posts: Array<{
    id: number;
    user_id: string;
    caption_text: string;
    like_count: number;
    comment_count: number;
    hashtags_used: string;
    taken_at: string;
  }>;
}

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const taskId = params.id;
  const [data, setData] = useState<TaskDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jsonFiles, setJsonFiles] = useState<string[]>([]);

  useEffect(() => {
    fetchTaskData();
  }, [taskId]);

  const fetchTaskData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tasks/${taskId}/data`);
      if (!res.ok) throw new Error('Task not found');
      const payload = await res.json();
      setData(payload);

      if (payload.task?.MUID) {
        const scanRes = await fetch(`/api/json-scandir?MUID=${encodeURIComponent(payload.task.MUID)}&type=ai`);
        if (scanRes.ok) {
          const files = await scanRes.json();
          setJsonFiles(files);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error loading task details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main>
        <Navigation />
        <div className="container py-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Loading task details...</p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main>
        <Navigation />
        <div className="container py-5">
          <Alert variant="danger">{error || 'Task data not available'}</Alert>
          <Link href="/" className="btn btn-secondary">
            Back to Tasks
          </Link>
        </div>
      </main>
    );
  }

  const { task, stats, hashtags, posts } = data;

  return (
    <main>
      <Navigation />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-0 fw-bold">{task.seed_node}</h2>
            <small className="text-muted font-monospace">{task.MUID}</small>
          </div>
          <div className="d-flex gap-2">
            <Link href="/" className="btn btn-outline-secondary">
              Back to Tasks
            </Link>
            {task.mining_type.includes('user') ? (
              <Link href={`/sigma/${task.MUID}`} className="btn btn-primary">
                Open User Network Graph
              </Link>
            ) : (
              <Link href={`/graph/${task.MUID}`} className="btn btn-success">
                Open AI Network Graph
              </Link>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <Row className="mb-4 text-center">
          <Col md={3}>
            <Card className="border-info bg-light shadow-sm">
              <Card.Body className="py-3">
                <h6 className="text-muted mb-1">Network Posts</h6>
                <h3 className="mb-0 text-info fw-bold">{stats.posts}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-success bg-light shadow-sm">
              <Card.Body className="py-3">
                <h6 className="text-muted mb-1">Mined Hashtags</h6>
                <h3 className="mb-0 text-success fw-bold">{stats.hashtags}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-warning bg-light shadow-sm">
              <Card.Body className="py-3">
                <h6 className="text-muted mb-1">Target Users</h6>
                <h3 className="mb-0 text-warning fw-bold">{stats.users}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-purple bg-light shadow-sm" style={{ borderColor: '#982AA5' }}>
              <Card.Body className="py-3">
                <h6 className="text-muted mb-1">AI Inferences</h6>
                <h3 className="mb-0 fw-bold" style={{ color: '#982AA5' }}>{stats.inferences || 0}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* JSON Cache Card */}
        {jsonFiles.length > 0 && (
          <Card className="mb-4 shadow-sm border-secondary">
            <Card.Header className="bg-secondary text-white fw-bold">
              Available Graph JSON Cache
            </Card.Header>
            <Card.Body className="py-2">
              <ul className="mb-0 small">
                {jsonFiles.map((file, idx) => (
                  <li key={idx} className="font-monospace text-muted">
                    {file}
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        )}

        {/* Hashtags Table */}
        <Card className="mb-4 shadow-sm">
          <Card.Header className="bg-light fw-bold fs-5">
            Network Hashtags ({hashtags.length})
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive" style={{ maxHeight: '350px', overflowY: 'auto' }}>
              <Table hover striped size="sm" className="mb-0">
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
                        No mined hashtags found
                      </td>
                    </tr>
                  ) : (
                    hashtags.map((h) => (
                      <tr key={h.id}>
                        <td className="fw-bold">#{h.hashtag}</td>
                        <td>{h.no_publications?.toLocaleString() || 0}</td>
                        <td>
                          <small className="text-muted">{h.mined_at}</small>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        {/* Posts Table */}
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-light fw-bold fs-5">
            Network Posts ({posts.length})
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive" style={{ maxHeight: '450px', overflowY: 'auto' }}>
              <Table hover striped size="sm" className="mb-0">
                <thead className="table-dark sticky-top">
                  <tr>
                    <th>User</th>
                    <th>Caption</th>
                    <th>Likes</th>
                    <th>Comments</th>
                    <th>Hashtags Used</th>
                    <th>Taken At</th>
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
                    posts.map((p) => {
                      let parsedTags: string[] = [];
                      try {
                        parsedTags = JSON.parse(p.hashtags_used);
                      } catch {
                        parsedTags = p.hashtags_used ? [p.hashtags_used] : [];
                      }

                      const truncatedCaption =
                        p.caption_text?.length > 70
                          ? `${p.caption_text.substring(0, 70)}...`
                          : p.caption_text;

                      return (
                        <tr key={p.id}>
                          <td className="fw-bold">{p.user_id}</td>
                          <td title={p.caption_text}>{truncatedCaption}</td>
                          <td>
                            <Badge bg="primary">{p.like_count || 0}</Badge>
                          </td>
                          <td>
                            <Badge bg="secondary">{p.comment_count || 0}</Badge>
                          </td>
                          <td>
                            <small className="text-muted">
                              {Array.isArray(parsedTags) ? parsedTags.join(', ') : parsedTags}
                            </small>
                          </td>
                          <td>
                            <small className="text-muted">{p.taken_at}</small>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </div>
    </main>
  );
}
