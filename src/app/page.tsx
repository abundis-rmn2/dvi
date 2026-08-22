'use client';

import React, { useEffect, useState } from 'react';
import { Card, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';

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
  u_count: number;
  inf_count: number;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchTasks(sortColumn, sortOrder);
  }, [sortColumn, sortOrder]);

  const fetchTasks = async (sort: string, order: 'asc' | 'desc') => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tasks?sort=${sort}&order=${order}`);
      if (!res.ok) throw new Error('Failed to load tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Error loading tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return ' ↕';
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <main>
      <Navigation />
      <div className="container py-4">
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
            <h3 className="mb-0 fs-4 fw-bold">Data Mining Tasks Dashboard (Consultation Mode)</h3>
            <Badge bg="light" text="dark" className="fs-6">
              Total Tasks: {tasks.length}
            </Badge>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading tasks from local database...</p>
              </div>
            ) : (
              <div className="table-responsive" style={{ maxHeight: '750px', overflowY: 'auto' }}>
                <Table hover bordered size="sm" className="align-middle mb-0">
                  <thead className="table-dark sticky-top">
                    <tr>
                      <th style={{ cursor: 'pointer' }} onClick={() => handleSort('MUID')}>
                        MUID{getSortIcon('MUID')}
                      </th>
                      <th style={{ cursor: 'pointer' }} onClick={() => handleSort('seed_node')}>
                        Seed Node{getSortIcon('seed_node')}
                      </th>
                      <th style={{ cursor: 'pointer' }} onClick={() => handleSort('mining_depth')}>
                        Depth{getSortIcon('mining_depth')}
                      </th>
                      <th style={{ cursor: 'pointer' }} onClick={() => handleSort('hashtag_media_amount')}>
                        Amount{getSortIcon('hashtag_media_amount')}
                      </th>
                      <th style={{ cursor: 'pointer' }} onClick={() => handleSort('p_count')}>
                        Posts{getSortIcon('p_count')}
                      </th>
                      <th style={{ cursor: 'pointer' }} onClick={() => handleSort('h_count')}>
                        Hashtags{getSortIcon('h_count')}
                      </th>
                      <th style={{ cursor: 'pointer' }} onClick={() => handleSort('inf_count')}>
                        Inferences{getSortIcon('inf_count')}
                      </th>
                      <th style={{ cursor: 'pointer' }} onClick={() => handleSort('created_at')}>
                        Created At{getSortIcon('created_at')}
                      </th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => {
                      const isEmpty = task.p_count === 0 && task.h_count === 0;
                      const truncatedMuid =
                        task.MUID.length > 22
                          ? `${task.MUID.substring(0, 12)}...${task.MUID.substring(task.MUID.length - 6)}`
                          : task.MUID;

                      return (
                        <tr
                          key={task.id}
                          className={isEmpty ? 'table-danger text-muted' : ''}
                        >
                          <td title={task.MUID}>
                            <small className="font-monospace">{truncatedMuid}</small>
                          </td>
                          <td className="fw-bold">{task.seed_node}</td>
                          <td>{task.mining_depth}</td>
                          <td>{task.hashtag_media_amount}</td>
                          <td>
                            <Badge bg={task.p_count > 0 ? 'info' : 'danger'}>
                              {task.p_count}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={task.h_count > 0 ? 'success' : 'danger'}>
                              {task.h_count}
                            </Badge>
                          </td>
                          <td>
                            <Badge
                              bg={task.inf_count > 0 ? 'secondary' : 'danger'}
                              style={{ backgroundColor: task.inf_count > 0 ? '#982AA5' : undefined }}
                            >
                              {task.inf_count || 0}
                            </Badge>
                          </td>
                          <td>
                            <small className="text-muted">{task.created_at}</small>
                          </td>
                          <td className="text-center">
                            <div className="btn-group btn-group-sm">
                              <Link
                                href={`/tasks/${task.id}`}
                                className="btn btn-outline-primary"
                                title="Inspect Task Details"
                              >
                                Details
                              </Link>
                              {task.mining_type.includes('user') ? (
                                <Link
                                  href={`/sigma/${task.id}`}
                                  className="btn btn-outline-info"
                                  title="User Follower Graph"
                                >
                                  User Graph
                                </Link>
                              ) : (
                                <Link
                                  href={`/graph/${task.id}`}
                                  className="btn btn-outline-success"
                                  title="AI Enriched Graph"
                                >
                                  AI Graph
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </main>
  );
}
