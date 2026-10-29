


'use client';

import { useState, useCallback } from 'react';
import styles from './page.module.css';
import TopicNavigator from '@/components/TopicNavigator';

type Operation = 'enqueue' | 'dequeue' | 'peek' | 'clear' | null;
type QueueElementState = 'default' | 'new' | 'dequeuing' | 'peek';

interface QueueElement {
    id: string;
    value: number;
    state: QueueElementState;
}

const MAX_SIZE = 8; // Slightly smaller for horizontal fit

const codeSnippets = {
    enqueue: `// Enqueue operation
function enqueue(queue, value) {
  if (queue.length >= MAX_SIZE) {
    return "Queue Overflow";
  }
  queue.push(value);
}`,
    dequeue: `// Dequeue operation
function dequeue(queue) {
  if (queue.length === 0) {
    return "Queue Underflow";
  }
  return queue.shift();
}`,
    peek: `// Peek operation
function peek(queue) {
  if (queue.length === 0) {
    return null;
  }
  return queue[0];
}`,
    clear: `// Clear operation
function clear(queue) {
  queue.length = 0;
}`,
};

const explanations = {
    enqueue: {
        title: 'Enqueue',
        description: 'Add an element to the rear (end) of the queue. Checks for overflow if the queue has a fixed size.',
        complexity: 'Time: O(1) | Space: O(1)',
    },
    dequeue: {
        title: 'Dequeue',
        description: 'Remove and return the element from the front (start) of the queue. Checks for underflow if the queue is empty.',
        complexity: 'Time: O(1) | Space: O(1)', // Assuming linked list or optimized array
    },
    peek: {
        title: 'Peek',
        description: 'View the element at the front of the queue without removing it.',
        complexity: 'Time: O(1) | Space: O(1)',
    },
    clear: {
        title: 'Clear',
        description: 'Remove all elements from the queue.',
        complexity: 'Time: O(1) | Space: O(1)',
    },
};

