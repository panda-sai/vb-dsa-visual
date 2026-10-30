


'use client';

import { useState, useRef } from 'react';
import styles from './page.module.css';
import TopicNavigator from '@/components/TopicNavigator';
import { GraphLogic, GraphNode, GraphEdge, GraphMode } from './graph-logic';

const codeSnippets = {
    bfs: `function bfs(startNode) {
  let queue = [startNode];
  let visited = new Set([startNode]);
  
  while (queue.length > 0) {
    let node = queue.shift();
    print(node);
    
    for (let neighbor of getNeighbors(node)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`,
    dfs: `function dfs(node, visited = new Set()) {
  visited.add(node);
  print(node);
  
  for (let neighbor of getNeighbors(node)) {
    if (!visited.has(neighbor)) {
      dfs(neighbor, visited);
    }
  }
}`
};

export default function GraphsPage() {
    // Initialize with a simple graph
    const [graphLogic] = useState(() => {
        const logic = new GraphLogic();
        const n1 = logic.addNode(100, 200, '0');
        const n2 = logic.addNode(300, 100, '1');
        const n3 = logic.addNode(300, 300, '2');
        const n4 = logic.addNode(500, 200, '3');

        logic.addEdge(n1.id, n2.id);
        logic.addEdge(n1.id, n3.id);
        logic.addEdge(n2.id, n4.id);
        logic.addEdge(n3.id, n4.id);
        return logic;
    });
    const [nodes, setNodes] = useState<GraphNode[]>(() => [...graphLogic.nodes]);
    const [edges, setEdges] = useState<GraphEdge[]>(() => [...graphLogic.edges]);
    const [mode, setMode] = useState<GraphMode>('add-node');
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set());
    const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState('Click on canvas to add nodes');
    const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');
    const [isAnimating, setIsAnimating] = useState(false);
    const [speed, setSpeed] = useState(500);
    const [traversalPath, setTraversalPath] = useState<string[]>([]);
    const [currentCode, setCurrentCode] = useState<string | null>(null);

    const svgRef = useRef<SVGSVGElement>(null);

    const refreshGraph = () => {
        setNodes([...graphLogic.nodes]);
        setEdges([...graphLogic.edges]);
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isAnimating) return;
        if (mode !== 'add-node') return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        graphLogic.addNode(x, y);
        refreshGraph();
        setStatusMessage('Node added');
    };

    const handleNodeClick = (e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        if (isAnimating) return;

        if (mode === 'add-edge') {
            if (selectedNodeId === null) {
                setSelectedNodeId(nodeId);
                setStatusMessage('Select target node');
            } else {
                if (selectedNodeId === nodeId) {
                    setSelectedNodeId(null);
                    setStatusMessage('Cancelled edge creation');
                } else {
                    graphLogic.addEdge(selectedNodeId, nodeId);
                    refreshGraph();
                    setSelectedNodeId(null);
                    setStatusMessage('Edge added');
                    setStatusType('success');
                }
            }
        } else if (mode === 'run-bfs' || mode === 'run-dfs') {
            runTraversal(mode === 'run-bfs' ? 'bfs' : 'dfs', nodeId);
        }
    };

    const runTraversal = async (type: 'bfs' | 'dfs', startNodeId: string) => {
        setIsAnimating(true);
        setVisitedNodes(new Set());
        setTraversalPath([]);
        setCurrentCode(codeSnippets[type]);
        setStatusMessage(`Running ${type.toUpperCase()} starting from node ${graphLogic.nodes.find(n => n.id === startNodeId)?.value}...`);

        const generator = type === 'bfs' ? graphLogic.bfs(startNodeId) : graphLogic.dfs(startNodeId);
        const path: string[] = [];
        const visited = new Set<string>();

        for (const nodeId of generator) {
            setCurrentNodeId(nodeId);
            visited.add(nodeId);
            setVisitedNodes(new Set(visited));

            const nodeValue = graphLogic.nodes.find(n => n.id === nodeId)?.value || '?';
            path.push(nodeValue);
            setTraversalPath([...path]);

            await new Promise(r => setTimeout(r, speed));
        }

        setCurrentNodeId(null);
        setStatusMessage(`${type.toUpperCase()} complete`);
        setStatusType('success');
        setIsAnimating(false);
    };

    const handleClear = () => {
        graphLogic.clear();
        refreshGraph();
        setVisitedNodes(new Set());
        setTraversalPath([]);
        setStatusMessage('Graph cleared');
    };

    const handleModeChange = (newMode: GraphMode) => {
        setMode(newMode);
        setSelectedNodeId(null);
        if (newMode === 'add-node') setStatusMessage('Click on canvas to add nodes');
        if (newMode === 'add-edge') setStatusMessage('Select source node, then target node');
        if (newMode === 'run-bfs') setStatusMessage('Click a node to start BFS');
        if (newMode === 'run-dfs') setStatusMessage('Click a node to start DFS');
    };

    return (
        <div className={styles.page}>
            <div className="container">
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <span className={styles.headerIcon}>🕸️</span>
                        <div>
                            <h1>Graphs</h1>
                            <p className={styles.headerSubtitle}>
                                Network structures. Explore BFS and DFS traversals.
                            </p>
                        </div>
                    </div>
                </header>

                <div className={styles.mainGrid}>
                    <section className={styles.visualizationPanel}>
                        <div className={styles.panelHeader}>
                            <h2>Graph Visualization</h2>
                            <div className={styles.modeSwitch}>
                                <button
                                    className={`${styles.modeBtn} ${mode === 'add-node' ? styles.active : ''}`}
                                    onClick={() => handleModeChange('add-node')}
                                    disabled={isAnimating}
                                >
                                    Add Node
                                </button>
                                <button
                                    className={`${styles.modeBtn} ${mode === 'add-edge' ? styles.active : ''}`}
                                    onClick={() => handleModeChange('add-edge')}
                                    disabled={isAnimating}
                                >
                                    Add Edge
                                </button>
                                <button
                                    className={`${styles.modeBtn} ${mode === 'run-bfs' ? styles.active : ''}`}
                                    onClick={() => handleModeChange('run-bfs')}
                                    disabled={isAnimating}
                                >
                                    Run BFS
                                </button>
                                <button
                                    className={`${styles.modeBtn} ${mode === 'run-dfs' ? styles.active : ''}`}
                                    onClick={() => handleModeChange('run-dfs')}
                                    disabled={isAnimating}
                                >
                                    Run DFS
                                </button>
                            </div>
                            <div className={styles.panelActions}>
                                <button className="btn btn-secondary" onClick={handleClear} disabled={isAnimating}>Clear</button>
                            </div>
                        </div>

                        <div
                            className={`${styles.graphContainer} ${styles[`mode-${mode}`]}`}
                            onClick={handleCanvasClick}
                        >
                            <svg className={styles.svgCanvas} ref={svgRef}>
                                {/* Edges */}
                                {edges.map(edge => {
                                    const source = nodes.find(n => n.id === edge.sourceId);
                                    const target = nodes.find(n => n.id === edge.targetId);
                                    if (!source || !target) return null;
                                    return (
                                        <line
                                            key={edge.id}
                                            x1={source.x} y1={source.y}
                                            x2={target.x} y2={target.y}
                                            className={styles.edge}
                                        />
                                    );
                                })}

                                {/* Nodes */}
                                {nodes.map(node => (
                                    <g
                                        key={node.id}
                                        className={`
                      ${styles.nodeGroup} 
                      ${selectedNodeId === node.id ? styles.selected : ''}
                      ${visitedNodes.has(node.id) ? styles.visited : ''}
                      ${currentNodeId === node.id ? styles.current : ''}
                    `}
                                        onClick={(e) => handleNodeClick(e, node.id)}
                                    >
                                        <circle cx={node.x} cy={node.y} r="25" className={styles.nodeCircle} />
                                        <text x={node.x} y={node.y} className={styles.nodeText}>{node.value}</text>
                                    </g>
                                ))}
                            </svg>
                        </div>

                        <div className={`status-message ${statusType === 'success' ? 'success' : statusType === 'error' ? 'error' : ''}`}>
                            {statusMessage}
                        </div>

                        <div className={styles.controlsSection}>
                            <div className={styles.controlRow}>
                                <label className="control-label" htmlFor="graph-animation-speed">Speed:</label>
                                <input id="graph-animation-speed" type="range" min="100" max="1000" step="100" value={1100 - speed} onChange={(e) => setSpeed(1100 - Number(e.target.value))} disabled={isAnimating} />
                            </div>
                        </div>

                        {traversalPath.length > 0 && (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                Traversal: {traversalPath.join(' → ')}
                            </div>
                        )}
                    </section>

                    <aside className={styles.infoPanel}>
                        <div className={styles.infoCard}>
                            <h3>Graph Algorithms</h3>
                            <p>
                                Graphs model relationships between objects. Nodes (vertices) are connected by edges.
                            </p>
                            <div className={styles.complexity}>
                                BFS/DFS: O(V + E)
                            </div>
                        </div>

                        {currentCode && (
                            <div className={styles.infoCard} style={{ padding: 0, overflow: 'hidden' }}>
                                <div style={{
                                    padding: '0.75rem 1rem',
                                    background: 'var(--bg-secondary)',
                                    borderBottom: '1px solid var(--border-subtle)',
                                    fontSize: '0.85rem',
                                    color: 'var(--text-muted)'
                                }}>
                                    JavaScript
                                </div>
                                <div className="code-block" style={{ margin: 0, borderRadius: 0 }}>
                                    {currentCode.split('\n').map((line, index) => (
                                        <div key={index} className="code-line">
                                            <span className="line-number">{index + 1}</span>
                                            <span className="line-content">{line}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className={styles.infoCard}>
                            <h3>Controls</h3>
                            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <li><strong>Add Node</strong>: Click anywhere on canvas</li>
                                <li><strong>Add Edge</strong>: Click source node, then target node</li>
                                <li><strong>Run BFS/DFS</strong>: Select mode, then click start node</li>
                            </ul>
                        </div>
                    </aside>
                </div>
                <TopicNavigator currentSlug="graphs" />
            </div>
        </div>
    );
}
