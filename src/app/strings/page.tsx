


'use client';

import { useState, useCallback } from 'react';
import styles from './page.module.css';
import TopicNavigator from '@/components/TopicNavigator';

type Operation = 'access' | 'search' | 'concat' | 'reverse' | 'substring' | null;
type CharState = 'default' | 'active' | 'found' | 'comparing' | 'highlight' | 'new';

interface StringChar {
    char: string;
    state: CharState;
}

const codeSnippets = {
    access: `// Access character at index
function charAt(str, index) {
  if (index < 0 || index >= str.length) {
    return undefined; // Out of bounds
  }
  return str[index]; // O(1) time complexity
}`,
    search: `// Find substring in string
function indexOf(str, target) {
  for (let i = 0; i <= str.length - target.length; i++) {
    let match = true;
    for (let j = 0; j < target.length; j++) {
      if (str[i + j] !== target[j]) {
        match = false;
        break;
      }
    }
    if (match) return i; // Found at index i
  }
  return -1; // Not found
}`,
    concat: `// Concatenate two strings
function concat(str1, str2) {
  let result = "";
  // Copy first string
  for (let char of str1) {
    result += char;
  }
  // Append second string
  for (let char of str2) {
    result += char;
  }
  return result;
}`,
    reverse: `// Reverse a string
function reverse(str) {
  let result = "";
  // Iterate from end to start
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
}`,
    substring: `// Extract substring
function substring(str, start, end) {
  let result = "";
  // Extract chars from start to end
  for (let i = start; i < end; i++) {
    result += str[i];
  }
  return result;
}`,
};

const explanations = {
    access: {
        title: 'Character Access',
        description: 'Strings provide O(1) constant time access to any character using its index, similar to arrays. Each character is stored at a specific memory location.',
        complexity: 'Time: O(1) | Space: O(1)',
    },
    search: {
        title: 'Substring Search',
        description: 'Naive substring search checks each position as a potential starting point and compares characters. More efficient algorithms like KMP achieve O(n+m).',
        complexity: 'Time: O(n×m) | Space: O(1)',
    },
    concat: {
        title: 'String Concatenation',
        description: 'Joining two strings creates a new string by copying all characters from both. In many languages, strings are immutable so a new string must be created.',
        complexity: 'Time: O(n+m) | Space: O(n+m)',
    },
    reverse: {
        title: 'String Reversal',
        description: 'Reversing a string creates a new string with characters in opposite order. This is a common interview question and building block for palindrome checks.',
        complexity: 'Time: O(n) | Space: O(n)',
    },
    substring: {
        title: 'Substring Extraction',
        description: 'Extracting a substring creates a new string containing only the characters between the start and end indices. End index is exclusive.',
        complexity: 'Time: O(k) | Space: O(k)',
    },
};

