'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, Spinner, Alert, Badge, Button, Form, Row, Col, Tab, Tabs, Table, ButtonGroup } from 'react-bootstrap';
import { logger } from '@/utils/logger';

interface AIGraphViewerProps {
  muid: string;
}

const colorMap: Record<string, string> = {
  hashtag: '#556270',
  post: '#4ECDC4',
  user: '#C7F464',
  hashtag_class: '#FFA500',
  ai_text_word: '#F7CD80',
  ai_text_hashtag: '#EAD7B5',
  ai_custom_inference: '#982AA5',
  ai_world_inference: '#A52A2A',
  entity_individual: '#FF6B6B',
  entity_sub: '#0088FE',
};

const louvainColors = [
  '#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58',
  '#53777A', '#78ec97', '#9c9595', '#fc9d9d', '#fcd49d',
  '#dbfc9d', '#8e407a', '#fe6962', '#f9ba84', '#eee097',
];

const latinText = (text: string): boolean => {
  const regexNonASCII = /([^\x00-\x7F]+)/;
  return !text.match(regexNonASCII);
};

const onlyNumbers = (text: string): boolean => {
  const regexNumbers = /^-?\d*\.?\d*$/;
  return !text.match(regexNumbers);
};

const normalize = (value: number, min: number, max: number, newMin: number, newMax: number): number => {
  if (max === min) return (newMin + newMax) / 2;
  return ((value - min) / (max - min)) * (newMax - newMin) + newMin;
};