export default function QueuesPage() {
    const [queue, setQueue] = useState<QueueElement[]>([
        { id: '1', value: 10, state: 'default' },
        { id: '2', value: 20, state: 'default' },
        { id: '3', value: 30, state: 'default' },
    ]);

    const [currentOperation, setCurrentOperation] = useState<Operation>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Choose an operation to begin');
    const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');
    const [inputValue, setInputValue] = useState('');
    const [speed, setSpeed] = useState(500);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const resetStates = useCallback(() => {
        setQueue(prev => prev.map(el => ({ ...el, state: 'default' })));
    }, []);

    const handleEnqueue = async () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) {
            setStatusMessage('Please enter a valid number');
            setStatusType('error');
            return;
        }

        if (queue.length >= MAX_SIZE) {
            setStatusMessage('Queue Overflow! Cannot enqueue to a full queue.');
            setStatusType('error');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('enqueue');
        resetStates();

        setStatusMessage(`Enqueuing ${val} to the rear...`);

        const newElement: QueueElement = {
            id: Date.now().toString(),
            value: val,
            state: 'new'
        };

        setQueue(prev => [...prev, newElement]);

        await sleep(speed);

        setQueue(prev => prev.map(el => ({ ...el, state: 'default' })));
        setStatusMessage(`Enqueued ${val} successfully.`);
        setStatusType('success');
        setInputValue('');
        setIsAnimating(false);
    };

    const handleDequeue = async () => {
        if (queue.length === 0) {
            setStatusMessage('Queue Underflow! Cannot dequeue from an empty queue.');
            setStatusType('error');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('dequeue');
        resetStates();

        const frontValue = queue[0].value;
        setStatusMessage(`Dequeuing ${frontValue} from the front...`);

        // Mark front element as dequeuing
        setQueue(prev => prev.map((el, i) =>
            i === 0 ? { ...el, state: 'dequeuing' } : el
        ));

        await sleep(speed);

        setQueue(prev => prev.slice(1));
        setStatusMessage(`Dequeued ${frontValue} successfully.`);
        setStatusType('success');
        setIsAnimating(false);
    };

    const handlePeek = async () => {
        if (queue.length === 0) {
            setStatusMessage('Queue is empty.');
            setStatusType('info');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('peek');
        resetStates();

        const frontValue = queue[0].value;
        setStatusMessage(`Peeking at front element: ${frontValue}`);

        setQueue(prev => prev.map((el, i) =>
            i === 0 ? { ...el, state: 'peek' } : el
        ));

        await sleep(speed);

        setStatusType('success');
        setIsAnimating(false);
    };

    const handleClear = async () => {
        setIsAnimating(true);
        setCurrentOperation('clear');
        setStatusMessage('Clearing queue...');

        setQueue([]);

        await sleep(speed / 2);
        setStatusMessage('Queue cleared.');
        setStatusType('success');
        setIsAnimating(false);
    };

    return (
        <div className={styles.page}>
            <div className="container">
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <span className={styles.headerIcon}>🚶‍♂️</span>
                        <div>
                            <h1>Queues</h1>
                            <p className={styles.headerSubtitle}>
                                FIFO (First-In, First-Out) data structure
                            </p>
                        </div>
                    </div>
                </header>

                <div className={styles.mainGrid}>
                    <section className={styles.visualizationPanel}>
                        <div className={styles.panelHeader}>
                            <h2>Queue Visualization (Max Size: {MAX_SIZE})</h2>
                            <div className={styles.panelActions}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleClear}
                                    disabled={isAnimating || queue.length === 0}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        <div className={styles.queueContainer}>
                            <div className={styles.queueVisual}>
                                {queue.map((element, index) => (
                                    <div
                                        key={element.id}
                                        className={`${styles.queueElement} ${styles[element.state]}`}
                                    >
                                        {element.value}
                                        <span className={styles.elementIndex}>{index}</span>
                                        {index === 0 && (
                                            <div className={styles.frontLabel}>Front</div>
                                        )}
                                        {index === queue.length - 1 && (
                                            <div className={styles.rearLabel}>Rear</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={`status-message ${statusType === 'success' ? 'success' : statusType === 'error' ? 'error' : ''}`}>
                            {statusMessage}
                        </div>

                        <div className={styles.controlsSection}>
                            <div className={styles.operationControls}>
                                <div className="control-group">
                                    <label className="control-label">Value:</label>
                                    <input
                                        type="number"
                                        className="input"
                                        style={{ width: '100px' }}
                                        placeholder="Val"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        disabled={isAnimating}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !isAnimating) handleEnqueue();
                                        }}
                                    />
                                </div>

                                <button
                                    className="btn btn-primary"
                                    onClick={handleEnqueue}
                                    disabled={isAnimating}
                                >
                                    Enqueue
                                </button>

                                <button
                                    className="btn btn-secondary"
                                    onClick={handleDequeue}
                                    disabled={isAnimating}
                                >
                                    Dequeue
                                </button>

                                <button
                                    className="btn btn-secondary"
                                    onClick={handlePeek}
                                    disabled={isAnimating}
                                >
                                    Peek
                                </button>

                                <div className="control-group" style={{ marginLeft: 'auto' }}>
                                    <label className="control-label">Speed:</label>
                                    <input
                                        type="range"
                                        min="100"
                                        max="1000"
                                        step="100"
                                        value={1100 - speed}
                                        onChange={(e) => setSpeed(1100 - parseInt(e.target.value))}
                                        disabled={isAnimating}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <aside className={styles.infoPanel}>
                        {currentOperation ? (
                            <>
                                <div className={styles.infoCard}>
                                    <h3>{explanations[currentOperation].title}</h3>
                                    <p>{explanations[currentOperation].description}</p>
                                    <div className={styles.complexity}>
                                        {explanations[currentOperation].complexity}
                                    </div>
                                </div>

                                <div className={styles.codeCard}>
                                    <div className={styles.codeHeader}>
                                        <span>JavaScript</span>
                                    </div>
                                    <div className="code-block">
                                        {codeSnippets[currentOperation].split('\n').map((line, index) => (
                                            <div key={index} className="code-line">
                                                <span className="line-number">{index + 1}</span>
                                                <span className="line-content">{line}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={styles.infoCard}>
                                <h3>Getting Started</h3>
                                <p>
                                    A Queue follows the FIFO (First-In, First-Out) principle.
                                    The first element added is the first one to be removed, like a line at a store.
                                </p>
                                <div className={styles.quickInfo}>
                                    <h4>Operations</h4>
                                    <ul>
                                        <li><strong>Enqueue</strong>: Add to rear</li>
                                        <li><strong>Dequeue</strong>: Remove from front</li>
                                        <li><strong>Peek</strong>: Look at front</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
                <TopicNavigator currentSlug="queues" />
            </div>
        </div>
    );
}
