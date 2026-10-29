


'use client';

import { useState, useCallback } from 'react';
import styles from './page.module.css';
import TopicNavigator from '@/components/TopicNavigator';

type Operation = 'push' | 'pop' | 'peek' | 'clear' | null;
type StackElementState = 'default' | 'new' | 'popping' | 'peek';

interface StackElement {
    id: string;
    value: number;
    state: StackElementState;
}

const MAX_SIZE = 10;

const codeSnippets = {
    push: `// Push operation
function push(stack, value) {
  if (stack.length >= MAX_SIZE) {
    return "Stack Overflow";
  }
  stack.push(value);
}`,
    pop: `// Pop operation
function pop(stack) {
  if (stack.length === 0) {
    return "Stack Underflow";
  }
  return stack.pop();
}`,
    peek: `// Peek operation
function peek(stack) {
  if (stack.length === 0) {
    return null;
  }
  return stack[stack.length - 1];
}`,
    clear: `// Clear operation
function clear(stack) {
  stack.length = 0;
}`,
};

const explanations = {
    push: {
        title: 'Push',
        description: 'Add an element to the top of the stack. Checks for overflow if the stack has a fixed size.',
        complexity: 'Time: O(1) | Space: O(1)',
    },
    pop: {
        title: 'Pop',
        description: 'Remove and return the element from the top of the stack. Checks for underflow if the stack is empty.',
        complexity: 'Time: O(1) | Space: O(1)',
    },
    peek: {
        title: 'Peek',
        description: 'View the element at the top of the stack without removing it.',
        complexity: 'Time: O(1) | Space: O(1)',
    },
    clear: {
        title: 'Clear',
        description: 'Remove all elements from the stack.',
        complexity: 'Time: O(1) | Space: O(1)',
    },
};

export default function StacksPage() {
    const [stack, setStack] = useState<StackElement[]>([
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
        setStack(prev => prev.map(el => ({ ...el, state: 'default' })));
    }, []);

    const handlePush = async () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) {
            setStatusMessage('Please enter a valid number');
            setStatusType('error');
            return;
        }

        if (stack.length >= MAX_SIZE) {
            setStatusMessage('Stack Overflow! Cannot push to a full stack.');
            setStatusType('error');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('push');
        resetStates();

        setStatusMessage(`Pushing ${val} onto the stack...`);

        const newElement: StackElement = {
            id: Date.now().toString(),
            value: val,
            state: 'new'
        };

        setStack(prev => [...prev, newElement]);

        await sleep(speed);

        setStack(prev => prev.map(el => ({ ...el, state: 'default' })));
        setStatusMessage(`Pushed ${val} successfully.`);
        setStatusType('success');
        setInputValue('');
        setIsAnimating(false);
    };

    const handlePop = async () => {
        if (stack.length === 0) {
            setStatusMessage('Stack Underflow! Cannot pop from an empty stack.');
            setStatusType('error');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('pop');
        resetStates();

        const topValue = stack[stack.length - 1].value;
        setStatusMessage(`Popping ${topValue} from the stack...`);

        // Mark top element as popping
        setStack(prev => prev.map((el, i) =>
            i === prev.length - 1 ? { ...el, state: 'popping' } : el
        ));

        await sleep(speed);

        setStack(prev => prev.slice(0, -1));
        setStatusMessage(`Popped ${topValue} successfully.`);
        setStatusType('success');
        setIsAnimating(false);
    };

    const handlePeek = async () => {
        if (stack.length === 0) {
            setStatusMessage('Stack is empty.');
            setStatusType('info');
            return;
        }

        setIsAnimating(true);
        setCurrentOperation('peek');
        resetStates();

        const topValue = stack[stack.length - 1].value;
        setStatusMessage(`Peeking at top element: ${topValue}`);

        setStack(prev => prev.map((el, i) =>
            i === prev.length - 1 ? { ...el, state: 'peek' } : el
        ));

        await sleep(speed);

        // Keep the highlight for a bit longer or until next operation
        setStatusType('success');
        setIsAnimating(false);
    };

    const handleClear = async () => {
        setIsAnimating(true);
        setCurrentOperation('clear');
        setStatusMessage('Clearing stack...');

        // Animate all popping? Or just clear. Let's just clear for simplicity/speed.
        setStack([]);

        await sleep(speed / 2);
        setStatusMessage('Stack cleared.');
        setStatusType('success');
        setIsAnimating(false);
    };

    return (
        <div className={styles.page}>
            <div className="container">
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <span className={styles.headerIcon}>📚</span>
                        <div>
                            <h1>Stacks</h1>
                            <p className={styles.headerSubtitle}>
                                LIFO (Last-In, First-Out) data structure
                            </p>
                        </div>
                    </div>
                </header>

                <div className={styles.mainGrid}>
                    <section className={styles.visualizationPanel}>
                        <div className={styles.panelHeader}>
                            <h2>Stack Visualization (Max Size: {MAX_SIZE})</h2>
                            <div className={styles.panelActions}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleClear}
                                    disabled={isAnimating || stack.length === 0}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        <div className={styles.stackContainer}>
                            <div className={styles.stackVisual}>
                                {stack.map((element, index) => (
                                    <div
                                        key={element.id}
                                        className={`${styles.stackElement} ${styles[element.state]}`}
                                    >
                                        {element.value}
                                        <span className={styles.elementIndex}>{index}</span>
                                        {index === stack.length - 1 && (
                                            <div className={styles.topLabel}>Top</div>
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
                                            if (e.key === 'Enter' && !isAnimating) handlePush();
                                        }}
                                    />
                                </div>

                                <button
                                    className="btn btn-primary"
                                    onClick={handlePush}
                                    disabled={isAnimating}
                                >
                                    Push
                                </button>

                                <button
                                    className="btn btn-secondary"
                                    onClick={handlePop}
                                    disabled={isAnimating}
                                >
                                    Pop
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
                                    A Stack follows the LIFO (Last-In, First-Out) principle.
                                    The last element added is the first one to be removed.
                                </p>
                                <div className={styles.quickInfo}>
                                    <h4>Operations</h4>
                                    <ul>
                                        <li><strong>Push</strong>: Add to top</li>
                                        <li><strong>Pop</strong>: Remove from top</li>
                                        <li><strong>Peek</strong>: Look at top</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
                <TopicNavigator currentSlug="stacks" />
            </div>
        </div>
    );
}
