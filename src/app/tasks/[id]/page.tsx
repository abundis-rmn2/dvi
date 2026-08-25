'use client';

import React, { useEffect, useState } from 'react';
import { Card, Table, Badge, Spinner, Alert, Button, Row, Col, Modal } from 'react-bootstrap';
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
    media?: string;
    pk?: string;
    m_id?: string;
    product_type?: string;
  }>;
}

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const taskId = params.id;
  const [data, setData] = useState<TaskDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jsonFiles, setJsonFiles] = useState<string[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

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

  const getMediaImageUrl = (post: any, format: 'jpg' | 'webp' = 'jpg') => {
    const postMediaId = post.m_id || post.pk;
    if (!postMediaId) return null;
    return `http://data.abundis.com.mx/media/exported_images/${task.MUID}/${postMediaId}_exported.${format}`;
  };

  return (
    <main>
      <Navigation />
      <style>{`
        .insta-grid-card:hover {
          transform: scale(1.025);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3) !important;
          z-index: 2;
        }
        .insta-grid-card:hover .insta-grid-overlay {
          opacity: 1 !important;
        }
      `}</style>
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

        {/* Posts Card with Instagram Grid & Table Switcher */}
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-light fw-bold fs-5 d-flex justify-content-between align-items-center flex-wrap gap-2 py-3">
            <div className="d-flex align-items-center gap-3">
              <span>Network Posts ({posts.length})</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted me-2 d-none d-md-inline">View Mode:</span>
              <div className="btn-group btn-group-sm" role="group" aria-label="View Mode Switcher">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                  onClick={() => setViewMode('grid')}
                  className="fw-bold d-flex align-items-center gap-1"
                >
                  <span>📱</span> Instagram Grid
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'primary' : 'outline-primary'}
                  onClick={() => setViewMode('table')}
                  className="fw-bold d-flex align-items-center gap-1"
                >
                  <span>📋</span> Table View
                </Button>
              </div>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {viewMode === 'grid' ? (
              /* Instagram Grid View */
              <div className="p-3 bg-dark bg-opacity-10" style={{ maxHeight: '650px', overflowY: 'auto' }}>
                {posts.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <p className="mb-0">No media posts found</p>
                  </div>
                ) : (
                  <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3">
                    {posts.map((p) => {
                      const primaryImgUrl = getMediaImageUrl(p, 'jpg') || '/img_not_inf.svg';

                      return (
                        <div key={p.id} className="col">
                          <div
                            className="insta-grid-card position-relative overflow-hidden rounded shadow-sm bg-dark"
                            style={{
                              aspectRatio: '1 / 1',
                              cursor: 'pointer',
                              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            }}
                            onClick={() => setSelectedPost(p)}
                          >
                            <img
                              src={primaryImgUrl}
                              alt={p.user_id || 'Post'}
                              className="w-100 h-100"
                              style={{ objectFit: 'cover' }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target.dataset.triedFallback === 'true') {
                                  target.src = '/img_not_inf.svg';
                                } else if (target.src.endsWith('.jpg')) {
                                  target.dataset.triedFallback = 'true';
                                  target.src = getMediaImageUrl(p, 'webp') || '/img_not_inf.svg';
                                } else if (target.src.includes('data.abundis.com.mx')) {
                                  target.src = `https://data.abundis.com/media/exported_images/${task.MUID}/${p.m_id || p.pk}_exported.jpg`;
                                } else {
                                  target.src = '/img_not_inf.svg';
                                }
                              }}
                            />
                            {/* Hover overlay with Instagram style metrics */}
                            <div
                              className="insta-grid-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between p-2 text-white"
                              style={{
                                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.65) 100%)',
                                opacity: 0,
                                transition: 'opacity 0.2s ease',
                              }}
                            >
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="badge bg-dark bg-opacity-75 font-monospace text-truncate" style={{ maxWidth: '110px' }}>
                                  @{p.user_id}
                                </span>
                              </div>
                              <div className="d-flex justify-content-center align-items-center gap-3 fw-bold fs-6">
                                <span>❤️ {p.like_count || 0}</span>
                                <span>💬 {p.comment_count || 0}</span>
                              </div>
                              <div className="small text-truncate text-white-50" style={{ fontSize: '0.75rem' }}>
                                {p.caption_text || 'No caption'}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Table View */
              <div className="table-responsive" style={{ maxHeight: '550px', overflowY: 'auto' }}>
                <Table hover striped size="sm" className="align-middle mb-0">
                  <thead className="table-dark sticky-top">
                    <tr>
                      <th style={{ width: '80px' }}>Image</th>
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
                        <td colSpan={7} className="text-center text-muted py-3">
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

                        const primaryImgUrl = getMediaImageUrl(p, 'jpg');

                        return (
                          <tr key={p.id}>
                            <td className="text-center">
                              {primaryImgUrl ? (
                                <img
                                  src={primaryImgUrl}
                                  alt={p.user_id || 'Post Media'}
                                  className="img-thumbnail rounded shadow-sm"
                                  style={{ width: '52px', height: '52px', objectFit: 'cover', cursor: 'pointer' }}
                                  onClick={() => setSelectedPost(p)}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (target.dataset.triedFallback === 'true') {
                                      target.src = '/img_not_inf.svg';
                                    } else if (target.src.endsWith('.jpg')) {
                                      target.dataset.triedFallback = 'true';
                                      target.src = getMediaImageUrl(p, 'webp') || '/img_not_inf.svg';
                                    } else if (target.src.includes('data.abundis.com.mx')) {
                                      target.src = `https://data.abundis.com/media/exported_images/${task.MUID}/${p.m_id || p.pk}_exported.jpg`;
                                    } else {
                                      target.src = '/img_not_inf.svg';
                                    }
                                  }}
                                />
                              ) : (
                                <img
                                  src="/img_not_inf.svg"
                                  alt="img_not_inf"
                                  className="img-thumbnail rounded shadow-sm"
                                  style={{ width: '52px', height: '52px', objectFit: 'cover' }}
                                />
                              )}
                            </td>
                            <td className="fw-bold">
                              <button
                                type="button"
                                className="btn btn-link p-0 fw-bold text-decoration-none"
                                onClick={() => setSelectedPost(p)}
                              >
                                @{p.user_id}
                              </button>
                            </td>
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
            )}
          </Card.Body>
        </Card>

        {/* Selected Post Image Modal */}
        {selectedPost && (
          <Modal show={!!selectedPost} onHide={() => setSelectedPost(null)} size="lg" centered>
            <Modal.Header closeButton className="bg-dark text-white">
              <Modal.Title className="fs-5 fw-bold">
                📷 Publication Media (@{selectedPost.user_id})
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              <div className="text-center mb-3 bg-dark rounded p-3" style={{ minHeight: '260px' }}>
                <img
                  src={getMediaImageUrl(selectedPost, 'jpg') || '/img_not_inf.svg'}
                  alt={selectedPost.user_id}
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: '500px', objectFit: 'contain' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.dataset.triedFallback === 'true') {
                      target.src = '/img_not_inf.svg';
                    } else if (target.src.endsWith('.jpg')) {
                      target.dataset.triedFallback = 'true';
                      target.src = getMediaImageUrl(selectedPost, 'webp') || '/img_not_inf.svg';
                    } else if (target.src.includes('data.abundis.com.mx')) {
                      target.src = `https://data.abundis.com/media/exported_images/${task.MUID}/${selectedPost.m_id || selectedPost.pk}_exported.jpg`;
                    } else {
                      target.src = '/img_not_inf.svg';
                    }
                  }}
                />
              </div>

              <div className="bg-light p-3 rounded border">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0 fw-bold">@{selectedPost.user_id}</h5>
                  <span className="text-muted small">{selectedPost.taken_at}</span>
                </div>
                <div className="mb-3">
                  <Badge bg="primary" className="me-2">❤️ {selectedPost.like_count || 0} Likes</Badge>
                  <Badge bg="secondary" className="me-2">💬 {selectedPost.comment_count || 0} Comments</Badge>
                  {selectedPost.product_type && (
                    <Badge bg="info">{selectedPost.product_type}</Badge>
                  )}
                </div>
                {selectedPost.caption_text && (
                  <div className="p-2 bg-white rounded border mb-2" style={{ whiteSpace: 'pre-wrap', maxHeight: '150px', overflowY: 'auto' }}>
                    {selectedPost.caption_text}
                  </div>
                )}
                {selectedPost.hashtags_used && (
                  <div className="small text-muted border-top pt-2">
                    <strong>Hashtags:</strong> {selectedPost.hashtags_used}
                  </div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
              {getMediaImageUrl(selectedPost, 'jpg') && (
                <a
                  href={getMediaImageUrl(selectedPost, 'jpg') || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm"
                >
                  🔗 Open Direct Media URL
                </a>
              )}
              <Button variant="secondary" onClick={() => setSelectedPost(null)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </main>
  );
}