export const AIGraphViewer: React.FC<AIGraphViewerProps> = ({ muid }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Graph Metrics
  const [stats, setStats] = useState<{
    order: number;
    size: number;
    dropped: number;
    afterOrder: number;
    afterSize: number;
    density: string;
    simpleSize: number;
    weightedSize: number;
  } | null>(null);

  // Results Outputs
  const [results1, setResults1] = useState<Record<string, number> | null>(null);
  const [results2, setResults2] = useState<Record<string, number> | null>(null);
  const [results3, setResults3] = useState<Array<{
    node: string;
    cleanName: string;
    nodetype: string;
    isPosMatch: boolean;
    usersCount: number;
    usersList: string[];
  }> | null>(null);
  const [centralityDone, setCentralityDone] = useState<boolean>(false);
  const [louvainDone, setLouvainDone] = useState<boolean>(false);

  // Config State (matching PHP form inputs)
  const [nodeMinDegree, setNodeMinDegree] = useState<number>(0);
  const [showConfig, setShowConfig] = useState<boolean>(true);
  const [cleanEntities, setCleanEntities] = useState<boolean>(true);
  const [nodeFixedSize, setNodeFixedSize] = useState<boolean>(false);
  const [initialLayout, setInitialLayout] = useState<'circlepack' | 'random'>('circlepack');
  const [autoGravityScale, setAutoGravityScale] = useState<'auto' | 'manual'>('auto');
  const [gravity, setGravity] = useState<number>(1);
  const [iterations, setIterations] = useState<number>(133);
  const [scale, setScale] = useState<number>(5000);
  const [adjustSizes, setAdjustSizes] = useState<boolean>(false);
  const [barnesHutOptimize, setBarnesHutOptimize] = useState<boolean>(false);
  const [barnesHutTheta, setBarnesHutTheta] = useState<number>(0.5);
  const [linLogMode, setLinLogMode] = useState<boolean>(false);
  const [outboundAttractionDistribution, setOutboundAttractionDistribution] = useState<boolean>(true);
  const [scalingRatio, setScalingRatio] = useState<number>(1);
  const [slowDown, setSlowDown] = useState<number>(1);
  const [strongGravityMode, setStrongGravityMode] = useState<boolean>(false);

  const [networkFilter, setNetworkFilter] = useState({
    standard: true,
    text_ai: true,
    image_ai: true,
    text_ai_entitites: true,
  });

  const [reducerDepth, setReducerDepth] = useState<'1hop' | '2hop'>('1hop');
  const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null);
  const [hoveredNodeInfo, setHoveredNodeInfo] = useState<{ node: string; nodetype: string; label: string; degree: number } | null>(null);
  const [nodeHistory, setNodeHistory] = useState<Array<{ node: string; nodetype: string; label: string }>>([]);

  const [activeLayout, setActiveLayout] = useState<boolean>(false);
  const fa2LayoutRef = useRef<any>(null);
  const graphRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);

  useEffect(() => {
    if (!muid || !containerRef.current) return;

    let isCancelled = false;

    const loadGraph = async () => {
      try {
        setLoading(true);
        setError(null);

        logger.log('AIGraphViewer', `Loading AI graph dataset for MUID: ${muid}`);

        const GraphologyModule: any = await import('graphology');
        const Graphology = GraphologyModule.default || GraphologyModule;
        const MultiGraph = Graphology.MultiGraph || Graphology.DirectedGraph || Graphology;

        const SigmaModule: any = await import('sigma');
        const Sigma = SigmaModule.default || SigmaModule;

        const GraphologyLibraryModule: any = await import('graphology-library');
        const GraphologyLibrary = GraphologyLibraryModule.default || GraphologyLibraryModule;

        let scanRes = await fetch(`/api/json-scandir?MUID=${encodeURIComponent(muid)}&type=ai`);
        let files: string[] = await scanRes.json();
        let isAiPath = true;

        if (!Array.isArray(files) || files.length === 0) {
          scanRes = await fetch(`/api/json-scandir?MUID=${encodeURIComponent(muid)}&type=standard`);
          files = await scanRes.json();
          isAiPath = false;
        }

        if (!Array.isArray(files) || files.length === 0) {
          setError(`No graph dataset JSON files found for MUID: ${muid}`);
          setLoading(false);
          return;
        }

        const graph = new MultiGraph();
        graphRef.current = graph;

        let maxLikes = Number.MIN_SAFE_INTEGER;
        let minLikes = Number.MAX_SAFE_INTEGER;
        let maxNoPublications = Number.MIN_SAFE_INTEGER;
        let minNoPublications = Number.MAX_SAFE_INTEGER;
        let maxFollowers = Number.MIN_SAFE_INTEGER;
        let minFollowers = Number.MAX_SAFE_INTEGER;

        for (const file of files) {
          const fetchPath = isAiPath ? `/json/ai/${file}` : `/json/${file}`;
          const res = await fetch(fetchPath);
          if (!res.ok) continue;
          const data = await res.json();

          if (data.nodes && Array.isArray(data.nodes)) {
            data.nodes.forEach((item: any) => {
              const nodeId = String(item.id).toLowerCase();
              if (!graph.hasNode(nodeId)) {
                if (item.type === 'post') {
                  const likes = item.likes || 0;
                  maxLikes = Math.max(maxLikes, likes);
                  minLikes = Math.min(minLikes, likes);
                  graph.addNode(nodeId, {
                    label: item.label || nodeId,
                    nodetype: item.type,
                    likes,
                    comments: item.comments || 0,
                    product_type: item.product_type || '',
                  });
                } else if (item.type === 'hashtag') {
                  const pubs = parseInt(item.no_publications, 10);
                  if (!isNaN(pubs)) {
                    maxNoPublications = Math.max(maxNoPublications, pubs);
                    minNoPublications = Math.min(minNoPublications, pubs);
                  }
                  graph.addNode(nodeId, {
                    label: item.label || nodeId,
                    nodetype: item.type,
                    no_publications: item.no_publications,
                  });
                } else if (item.type === 'user') {
                  const followers = item.follower || 0;
                  maxFollowers = Math.max(maxFollowers, followers);
                  minFollowers = Math.min(minFollowers, followers);
                  graph.addNode(nodeId, {
                    label: item.label || nodeId,
                    nodetype: item.type,
                    followers,
                    following: item.following || 0,
                    private: item.private || 0,
                  });
                } else {
                  graph.addNode(nodeId, {
                    label: item.label || nodeId,
                    nodetype: item.type || 'default',
                  });
                }
              }
            });
          }

          if (data.edges && Array.isArray(data.edges)) {
            data.edges.forEach((item: any) => {
              const source = String(item.source).toLowerCase();
              const target = String(item.target).toLowerCase();
              if (graph.hasNode(source) && graph.hasNode(target)) {
                try {
                  graph.addEdge(source, target);
                } catch {
                  // duplicate edge handled in multigraph
                }
              }
            });
          }
        }

        if (isCancelled) return;

        const initialOrder = graph.order;
        const initialSize = graph.size;
        let dropCont = 0;

        // Pruning logic matching PHP setNodeSize & cleanEntities
        graph.forEachNode((node: string) => {
          const nodetype = graph.getNodeAttribute(node, 'nodetype');

          if (graph.degree(node) <= nodeMinDegree) {
            dropCont++;
            graph.dropNode(node);
            return;
          }

          if (cleanEntities) {
            if (!latinText(node) && graph.hasNode(node)) {
              graph.dropNode(node);
              dropCont++;
              return;
            }
            if (!onlyNumbers(node) && graph.hasNode(node)) {
              graph.dropNode(node);
              dropCont++;
              return;
            }
          }

          // Node size assignment
          if (nodeFixedSize) {
            if (nodetype === 'hashtag') {
              graph.setNodeAttribute(node, 'size', 4);
              graph.setNodeAttribute(node, 'color', colorMap.hashtag);
            } else if (nodetype === 'post') {
              graph.setNodeAttribute(node, 'size', 8);
              graph.setNodeAttribute(node, 'color', colorMap.post);
            } else if (nodetype === 'user') {
              graph.setNodeAttribute(node, 'size', 6);
              graph.setNodeAttribute(node, 'color', colorMap.user);
            } else if (nodetype === 'hashtag_class') {
              graph.setNodeAttribute(node, 'size', 15);
              graph.setNodeAttribute(node, 'color', colorMap.hashtag_class);
            } else if (nodetype === 'ai_custom_inference') {
              graph.setNodeAttribute(node, 'size', 15);
              graph.setNodeAttribute(node, 'color', colorMap.ai_custom_inference);
            } else {
              graph.setNodeAttribute(node, 'size', 5);
              graph.setNodeAttribute(node, 'color', colorMap[nodetype] || '#888888');
            }
          } else {
            if (nodetype === 'hashtag') {
              const pubs = graph.getNodeAttribute(node, 'no_publications') || 0;
              const size = normalize(pubs, minNoPublications, maxNoPublications, 3, 20);
              graph.setNodeAttribute(node, 'size', size);
              graph.setNodeAttribute(node, 'color', colorMap.hashtag);
            } else if (nodetype === 'post') {
              const likes = graph.getNodeAttribute(node, 'likes') || 0;
              const size = normalize(likes, minLikes, maxLikes, 3, 20);
              graph.setNodeAttribute(node, 'size', size);
              graph.setNodeAttribute(node, 'color', colorMap.post);
            } else if (nodetype === 'user') {
              const followers = graph.getNodeAttribute(node, 'followers') || 0;
              const size = normalize(followers, minFollowers, maxFollowers, 3, 20);
              graph.setNodeAttribute(node, 'size', size);
              graph.setNodeAttribute(node, 'color', colorMap.user);
            } else {
              const size = (graph.degree(node) / 9.333) + 3.33;
              graph.setNodeAttribute(node, 'size', size);
              graph.setNodeAttribute(node, 'color', colorMap[nodetype] || '#888888');
            }
          }
        });

        // Apply initial layout
        if (GraphologyLibrary.layout) {
          if (initialLayout === 'random' && GraphologyLibrary.layout.random) {
            GraphologyLibrary.layout.random.assign(graph);
          } else if (GraphologyLibrary.layout.circlepack) {
            GraphologyLibrary.layout.circlepack.assign(graph);
          }
        }

        let computedGravity = gravity;
        let computedScaling = scalingRatio;
        if (autoGravityScale === 'auto') {
          computedGravity = graph.order;
          computedScaling = graph.size;
        }

        const calculatedDensity = GraphologyLibrary.metrics?.graph?.density
          ? GraphologyLibrary.metrics.graph.density(graph).toFixed(4)
          : 'N/A';

        const simpleSize = GraphologyLibrary.metrics?.graph?.simpleSize
          ? GraphologyLibrary.metrics.graph.simpleSize(graph)
          : graph.size;

        const weightedSize = GraphologyLibrary.metrics?.graph?.weightedSize
          ? GraphologyLibrary.metrics.graph.weightedSize(graph)
          : graph.size;

        setStats({
          order: initialOrder,
          size: initialSize,
          dropped: dropCont,
          afterOrder: graph.order,
          afterSize: graph.size,
          density: String(calculatedDensity),
          simpleSize,
          weightedSize,
        });

        if (containerRef.current && !isCancelled) {
          containerRef.current.innerHTML = '';
          const renderer = new Sigma(graph, containerRef.current, {
            renderLabels: false,
            allowInvalidContainer: true,
          });
          rendererRef.current = renderer;

          const state: any = {};

          renderer.on('clickNode', async ({ node }: { node: string }) => {
            const nodetype = graph.getNodeAttribute(node, 'nodetype');
            const label = graph.getNodeAttribute(node, 'label') || node;

            state.selectedNode = node;
            state.selectedNeighbors = new Set(graph.neighbors(node));
            state.selectedNeighborsNeighbors = new Set();
            graph.neighbors(node).forEach((el: string) => {
              graph.neighbors(el).forEach((item: string) => state.selectedNeighborsNeighbors.add(item));
            });

            setNodeHistory((prev) => [
              { node, nodetype, label },
              ...prev.filter((h) => h.node !== node),
            ]);

            try {
              const res = await fetch(
                `/api/json-data?node=${encodeURIComponent(node)}&nodeType=${encodeURIComponent(
                  nodetype || 'hashtag'
                )}&MUID=${encodeURIComponent(muid)}`
              );
              const info = await res.json();
              setSelectedNodeData({ node, nodetype, label, ...info });
            } catch (err) {
              setSelectedNodeData({ node, nodetype, label });
            }
            renderer.refresh();
          });

          renderer.on('clickStage', () => {
            state.selectedNode = undefined;
            state.selectedNeighbors = undefined;
            state.selectedNeighborsNeighbors = undefined;
            setSelectedNodeData(null);
            renderer.refresh();
          });

          renderer.on('enterNode', ({ node }: { node: string }) => {
            if (graph.hasNode(node)) {
              const attr = graph.getNodeAttributes(node);
              setHoveredNodeInfo({
                node,
                nodetype: attr.nodetype || 'node',
                label: attr.label || node,
                degree: graph.degree(node),
              });
            }
          });

          renderer.on('leaveNode', () => {
            setHoveredNodeInfo(null);
          });

          renderer.setSetting('nodeReducer', (node: string, data: any) => {
            const res = { ...data };
            if (
              state.selectedNeighborsNeighbors &&
              state.selectedNeighborsNeighbors.has(node) &&
              state.selectedNeighbors &&
              !state.selectedNeighbors.has(node) &&
              state.selectedNode !== node
            ) {
              if (reducerDepth === '1hop') {
                res.label = '';
                res.color = '#f6f6f6';
                res.hidden = true;
              }
            } else if (
              state.selectedNeighbors &&
              !state.selectedNeighbors.has(node) &&
              state.selectedNode !== node
            ) {
              res.label = '';
              res.color = '#f6f6f6';
              res.hidden = true;
            }
            if (state.selectedNode === node) {
              res.highlighted = true;
            }
            return res;
          });
        }

        setLoading(false);
      } catch (err: any) {
        logger.error('AIGraphViewer', 'Error loading AI graph', err);
        setError(`Failed to render graph: ${err.message || err}`);
        setLoading(false);
      }
    };

    loadGraph();

    return () => {
      isCancelled = true;
      if (fa2LayoutRef.current && fa2LayoutRef.current.stop) {
        fa2LayoutRef.current.stop();
      }
      if (rendererRef.current && typeof rendererRef.current.kill === 'function') {
        rendererRef.current.kill();
      }
    };
  }, [
    muid,
    nodeMinDegree,
    cleanEntities,
    nodeFixedSize,
    initialLayout,
    autoGravityScale,
    reducerDepth,
  ]);

  // BUTTON 1: Start FA2 Layout
  const handleStartLayout = async () => {
    if (!graphRef.current) return;
    try {
      const GraphologyLibraryModule: any = await import('graphology-library');
      const GraphologyLibrary = GraphologyLibraryModule.default || GraphologyLibraryModule;

      if (GraphologyLibrary.FA2Layout) {
        if (fa2LayoutRef.current) fa2LayoutRef.current.stop();
        const layout = new GraphologyLibrary.FA2Layout(graphRef.current, {
          iterations,
          settings: {
            gravity,
            adjustSizes,
            barnesHutOptimize,
            barnesHutTheta,
            linLogMode,
            outboundAttractionDistribution,
            scalingRatio,
            slowDown,
            strongGravityMode,
          },
        });
        fa2LayoutRef.current = layout;
        layout.start();
        setActiveLayout(true);
      }
    } catch (err) {
      logger.error('AIGraphViewer', 'Error starting FA2 layout', err);
    }
  };

  // BUTTON 2: Stop FA2 Layout
  const handleStopLayout = () => {
    if (fa2LayoutRef.current && fa2LayoutRef.current.stop) {
      fa2LayoutRef.current.stop();
      setActiveLayout(false);
    }
  };

  // BUTTON 3: Screenshot
  const handleScreenshot = async () => {
    if (!containerRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(containerRef.current, { scale: 3, backgroundColor: '#ffffff' });
      const url = canvas.toDataURL('image/jpeg');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${muid}_${new Date().toISOString().slice(0, 19)}.jpeg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      logger.error('AIGraphViewer', 'Error taking screenshot', err);
    }
  };

  // BUTTON 4: Reset Initial Sizes & Colors
  const handleResetFixedSizes = () => {
    if (!graphRef.current) return;
    graphRef.current.forEachNode((node: string) => {
      const nodetype = graphRef.current.getNodeAttribute(node, 'nodetype');
      graphRef.current.setNodeAttribute(node, 'color', colorMap[nodetype] || '#888888');
      graphRef.current.setNodeAttribute(node, 'size', 6);
    });
    if (rendererRef.current) rendererRef.current.refresh();
  };

  // BUTTON 5: Drop Not Inferenced (cleanNonInferenced)
  const handleCleanNonInferenced = async () => {
    if (!graphRef.current) return;
    const graph = graphRef.current;
    try {
      const GraphologyLibraryModule: any = await import('graphology-library');
      const GraphologyLibrary = GraphologyLibraryModule.default || GraphologyLibraryModule;

      const userNodes: string[] = [];
      graph.forEachNode((node: string, attr: any) => {
        if (attr.nodetype === 'user') userNodes.push(node);
      });

      userNodes.forEach((userNode) => {
        graph.forEachNode((node: string, attr: any) => {
          if (attr.nodetype === 'ai_custom_inference') {
            const path = GraphologyLibrary.shortestPath?.bidirectional(graph, userNode, node);
            if (path && path.length === 3) {
              try {
                graph.addEdge(node, userNode, { weight: 3 });
              } catch {}
            }
          }
        });
      });

      graph.forEachNode((node: string, attr: any) => {
        if (attr.nodetype === 'hashtag' || attr.nodetype === 'post') {
          graph.dropNode(node);
        }
      });

      if (GraphologyLibrary.layout?.circlepack) {
        GraphologyLibrary.layout.circlepack.assign(graph);
      }
      if (rendererRef.current) rendererRef.current.refresh();
    } catch (err) {
      logger.error('AIGraphViewer', 'Error in cleanNonInferenced', err);
    }
  };

  // BUTTON 6: Delete Post/Hashtags
  const handleDeletePostHashtags = () => {
    if (!graphRef.current) return;
    const graph = graphRef.current;
    graph.forEachNode((node: string, attr: any) => {
      if (attr.nodetype === 'hashtag' || attr.nodetype === 'post') {
        graph.dropNode(node);
      }
    });
    if (rendererRef.current) rendererRef.current.refresh();
  };

  // BUTTON 7: Compute Centrality Stats
  const handleComputeCentrality = async () => {
    if (!graphRef.current) return;
    try {
      const GraphologyLibraryModule: any = await import('graphology-library');
      const GraphologyLibrary = GraphologyLibraryModule.default || GraphologyLibraryModule;

      const metrics = GraphologyLibrary.metrics?.centrality;
      if (metrics) {
        if (metrics.betweenness?.assign) metrics.betweenness.assign(graphRef.current, { normalized: true });
        if (metrics.closeness?.assign) metrics.closeness.assign(graphRef.current, { normalized: true });
        if (metrics.degree?.assign) metrics.degree.assign(graphRef.current, { normalized: true });
        if (metrics.pagerank?.assign) metrics.pagerank.assign(graphRef.current, { maxIterations: 9000, alpha: 0.3 });
      }
      setCentralityDone(true);
    } catch (err) {
      logger.error('AIGraphViewer', 'Error computing centralities', err);
    }
  };

  // Centrality Visual Sizing Helpers
  const applyCentralitySizing = (attrName: string) => {
    if (!graphRef.current) return;
    const graph = graphRef.current;
    const values = graph.nodes().map((node: string) => graph.getNodeAttribute(node, attrName) || 0);
    const maxVal = Math.max(...values);
    const scaleFactor = maxVal > 0 ? 50 / maxVal : 1;

    graph.forEachNode((node: string) => {
      const val = graph.getNodeAttribute(node, attrName) || 0;
      graph.setNodeAttribute(node, 'size', Math.max(3, val * scaleFactor));
    });
    if (rendererRef.current) rendererRef.current.refresh();
  };

  // BUTTON 8: Compute Louvain
  const handleComputeLouvain = async () => {
    if (!graphRef.current) return;
    try {
      const GraphologyLibraryModule: any = await import('graphology-library');
      const GraphologyLibrary = GraphologyLibraryModule.default || GraphologyLibraryModule;

      if (GraphologyLibrary.communitiesLouvain) {
        GraphologyLibrary.communitiesLouvain.assign(graphRef.current, {
          randomWalk: false,
          resolution: 0.38,
        });
        setLouvainDone(true);
      }
    } catch (err) {
      logger.error('AIGraphViewer', 'Error computing Louvain', err);
    }
  };

  // BUTTON 9: Color Louvain
  const handleColorLouvain = () => {
    if (!graphRef.current) return;
    const graph = graphRef.current;
    const graphColors: Record<number, string> = {};

    graph.forEachNode((node: string) => {
      const community = graph.getNodeAttribute(node, 'community');
      if (community !== undefined) {
        if (community < louvainColors.length) {
          graph.setNodeAttribute(node, 'color', louvainColors[community]);
        } else {
          if (!(community in graphColors)) {
            graphColors[community] = '#' + Math.floor(Math.random() * 16777215).toString(16);
          }
          graph.setNodeAttribute(node, 'color', graphColors[community]);
        }
      }
    });
    if (rendererRef.current) rendererRef.current.refresh();
  };

  // BUTTON 10: Count Node Types
  const handleCountNodeTypes = () => {
    if (!graphRef.current) return;
    const counts: Record<string, number> = { total: 0 };
    graphRef.current.forEachNode((node: string, attr: any) => {
      counts.total++;
      const type = attr.nodetype || 'other';
      counts[type] = (counts[type] || 0) + 1;
    });
    setResults1(counts);
  };

  // Helper to select node from table
  const handleSelectNodeFromTable = async (node: string) => {
    if (!graphRef.current) return;
    const graph = graphRef.current;
    if (!graph.hasNode(node)) return;

    const nodetype = graph.getNodeAttribute(node, 'nodetype') || 'entity_individual';
    const label = graph.getNodeAttribute(node, 'label') || node;

    setNodeHistory((prev) => [
      { node, nodetype, label },
      ...prev.filter((h) => h.node !== node),
    ]);

    try {
      const res = await fetch(
        `/api/json-data?node=${encodeURIComponent(node)}&nodeType=${encodeURIComponent(
          nodetype
        )}&MUID=${encodeURIComponent(muid)}`
      );
      const info = await res.json();
      setSelectedNodeData({ node, nodetype, label, ...info });
    } catch (err) {
      setSelectedNodeData({ node, nodetype, label });
    }
  };

  // BUTTON 11: Top Linked Users Analysis (contarNodosConUsuariosVinculados)
  const handleContarNodosConUsuariosVinculados = () => {
    if (!graphRef.current) return;
    const graph = graphRef.current;
    const nodesWithUsers: Record<string, { count: number; cleanName: string; nodetype: string; isPosMatch: boolean; neighbors: string[] }> = {};

    graph.forEachNode((node: string, attr: any) => {
      const nodetype = attr.nodetype || '';
      if (
        nodetype === 'entity_individual' ||
        nodetype === 'ai_custom_inference' ||
        nodetype === 'ai_text_word' ||
        nodetype === 'ai_text_hashtag' ||
        nodetype === 'ai_world_inference' ||
        nodetype === 'entity_sub' ||
        nodetype === 'hashtag_class'
      ) {
        const neighbors = graph.neighbors(node);
        const cleanName = node.toString().replace(/^ent_/, '').replace(/^ai_/, '');
        const isPosMatch = neighbors.includes(cleanName);
        nodesWithUsers[node] = {
          count: neighbors.length,
          cleanName,
          nodetype,
          isPosMatch,
          neighbors,
        };
      }
    });

    const sorted = Object.keys(nodesWithUsers).sort((a, b) => nodesWithUsers[b].count - nodesWithUsers[a].count);
    const top20 = sorted.slice(0, 20).map((node) => ({
      node,
      cleanName: nodesWithUsers[node].cleanName,
      nodetype: nodesWithUsers[node].nodetype,
      isPosMatch: nodesWithUsers[node].isPosMatch,
      usersCount: nodesWithUsers[node].count,
      usersList: nodesWithUsers[node].neighbors,
    }));

    setResults3(top20);
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center py-3">
        <h4 className="mb-0 fs-5 fw-bold">Multi-Layer AI Network Graph Analysis</h4>
        {stats && (
          <div className="small">
            <Badge bg="primary" className="me-2">Initial Nodes: {stats.order}</Badge>
            <Badge bg="secondary" className="me-2">Dropped: {stats.dropped}</Badge>
            <Badge bg="success" className="me-2">Active Nodes: {stats.afterOrder}</Badge>
            <Badge bg="info" className="me-2">Active Edges: {stats.afterSize}</Badge>
            <Badge bg="warning" text="dark">Density: {stats.density}</Badge>
          </div>
        )}
      </Card.Header>

      <Card.Body>
        {/* 1. Interactive Action Buttons Toolbar (Always Visible) */}
        <div className="bg-light p-3 rounded border mb-3">
          <div className="fw-bold mb-2 text-dark border-bottom pb-1">Interactive Graph Actions</div>
          <div className="d-flex flex-wrap gap-2 mb-2">
            <Button variant={activeLayout ? 'warning' : 'primary'} size="sm" onClick={handleStartLayout}>
              Start FA2 Layout
            </Button>
            <Button variant="secondary" size="sm" onClick={handleStopLayout}>
              Stop FA2 Layout
            </Button>
            <Button variant="outline-dark" size="sm" onClick={handleScreenshot}>
              Capture Screenshot
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={handleResetFixedSizes}>
              Reset Initial Size & Colors
            </Button>
            <Button variant="outline-danger" size="sm" onClick={handleCleanNonInferenced}>
              Drop Not Inferenced
            </Button>
            <Button variant="outline-danger" size="sm" onClick={handleDeletePostHashtags}>
              Delete Post/Hashtags
            </Button>
          </div>

          <div className="d-flex flex-wrap gap-2 mb-2 align-items-center">
            <Button variant="info" size="sm" className="text-white" onClick={handleComputeCentrality}>
              Compute Centrality Stats
            </Button>
            {centralityDone && <Badge bg="success">Centralities Done</Badge>}
            <ButtonGroup size="sm">
              <Button variant="outline-info" onClick={() => applyCentralitySizing('betweennessCentrality')}>
                Betweenness
              </Button>
              <Button variant="outline-info" onClick={() => applyCentralitySizing('closenessCentrality')}>
                Closeness
              </Button>
              <Button variant="outline-info" onClick={() => applyCentralitySizing('degreeCentrality')}>
                Degree
              </Button>
              <Button variant="outline-info" onClick={() => applyCentralitySizing('pagerank')}>
                PageRank
              </Button>
            </ButtonGroup>
          </div>

          <div className="d-flex flex-wrap gap-2 align-items-center">
            <Button variant="success" size="sm" onClick={handleComputeLouvain}>
              Compute Louvain Stats
            </Button>
            {louvainDone && <Badge bg="success">Louvain Done</Badge>}
            <Button variant="outline-success" size="sm" onClick={handleColorLouvain}>
              Color Louvain Communities
            </Button>
            <Button variant="outline-primary" size="sm" onClick={handleCountNodeTypes}>
              Count Node Types
            </Button>
            <Button variant="outline-dark" size="sm" onClick={handleContarNodosConUsuariosVinculados}>
              Top Linked Users Analysis
            </Button>
          </div>
        </div>

        {/* 2. Graph Parameters & Filters - EXACT ORIGINAL PHP FORM ORDER (Section 9 Report) */}
        <Card className="mb-3 border bg-light">
          <Card.Header className="bg-white fw-bold py-2 d-flex justify-content-between align-items-center">
            <span>Graphology.js ForceAtlas Layout — Parameters &amp; Filters</span>
            <Button
              variant="link"
              size="sm"
              className="p-0 text-decoration-none"
              onClick={() => setShowConfig(!showConfig)}
            >
              {showConfig ? 'Hide Parameters ▲' : 'Show Parameters ▼'}
            </Button>
          </Card.Header>
          {showConfig && (
            <Card.Body className="p-3">
              {/* ── 1. networkfilter[] ── (Original: Checkboxes Standard, Text_AI_Dict, Text_AI_OOV, Image_AI) */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small">Network will include:</Form.Label>
                <div className="d-flex flex-wrap gap-3">
                  <Form.Check
                    type="checkbox"
                    id="networkfilter-standard"
                    label="Standard"
                    checked={networkFilter.standard}
                    onChange={(e) => setNetworkFilter({ ...networkFilter, standard: e.target.checked })}
                  />
                  <Form.Check
                    type="checkbox"
                    id="networkfilter-text_ai"
                    label="Text_AI_Dict"
                    checked={networkFilter.text_ai}
                    onChange={(e) => setNetworkFilter({ ...networkFilter, text_ai: e.target.checked })}
                  />
                  <Form.Check
                    type="checkbox"
                    id="networkfilter-text_ai_entities"
                    label="Text_AI_OOV"
                    checked={networkFilter.text_ai_entitites}
                    onChange={(e) => setNetworkFilter({ ...networkFilter, text_ai_entitites: e.target.checked })}
                  />
                  <Form.Check
                    type="checkbox"
                    id="networkfilter-image_ai"
                    label="Image_AI"
                    checked={networkFilter.image_ai}
                    onChange={(e) => setNetworkFilter({ ...networkFilter, image_ai: e.target.checked })}
                  />
                </div>
                <Form.Text className="text-muted">
                  Select the data used to feed the graph. Standard [hashtags, posts, users]. Text_AI: Hashtags classified by [Northamerica city list, Graffiti terms, Railroad terms]. Image_AI: Post classified by graffiti types [tag, wildstyle, 3D, monikers, bomba (throwup)]
                </Form.Text>
              </Form.Group>

              <hr className="my-2" />

              {/* ── 2. nodeMinDegree ── */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small">Node Minimum Degree ({nodeMinDegree})</Form.Label>
                <Form.Range min={0} max={30} value={nodeMinDegree} onChange={(e) => setNodeMinDegree(parseInt(e.target.value, 10))} />
                <Form.Text className="text-muted">Minimum entrance degree of node, smaller will be deleted from graph. Default: 0</Form.Text>
              </Form.Group>

              {/* ── 3. cleanEntities ── */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small d-block">Should we clean not related <b>text_ai_entities</b> to term <b>"graffiti"</b>, numbers only and non latin chars?</Form.Label>
                <Form.Check inline type="radio" id="cleanEntities-true" label="true" checked={cleanEntities} onChange={() => setCleanEntities(true)} />
                <Form.Check inline type="radio" id="cleanEntities-false" label="false" checked={!cleanEntities} onChange={() => setCleanEntities(false)} />
              </Form.Group>

              <hr className="my-2" />

              <Row>
                <Col md={6}>
                  {/* ── 4. gravity ── */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Gravity ({gravity})</Form.Label>
                    <Form.Control type="number" size="sm" step="0.1" value={gravity} onChange={(e) => setGravity(parseFloat(e.target.value))} />
                  </Form.Group>

                  {/* ── 5. adjustSizes ── */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small d-block">Should the node&apos;s sizes be taken into account?</Form.Label>
                    <Form.Check inline type="radio" id="adjustSizes-true" label="true" checked={adjustSizes} onChange={() => setAdjustSizes(true)} />
                    <Form.Check inline type="radio" id="adjustSizes-false" label="false" checked={!adjustSizes} onChange={() => setAdjustSizes(false)} />
                  </Form.Group>

                  {/* ── 6. barnesHutOptimize ── */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small d-block">Use Barnes-Hut approximation O(n·log n)?</Form.Label>
                    <Form.Check inline type="radio" id="barnesHut-true" label="true" checked={barnesHutOptimize} onChange={() => setBarnesHutOptimize(true)} />
                    <Form.Check inline type="radio" id="barnesHut-false" label="false" checked={!barnesHutOptimize} onChange={() => setBarnesHutOptimize(false)} />
                  </Form.Group>

                  {/* ── 7. barnesHutTheta ── */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Barnes-Hut approximation theta ({barnesHutTheta})</Form.Label>
                    <Form.Control type="number" size="sm" step="0.1" value={barnesHutTheta} onChange={(e) => setBarnesHutTheta(parseFloat(e.target.value))} />
                  </Form.Group>

                  {/* ── 8. outboundAttractionDistribution ── */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small d-block">outboundAttractionDistribution</Form.Label>
                    <Form.Check inline type="radio" id="outbound-true" label="true" checked={outboundAttractionDistribution} onChange={() => setOutboundAttractionDistribution(true)} />
                    <Form.Check inline type="radio" id="outbound-false" label="false" checked={!outboundAttractionDistribution} onChange={() => setOutboundAttractionDistribution(false)} />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  {/* ── 9. linLogMode ── */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small d-block">Use Noack&apos;s LinLog model?</Form.Label>
                    <Form.Check inline type="radio" id="linLog-true" label="true" checked={linLogMode} onChange={() => setLinLogMode(true)} />
                    <Form.Check inline type="radio" id="linLog-false" label="false" checked={!linLogMode} onChange={() => setLinLogMode(false)} />
                  </Form.Group>

                  {/* ── 10. scalingRatio ── */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">scalingRatio ({scalingRatio})</Form.Label>
                    <Form.Control type="number" size="sm" step="0.1" value={scalingRatio} onChange={(e) => setScalingRatio(parseFloat(e.target.value))} />
                  </Form.Group>

                  {/* ── 11. slowDown ── */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">slowDown ({slowDown})</Form.Label>
                    <Form.Control type="number" size="sm" step="0.1" value={slowDown} onChange={(e) => setSlowDown(parseFloat(e.target.value))} />
                  </Form.Group>

                  {/* ── 12. strongGravityMode ── */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small d-block">strongGravityMode</Form.Label>
                    <Form.Check inline type="radio" id="strongGravity-true" label="true" checked={strongGravityMode} onChange={() => setStrongGravityMode(true)} />
                    <Form.Check inline type="radio" id="strongGravity-false" label="false" checked={!strongGravityMode} onChange={() => setStrongGravityMode(false)} />
                  </Form.Group>

                  {/* ── 13. nodeFixedSize ── */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small d-block">nodeFixedSize</Form.Label>
                    <Form.Check inline type="radio" id="nodeFixedSize-true" label="true" checked={nodeFixedSize} onChange={() => setNodeFixedSize(true)} />
                    <Form.Check inline type="radio" id="nodeFixedSize-false" label="false" checked={!nodeFixedSize} onChange={() => setNodeFixedSize(false)} />
                  </Form.Group>

                  {/* ── 14. initialLayout ── */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small d-block">initialLayout</Form.Label>
                    <Form.Check inline type="radio" id="initialLayout-random" label="random" checked={initialLayout === 'random'} onChange={() => setInitialLayout('random')} />
                    <Form.Check inline type="radio" id="initialLayout-circlepack" label="circlepack" checked={initialLayout === 'circlepack'} onChange={() => setInitialLayout('circlepack')} />
                  </Form.Group>

                  {/* ── 15. autoGravityScale ── */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small d-block">autoGravityScale</Form.Label>
                    <Form.Check inline type="radio" id="autoGravity-auto" label="auto" checked={autoGravityScale === 'auto'} onChange={() => setAutoGravityScale('auto')} />
                    <Form.Check inline type="radio" id="autoGravity-manual" label="manual" checked={autoGravityScale === 'manual'} onChange={() => setAutoGravityScale('manual')} />
                  </Form.Group>
                </Col>
              </Row>

              <hr className="my-2" />

              {/* ── 16. nodeReducerDepth (from Section 2 Central) ── */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small d-block">nodeReducerDepth <span className="text-danger">*</span></Form.Label>
                <Form.Check inline type="radio" id="reducerDepth-1hop" label="selectedNeighbors (1-hop)" checked={reducerDepth === '1hop'} onChange={() => setReducerDepth('1hop')} />
                <Form.Check inline type="radio" id="reducerDepth-2hop" label="selectedNeighborsNeighbors (2-hop)" checked={reducerDepth === '2hop'} onChange={() => setReducerDepth('2hop')} />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Iterations ({iterations})</Form.Label>
                    <Form.Control type="number" size="sm" value={iterations} onChange={(e) => setIterations(parseInt(e.target.value, 10))} />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          )}
        </Card>

        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Building AI multi-layer graph network...</p>
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {/* 3. Sigma Canvas Container & Floating Overlays/Modals (exact deprecated structure) */}
        <div
          ref={containerRef}
          style={{
            height: '750px',
            width: '100%',
            backgroundColor: '#ffffff',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* LEFT FLOATING OVERLAY: Click History & Graph Stats Modal (.hover.stats) */}
          <div
            style={{
              position: 'absolute',
              left: '12px',
              top: '12px',
              zIndex: 9999,
              width: '320px',
              maxHeight: '720px',
              overflowY: 'auto',
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #ced4da',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              padding: '12px',
              fontSize: '0.82rem',
            }}
          >
            {/* Graph Stats Section */}
            {stats && (
              <div className="mb-3 border-bottom pb-2">
                <h6 className="fw-bold text-dark mb-1 fs-7">Graph Stats</h6>
                <ul className="list-unstyled mb-0 small">
                  <li>Total nodes: <strong>{stats.order}</strong></li>
                  <li>Total edges: <strong>{stats.size}</strong></li>
                  <li>Dropped nodes: <strong>{stats.dropped}</strong></li>
                  <li>Nodes after drop: <strong>{stats.afterOrder}</strong></li>
                  <li>Edges after drop: <strong>{stats.afterSize}</strong></li>
                  <li>Density: <strong>{stats.density}</strong></li>
                  <li>Simple size: <strong>{stats.simpleSize}</strong></li>
                  <li>Weighted size: <strong>{stats.weightedSize}</strong></li>
                </ul>
              </div>
            )}

            {/* Click History Section */}
            <div className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h6 className="fw-bold text-dark mb-0 fs-7">
                  Click History {nodeHistory.length > 0 && `(${nodeHistory.length})`}
                </h6>
                {nodeHistory.length > 0 && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-danger text-decoration-none small"
                    onClick={() => setNodeHistory([])}
                  >
                    Delete
                  </Button>
                )}
              </div>
              {nodeHistory.length === 0 ? (
                <small className="text-muted italic">Click any node on graph...</small>
              ) : (
                <ul className="list-group list-group-flush small" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                  {nodeHistory.map((item, idx) => (
                    <li
                      key={idx}
                      className="list-group-item list-group-item-action py-1 px-2 d-flex justify-content-between align-items-center"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSelectNodeFromTable(item.node)}
                    >
                      <span className="fw-semibold text-truncate me-1">{item.label}</span>
                      <Badge bg="secondary" style={{ fontSize: '0.65rem' }}>{item.nodetype}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Hover Tooltip Info if hovering over node */}
            {hoveredNodeInfo && (
              <div className="mt-2 p-2 bg-dark text-white rounded small">
                <div className="fw-bold text-warning">{hoveredNodeInfo.label}</div>
                <div>Type: <Badge bg="info" className="text-white">{hoveredNodeInfo.nodetype}</Badge></div>
                <div>Neighbors: <strong>{hoveredNodeInfo.degree}</strong></div>
              </div>
            )}
          </div>

          {/* RIGHT FLOATING OVERLAY MODAL: HoverBox / ML Post Inspection Card (.hoverBox.hashtag) */}
          {selectedNodeData && (
            <div
              style={{
                position: 'absolute',
                right: '0',
                top: '0',
                bottom: '0',
                zIndex: 99999,
                width: '420px',
                backgroundColor: 'rgba(255, 255, 255, 0.97)',
                backdropFilter: 'blur(10px)',
                borderLeft: '2px solid #0d6efd',
                boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
                padding: '16px',
                overflowY: 'auto',
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                <h6 className="fw-bold text-primary mb-0">
                  Node Inspection: {selectedNodeData.label || selectedNodeData.node}
                </h6>
                <Button variant="outline-secondary" size="sm" onClick={() => setSelectedNodeData(null)}>
                  ✕ Close
                </Button>
              </div>

              {selectedNodeData.hashtag_info && (
                <div className="mb-3 p-2 bg-light rounded border">
                  <h5 className="fw-bold text-primary mb-1">
                    Hashtag:{' '}
                    <a
                      href={`https://www.instagram.com/explore/tags/${selectedNodeData.hashtag_info.node}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      #{selectedNodeData.hashtag_info.node}
                    </a>
                  </h5>
                  <h6>Amount: <b>{selectedNodeData.hashtag_info.no_publications}</b></h6>
                  <small className="text-muted">Mined at: <b>{selectedNodeData.hashtag_info.mined_at}</b></small>
                </div>
              )}

              {selectedNodeData.user_info && (
                <div className="mb-3 p-2 bg-light rounded border">
                  <h5 className="fw-bold text-success mb-1">User: @{selectedNodeData.user_info.username}</h5>
                  <p className="mb-1 small text-muted">
                    Followers: {selectedNodeData.user_info.follower_count || 'N/A'} | Following:{' '}
                    {selectedNodeData.user_info.following_count || 'N/A'}
                  </p>
                </div>
              )}

              {selectedNodeData.post && Object.keys(selectedNodeData.post).length > 0 && (
                <div>
                  <h5 className="fw-bold text-dark border-bottom pb-2 fs-6">Image from ML inference (if available)</h5>
                  {Object.entries(selectedNodeData.post).map(([key, item]: [string, any]) => (
                    <div key={key} className="border-bottom py-2">
                      {item.m_id && (
                        <div className="mb-2 text-center">
                          <img
                            src={`http://data.abundis.com.mx/media//exported_images/${muid}/${item.m_id}_exported.jpg`}
                            alt={item.m_id}
                            style={{ width: '85%', borderRadius: '6px', border: '1px solid #dee2e6' }}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <img
                            src={`http://data.abundis.com.mx/media/exported_images/${muid}/${item.m_id}_exported.webp`}
                            alt={item.m_id}
                            style={{ width: '85%', borderRadius: '6px', border: '1px solid #dee2e6' }}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <ul className="list-unstyled small mb-0">
                        <li><strong>User:</strong> {item.user_id}</li>
                        <li><strong>Posted @:</strong> {item.taken_at}</li>
                        <li><strong>Comments:</strong> {item.comment_count}</li>
                        <li><strong>Likes:</strong> {item.like_count}</li>
                        <li><strong>Hashtags:</strong> {item.hashtags_used}</li>
                        <li className="mt-1 text-muted"><em>{item.caption_text}</em></li>
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Results Output Panels */}
        {results1 && (
          <Alert variant="info" className="mt-3">
            <h6 className="fw-bold mb-2">Node Types Breakdown</h6>
            <div className="d-flex flex-wrap gap-3">
              {Object.entries(results1).map(([key, val]) => (
                <span key={key} className="small">
                  <strong>{key}:</strong> {val}
                </span>
              ))}
            </div>
          </Alert>
        )}

        {results3 && (
          <Card className="mt-3 border shadow-sm">
            <Card.Header className="bg-light text-dark fw-bold border-bottom d-flex justify-content-between align-items-center">
              <span>Top AI Inferenced Entities Ranked by Connected Users</span>
              <Badge bg="primary">{results3.length} Entities Ranked</Badge>
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover striped responsive size="sm" className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Entity Node ID</th>
                    <th>Cleaned Entity Name</th>
                    <th>Node Category</th>
                    <th>Linked Users Count</th>
                    <th>Linked Users List</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results3.map((item, idx) => (
                    <tr key={idx}>
                      <td className="text-muted small">{idx + 1}</td>
                      <td className="fw-bold text-primary">{item.node}</td>
                      <td className="fw-semibold text-dark">{item.cleanName}</td>
                      <td>
                        <Badge
                          bg={
                            item.nodetype === 'entity_individual' ? 'danger' :
                            item.nodetype === 'ai_custom_inference' ? 'dark' :
                            item.nodetype === 'ai_text_word' ? 'warning' : 'info'
                          }
                        >
                          {item.nodetype}
                        </Badge>
                        {item.isPosMatch && (
                          <Badge bg="success" className="ms-1">
                            ent_ match
                          </Badge>
                        )}
                      </td>
                      <td>
                        <Badge bg="success" className="fs-6">{item.usersCount}</Badge>
                      </td>
                      <td>
                        <small className="text-muted" style={{ maxHeight: '60px', overflowY: 'auto', display: 'block', maxWidth: '300px' }}>
                          {item.usersList.join(', ')}
                        </small>
                      </td>
                      <td className="text-end">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleSelectNodeFromTable(item.node)}
                        >
                          Inspect
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}

        {/* HoverBox Details Panel */}
        {selectedNodeData && (
          <Card className="mt-3 border-primary shadow-sm">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <span className="fw-bold">
                Selected Node: {selectedNodeData.label || selectedNodeData.node} ({selectedNodeData.nodetype || 'node'})
              </span>
              <Button variant="light" size="sm" onClick={() => setSelectedNodeData(null)}>
                Close
              </Button>
            </Card.Header>
            <Card.Body style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {selectedNodeData.hashtag_info && (
                <div className="mb-3">
                  <h5 className="fw-bold text-primary">
                    Hashtag:{' '}
                    <a
                      href={`https://www.instagram.com/explore/tags/${selectedNodeData.hashtag_info.node}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      #{selectedNodeData.hashtag_info.node}
                    </a>
                  </h5>
                  <h6>
                    Total Publications (IG): <strong>{selectedNodeData.hashtag_info.no_publications}</strong>
                  </h6>
                  <p className="small text-muted">Mined at: {selectedNodeData.hashtag_info.mined_at}</p>
                </div>
              )}

              {selectedNodeData.user_info && (
                <div className="mb-3">
                  <h5 className="fw-bold text-success">User: @{selectedNodeData.user_info.username}</h5>
                  <p className="mb-1 small text-muted">
                    Followers: {selectedNodeData.user_info.follower_count || 'N/A'} | Following:{' '}
                    {selectedNodeData.user_info.following_count || 'N/A'}
                  </p>
                </div>
              )}

              {selectedNodeData.post && Object.keys(selectedNodeData.post).length > 0 && (
                <div>
                  <h5 className="fw-bold text-dark border-bottom pb-2">Image from ML inference (if available)</h5>
                  {Object.entries(selectedNodeData.post).map(([key, item]: [string, any]) => (
                    <div key={key} className="border-bottom py-2">
                      <p className="mb-1 fw-bold text-dark">
                        User: @{item.user_id} | Posted @: {item.taken_at} | Likes: {item.like_count} | Comments:{' '}
                        {item.comment_count}
                      </p>
                      <p className="small text-muted mb-1">{item.caption_text}</p>
                      {item.m_id && (
                        <div className="mt-2 d-flex gap-2">
                          <img
                            src={`http://data.abundis.com.mx/media//exported_images/${muid}/${item.m_id}_exported.jpg`}
                            alt={item.m_id}
                            style={{ maxHeight: '180px', borderRadius: '4px' }}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <img
                            src={`http://data.abundis.com.mx/media/exported_images/${muid}/${item.m_id}_exported.webp`}
                            alt={item.m_id}
                            style={{ maxHeight: '180px', borderRadius: '4px' }}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        )}
      </Card.Body>
    </Card>
  );
};
