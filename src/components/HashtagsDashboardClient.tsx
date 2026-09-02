'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

export interface Task {
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

interface HashtagsDashboardClientProps {
  initialTasks: Task[];
}

export function HashtagsDashboardClient({ initialTasks }: HashtagsDashboardClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'hashtag_only'>('hashtag_only');
  const [sortColumn, setSortColumn] = useState<string>('h_count');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const hashtagTasks = useMemo(() => {
    return initialTasks.filter((t) => {
      if (filterType === 'hashtag_only') {
        return (
          t.mining_type?.toLowerCase().includes('hashtag') ||
          t.seed_node.startsWith('#') ||
          !t.mining_type?.toLowerCase().includes('user')
        );
      }
      return true;
    });
  }, [initialTasks, filterType]);

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

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-dark text-white p-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-2">
          <h5 className="mb-0 fw-bold">🏷️ Data Mining Tasks &amp; Hashtag Datasets</h5>
          <span className="badge bg-primary rounded-pill">{filteredAndSortedTasks.length} Tasks</span>
        </div>

        {/* Filters and Controls */}
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <input
            type="text"
            className="form-control form-control-sm bg-secondary text-white border-0"
            placeholder="🔍 Search seed node, MUID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '220px' }}
          />

          <select
            className="form-select form-select-sm bg-secondary text-white border-0"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            style={{ width: '170px' }}
          >
            <option value="hashtag_only">Hashtags Only</option>
            <option value="all">All Data Tasks</option>
          </select>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark font-monospace small">
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('id')}>
                  # ID{getSortIcon('id')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('seed_node')}>
                  Seed Node / Hashtag{getSortIcon('seed_node')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('MUID')}>
                  MUID Task Identifier{getSortIcon('MUID')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('mining_type')}>
                  Type{getSortIcon('mining_type')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('p_count')}>
                  Posts{getSortIcon('p_count')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('h_count')}>
                  Hashtags{getSortIcon('h_count')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('u_count')}>
                  Users{getSortIcon('u_count')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('inf_count')}>
                  AI Inferences{getSortIcon('inf_count')}
                </th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTasks.map((task) => (
                <tr key={task.id}>
                  <td className="font-monospace text-muted small">{task.id}</td>
                  <td>
                    <strong className="text-primary fs-6">{task.seed_node}</strong>
                  </td>
                  <td>
                    <code className="bg-light px-2 py-1 rounded text-dark border small">{task.MUID}</code>
                  </td>
                  <td>
                    <span className="badge bg-secondary font-monospace small">{task.mining_type}</span>
                  </td>
                  <td>
                    <span className="badge bg-info text-dark font-monospace">{task.p_count || 0}</span>
                  </td>
                  <td>
                    <span className="badge bg-primary font-monospace">{task.h_count || 0}</span>
                  </td>
                  <td>
                    <span className="badge bg-dark font-monospace">{task.u_count || 0}</span>
                  </td>
                  <td>
                    <span className="badge bg-warning text-dark font-monospace">{task.inf_count || 0}</span>
                  </td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <Link href={`/tasks/${task.MUID}`} className="btn btn-outline-primary fw-bold">
                        📋 Details
                      </Link>
                      <Link href={`/graph/${task.MUID}`} className="btn btn-primary fw-bold">
                        🌐 AI Graph
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredAndSortedTasks.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-5 text-muted">
                    No mining tasks matching criteria &quot;{searchTerm}&quot;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
