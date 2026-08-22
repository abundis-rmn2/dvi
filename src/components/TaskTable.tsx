'use client';

import React, { useState } from 'react';
import { Table, Badge, Button } from 'react-bootstrap';
import Link from 'next/link';

export interface TaskItem {
  id: number;
  MUID: string;
  seed_node: string;
  mining_depth: number;
  mining_type?: string;
  hashtag_media_amount: number;
  p_count?: number;
  h_count?: number;
  created_at: string;
}

interface TaskTableProps {
  tasks: TaskItem[];
  sortColumn: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (column: string) => void;
  onTaskDeleted: () => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  sortColumn,
  sortOrder,
  onSortChange,
  onTaskDeleted,
}) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const renderSortIcon = (col: string) => {
    if (sortColumn !== col) {
      return <span className="text-muted ms-1">↕</span>;
    }
    return sortOrder === 'asc' ? (
      <span className="ms-1">↑</span>
    ) : (
      <span className="ms-1">↓</span>
    );
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onTaskDeleted();
      }
    } catch (err) {
      console.error('Failed to delete task', err);
    } finally {
      setDeletingId(null);
    }
  };

  const truncateMUID = (muid: string) => {
    if (!muid) return '';
    return muid.length > 20
      ? `${muid.substring(0, 12)}...${muid.substring(muid.length - 6)}`
      : muid;
  };

  return (
    <div className="table-responsive shadow-sm rounded" style={{ maxHeight: '800px', overflowY: 'auto' }}>
      <Table striped bordered hover size="sm" className="align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th onClick={() => onSortChange('MUID')} style={{ cursor: 'pointer' }}>
              MUID {renderSortIcon('MUID')}
            </th>
            <th onClick={() => onSortChange('seed_node')} style={{ cursor: 'pointer' }}>
              Seed Node {renderSortIcon('seed_node')}
            </th>
            <th onClick={() => onSortChange('mining_depth')} style={{ cursor: 'pointer' }}>
              Depth {renderSortIcon('mining_depth')}
            </th>
            <th onClick={() => onSortChange('hashtag_media_amount')} style={{ cursor: 'pointer' }}>
              Amount {renderSortIcon('hashtag_media_amount')}
            </th>
            <th>Posts</th>
            <th>Hashtags</th>
            <th onClick={() => onSortChange('created_at')} style={{ cursor: 'pointer' }}>
              Created At {renderSortIcon('created_at')}
            </th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const pCount = task.p_count ?? 0;
            const hCount = task.h_count ?? 0;
            const isEmpty = pCount === 0 && hCount === 0;

            return (
              <tr key={task.id} className={isEmpty ? 'table-danger text-muted' : ''}>
                <td title={task.MUID}>
                  <small>{truncateMUID(task.MUID)}</small>
                </td>
                <td>{task.seed_node}</td>
                <td>{task.mining_depth}</td>
                <td>{task.hashtag_media_amount}</td>
                <td>
                  <Badge pill bg={pCount > 0 ? 'info' : 'danger'}>
                    {pCount}
                  </Badge>
                </td>
                <td>
                  <Badge pill bg={hCount > 0 ? 'success' : 'danger'}>
                    {hCount}
                  </Badge>
                </td>
                <td>
                  <small>{new Date(task.created_at).toLocaleString()}</small>
                </td>
                <td className="text-center">
                  <Link href={`/sigma/${task.id}`} className="btn btn-secondary btn-sm me-1">
                    ✏️
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={deletingId === task.id}
                    onClick={() => handleDelete(task.id)}
                  >
                    🗑️
                  </Button>
                </td>
              </tr>
            );
          })}
          {tasks.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center py-3 text-muted">
                No tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};
