'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { logger } from '@/utils/logger';

interface SigmaGraphViewerProps {
  muid: string;
}

const communityColors = [
  '#556270', // com0
  '#4ECDC4', // com1
  '#C7F464', // com2
  '#FF6B6B', // com3
  '#C44D58', // com4
  '#53777A', // com5
  '#78ec97', // com6
];

export const SigmaGraphViewer: React.FC<SigmaGraphViewerProps> = ({ muid }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ nodes: number; edges: number } | null>(null);
  const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null);

  useEffect(() => {
    if (!muid || !containerRef.current) return;

    let sigmaInstance: any = null;
    let isCancelled = false;

    const loadGraphData = async () => {
      try {
        setLoading(true);
        setError(null);

        logger.log('SigmaGraphViewer', `Loading graph files for MUID: ${muid}`);

        // Dynamically import graphology and sigma
        const GraphologyModule: any = await import('graphology');
        const Graphology = GraphologyModule.default || GraphologyModule;
        const DirectedGraph = Graphology.DirectedGraph || Graphology;

        const SigmaModule: any = await import('sigma');
        const Sigma = SigmaModule.default || SigmaModule;

        const scanRes = await fetch(`/api/json-scandir?MUID=${encodeURIComponent(muid)}`);
        const files: string[] = await scanRes.json();

        if (!Array.isArray(files) || files.length === 0) {
          setError(`No JSON graph data files found for MUID: ${muid}`);
          setLoading(false);
          return;
        }

        const graph = new DirectedGraph();

        for (const file of files) {
          logger.log('SigmaGraphViewer', `Fetching graph file: /json/${file}`);
          const res = await fetch(`/json/${file}`);
          if (!res.ok) continue;

          const data = await res.json();

          if (data.nodes && Array.isArray(data.nodes)) {
            data.nodes.forEach((nodeItem: any) => {
              const nodeId = String(nodeItem.id);
              if (!graph.hasNode(nodeId)) {
                graph.addNode(nodeId, {
                  label: nodeId,
                  x: Math.random() * 100,
                  y: Math.random() * 100,
                  size: 5,
                  color: '#556270',
                });
              }
            });
          }

          if (data.edges && Array.isArray(data.edges)) {
            data.edges.forEach((edgeItem: any) => {
              const source = String(edgeItem.source);
              const target = String(edgeItem.target);
              if (graph.hasNode(source) && graph.hasNode(target)) {
                if (!graph.hasEdge(source, target)) {
                  graph.addEdge(source, target);
                }
              }
            });
          }
        }

        if (isCancelled) return;

        // Clean up isolated nodes & adjust node sizes
        graph.forEachNode((node: string) => {
          if (graph.degree(node) <= 0) {
            graph.dropNode(node);
          } else {
            const inDeg = graph.inDegree(node);
            graph.setNodeAttribute(node, 'size', Math.max(3, inDeg / 10 + 2));
          }
        });

        // Simple community clustering based on hash of node ID
        graph.forEachNode((node: string) => {
          let hash = 0;
          for (let i = 0; i < node.length; i++) {
            hash = (hash << 5) - hash + node.charCodeAt(i);
            hash |= 0;
          }
          const communityIdx = Math.abs(hash) % communityColors.length;
          graph.setNodeAttribute(node, 'color', communityColors[communityIdx]);
        });

        setStats({ nodes: graph.order, edges: graph.size });

        if (containerRef.current && !isCancelled) {
          containerRef.current.innerHTML = '';
          sigmaInstance = new Sigma(graph, containerRef.current, {
            renderEdgeLabels: false,
            allowInvalidContainer: true,
            enableEdgeClickEvents: true,
            enableEdgeHoverEvents: 'debounce',
          });

          sigmaInstance.on('clickNode', async ({ node }: { node: string }) => {
            logger.log('SigmaGraphViewer', `Node clicked: ${node}`);
            try {
              const infoRes = await fetch(
                `/api/json-data?node=${encodeURIComponent(node)}&nodeType=hashtag&MUID=${encodeURIComponent(muid)}`
              );
              const infoData = await infoRes.json();
              setSelectedNodeData({ node, ...infoData });
            } catch (err) {
              setSelectedNodeData({ node });
            }
          });
        }

        setLoading(false);
      } catch (err: any) {
        logger.error('SigmaGraphViewer', 'Error building graph', err);
        setError(`Failed to render graph: ${err.message || err}`);
        setLoading(false);
      }
    };

    loadGraphData();

    return () => {
      isCancelled = true;
      if (sigmaInstance && typeof sigmaInstance.kill === 'function') {
        sigmaInstance.kill();
      }
    };
  }, [muid]);

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Network Graph User</h4>
          {stats && (
            <div>
              <Badge bg="primary" className="me-2">
                Nodes: {stats.nodes}
              </Badge>
              <Badge bg="secondary">
                Edges: {stats.edges}
              </Badge>
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Building graph network visualization...</p>
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        <div
          ref={containerRef}
          style={{
            height: '750px',
            width: '100%',
            backgroundColor: '#ffffff',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
          }}
        />

        {selectedNodeData && (
          <Card className="mt-3 bg-light">
            <Card.Header className="fw-bold">
              Selected Node Details: {selectedNodeData.node}
            </Card.Header>
            <Card.Body>
              <pre style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {JSON.stringify(selectedNodeData, null, 2)}
              </pre>
            </Card.Body>
          </Card>
        )}
      </Card.Body>
    </Card>
  );
};
