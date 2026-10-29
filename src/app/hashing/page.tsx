


'use client';

import { useState, useCallback } from 'react';
import styles from './page.module.css';
import TopicNavigator from '@/components/TopicNavigator';

type Operation = 'insert' | 'search' | 'delete' | null;
type CellState = 'default' | 'active' | 'found' | 'comparing' | 'occupied' | 'deleted' | 'probing';
type CollisionTechnique = 'linear' | 'quadratic' | 'double';

interface HashCell {
    value: number | null;
    state: CellState;
}

const TABLE_SIZE = 10;

const getCodeSnippet = (technique: CollisionTechnique, operation: Operation) => {
    if (!operation) return '';

    const baseInsert = `function insert(key) {
  let index = key % size;
  let i = 0;
  
  while (table[index] !== null) {
    i++;
    // PROBING_LOGIC
  }
  
  table[index] = key;
}`;

    const baseSearch = `function search(key) {
  let index = key % size;
  let start = index;
  let i = 0;
  
  while (table[index] !== null) {
    if (table[index] === key) return index;
    i++;
    // PROBING_LOGIC
    if (index === start && i > 0) break;
  }
  return -1;
}`;

    const probingLogic = {
        linear: `index = (index + 1) % size; // Linear`,
        quadratic: `index = (hash + i * i) % size; // Quadratic`,
        double: `index = (hash + i * (1 + key % (size - 1))) % size; // Double`
    };

    let code = operation === 'insert' ? baseInsert : operation === 'search' ? baseSearch : `// Delete uses Search logic first
function delete(key) {
  let index = search(key);
  if (index !== -1) {
    table[index] = null;
    return true;
  }
  return false;
}`;

    if (operation !== 'delete') {
        code = code.replace('// PROBING_LOGIC', probingLogic[technique]);
    }

    return code;
};

const explanations = {
    linear: {
        title: 'Linear Probing',
        description: 'On collision, check the next available slot sequentially: (hash + i) % size.',
        complexity: 'Avg: O(1) | Worst: O(n) (Primary Clustering)',
    },
    quadratic: {
        title: 'Quadratic Probing',
        description: 'On collision, check slots based on quadratic polynomial: (hash + i²) % size. Reduces primary clustering.',
        complexity: 'Avg: O(1) | Worst: O(n) (Secondary Clustering)',
    },
    double: {
        title: 'Double Hashing',
        description: 'Use a second hash function for step size: (hash + i * h2(key)) % size. Best distribution, minimizes clustering.',
        complexity: 'Avg: O(1) | Worst: O(n)',
    },
};

