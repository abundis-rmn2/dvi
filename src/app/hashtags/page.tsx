'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Card, Table, Badge, Spinner, Alert, Row, Col, Form, InputGroup } from 'react-bootstrap';
import Link from 'next/link';
import { logger } from '@/utils/logger';

interface Task {
  id: number;
  MUID: string;
  seed_node: string;
  mining_depth: number;
  mining_type: string;
  hashtag_media_amount: number;
  created_at: string;
  p_count: number;
  h_count: number;
  u_count?: number;
  inf_count: number;
}

export default function HashtagsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'hashtag_only'>('hashtag_only');
  const [sortColumn, setSortColumn] = useState<string>('h_count');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      logger.log('HashtagsPage', 'Fetching data mining tasks from /api/tasks');
      const res = await fetch('/api/tasks?sort=created_at&order=desc');
      if (!res.ok) throw new Error('Failed to load tasks data');
      const data: Task[] = await res.json();
      setTasks(data);
      logger.log('HashtagsPage', `Successfully loaded ${data.length} tasks`);
    } catch (err: any) {
      logger.error('HashtagsPage', 'Error loading tasks', err);
      setError(err.message || 'Error loading tasks data');
    } finally {
      setLoading(false);
    }
  };

  const hashtagTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filterType === 'hashtag_only') {
        return t.mining_type?.toLowerCase().includes('hashtag') || t.seed_node.startsWith('#') || !t.mining_type?.toLowerCase().includes('user');
      }
      return true;
    });
  }, [tasks, filterType]);

  const filteredAndSortedTasks = useMemo(() => {
    let result = hashtagTasks.filter((t) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        t.seed_node.toLowerCase().includes(term) ||
        t.MUID.toLowerCase().includes(term) ||
        t.mining_type.toLowerCase().includes(term)
      );
    });

    result.sort((a: any, b: any) => {
      let valA = a[sortColumn] ?? '';
      let valB = b[sortColumn] ?? '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [hashtagTasks, searchTerm, sortColumn, sortOrder]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return ' ↕';
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  // Metrics summary
  const totalHashtagTasks = hashtagTasks.length;
  const uniqueSeeds = useMemo(() => new Set(hashtagTasks.map((t) => t.seed_node.toLowerCase())).size, [hashtagTasks]);
  const totalPostsMined = useMemo(() => hashtagTasks.reduce((acc, t) => acc + (t.p_count || 0), 0), [hashtagTasks]);
  const totalHashtagsExtracted = useMemo(() => hashtagTasks.reduce((acc, t) => acc + (t.h_count || 0), 0), [hashtagTasks]);

  return (
    <main className="container py-3">
      {/* Header Banner */}
      <div className="bg-dark text-white p-4 rounded-3 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h1 className="fs-3 fw-bold mb-1">🏷️ Hashtag Networks & Data Mining Dashboard</h1>
            <p className="text-light-50 mb-0 small">
              Explore Instagram hashtag co-occurrence networks, seed nodes, and hyper-graph relationships in North American freight train graffiti.
            </p>
          </div>
          <Link href="/" className="btn btn-outline-light btn-sm">
            🏠 Back to Home
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <Row className="g-3 mb-4">
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm text-center h-100 bg-primary text-white">
            <Card.Body className="py-3">
              <h2 className="display-6 fw-bold mb-0">{totalHashtagTasks}</h2>
              <div className="small text-white-50 text-uppercase fw-semibold">Hashtag Tasks</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm text-center h-100 bg-success text-white">
            <Card.Body className="py-3">
              <h2 className="display-6 fw-bold mb-0">{uniqueSeeds}</h2>
              <div className="small text-white-50 text-uppercase fw-semibold">Unique Seed Nodes</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm text-center h-100 bg-info text-white">
            <Card.Body className="py-3">
              <h2 className="display-6 fw-bold mb-0">{totalPostsMined.toLocaleString()}</h2>
              <div className="small text-white-50 text-uppercase fw-semibold">Posts Collected</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm text-center h-100 text-white" style={{ backgroundColor: '#8E24AA' }}>
            <Card.Body className="py-3">
              <h2 className="display-6 fw-bold mb-0">{totalHashtagsExtracted.toLocaleString()}</h2>
              <div className="small text-white-50 text-uppercase fw-semibold">Hashtags Co-occurrences</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Controls Card */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="g-3 align-items-center">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">🔍</InputGroup.Text>
                <Form.Control
                  placeholder="Search by seed node (#freightgraffiti), MUID, or mining type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-start-0 shadow-none"
                />
                {searchTerm && (
                  <button className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
                    Clear
                  </button>
                )}
              </InputGroup>
            </Col>

            <Col md={6} className="d-flex justify-content-md-end gap-2">
              <Form.Select
                value={filterType}
                onChange={(e: any) => setFilterType(e.target.value)}
                className="w-auto shadow-none"
              >
                <option value="hashtag_only">Hashtag Tasks Only</option>
                <option value="all">All Tasks (Including User Mining)</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Main Table */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center py-3">
          <h2 className="mb-0 fs-5 fw-bold">Hashtag Network Mining Tasks</h2>
          <Badge bg="primary" className="fs-6">
            Showing {filteredAndSortedTasks.length} tasks
          </Badge>
        </Card.Header>
        <Card.Body className="p-0">
          {error && (
            <div className="p-3">
              <Alert variant="danger">{error}</Alert>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Loading hashtag graph tasks...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover striped bordered size="sm" className="align-middle mb-0">
                <thead className="table-dark text-nowrap">
                  <tr>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('seed_node')}>
                      Seed Node{getSortIcon('seed_node')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('MUID')}>
                      MUID{getSortIcon('MUID')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('mining_type')}>
                      Type{getSortIcon('mining_type')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('mining_depth')}>
                      Depth{getSortIcon('mining_depth')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('p_count')}>
                      Posts{getSortIcon('p_count')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('h_count')}>
                      Hashtags{getSortIcon('h_count')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('inf_count')}>
                      AI Inferences{getSortIcon('inf_count')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('created_at')}>
                      Created At{getSortIcon('created_at')}
                    </th>
                    <th className="text-center">Network Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedTasks.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-4 text-muted">
                        No hashtag tasks matched your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedTasks.map((task) => {
                      const truncatedMuid =
                        task.MUID.length > 20
                          ? `${task.MUID.substring(0, 10)}...${task.MUID.substring(task.MUID.length - 6)}`
                          : task.MUID;

                      const isHashtagType = task.mining_type?.toLowerCase().includes('hashtag') || !task.mining_type?.toLowerCase().includes('user');

                      return (
                        <tr key={task.id}>
                          <td className="fw-bold">
                            <span className="text-primary">#{task.seed_node.replace(/^#/, '')}</span>
                          </td>
                          <td title={task.MUID}>
                            <small className="font-monospace text-muted">{truncatedMuid}</small>
                          </td>
                          <td>
                            <Badge bg={isHashtagType ? 'success' : 'secondary'} className="fw-normal">
                              {task.mining_type}
                            </Badge>
                          </td>
                          <td className="text-center">{task.mining_depth}</td>
                          <td>
                            <Badge bg={task.p_count > 0 ? 'info' : 'secondary'}>
                              {task.p_count}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={task.h_count > 0 ? 'primary' : 'secondary'}>
                              {task.h_count}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={task.inf_count > 0 ? 'warning' : 'light'} text={task.inf_count > 0 ? 'dark' : 'muted'}>
                              {task.inf_count || 0}
                            </Badge>
                          </td>
                          <td>
                            <small className="text-muted">{task.created_at}</small>
                          </td>
                          <td className="text-center">
                            <div className="btn-group btn-group-sm">
                              <Link
                                href={`/hashtags/${task.MUID}`}
                                className="btn btn-outline-primary"
                                title="View Hashtag Graph Analysis"
                              >
                                🏷️ Hashtag Graph
                              </Link>
                              <Link
                                href={`/graph/${task.MUID}`}
                                className="btn btn-outline-success"
                                title="View Multi-layer AI Graph"
                              >
                                🧠 AI Graph
                              </Link>
                              <Link
                                href={`/tasks/${task.MUID}`}
                                className="btn btn-outline-secondary"
                                title="View Raw Task Metrics"
                              >
                                📋 Details
                              </Link>
                            </div>
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
    </main>
  );
}
