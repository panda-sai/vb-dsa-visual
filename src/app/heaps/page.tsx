


'use client';

import { useState } from 'react';
import styles from './page.module.css';
import TopicNavigator from '@/components/TopicNavigator';
import { HeapLogic, HeapType } from './heap-logic';

const codeSnippets = {
    insert: `function insert(value) {
  heap.push(value);
  siftUp(heap.length - 1);
}

function siftUp(index) {
  while (index > 0) {
    let parent = Math.floor((index - 1) / 2);
    if (compare(heap[index], heap[parent])) {
      swap(index, parent);
      index = parent;
    } else break;
  }
}`,
    extract: `function extract() {
  const root = heap[0];
  const last = heap.pop();
  if (heap.length > 0) {
    heap[0] = last;
    siftDown(0);
  }
  return root;
}

function siftDown(index) {
  while (true) {
    let swap = null;
    // Compare with children...
    if (shouldSwap(index, left)) swap = left;
    if (shouldSwap(index, right)) swap = right;
    
    if (!swap) break;
    swap(index, swap);
    index = swap;
  }
}`
};

export default function HeapsPage() {
    const [heapLogic] = useState(() => new HeapLogic());
    const [heapType, setHeapType] = useState<HeapType>('Min');
    const [heap, setHeap] = useState<number[]>([]);
    const [highlightIndices, setHighlightIndices] = useState<number[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [statusMessage, setStatusMessage] = useState('Start by inserting some numbers');
    const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentOperation, setCurrentOperation] = useState<'insert' | 'extract' | null>(null);

    const handleInsert = async () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) {
            setStatusMessage('Please enter a valid number');
            setStatusType('error');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('insert');
        setStatusMessage(`Inserting ${val}...`);
        setInputValue('');

        const generator = heapLogic.insert(val);

        for (const step of generator) {
            setHeap(step.heap);
            setHighlightIndices(step.highlight);
            setActiveIndex(step.active);
            await new Promise(r => setTimeout(r, 800));
        }

        setStatusMessage(`Inserted ${val}`);
        setStatusType('success');
        setIsAnimating(false);
    };

    const handleExtract = async () => {
        if (heap.length === 0) return;

        setIsAnimating(true);
        setCurrentOperation('extract');
        setStatusMessage(`Extracting ${heapType === 'Min' ? 'Min' : 'Max'}...`);

        const generator = heapLogic.extract();

        for (const step of generator) {
            setHeap(step.heap);
            setHighlightIndices(step.highlight);
            setActiveIndex(step.active);
            await new Promise(r => setTimeout(r, 800));
        }

        setStatusMessage(`Extracted root`);
        setStatusType('success');
        setIsAnimating(false);
    };

    const handleClear = () => {
        heapLogic.clear();
        setHeap([]);
        setHighlightIndices([]);
        setActiveIndex(null);
        setStatusMessage('Heap cleared');
    };

    const handleRandom = async () => {
        handleClear();
        setIsAnimating(true);
        setCurrentOperation('insert');

        for (let i = 0; i < 5; i++) {
            const val = Math.floor(Math.random() * 50) + 1;
            const generator = heapLogic.insert(val);
            for (const step of generator) {
                setHeap(step.heap);
                setHighlightIndices(step.highlight);
                setActiveIndex(step.active);
                // Fast animation for random generation
                await new Promise(r => setTimeout(r, 200));
            }
        }

        setStatusMessage('Generated random heap');
        setIsAnimating(false);
    };

    const switchType = (type: HeapType) => {
        setHeapType(type);
        heapLogic.setType(type);
        handleClear();
        setStatusMessage(`Switched to ${type} Heap`);
    };

    // Helper to calculate node positions for tree view
    const getNodePosition = (index: number) => {
        // Simple level-based positioning
        const level = Math.floor(Math.log2(index + 1));
        const levelStartIndex = Math.pow(2, level) - 1;
        const itemsInLevel = Math.pow(2, level);
        const positionInLevel = index - levelStartIndex;

        // Canvas width 800
        const levelWidth = 800;
        const x = (levelWidth / (itemsInLevel + 1)) * (positionInLevel + 1) - 400;
        const y = level * 60 + 50;

        return { x, y };
    };

    return (
        <div className={styles.page}>
            <div className="container">
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <span className={styles.headerIcon}>🏔️</span>
                        <div>
                            <h1>Heaps</h1>
                            <p className={styles.headerSubtitle}>
                                Priority Queue structures. Visualize Min and Max Heaps.
                            </p>
                        </div>
                    </div>
                </header>

                <div className={styles.mainGrid}>
                    <section className={styles.visualizationPanel}>
                        <div className={styles.panelHeader}>
                            <h2>Heap Visualization</h2>
                            <div className={styles.modeSwitch}>
                                <button
                                    className={`${styles.modeBtn} ${heapType === 'Min' ? styles.active : ''}`}
                                    onClick={() => switchType('Min')}
                                    disabled={isAnimating}
                                >
                                    Min Heap
                                </button>
                                <button
                                    className={`${styles.modeBtn} ${heapType === 'Max' ? styles.active : ''}`}
                                    onClick={() => switchType('Max')}
                                    disabled={isAnimating}
                                >
                                    Max Heap
                                </button>
                            </div>
                            <div className={styles.panelActions}>
                                <button className="btn btn-secondary" onClick={handleClear} disabled={isAnimating}>Clear</button>
                                <button className="btn btn-secondary" onClick={handleRandom} disabled={isAnimating}>Random</button>
                            </div>
                        </div>

                        <div className={styles.viewsContainer}>
                            {/* Tree View */}
                            <div className={styles.treeContainer}>
                                <svg className={styles.svgCanvas} viewBox="-400 0 800 400" preserveAspectRatio="xMidYMin meet">
                                    {heap.map((val, index) => {
                                        const pos = getNodePosition(index);
                                        const leftChildIdx = 2 * index + 1;
                                        const rightChildIdx = 2 * index + 2;

                                        return (
                                            <g key={`node-${index}`}>
                                                {/* Edges */}
                                                {leftChildIdx < heap.length && (
                                                    <line
                                                        x1={pos.x} y1={pos.y}
                                                        x2={getNodePosition(leftChildIdx).x}
                                                        y2={getNodePosition(leftChildIdx).y}
                                                        className={styles.edge}
                                                    />
                                                )}
                                                {rightChildIdx < heap.length && (
                                                    <line
                                                        x1={pos.x} y1={pos.y}
                                                        x2={getNodePosition(rightChildIdx).x}
                                                        y2={getNodePosition(rightChildIdx).y}
                                                        className={styles.edge}
                                                    />
                                                )}
                                            </g>
                                        );
                                    })}

                                    {/* Nodes on top */}
                                    {heap.map((val, index) => {
                                        const pos = getNodePosition(index);
                                        return (
                                            <g
                                                key={`circle-${index}`}
                                                className={`
                          ${styles.nodeGroup}
                          ${highlightIndices.includes(index) ? styles.highlight : ''}
                          ${activeIndex === index ? styles.active : ''}
                        `}
                                            >
                                                <circle cx={pos.x} cy={pos.y} r="20" className={styles.nodeCircle} />
                                                <text x={pos.x} y={pos.y} className={styles.nodeText}>{val}</text>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>

                            {/* Array View */}
                            <div className={styles.arrayContainer}>
                                <div className={styles.arrayGrid}>
                                    {heap.map((val, index) => (
                                        <div key={index} className={styles.arrayItem}>
                                            <div className={`
                        ${styles.arrayBox}
                        ${highlightIndices.includes(index) ? styles.highlight : ''}
                        ${activeIndex === index ? styles.active : ''}
                      `}>
                                                {val}
                                            </div>
                                            <span className={styles.arrayIndex}>{index}</span>
                                        </div>
                                    ))}
                                    {heap.length === 0 && (
                                        <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                            Empty Heap
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={`status-message ${statusType === 'success' ? 'success' : statusType === 'error' ? 'error' : ''}`}>
                            {statusMessage}
                        </div>

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
                                        disabled={isAnimating}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !isAnimating) handleInsert();
                                        }}
                                    />
                                    <button className="btn btn-primary" onClick={handleInsert} disabled={isAnimating}>Insert</button>
                                    <button className="btn btn-secondary" onClick={handleExtract} disabled={isAnimating}>
                                        Extract {heapType === 'Min' ? 'Min' : 'Max'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <aside className={styles.infoPanel}>
                        <div className={styles.infoCard}>
                            <h3>{heapType} Heap</h3>
                            <p>
                                {heapType === 'Min'
                                    ? 'Root node is the smallest element. Every parent is smaller than its children.'
                                    : 'Root node is the largest element. Every parent is larger than its children.'}
                            </p>
                            <div className={styles.complexity}>
                                Insert/Extract: O(log n)
                            </div>
                        </div>

                        {currentOperation && (
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
                                    {codeSnippets[currentOperation].split('\n').map((line, index) => (
                                        <div key={index} className="code-line">
                                            <span className="line-number">{index + 1}</span>
                                            <span className="line-content">{line}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
                <TopicNavigator currentSlug="heaps" />
            </div>
        </div>
    );
}
