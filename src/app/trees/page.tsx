


'use client';

import { useState } from 'react';
import styles from './page.module.css';
import TopicNavigator from '@/components/TopicNavigator';
import { TreeLogic, TreeNode, TreeType, TraversalType } from './tree-logic';

const codeSnippets = {
    BST_insert: `function insert(node, value) {
  if (!node) return new Node(value);
  
  if (value < node.value)
    node.left = insert(node.left, value);
  else if (value > node.value)
    node.right = insert(node.right, value);
    
  return node;
}`,
    AVL_insert: `function insert(node, value) {
  // 1. Normal BST insert
  if (!node) return new Node(value);
  if (value < node.value) node.left = insert(node.left, value);
  else if (value > node.value) node.right = insert(node.right, value);
  
  // 2. Update height & Get balance
  let balance = getBalance(node);
  
  // 3. Rotate if unbalanced
  if (balance > 1 && value < node.left.value) return rightRotate(node);
  if (balance < -1 && value > node.right.value) return leftRotate(node);
  if (balance > 1 && value > node.left.value) {
    node.left = leftRotate(node.left);
    return rightRotate(node);
  }
  if (balance < -1 && value < node.right.value) {
    node.right = rightRotate(node.right);
    return leftRotate(node);
  }
  return node;
}`,
    delete: `function delete(node, value) {
  if (!node) return null;
  
  if (value < node.value) node.left = delete(node.left, value);
  else if (value > node.value) node.right = delete(node.right, value);
  else {
    // Node with only one child or no child
    if (!node.left) return node.right;
    if (!node.right) return node.left;
    
    // Node with two children
    let temp = minValueNode(node.right);
    node.value = temp.value;
    node.right = delete(node.right, temp.value);
  }
  return node;
}`,
    search: `function search(node, value) {
  if (!node || node.value === value) 
    return node;
    
  if (value < node.value) 
    return search(node.left, value);
    
  return search(node.right, value);
}`,
    inorder: `function inorder(node) {
  if (!node) return;
  inorder(node.left);
  print(node.value);
  inorder(node.right);
}`,
    preorder: `function preorder(node) {
  if (!node) return;
  print(node.value);
  preorder(node.left);
  preorder(node.right);
}`,
    postorder: `function postorder(node) {
  if (!node) return;
  postorder(node.left);
  postorder(node.right);
  print(node.value);
}`,
    bfs: `function bfs(root) {
  if (!root) return;
  let queue = [root];
  while (queue.length > 0) {
    let node = queue.shift();
    print(node.value);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
}`
};

