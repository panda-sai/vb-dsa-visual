


'use client';

import { useState } from 'react';
import styles from './page.module.css';
import TopicNavigator from '@/components/TopicNavigator';

type ExecutionPhase = 'idle' | 'calling' | 'executing' | 'returning' | 'complete';

interface FunctionCall {
    id: number;
    param1: number;
    param2: number;
    result: number | null;
    phase: ExecutionPhase;
}

const pseudocode = `FUNCTION add(a, b)
    result = a + b
    RETURN result
END FUNCTION

// Calling the function
output = add(param1, param2)`;

export default function FunctionsPage() {
    const [param1, setParam1] = useState(5);
    const [param2, setParam2] = useState(3);
    const [currentCall, setCurrentCall] = useState<FunctionCall | null>(null);
    const [callHistory, setCallHistory] = useState<FunctionCall[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [speed, setSpeed] = useState(800);
    const [highlightedLine, setHighlightedLine] = useState(-1);
    const [statusMessage, setStatusMessage] = useState('Configure parameters and call the function to see execution flow');

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const resetState = () => {
        setCurrentCall(null);
        setHighlightedLine(-1);
    };

    const callFunction = async () => {
        setIsAnimating(true);
        resetState();

        const callId = callHistory.length + 1;
        const newCall: FunctionCall = {
            id: callId,
            param1,
            param2,
            result: null,
            phase: 'calling',
        };

        // Calling phase
        setHighlightedLine(5);
        setCurrentCall(newCall);
        setStatusMessage(`Calling function add(${param1}, ${param2})`);
        await sleep(speed);

        // Entering function
        setHighlightedLine(0);
        newCall.phase = 'executing';
        setCurrentCall({ ...newCall });
        setStatusMessage(`Entering function with a=${param1}, b=${param2}`);
        await sleep(speed);

        // Executing function body
        setHighlightedLine(1);
        setStatusMessage(`Computing: ${param1} + ${param2}`);
        await sleep(speed);

        const result = param1 + param2;
        newCall.result = result;
        setCurrentCall({ ...newCall });
        setStatusMessage(`Result calculated: ${result}`);
        await sleep(speed);

        // Returning
        setHighlightedLine(2);
        newCall.phase = 'returning';
        setCurrentCall({ ...newCall });
        setStatusMessage(`Returning value: ${result}`);
        await sleep(speed);

        // Back to caller
        setHighlightedLine(5);
        newCall.phase = 'complete';
        setCurrentCall({ ...newCall });
        setStatusMessage(`Function returned ${result} to caller`);
        await sleep(speed);

        // Add to history
        setCallHistory([...callHistory, newCall]);
        setCurrentCall(null);
        setHighlightedLine(-1);
        setStatusMessage('Function call complete');
        setIsAnimating(false);
    };

    const clearHistory = () => {
        setCallHistory([]);
        setCurrentCall(null);
        setHighlightedLine(-1);
        setStatusMessage('History cleared');
    };

    return (
        <div className={styles.page}>
            <div className="container">
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <span className={styles.headerIcon}>⚙️</span>
                        <div>
                            <h1>Functions</h1>
                            <p className={styles.headerSubtitle}>
                                Organize code into reusable blocks with parameters and return values
                            </p>
                        </div>
                    </div>
                </header>

                <div className={styles.mainGrid}>
                    <section className={styles.visualizationPanel}>
                        <div className={styles.panelHeader}>
                            <h2>Visualization</h2>
                        </div>

                        {/* Function Execution Flow */}
                        <div className={styles.executionFlow}>
                            {/* Caller */}
                            <div className={styles.callerBox}>
                                <div className={styles.boxTitle}>Caller (Main Program)</div>
                                <div className={styles.boxContent}>
                                    <div className={styles.callStatement}>
                                        output = add({param1}, {param2})
                                    </div>
                                    {currentCall && currentCall.phase === 'calling' && (
                                        <div className={styles.callingIndicator}>
                                            📞 Calling function...
                                        </div>
                                    )}
                                    {currentCall && currentCall.phase === 'complete' && (
                                        <div className={styles.returnIndicator}>
                                            ✓ Received: {currentCall.result}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Arrow Down */}
                            {currentCall && (currentCall.phase === 'calling' || currentCall.phase === 'executing') && (
                                <div className={styles.arrowDown}>
                                    <div className={styles.arrowLine}></div>
                                    <div className={styles.arrowHead}>▼</div>
                                    <div className={styles.arrowLabel}>Call with params</div>
                                </div>
                            )}

                            {/* Function */}
                            {currentCall && currentCall.phase !== 'idle' && (
                                <div className={`${styles.functionBox} ${currentCall.phase === 'executing' ? styles.executing : ''}`}>
                                    <div className={styles.boxTitle}>Function: add(a, b)</div>
                                    <div className={styles.boxContent}>
                                        <div className={styles.parameters}>
                                            <div className={styles.paramItem}>
                                                <span className={styles.paramName}>a</span>
                                                <span className={styles.paramValue}>{currentCall.param1}</span>
                                            </div>
                                            <div className={styles.paramItem}>
                                                <span className={styles.paramName}>b</span>
                                                <span className={styles.paramValue}>{currentCall.param2}</span>
                                            </div>
                                        </div>
                                        {currentCall.phase === 'executing' && (
                                            <div className={styles.computation}>
                                                Computing: {currentCall.param1} + {currentCall.param2}
                                            </div>
                                        )}
                                        {currentCall.result !== null && (
                                            <div className={styles.resultBox}>
                                                <span className={styles.resultLabel}>Result:</span>
                                                <span className={styles.resultValue}>{currentCall.result}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Arrow Up */}
                            {currentCall && (currentCall.phase === 'returning' || currentCall.phase === 'complete') && (
                                <div className={styles.arrowUp}>
                                    <div className={styles.arrowLabel}>Return value</div>
                                    <div className={styles.arrowHead}>▲</div>
                                    <div className={styles.arrowLine}></div>
                                </div>
                            )}
                        </div>

                        {/* Call History */}
                        <div className={styles.historySection}>
                            <div className={styles.historyHeader}>
                                <h3>Call History</h3>
                                {callHistory.length > 0 && (
                                    <button
                                        className="btn btn-secondary"
                                        onClick={clearHistory}
                                        disabled={isAnimating}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <div className={styles.historyList}>
                                {callHistory.length === 0 ? (
                                    <div className={styles.noHistory}>No function calls yet</div>
                                ) : (
                                    callHistory.map((call) => (
                                        <div key={call.id} className={styles.historyItem}>
                                            <span className={styles.callNumber}>#{call.id}</span>
                                            <span className={styles.callExpression}>
                                                add({call.param1}, {call.param2})
                                            </span>
                                            <span className={styles.callResult}>→ {call.result}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Status Message */}
                        <div className={`status-message ${!isAnimating && callHistory.length > 0 ? 'success' : ''}`}>
                            {statusMessage}
                        </div>

                        {/* Controls */}
                        <div className={styles.controlsSection}>
                            <div className={styles.variableControls}>
                                <div className="control-group">
                                    <label className="control-label">Parameter 1:</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={param1}
                                        onChange={(e) => setParam1(parseInt(e.target.value) || 0)}
                                        disabled={isAnimating}
                                    />
                                </div>
                                <div className="control-group">
                                    <label className="control-label">Parameter 2:</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={param2}
                                        onChange={(e) => setParam2(parseInt(e.target.value) || 0)}
                                        disabled={isAnimating}
                                    />
                                </div>
                                <div className="control-group">
                                    <label className="control-label">Speed:</label>
                                    <input
                                        type="range"
                                        min="200"
                                        max="1500"
                                        step="100"
                                        value={1700 - speed}
                                        onChange={(e) => setSpeed(1700 - parseInt(e.target.value))}
                                        disabled={isAnimating}
                                    />
                                </div>
                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={callFunction}
                                disabled={isAnimating}
                                style={{ marginTop: '1rem' }}
                            >
                                {isAnimating ? '⏳ Running...' : '▶ Call Function'}
                            </button>
                        </div>
                    </section>

                    <aside className={styles.infoPanel}>
                        <div className={styles.infoCard}>
                            <h3>About Functions</h3>
                            <p>
                                Functions are reusable blocks of code that accept parameters, perform operations, and return results.
                            </p>
                            <div className={styles.quickInfo}>
                                <h4>Key Concepts:</h4>
                                <ul>
                                    <li><strong>Parameters:</strong> Input values passed to the function</li>
                                    <li><strong>Function Body:</strong> Code that executes when called</li>
                                    <li><strong>Return Value:</strong> Output sent back to caller</li>
                                    <li><strong>Reusability:</strong> Call the same function multiple times</li>
                                </ul>
                                <h4 style={{ marginTop: '1rem' }}>Benefits:</h4>
                                <ul>
                                    <li>Code organization and modularity</li>
                                    <li>Avoid code duplication</li>
                                    <li>Easier testing and debugging</li>
                                    <li>Improved readability</li>
                                </ul>
                            </div>
                        </div>

                        <div className={styles.codeCard}>
                            <div className={styles.codeHeader}>
                                <span>Pseudocode</span>
                            </div>
                            <div className="code-block">
                                {pseudocode.split('\n').map((line, index) => (
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
                    </aside>
                </div>
                <TopicNavigator currentSlug="functions" />
            </div>
        </div>
    );
}