export default function StringsPage() {
    const [inputString, setInputString] = useState('HELLO');
    const [stringChars, setStringChars] = useState<StringChar[]>(
        'HELLO'.split('').map(char => ({ char, state: 'default' }))
    );

    const [currentOperation, setCurrentOperation] = useState<Operation>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Choose an operation to begin');
    const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');
    const [inputValue, setInputValue] = useState('');
    const [inputIndex, setInputIndex] = useState('');
    const [inputEnd, setInputEnd] = useState('');
    const [speed, setSpeed] = useState(400);
    const [highlightedLine, setHighlightedLine] = useState(-1);
    const [resultString, setResultString] = useState<StringChar[] | null>(null);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const resetStates = useCallback(() => {
        setStringChars(prev => prev.map(c => ({ ...c, state: 'default' })));
        setHighlightedLine(-1);
        setResultString(null);
    }, []);

    const updateInputString = (newStr: string) => {
        setInputString(newStr.toUpperCase());
        setStringChars(newStr.toUpperCase().split('').map(char => ({ char, state: 'default' })));
        setResultString(null);
    };

    const handleAccess = async () => {
        const index = parseInt(inputIndex);
        if (isNaN(index) || index < 0 || index >= stringChars.length) {
            setStatusMessage(`Invalid index! Please enter 0-${stringChars.length - 1}`);
            setStatusType('error');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('access');
        resetStates();

        setHighlightedLine(1);
        setStatusMessage(`Checking if index ${index} is valid...`);
        await sleep(speed);

        setHighlightedLine(4);
        setStringChars(prev => prev.map((c, i) => ({
            ...c,
            state: i === index ? 'found' : 'default'
        })));
        setStatusMessage(`Character at index ${index}: '${stringChars[index].char}'`);
        setStatusType('success');

        setIsAnimating(false);
    };

    const handleSearch = async () => {
        const target = inputValue.toUpperCase();
        if (!target) {
            setStatusMessage('Please enter a substring to search');
            setStatusType('error');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('search');
        resetStates();

        let foundIndex = -1;
        const str = stringChars.map(c => c.char).join('');

        for (let i = 0; i <= str.length - target.length; i++) {
            setHighlightedLine(2);
            setStatusMessage(`Checking position ${i}...`);

            let match = true;
            for (let j = 0; j < target.length; j++) {
                setHighlightedLine(4);
                setStringChars(prev => prev.map((c, idx) => ({
                    ...c,
                    state: idx >= i && idx < i + target.length ? 'comparing' : 'default'
                })));
                await sleep(speed / 2);

                if (str[i + j] !== target[j]) {
                    match = false;
                    setHighlightedLine(5);
                    break;
                }
            }

            await sleep(speed / 2);

            if (match) {
                foundIndex = i;
                setHighlightedLine(9);
                setStringChars(prev => prev.map((c, idx) => ({
                    ...c,
                    state: idx >= i && idx < i + target.length ? 'found' : 'default'
                })));
                setStatusMessage(`Found "${target}" at index ${i}!`);
                setStatusType('success');
                break;
            }
        }

        if (foundIndex === -1) {
            setHighlightedLine(11);
            resetStates();
            setStatusMessage(`Substring "${target}" not found`);
            setStatusType('error');
        }

        setIsAnimating(false);
    };

    const handleConcat = async () => {
        const str2 = inputValue.toUpperCase();
        if (!str2) {
            setStatusMessage('Please enter a string to concatenate');
            setStatusType('error');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('concat');
        resetStates();

        const result: StringChar[] = [];

        // Copy first string
        setHighlightedLine(3);
        for (let i = 0; i < stringChars.length; i++) {
            setStatusMessage(`Copying character '${stringChars[i].char}' from first string...`);
            setStringChars(prev => prev.map((c, idx) => ({
                ...c,
                state: idx === i ? 'active' : idx < i ? 'highlight' : 'default'
            })));
            result.push({ char: stringChars[i].char, state: 'highlight' });
            setResultString([...result]);
            await sleep(speed / 2);
        }

        // Append second string
        setHighlightedLine(6);
        for (let i = 0; i < str2.length; i++) {
            setStatusMessage(`Appending character '${str2[i]}' from second string...`);
            result.push({ char: str2[i], state: 'new' });
            setResultString([...result]);
            await sleep(speed / 2);
        }

        setHighlightedLine(8);
        setResultString(result.map(c => ({ ...c, state: c.state === 'new' ? 'new' : 'default' })));
        setStatusMessage(`Concatenated: "${stringChars.map(c => c.char).join('')}" + "${str2}" = "${result.map(c => c.char).join('')}"`);
        setStatusType('success');

        setIsAnimating(false);
    };

    const handleReverse = async () => {
        setIsAnimating(true);
        setCurrentOperation('reverse');
        resetStates();

        const result: StringChar[] = [];

        setHighlightedLine(3);
        for (let i = stringChars.length - 1; i >= 0; i--) {
            setStatusMessage(`Adding character '${stringChars[i].char}' from position ${i}...`);
            setStringChars(prev => prev.map((c, idx) => ({
                ...c,
                state: idx === i ? 'active' : c.state
            })));
            result.push({ char: stringChars[i].char, state: 'new' });
            setResultString([...result]);
            await sleep(speed);
        }

        setHighlightedLine(5);
        setResultString(result.map(c => ({ ...c, state: 'found' })));
        setStatusMessage(`Reversed: "${stringChars.map(c => c.char).join('')}" → "${result.map(c => c.char).join('')}"`);
        setStatusType('success');

        setIsAnimating(false);
    };

    const handleSubstring = async () => {
        const start = parseInt(inputIndex);
        const end = parseInt(inputEnd);

        if (isNaN(start) || isNaN(end) || start < 0 || end > stringChars.length || start >= end) {
            setStatusMessage(`Invalid range! Start must be 0-${stringChars.length - 1}, end must be > start and ≤ ${stringChars.length}`);
            setStatusType('error');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('substring');
        resetStates();

        const result: StringChar[] = [];

        setHighlightedLine(3);
        for (let i = start; i < end; i++) {
            setStatusMessage(`Extracting character '${stringChars[i].char}' at index ${i}...`);
            setStringChars(prev => prev.map((c, idx) => ({
                ...c,
                state: idx === i ? 'active' : idx >= start && idx < i ? 'highlight' : 'default'
            })));
            result.push({ char: stringChars[i].char, state: 'new' });
            setResultString([...result]);
            await sleep(speed);
        }

        setHighlightedLine(5);
        setStringChars(prev => prev.map((c, idx) => ({
            ...c,
            state: idx >= start && idx < end ? 'found' : 'default'
        })));
        setResultString(result.map(c => ({ ...c, state: 'found' })));
        setStatusMessage(`Substring [${start}:${end}] = "${result.map(c => c.char).join('')}"`);
        setStatusType('success');

        setIsAnimating(false);
    };

    const handleReset = () => {
        updateInputString('HELLO');
        setStatusMessage('String reset to initial state');
        setStatusType('info');
        setCurrentOperation(null);
        setHighlightedLine(-1);
        setInputValue('');
        setInputIndex('');
        setInputEnd('');
        setResultString(null);
    };

    return (
        <div className={styles.page}>
            <div className="container">
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <span className={styles.headerIcon}>🔤</span>
                        <div>
                            <h1>Strings</h1>
                            <p className={styles.headerSubtitle}>
                                Sequences of characters with powerful manipulation operations
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
                                    onClick={handleReset}
                                    disabled={isAnimating}
                                >
                                    ↺ Reset
                                </button>
                            </div>
                        </div>

                        {/* String Input */}
                        <div className={styles.stringInputSection}>
                            <label className="control-label">Input String:</label>
                            <input
                                type="text"
                                className="input"
                                value={inputString}
                                onChange={(e) => updateInputString(e.target.value)}
                                disabled={isAnimating}
                                maxLength={12}
                                style={{ width: '200px', textTransform: 'uppercase' }}
                            />
                        </div>

                        {/* String Display */}
                        <div className={styles.stringDisplay}>
                            <div className={styles.stringLabel}>Original String:</div>
                            <div className={styles.stringContainer}>
                                {stringChars.map((c, index) => (
                                    <div key={index} className={styles.charElement}>
                                        <div className={`${styles.charBox} ${styles[c.state]}`}>
                                            {c.char}
                                        </div>
                                        <span className={styles.charIndex}>[{index}]</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Result Display */}
                        {resultString && (
                            <div className={styles.stringDisplay}>
                                <div className={styles.stringLabel}>Result:</div>
                                <div className={styles.stringContainer}>
                                    {resultString.map((c, index) => (
                                        <div key={index} className={styles.charElement}>
                                            <div className={`${styles.charBox} ${styles[c.state]}`}>
                                                {c.char}
                                            </div>
                                            <span className={styles.charIndex}>[{index}]</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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
                                    className={`btn ${currentOperation === 'concat' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setCurrentOperation('concat')}
                                    disabled={isAnimating}
                                >
                                    Concat
                                </button>
                                <button
                                    className={`btn ${currentOperation === 'reverse' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setCurrentOperation('reverse')}
                                    disabled={isAnimating}
                                >
                                    Reverse
                                </button>
                                <button
                                    className={`btn ${currentOperation === 'substring' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setCurrentOperation('substring')}
                                    disabled={isAnimating}
                                >
                                    Substring
                                </button>
                            </div>

                            {currentOperation && (
                                <div className={styles.operationControls}>
                                    {currentOperation === 'access' && (
                                        <div className="control-group">
                                            <label className="control-label">Index:</label>
                                            <input
                                                type="number"
                                                className="input"
                                                style={{ width: '80px' }}
                                                placeholder="0"
                                                min="0"
                                                max={stringChars.length - 1}
                                                value={inputIndex}
                                                onChange={(e) => setInputIndex(e.target.value)}
                                                disabled={isAnimating}
                                            />
                                        </div>
                                    )}

                                    {(currentOperation === 'search' || currentOperation === 'concat') && (
                                        <div className="control-group">
                                            <label className="control-label">{currentOperation === 'search' ? 'Find:' : 'Append:'}</label>
                                            <input
                                                type="text"
                                                className="input"
                                                style={{ width: '100px', textTransform: 'uppercase' }}
                                                placeholder={currentOperation === 'search' ? 'LO' : 'WORLD'}
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                disabled={isAnimating}
                                                maxLength={6}
                                            />
                                        </div>
                                    )}

                                    {currentOperation === 'substring' && (
                                        <>
                                            <div className="control-group">
                                                <label className="control-label">Start:</label>
                                                <input
                                                    type="number"
                                                    className="input"
                                                    style={{ width: '70px' }}
                                                    placeholder="0"
                                                    min="0"
                                                    max={stringChars.length - 1}
                                                    value={inputIndex}
                                                    onChange={(e) => setInputIndex(e.target.value)}
                                                    disabled={isAnimating}
                                                />
                                            </div>
                                            <div className="control-group">
                                                <label className="control-label">End:</label>
                                                <input
                                                    type="number"
                                                    className="input"
                                                    style={{ width: '70px' }}
                                                    placeholder={String(stringChars.length)}
                                                    min="1"
                                                    max={stringChars.length}
                                                    value={inputEnd}
                                                    onChange={(e) => setInputEnd(e.target.value)}
                                                    disabled={isAnimating}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="control-group">
                                        <label className="control-label">Speed:</label>
                                        <input
                                            type="range"
                                            min="100"
                                            max="800"
                                            step="100"
                                            value={900 - speed}
                                            onChange={(e) => setSpeed(900 - parseInt(e.target.value))}
                                            disabled={isAnimating}
                                        />
                                    </div>

                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            switch (currentOperation) {
                                                case 'access': handleAccess(); break;
                                                case 'search': handleSearch(); break;
                                                case 'concat': handleConcat(); break;
                                                case 'reverse': handleReverse(); break;
                                                case 'substring': handleSubstring(); break;
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
                                    <h4>What is a String?</h4>
                                    <ul>
                                        <li>A sequence of characters (letters, numbers, symbols)</li>
                                        <li>Immutable in many languages (can&apos;t change in place)</li>
                                        <li>Indexed from 0, similar to arrays</li>
                                        <li>Common operations: search, concat, reverse, substring</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
                <TopicNavigator currentSlug="strings" />
            </div>
        </div>
    );
}
