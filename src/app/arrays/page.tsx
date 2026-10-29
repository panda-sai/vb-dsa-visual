
'use client';

import { useState, useCallback } from 'react';
import styles from './page.module.css';
import TopicNavigator from '@/components/TopicNavigator';

type Operation = 'access' | 'search' | 'insert' | 'delete' | null;
type ElementState = 'default' | 'active' | 'found' | 'comparing' | 'shifting' | 'inserting' | 'deleting';

interface ArrayElement {
    value: number;
    state: ElementState;
}

const codeSnippets = {
    access: `// Access element at index
function access(arr, index) {
  if (index < 0 || index >= arr.length) {
    return undefined; // Out of bounds
  }
  return arr[index]; // O(1) time complexity
}`,
    search: `// Linear Search - Find element in array
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Found at index i
    }
  }
  return -1; // Not found
}`,
    insert: `// Insert element at index
function insert(arr, index, value) {
  // Shift elements right from end
  for (let i = arr.length; i > index; i--) {
    arr[i] = arr[i - 1];
  }
  arr[index] = value; // Insert new element
  return arr;
}`,
    delete: `// Delete element at index
function deleteAt(arr, index) {
  // Shift elements left
  for (let i = index; i < arr.length - 1; i++) {
    arr[i] = arr[i + 1];
  }
  arr.length--; // Remove last element
  return arr;
}`,
};

const explanations = {
    access: {
        title: 'Access Operation',
        description: 'Arrays provide O(1) constant time access to any element using its index. The memory address is calculated directly from the base address and index.',
        complexity: 'Time: O(1) | Space: O(1)',
    },
    search: {
        title: 'Linear Search',
        description: 'Linear search checks each element sequentially until the target is found or the array ends. It\'s simple but not efficient for large arrays.',
        complexity: 'Time: O(n) | Space: O(1)',
    },
    insert: {
        title: 'Insert Operation',
        description: 'Inserting at an index requires shifting all subsequent elements to the right to make room for the new element.',
        complexity: 'Time: O(n) | Space: O(1)',
    },
    delete: {
        title: 'Delete Operation',
        description: 'Deleting from an index requires shifting all subsequent elements to the left to fill the gap left by the removed element.',
        complexity: 'Time: O(n) | Space: O(1)',
    },
};

