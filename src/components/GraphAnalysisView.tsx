'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamicImport from 'next/dynamic';
import { Spinner, Alert, Card, Table } from 'react-bootstrap';
import Link from 'next/link';

const SigmaGraphViewer = dynamicImport(
  () => import('@/components/SigmaGraphViewer').then((mod) => mod.SigmaGraphViewer),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading graph engine...</p>
      </div>
    ),
  }
);

export const GraphAnalysisView: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const [task, setTask] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTask = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/tasks/${id}`);
        if (!res.ok) throw new Error('Task not found');
        const data = await res.json();
        setTask(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load task details');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading visualization details...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <Alert variant="danger">
        {error || 'Task not found'}
        <div className="mt-3">
          <Link href="/" className="btn btn-secondary btn-sm">
            Back to Home
          </Link>
        </div>
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Network Graph Analysis</h2>
        <Link href="/" className="btn btn-outline-secondary">
          Back to Tasks
        </Link>
      </div>

      <Card className="mb-4 shadow-sm">
        <Card.Header as="h5">{task.MUID}</Card.Header>
        <Card.Body>
          <Table striped bordered size="sm" className="mb-0">
            <thead>
              <tr>
                <th>MUID</th>
                <th>Seed Node</th>
                <th>Depth</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{task.MUID}</td>
                <td>{task.seed_node}</td>
                <td>{task.mining_depth}</td>
                <td>{task.mining_type || 'user'}</td>
                <td>{task.hashtag_media_amount}</td>
                <td>{new Date(task.created_at).toLocaleString()}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <SigmaGraphViewer muid={task.MUID} />
    </div>
  );
};