export default function TreesPage() {
    // Initialize with some data
    const [treeLogic] = useState(() => {
        const logic = new TreeLogic();
        logic.insert(50, 'BST');
        logic.insert(30, 'BST');
        logic.insert(70, 'BST');
        return logic;
    });
    const [treeType, setTreeType] = useState<TreeType>('BST');
    const [root, setRoot] = useState<TreeNode | null>(() => ({ ...treeLogic.root! }));
    const [inputValue, setInputValue] = useState('');
    const [statusMessage, setStatusMessage] = useState('Start by inserting some nodes');
    const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');
    const [highlightNodeId, setHighlightNodeId] = useState<string | null>(null);
    const [traversalPath, setTraversalPath] = useState<number[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentOperation, setCurrentOperation] = useState<string>('BST_insert');

    const handleInsert = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) {
            setStatusMessage('Please enter a valid number');
            setStatusType('error');
            return;
        }

        setCurrentOperation(treeType === 'BST' ? 'BST_insert' : 'AVL_insert');
        treeLogic.insert(val, treeType);
        setRoot({ ...treeLogic.root! }); // Force update
        setInputValue('');
        setStatusMessage(`Inserted ${val}`);
        setStatusType('success');
    };

    const handleDelete = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) return;

        setCurrentOperation('delete');
        treeLogic.delete(val, treeType);
        setRoot(treeLogic.root ? { ...treeLogic.root } : null);
        setInputValue('');
        setStatusMessage(`Deleted ${val}`);
        setStatusType('success');
    };

    const handleSearch = async () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) return;

        setCurrentOperation('search');
        setIsAnimating(true);
        setStatusMessage(`Searching for ${val}...`);

        // Simple visual search simulation
        let current = treeLogic.root;
        while (current) {
            setHighlightNodeId(current.id);
            await new Promise(r => setTimeout(r, 500));

            if (val === current.value) {
                setStatusMessage(`Found ${val}!`);
                setStatusType('success');
                setIsAnimating(false);
                return;
            }

            if (val < current.value) current = current.left;
            else current = current.right;
        }

        setHighlightNodeId(null);
        setStatusMessage(`${val} not found`);
        setStatusType('error');
        setIsAnimating(false);
    };

    const handleTraversal = async (type: TraversalType) => {
        setCurrentOperation(type);
        setIsAnimating(true);
        setTraversalPath([]);
        setStatusMessage(`Running ${type} traversal...`);

        const generator = treeLogic.traverse(type);
        const path: number[] = [];

        for (const value of generator) {
            path.push(value);
            setTraversalPath([...path]);
            // Find node to highlight
            // Note: In a real app we'd map values back to IDs or store IDs in traversal
            await new Promise(r => setTimeout(r, 500));
        }

        setStatusMessage(`${type} traversal complete`);
        setStatusType('success');
        setIsAnimating(false);
    };

    const handleClear = () => {
        treeLogic.clear();
        setRoot(null);
        setStatusMessage('Tree cleared');
        setStatusType('info');
    };

    const handleRandom = () => {
        handleClear();
        for (let i = 0; i < 7; i++) {
            const val = Math.floor(Math.random() * 100) + 1;
            treeLogic.insert(val, treeType);
        }
        setRoot({ ...treeLogic.root! });
        setStatusMessage('Generated random tree');
        setCurrentOperation(treeType === 'BST' ? 'BST_insert' : 'AVL_insert');
    };

    const switchType = (type: TreeType) => {
        setTreeType(type);
        handleClear();
        setStatusMessage(`Switched to ${type} mode`);
        setCurrentOperation(type === 'BST' ? 'BST_insert' : 'AVL_insert');
    };

    // Recursive render helper
    const renderTree = (node: TreeNode | null) => {
        if (!node) return null;

        return (
            <g key={node.id} className={`${styles.nodeGroup} ${highlightNodeId === node.id ? styles.highlight : ''}`}>
                {/* Edges */}
                {node.left && (
                    <line
                        x1={node.x} y1={node.y}
                        x2={node.left.x} y2={node.left.y}
                        className={styles.edge}
                    />
                )}
                {node.right && (
                    <line
                        x1={node.x} y1={node.y}
                        x2={node.right.x} y2={node.right.y}
                        className={styles.edge}
                    />
                )}

                {/* Recursive Children */}
                {renderTree(node.left)}
                {renderTree(node.right)}

                {/* Node Circle & Text (Rendered last to be on top) */}
                <circle cx={node.x} cy={node.y} r="20" className={styles.nodeCircle} />
                <text x={node.x} y={node.y} className={styles.nodeText}>{node.value}</text>
                <text x={node.x} y={node.y + 35} className={styles.nodeHeight}>h:{node.height}</text>
            </g>
        );
    };

    return (
        <div className={styles.page}>
            <div className="container">
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <span className={styles.headerIcon}>🌳</span>
                        <div>
                            <h1>Trees</h1>
                            <p className={styles.headerSubtitle}>
                                Hierarchical data structures. Explore BST and AVL trees.
                            </p>
                        </div>
                    </div>
                </header>

                <div className={styles.mainGrid}>
                    <section className={styles.visualizationPanel}>
                        <div className={styles.panelHeader}>
                            <h2>Tree Visualization</h2>
                            <div className={styles.modeSwitch}>
                                <button
                                    className={`${styles.modeBtn} ${treeType === 'BST' ? styles.active : ''}`}
                                    onClick={() => switchType('BST')}
                                >
                                    BST
                                </button>
                                <button
                                    className={`${styles.modeBtn} ${treeType === 'AVL' ? styles.active : ''}`}
                                    onClick={() => switchType('AVL')}
                                >
                                    AVL
                                </button>
                            </div>
                            <div className={styles.panelActions}>
                                <button className="btn btn-secondary" onClick={handleClear}>Clear</button>
                                <button className="btn btn-secondary" onClick={handleRandom}>Random</button>
                            </div>
                        </div>

                        <div className={styles.treeContainer}>
                            <svg className={styles.svgCanvas} viewBox="-400 -50 800 500" preserveAspectRatio="xMidYMin meet">
                                {renderTree(root)}
                            </svg>
                        </div>

                        <div className={`status-message ${statusType === 'success' ? 'success' : statusType === 'error' ? 'error' : ''}`}>
                            {statusMessage}
                        </div>

                        {traversalPath.length > 0 && (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                Traversal: {traversalPath.join(' → ')}
                            </div>
                        )}

                        <div className={styles.controlsSection}>
                            <div className={styles.operationControls}>
                                <div className={styles.controlRow}>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="Value"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        style={{ width: '100px' }}
                                    />
                                    <button className="btn btn-primary" onClick={handleInsert} disabled={isAnimating}>Insert</button>
                                    <button className="btn btn-secondary" onClick={handleDelete} disabled={isAnimating}>Delete</button>
                                    <button className="btn btn-secondary" onClick={handleSearch} disabled={isAnimating}>Search</button>
                                </div>

                                <div className={styles.controlRow}>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Traversals:</span>
                                    <button className="btn btn-sm btn-secondary" onClick={() => handleTraversal('inorder')} disabled={isAnimating}>In-Order</button>
                                    <button className="btn btn-sm btn-secondary" onClick={() => handleTraversal('preorder')} disabled={isAnimating}>Pre-Order</button>
                                    <button className="btn btn-sm btn-secondary" onClick={() => handleTraversal('postorder')} disabled={isAnimating}>Post-Order</button>
                                    <button className="btn btn-sm btn-secondary" onClick={() => handleTraversal('bfs')} disabled={isAnimating}>BFS</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <aside className={styles.infoPanel}>
                        <div className={styles.infoCard}>
                            <h3>{treeType === 'BST' ? 'Binary Search Tree' : 'AVL Tree'}</h3>
                            <p>
                                {treeType === 'BST'
                                    ? 'A standard binary tree where left child < parent < right child. No balancing guarantees.'
                                    : 'A self-balancing BST where the difference between heights of left and right subtrees cannot be more than one.'}
                            </p>
                            <div className={styles.complexity}>
                                {treeType === 'BST'
                                    ? 'Search/Insert/Delete: O(h) (worst O(n))'
                                    : 'Search/Insert/Delete: O(log n)'}
                            </div>
                        </div>

                        {currentOperation && codeSnippets[currentOperation as keyof typeof codeSnippets] && (
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
                                    {codeSnippets[currentOperation as keyof typeof codeSnippets].split('\n').map((line, index) => (
                                        <div key={index} className="code-line">
                                            <span className="line-number">{index + 1}</span>
                                            <span className="line-content">{line}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className={styles.infoCard}>
                            <h3>Traversals</h3>
                            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <li><strong>In-Order</strong>: Left → Root → Right (Sorted order)</li>
                                <li><strong>Pre-Order</strong>: Root → Left → Right</li>
                                <li><strong>Post-Order</strong>: Left → Right → Root</li>
                                <li><strong>BFS</strong>: Level by level</li>
                            </ul>
                        </div>
                    </aside>
                </div>
                <TopicNavigator currentSlug="trees" />
            </div>
        </div>
    );
}