export default function ArraysPage() {
    const [array, setArray] = useState<ArrayElement[]>([
        { value: 15, state: 'default' },
        { value: 27, state: 'default' },
        { value: 42, state: 'default' },
        { value: 8, state: 'default' },
        { value: 33, state: 'default' },
        { value: 19, state: 'default' },
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

    const resetArrayStates = useCallback(() => {
        setArray(prev => prev.map(el => ({ ...el, state: 'default' as ElementState })));
        setHighlightedLine(-1);
    }, []);

    const handleAccess = async () => {
        const index = parseInt(inputIndex);
        if (isNaN(index) || index < 0 || index >= array.length) {
            setStatusMessage(`Invalid index! Please enter 0-${array.length - 1}`);
            setStatusType('error');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('access');
        resetArrayStates();

        setHighlightedLine(1);
        setStatusMessage(`Checking if index ${index} is valid...`);
        await sleep(speed);

        setHighlightedLine(4);
        setArray(prev => prev.map((el, i) => ({
            ...el,
            state: i === index ? 'found' : 'default'
        })));
        setStatusMessage(`Accessed element at index ${index}: value = ${array[index].value}`);
        setStatusType('success');

        setIsAnimating(false);
    };

    const handleSearch = async () => {
        const target = parseInt(inputValue);
        if (isNaN(target)) {
            setStatusMessage('Please enter a valid number to search');
            setStatusType('error');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('search');
        resetArrayStates();

        let foundIndex = -1;

        for (let i = 0; i < array.length; i++) {
            setHighlightedLine(2);
            setStatusMessage(`Checking index ${i}...`);

            setArray(prev => prev.map((el, idx) => ({
                ...el,
                state: idx === i ? 'comparing' : idx < i ? 'default' : el.state
            })));

            await sleep(speed);

            setHighlightedLine(3);
            if (array[i].value === target) {
                foundIndex = i;
                setArray(prev => prev.map((el, idx) => ({
                    ...el,
                    state: idx === i ? 'found' : 'default'
                })));
                setHighlightedLine(4);
                setStatusMessage(`Found ${target} at index ${i}!`);
                setStatusType('success');
                break;
            }
        }

        if (foundIndex === -1) {
            setHighlightedLine(7);
            resetArrayStates();
            setStatusMessage(`Element ${target} not found in array`);
            setStatusType('error');
        }

        setIsAnimating(false);
    };

    const handleInsert = async () => {
        const index = parseInt(inputIndex);
        const value = parseInt(inputValue);

        if (isNaN(index) || index < 0 || index > array.length) {
            setStatusMessage(`Invalid index! Please enter 0-${array.length}`);
            setStatusType('error');
            return;
        }

        if (isNaN(value)) {
            setStatusMessage('Please enter a valid number to insert');
            setStatusType('error');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('insert');
        resetArrayStates();

        // Show shifting animation from end to index
        for (let i = array.length - 1; i >= index; i--) {
            setHighlightedLine(3);
            setStatusMessage(`Shifting element at index ${i} to the right...`);
            setArray(prev => prev.map((el, idx) => ({
                ...el,
                state: idx === i ? 'shifting' : el.state
            })));
            await sleep(speed / 2);
        }

        // Insert the new element
        setHighlightedLine(5);
        setStatusMessage(`Inserting ${value} at index ${index}...`);

        const newArray: ArrayElement[] = [...array];
        newArray.splice(index, 0, { value, state: 'inserting' });
        setArray(newArray);

        await sleep(speed);

        // Reset states
        setArray(prev => prev.map(el => ({ ...el, state: 'default' })));
        setStatusMessage(`Inserted ${value} at index ${index}`);
        setStatusType('success');

        setIsAnimating(false);
    };

    const handleDelete = async () => {
        const index = parseInt(inputIndex);

        if (isNaN(index) || index < 0 || index >= array.length) {
            setStatusMessage(`Invalid index! Please enter 0-${array.length - 1}`);
            setStatusType('error');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('delete');
        resetArrayStates();

        // Highlight element to delete
        setHighlightedLine(2);
        setStatusMessage(`Deleting element at index ${index}...`);
        setArray(prev => prev.map((el, i) => ({
            ...el,
            state: i === index ? 'deleting' : el.state
        })));

        await sleep(speed);

        // Show shifting animation
        for (let i = index; i < array.length - 1; i++) {
            setHighlightedLine(3);
            setStatusMessage(`Shifting element from index ${i + 1} to ${i}...`);
            setArray(prev => prev.map((el, idx) => ({
                ...el,
                state: idx === i + 1 ? 'shifting' : idx === index ? 'deleting' : el.state
            })));
            await sleep(speed / 2);
        }

        // Remove element
        setHighlightedLine(5);
        const newArray = array.filter((_, i) => i !== index);
        setArray(newArray.map(el => ({ ...el, state: 'default' })));

        setStatusMessage(`Deleted element at index ${index}`);
        setStatusType('success');

        setIsAnimating(false);
    };

    const handleReset = () => {
        setArray([
            { value: 15, state: 'default' },
            { value: 27, state: 'default' },
            { value: 42, state: 'default' },
            { value: 8, state: 'default' },
            { value: 33, state: 'default' },
            { value: 19, state: 'default' },
        ]);
        setStatusMessage('Array reset to initial state');
        setStatusType('info');
        setCurrentOperation(null);
        setHighlightedLine(-1);
        setInputValue('');
        setInputIndex('');
    };

    const handleRandomize = () => {
        const newArray: ArrayElement[] = Array.from({ length: 6 }, () => ({
            value: Math.floor(Math.random() * 99) + 1,
            state: 'default' as ElementState
        }));
        setArray(newArray);
        setStatusMessage('Array randomized!');
        setStatusType('info');
        setHighlightedLine(-1);
    };

    return (
        <div className={styles.page}>
            <div className="container">
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <span className={styles.headerIcon}>📊</span>
                        <div>
                            <h1>Arrays</h1>
                            <p className={styles.headerSubtitle}>
                                The fundamental data structure for storing elements in contiguous memory
                            </p>
                        </div>
                    </div>
                </header>

                {/* Main Content Grid */}
                <div className={styles.mainGrid}>
                    {/* Visualization Panel */}
                    <section className={styles.visualizationPanel}>
                        <div className={styles.panelHeader}>
                            <h2>Visualization</h2>
                            <div className={styles.panelActions}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleRandomize}
                                    disabled={isAnimating}
                                >
                                    🎲 Randomize
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleReset}
                                    disabled={isAnimating}
                                >
                                    ↺ Reset
                                </button>
                            </div>
                        </div>

                        {/* Array Display */}
                        <div className={styles.arrayDisplay}>
                            <div className="array-container">
                                {array.map((element, index) => (
                                    <div key={index} className="array-element">
                                        <div className={`array-box ${element.state}`}>
                                            {element.value}
                                        </div>
                                        <span className="array-index">[{index}]</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Status Message */}
                        <div className={`status-message ${statusType === 'success' ? 'success' : statusType === 'error' ? 'error' : ''}`}>
                            {statusMessage}
                        </div>

                        {/* Controls */}
                        <div className={styles.controlsSection}>
                            <div className={styles.operationButtons}>
                                <button
                                    className={`btn ${currentOperation === 'access' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setCurrentOperation('access')}
                                    disabled={isAnimating}
                                >
                                    Access
                                </button>
                                <button
                                    className={`btn ${currentOperation === 'search' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setCurrentOperation('search')}
                                    disabled={isAnimating}
                                >
                                    Search
                                </button>
                                <button
                                    className={`btn ${currentOperation === 'insert' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setCurrentOperation('insert')}
                                    disabled={isAnimating}
                                >
                                    Insert
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
                                    {(currentOperation === 'access' || currentOperation === 'insert' || currentOperation === 'delete') && (
                                        <div className="control-group">
                                            <label className="control-label">Index:</label>
                                            <input
                                                type="number"
                                                className="input"
                                                style={{ width: '80px' }}
                                                placeholder="0"
                                                min="0"
                                                max={currentOperation === 'insert' ? array.length : array.length - 1}
                                                value={inputIndex}
                                                onChange={(e) => setInputIndex(e.target.value)}
                                                disabled={isAnimating}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !isAnimating) {
                                                        switch (currentOperation) {
                                                            case 'access': handleAccess(); break;
                                                            case 'insert': handleInsert(); break;
                                                            case 'delete': handleDelete(); break;
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}

                                    {(currentOperation === 'search' || currentOperation === 'insert') && (
                                        <div className="control-group">
                                            <label className="control-label">Value:</label>
                                            <input
                                                type="number"
                                                className="input"
                                                style={{ width: '80px' }}
                                                placeholder="42"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                disabled={isAnimating}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !isAnimating) {
                                                        switch (currentOperation) {
                                                            case 'search': handleSearch(); break;
                                                            case 'insert': handleInsert(); break;
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
                                                case 'access': handleAccess(); break;
                                                case 'search': handleSearch(); break;
                                                case 'insert': handleInsert(); break;
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

                    {/* Info Panel */}
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
                                    Select an operation from the buttons above to see how it works.
                                    Watch the visualization animate step by step while the code highlights.
                                </p>
                                <div className={styles.quickInfo}>
                                    <h4>What is an Array?</h4>
                                    <ul>
                                        <li>A collection of elements stored at contiguous memory locations</li>
                                        <li>Elements are accessed using index (0-based)</li>
                                        <li>Fixed or dynamic size depending on language</li>
                                        <li>Fast access O(1), slower insert/delete O(n)</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
                <TopicNavigator currentSlug="arrays" />
            </div>
        </div>
    );
}
