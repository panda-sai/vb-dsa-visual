


'use client';

import { useState, useCallback } from 'react';
import styles from './page.module.css';
import TopicNavigator from '@/components/TopicNavigator';

type Operation = 'insertHead' | 'insertTail' | 'insertIndex' | 'deleteIndex' | 'search' | null;
type NodeState = 'default' | 'active' | 'found' | 'visited' | 'new' | 'deleted';

interface ListNode {
    id: string;
    value: number;
    state: NodeState;
}

const codeSnippets = {
    insertHead: `// Insert at Head
function insertHead(head, value) {
  const newNode = new Node(value);
  newNode.next = head;
  head = newNode;
  return head;
}`,
    insertTail: `// Insert at Tail
function insertTail(head, value) {
  const newNode = new Node(value);
  if (!head) return newNode;
  
  let current = head;
  while (current.next) {
    current = current.next;
  }
  current.next = newNode;
  return head;
}`,
    insertIndex: `// Insert at Index
function insertAt(head, index, value) {
  if (index === 0) return insertHead(head, value);
  
  let current = head;
  for (let i = 0; i < index - 1; i++) {
    if (!current) return head; // Out of bounds
    current = current.next;
  }
  
  const newNode = new Node(value);
  newNode.next = current.next;
  current.next = newNode;
  return head;
}`,
    deleteIndex: `// Delete at Index
function deleteAt(head, index) {
  if (!head) return null;
  if (index === 0) return head.next;
  
  let current = head;
  for (let i = 0; i < index - 1; i++) {
    if (!current.next) return head;
    current = current.next;
  }
  
  if (current.next) {
    current.next = current.next.next;
  }
  return head;
}`,
    search: `// Search for value
function search(head, target) {
  let current = head;
  while (current) {
    if (current.value === target) return true;
    current = current.next;
  }
  return false;
}`,
};

const explanations = {
    insertHead: {
        title: 'Insert at Head',
        description: 'Create a new node and point its next pointer to the current head. Update head to be the new node.',
        complexity: 'Time: O(1) | Space: O(1)',
    },
    insertTail: {
        title: 'Insert at Tail',
        description: 'Traverse to the last node. Create a new node and point the last node\'s next pointer to it.',
        complexity: 'Time: O(n) | Space: O(1)',
    },
    insertIndex: {
        title: 'Insert at Index',
        description: 'Traverse to the node before the index. Update pointers to insert the new node between them.',
        complexity: 'Time: O(n) | Space: O(1)',
    },
    deleteIndex: {
        title: 'Delete at Index',
        description: 'Traverse to the node before the index. Update its next pointer to skip the node to be deleted.',
        complexity: 'Time: O(n) | Space: O(1)',
    },
    search: {
        title: 'Search',
        description: 'Traverse the list from the head, comparing each node\'s value with the target.',
        complexity: 'Time: O(n) | Space: O(1)',
    },
};