export default function HashingPage() {
    const [table, setTable] = useState<HashCell[]>(
        Array(TABLE_SIZE).fill(null).map(() => ({ value: null, state: 'default' }))
    );

    const [currentOperation, setCurrentOperation] = useState<Operation>(null);
    const [technique, setTechnique] = useState<CollisionTechnique>('linear');
    const [isAnimating, setIsAnimating] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Choose an operation to begin');
    const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');
    const [inputValue, setInputValue] = useState('');
    const [speed, setSpeed] = useState(500);
    const [highlightedLine, setHighlightedLine] = useState(-1);
    const [calculatedHash, setCalculatedHash] = useState<number | null>(null);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const resetStates = useCallback(() => {
        setTable(prev => prev.map(cell => ({
            ...cell,
            state: cell.value === null ? 'default' : 'occupied'
        })));
        setHighlightedLine(-1);
        setCalculatedHash(null);
    }, []);

    const getNextIndex = (key: number, i: number, initialHash: number) => {
        switch (technique) {
            case 'linear':
                return (initialHash + i) % TABLE_SIZE;
            case 'quadratic':
                return (initialHash + i * i) % TABLE_SIZE;
            case 'double':
                const h2 = 1 + (key % (TABLE_SIZE - 1));
                return (initialHash + i * h2) % TABLE_SIZE;
        }
    };

    const handleInsert = async () => {
        const key = parseInt(inputValue);
        if (isNaN(key)) {
            setStatusMessage('Please enter a valid number');
            setStatusType('error');
            return;
        }

        if (table.every(cell => cell.value !== null)) {
            setStatusMessage('Hash Table is full!');
            setStatusType('error');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('insert');
        resetStates();

        // Calculate Hash
        setHighlightedLine(2);
        const hash = key % TABLE_SIZE;
        setCalculatedHash(hash);
        setStatusMessage(`Hash: ${key} % ${TABLE_SIZE} = ${hash}`);
        await sleep(speed);

        let i = 0;
        let index = hash;
        let probes = 0;

        // Probing
        while (probes < TABLE_SIZE) {
            setHighlightedLine(6); // Inside loop
            setStatusMessage(`Checking index ${index} (i=${i})...`);

            setTable(prev => prev.map((cell, idx) => ({
                ...cell,
                state: idx === index ? 'comparing' : cell.state
            })));
            await sleep(speed);

            if (table[index].value === null) {
                // Found empty spot
                setHighlightedLine(10);
                setStatusMessage(`Found empty slot at index ${index}. Inserting ${key}.`);
                setTable(prev => prev.map((cell, idx) => ({
                    ...cell,
                    value: idx === index ? key : cell.value,
                    state: idx === index ? 'found' : cell.state
                })));
                setStatusType('success');
                break;
            } else {
                // Collision
                setStatusMessage(`Collision at index ${index}! Probing next...`);
                setTable(prev => prev.map((cell, idx) => ({
                    ...cell,
                    state: idx === index ? 'probing' : cell.state
                })));
                await sleep(speed);

                i++;
                index = getNextIndex(key, i, hash);
                probes++;
            }
        }

        if (probes >= TABLE_SIZE) {
            setStatusMessage('Could not find empty slot (cycle detected or full)');
            setStatusType('error');
        }

        setIsAnimating(false);
    };

    const handleSearch = async () => {
        const key = parseInt(inputValue);
        if (isNaN(key)) {
            setStatusMessage('Please enter a valid number');
            setStatusType('error');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('search');
        resetStates();

        setHighlightedLine(2);
        const hash = key % TABLE_SIZE;
        setCalculatedHash(hash);
        setStatusMessage(`Hash: ${key} % ${TABLE_SIZE} = ${hash}`);
        await sleep(speed);

        let i = 0;
        let index = hash;
        let probes = 0;
        let found = false;

        while (probes < TABLE_SIZE) {
            setHighlightedLine(6);
            setStatusMessage(`Checking index ${index} (i=${i})...`);

            setTable(prev => prev.map((cell, idx) => ({
                ...cell,
                state: idx === index ? 'comparing' : cell.state
            })));
            await sleep(speed);

            if (table[index].value === null) {
                break;
            }

            if (table[index].value === key) {
                setHighlightedLine(7);
                setStatusMessage(`Found ${key} at index ${index}!`);
                setTable(prev => prev.map((cell, idx) => ({
                    ...cell,
                    state: idx === index ? 'found' : cell.state
                })));
                setStatusType('success');
                found = true;
                break;
            }

            // Continue probing
            i++;
            index = getNextIndex(key, i, hash);
            probes++;
        }

        if (!found) {
            setHighlightedLine(12);
            setStatusMessage(`${key} not found in table`);
            setStatusType('error');
            resetStates();
        }

        setIsAnimating(false);
    };

    const handleDelete = async () => {
        const key = parseInt(inputValue);
        if (isNaN(key)) {
            setStatusMessage('Please enter a valid number');
            setStatusType('error');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('delete');
        resetStates();

        // Search part
        setHighlightedLine(2);
        const hash = key % TABLE_SIZE;
        setCalculatedHash(hash);
        setStatusMessage(`Searching for ${key} starting at index ${hash}...`);
        await sleep(speed);

        let i = 0;
        let index = hash;
        let probes = 0;
        let found = false;

        while (probes < TABLE_SIZE) {
            setTable(prev => prev.map((cell, idx) => ({
                ...cell,
                state: idx === index ? 'comparing' : cell.state
            })));
            await sleep(speed);

            if (table[index].value === key) {
                setHighlightedLine(4);
                setStatusMessage(`Found ${key} at index ${index}. Deleting...`);
                setTable(prev => prev.map((cell, idx) => ({
                    ...cell,
                    state: idx === index ? 'deleted' : cell.state
                })));
                await sleep(speed);

                setTable(prev => prev.map((cell, idx) => ({
                    ...cell,
                    value: idx === index ? null : cell.value,
                    state: idx === index ? 'default' : cell.state
                })));
                setStatusMessage(`Deleted ${key} from index ${index}`);
                setStatusType('success');
                found = true;
                break;
            }

            if (table[index].value === null) break;

            i++;
            index = getNextIndex(key, i, hash);
            probes++;
        }

        if (!found) {
            setStatusMessage(`${key} not found to delete`);
            setStatusType('error');
            resetStates();
        }

        setIsAnimating(false);
    };

    const handleReset = () => {
        setTable(Array(TABLE_SIZE).fill(null).map(() => ({ value: null, state: 'default' })));
        setStatusMessage('Hash Table cleared');
        setStatusType('info');
        setCurrentOperation(null);
        setHighlightedLine(-1);
        setInputValue('');
        setCalculatedHash(null);
    };

    return (
        <div className={styles.page}>
            <div className="container">
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <span className={styles.headerIcon}>🔑</span>
                        <div>
                            <h1>Hashing</h1>
                            <p className={styles.headerSubtitle}>
                                Key-Value mapping with constant time average access
                            </p>
                        </div>
                    </div>
                </header>

                <div className={styles.mainGrid}>
                    <section className={styles.visualizationPanel}>
                        <div className={styles.panelHeader}>
                            <h2>Hash Table</h2>
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

                        {/* Technique Selector */}
                        <div className={styles.techniqueSelector}>
                            <label className={styles.selectorLabel}>Collision Resolution:</label>
                            <div className={styles.radioGroup}>
                                <label className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="technique"
                                        value="linear"
                                        checked={technique === 'linear'}
                                        onChange={() => setTechnique('linear')}
                                        disabled={isAnimating}
                                    />
                                    Linear Probing
                                </label>
                                <label className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="technique"
                                        value="quadratic"
                                        checked={technique === 'quadratic'}
                                        onChange={() => setTechnique('quadratic')}
                                        disabled={isAnimating}
                                    />
                                    Quadratic Probing
                                </label>
                                <label className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="technique"
                                        value="double"
                                        checked={technique === 'double'}
                                        onChange={() => setTechnique('double')}
                                        disabled={isAnimating}
                                    />
                                    Double Hashing
                                </label>
                            </div>
                        </div>

                        {/* Hash Calculation Display */}
                        <div className={styles.hashDisplay}>
                            <div className={styles.hashFormula}>
                                Index = Key % {TABLE_SIZE}
                            </div>
                            {calculatedHash !== null && (
                                <div className={styles.hashResult}>
                                    = <span className={styles.highlight}>{calculatedHash}</span>
                                </div>
                            )}
                        </div>

                        {/* Table Display */}
                        <div className={styles.tableContainer}>
                            {table.map((cell, index) => (
                                <div key={index} className={styles.tableRow}>
                                    <div className={styles.indexCell}>{index}</div>
                                    <div className={`${styles.valueCell} ${styles[cell.state]}`}>
                                        {cell.value !== null ? cell.value : <span className={styles.empty}>Empty</span>}
                                    </div>
                                    {calculatedHash === index && (
                                        <div className={styles.pointer}>← Hash</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className={`status-message ${statusType === 'success' ? 'success' : statusType === 'error' ? 'error' : ''}`}>
                            {statusMessage}
                        </div>

                        <div className={styles.controlsSection}>
                            <div className={styles.operationButtons}>
                                <button
                                    className={`btn ${currentOperation === 'insert' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setCurrentOperation('insert')}
                                    disabled={isAnimating}
                                >
                                    Insert
                                </button>
                                <button
                                    className={`btn ${currentOperation === 'search' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setCurrentOperation('search')}
                                    disabled={isAnimating}
                                >
                                    Search
                                </button>
                                <button
                                    className={`btn ${currentOperation === 'delete' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setCurrentOperation('delete')}
                                    disabled={isAnimating}
                                >
                                    Delete
                                </button>
                            </div>

                            {currentOperation && (
                                <div className={styles.operationControls}>
                                    <div className="control-group">
                                        <label className="control-label">Key:</label>
                                        <input
                                            type="number"
                                            className="input"
                                            style={{ width: '100px' }}
                                            placeholder="Number"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            disabled={isAnimating}
                                        />
                                    </div>

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
                                                case 'insert': handleInsert(); break;
                                                case 'search': handleSearch(); break;
                                                case 'delete': handleDelete(); break;
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
                        <div className={styles.infoCard}>
                            <h3>{explanations[technique].title}</h3>
                            <p>{explanations[technique].description}</p>
                            <div className={styles.complexity}>
                                {explanations[technique].complexity}
                            </div>
                        </div>

                        {currentOperation && (
                            <div className={styles.codeCard}>
                                <div className={styles.codeHeader}>
                                    <span>JavaScript</span>
                                </div>
                                <div className="code-block">
                                    {getCodeSnippet(technique, currentOperation).split('\n').map((line, index) => (
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
                        )}

                        {!currentOperation && (
                            <div className={styles.infoCard}>
                                <h3>Getting Started</h3>
                                <p>
                                    Select a collision resolution technique and an operation to see how it works.
                                </p>
                                <div className={styles.quickInfo}>
                                    <h4>Collision Resolution</h4>
                                    <ul>
                                        <li><strong>Linear:</strong> Check next slot sequentially</li>
                                        <li><strong>Quadratic:</strong> Check slots with increasing gaps (1, 4, 9...)</li>
                                        <li><strong>Double:</strong> Use second hash for step size</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
                <TopicNavigator currentSlug="hashing" />
            </div>
        </div>
    );
}
