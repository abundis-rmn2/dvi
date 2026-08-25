'use client';

import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert, Button } from 'react-bootstrap';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { AIGraphViewer } from '@/components/AIGraphViewer';

export default function AIGraphPage({ params }: { params: { id: string } }) {
  const taskId = params.id;
  const [task, setTask] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tasks/${taskId}`);
      if (!res.ok) throw new Error('Task not found');
      const data = await res.json();
      setTask(data);
    } catch (err: any) {
      setError(err.message || 'Error loading task');
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
          <p className="mt-2 text-muted">Loading graph workspace...</p>
        </div>
      </main>
    );
  }

  if (error || !task) {
    return (
      <main>
        <Navigation />
        <div className="container py-5">
          <Alert variant="danger">{error || 'Task not found'}</Alert>
          <Link href="/" className="btn btn-secondary">
            Back to Tasks
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Navigation />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-0 fw-bold">Network Graph AI Analysis</h2>
            <p className="text-muted mb-0">
              Task: <strong>{task.seed_node}</strong> | MUID: <code className="text-primary">{task.MUID}</code>
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link href="/" className="btn btn-outline-secondary">
              Dashboard
            </Link>
            <Link href={`/tasks/${task.MUID}`} className="btn btn-outline-primary">
              Task Details
            </Link>
          </div>
        </div>

        <AIGraphViewer muid={task.MUID} />
      </div>
    </main>
  );
}