export default function LinkedListsPage() {
    const [list, setList] = useState<ListNode[]>([
        { id: '1', value: 10, state: 'default' },
        { id: '2', value: 20, state: 'default' },
        { id: '3', value: 30, state: 'default' },
        { id: '4', value: 40, state: 'default' },
    ]);

    const [currentOperation, setCurrentOperation] = useState<Operation>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Choose an operation to begin');
    const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');
    const [inputValue, setInputValue] = useState('');
    const [inputIndex, setInputIndex] = useState('');
    const [speed, setSpeed] = useState(500);
    const [highlightedLine, setHighlightedLine] = useState(-1);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const resetStates = useCallback(() => {
        setList(prev => prev.map(node => ({ ...node, state: 'default' })));
        setHighlightedLine(-1);
    }, []);

    const handleInsertHead = async () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) {
            setStatusMessage('Please enter a valid number');
            setStatusType('error');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('insertHead');
        resetStates();

        setHighlightedLine(2);
        setStatusMessage(`Creating new node with value ${val}...`);
        await sleep(speed);

        const newNode: ListNode = { id: Date.now().toString(), value: val, state: 'new' };

        setHighlightedLine(3);
        setStatusMessage('Pointing new node to current head...');
        await sleep(speed);

        setList(prev => [newNode, ...prev]);
        setHighlightedLine(4);
        setStatusMessage(`Inserted ${val} at head.`);
        setStatusType('success');

        await sleep(speed);
        setList(prev => prev.map(n => ({ ...n, state: 'default' })));
        setIsAnimating(false);
    };

    const handleInsertTail = async () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) {
            setStatusMessage('Please enter a valid number');
            setStatusType('error');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('insertTail');
        resetStates();

        if (list.length === 0) {
            await handleInsertHead();
            return;
        }

        setHighlightedLine(6);
        setStatusMessage('Traversing to the last node...');

        for (let i = 0; i < list.length; i++) {
            setList(prev => prev.map((node, idx) => ({
                ...node,
                state: idx === i ? 'active' : (idx < i ? 'visited' : 'default')
            })));
            await sleep(speed / 2);
        }

        setHighlightedLine(10);
        setStatusMessage(`Found tail. Inserting ${val}...`);
        await sleep(speed);

        const newNode: ListNode = { id: Date.now().toString(), value: val, state: 'new' };
        setList(prev => [...prev, newNode]);

        setStatusType('success');
        await sleep(speed);
        setList(prev => prev.map(n => ({ ...n, state: 'default' })));
        setIsAnimating(false);
    };

    const handleInsertIndex = async () => {
        const val = parseInt(inputValue);
        const idx = parseInt(inputIndex);

        if (isNaN(val) || isNaN(idx)) {
            setStatusMessage('Please enter valid number and index');
            setStatusType('error');
            return;
        }

        if (idx < 0 || idx > list.length) {
            setStatusMessage('Index out of bounds');
            setStatusType('error');
            return;
        }

        if (idx === 0) {
            await handleInsertHead();
            return;
        }

        if (idx === list.length) {
            await handleInsertTail();
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('insertIndex');
        resetStates();

        setHighlightedLine(6);
        setStatusMessage(`Traversing to index ${idx - 1}...`);

        for (let i = 0; i < idx; i++) {
            setList(prev => prev.map((node, index) => ({
                ...node,
                state: index === i ? 'active' : (index < i ? 'visited' : 'default')
            })));
            await sleep(speed);
        }

        setHighlightedLine(12);
        setStatusMessage(`Inserting ${val} at index ${idx}...`);
        await sleep(speed);

        const newNode: ListNode = { id: Date.now().toString(), value: val, state: 'new' };
        setList(prev => [
            ...prev.slice(0, idx),
            newNode,
            ...prev.slice(idx)
        ]);

        setStatusType('success');
        await sleep(speed);
        setList(prev => prev.map(n => ({ ...n, state: 'default' })));
        setIsAnimating(false);
    };

    const handleDeleteIndex = async () => {
        const idx = parseInt(inputIndex);

        if (isNaN(idx)) {
            setStatusMessage('Please enter a valid index');
            setStatusType('error');
            return;
        }

        if (idx < 0 || idx >= list.length) {
            setStatusMessage('Index out of bounds');
            setStatusType('error');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('deleteIndex');
        resetStates();

        if (idx === 0) {
            setHighlightedLine(3);
            setStatusMessage('Deleting head node...');
            setList(prev => prev.map((n, i) => i === 0 ? { ...n, state: 'deleted' } : n));
            await sleep(speed);
            setList(prev => prev.slice(1));
            setStatusMessage('Head deleted.');
            setStatusType('success');
            setIsAnimating(false);
            return;
        }

        setHighlightedLine(6);
        setStatusMessage(`Traversing to node before index ${idx}...`);

        for (let i = 0; i < idx; i++) {
            setList(prev => prev.map((node, index) => ({
                ...node,
                state: index === i ? 'active' : (index < i ? 'visited' : 'default')
            })));
            await sleep(speed);
        }

        setHighlightedLine(11);
        setStatusMessage(`Deleting node at index ${idx}...`);

        setList(prev => prev.map((n, i) => i === idx ? { ...n, state: 'deleted' } : n));
        await sleep(speed);

        setList(prev => prev.filter((_, i) => i !== idx));
        setStatusMessage(`Node at index ${idx} deleted.`);
        setStatusType('success');

        await sleep(speed);
        setList(prev => prev.map(n => ({ ...n, state: 'default' })));
        setIsAnimating(false);
    };

    const handleSearch = async () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) {
            setStatusMessage('Please enter a valid number');
            setStatusType('error');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('search');
        resetStates();

        setHighlightedLine(3);
        setStatusMessage(`Searching for ${val}...`);

        let found = false;
        for (let i = 0; i < list.length; i++) {
            setList(prev => prev.map((node, index) => ({
                ...node,
                state: index === i ? 'active' : (index < i ? 'visited' : 'default')
            })));

            setHighlightedLine(4);
            await sleep(speed);

            if (list[i].value === val) {
                setHighlightedLine(4);
                setStatusMessage(`Found ${val} at index ${i}!`);
                setList(prev => prev.map((node, index) => ({
                    ...node,
                    state: index === i ? 'found' : node.state
                })));
                setStatusType('success');
                found = true;
                break;
            }

            setHighlightedLine(5);
        }

        if (!found) {
            setHighlightedLine(7);
            setStatusMessage(`${val} not found in list.`);
            setStatusType('error');
        }

        setIsAnimating(false);
    };

    const handleReset = () => {
        setList([
            { id: '1', value: 10, state: 'default' },
            { id: '2', value: 20, state: 'default' },
            { id: '3', value: 30, state: 'default' },
            { id: '4', value: 40, state: 'default' },
        ]);
        setStatusMessage('List reset');
        setStatusType('info');
        setCurrentOperation(null);
        setHighlightedLine(-1);
        setInputValue('');
        setInputIndex('');
    };

    return (
        <div className={styles.page}>
            <div className="container">
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <span className={styles.headerIcon}>🔗</span>
                        <div>
                            <h1>Linked Lists</h1>
                            <p className={styles.headerSubtitle}>
                                Dynamic data structure with nodes and pointers
                            </p>
                        </div>
                    </div>
                </header>

                <div className={styles.mainGrid}>
                    <section className={styles.visualizationPanel}>
                        <div className={styles.panelHeader}>
                            <h2>Singly Linked List</h2>
                            <div className={styles.panelActions}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleReset}
                                    disabled={isAnimating}
                                >
                                    ↺ Reset
                                </button>
                            </div>
                        </div>

                        <div className={styles.listContainer}>
                            {list.length === 0 ? (
                                <div className={styles.nullNode}>NULL</div>
                            ) : (
                                <>
                                    {list.map((node, index) => (
                                        <div key={node.id} className={styles.nodeWrapper}>
                                            <div className={`${styles.node} ${styles[node.state]}`}>
                                                <div className={styles.nodeContent}>
                                                    {node.value}
                                                </div>
                                                <div className={styles.nodeIndex}>
                                                    {index === 0 ? 'Head' : index === list.length - 1 ? 'Tail' : index}
                                                </div>
                                            </div>
                                            <div className={styles.arrow}></div>
                                        </div>
                                    ))}
                                    <div className={styles.nullNode}>NULL</div>
                                </>
                            )}
                        </div>

                        <div className={`status-message ${statusType === 'success' ? 'success' : statusType === 'error' ? 'error' : ''}`}>
                            {statusMessage}
                        </div>

                        <div className={styles.controlsSection}>
                            <div className={styles.operationButtons}>
                                <button
                                    className={`btn ${currentOperation === 'insertHead' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setCurrentOperation('insertHead')}
                                    disabled={isAnimating}
                                >
                                    Insert Head
                                </button>
                                <button
                                    className={`btn ${currentOperation === 'insertTail' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setCurrentOperation('insertTail')}
                                    disabled={isAnimating}
                                >
                                    Insert Tail
                                </button>
                                <button
                                    className={`btn ${currentOperation === 'insertIndex' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setCurrentOperation('insertIndex')}
                                    disabled={isAnimating}
                                >
                                    Insert Index
                                </button>
                                <button
                                    className={`btn ${currentOperation === 'deleteIndex' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setCurrentOperation('deleteIndex')}
                                    disabled={isAnimating}
                                >
                                    Delete Index
                                </button>
                                <button
                                    className={`btn ${currentOperation === 'search' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setCurrentOperation('search')}
                                    disabled={isAnimating}
                                >
                                    Search
                                </button>
                            </div>

                            {currentOperation && (
                                <div className={styles.operationControls}>
                                    {(currentOperation !== 'deleteIndex' && (
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
                                                    if (e.key === 'Enter' && !isAnimating) {
                                                        switch (currentOperation) {
                                                            case 'insertHead': handleInsertHead(); break;
                                                            case 'insertTail': handleInsertTail(); break;
                                                            case 'insertIndex': handleInsertIndex(); break;
                                                            case 'search': handleSearch(); break;
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    ))}
                                    {(currentOperation === 'insertIndex' || currentOperation === 'deleteIndex') && (
                                        <div className="control-group">
                                            <label className="control-label">Index:</label>
                                            <input
                                                type="number"
                                                className="input"
                                                style={{ width: '80px' }}
                                                placeholder="Idx"
                                                value={inputIndex}
                                                onChange={(e) => setInputIndex(e.target.value)}
                                                disabled={isAnimating}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !isAnimating) {
                                                        switch (currentOperation) {
                                                            case 'insertIndex': handleInsertIndex(); break;
                                                            case 'deleteIndex': handleDeleteIndex(); break;
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}

                                    <div className="control-group">
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

                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            switch (currentOperation) {
                                                case 'insertHead': handleInsertHead(); break;
                                                case 'insertTail': handleInsertTail(); break;
                                                case 'insertIndex': handleInsertIndex(); break;
                                                case 'deleteIndex': handleDeleteIndex(); break;
                                                case 'search': handleSearch(); break;
                                            }
                                        }}
                                        disabled={isAnimating}
                                    >
                                        {isAnimating ? '⏳ Running...' : '▶ Run'}
                                    </button>
                                </div>
                            )}
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
                                            <div
                                                key={index}
                                                className={`code-line ${highlightedLine === index ? 'highlight' : ''}`}
                                            >
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
                                    Select an operation to manipulate the Linked List.
                                </p>
                                <div className={styles.quickInfo}>
                                    <h4>What is a Linked List?</h4>
                                    <ul>
                                        <li>Linear collection of data elements</li>
                                        <li>Elements point to the next element</li>
                                        <li>Dynamic size (easy insertion/deletion)</li>
                                        <li>No random access (must traverse)</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
                <TopicNavigator currentSlug="linked-lists" />
            </div>
        </div>
    );
}
