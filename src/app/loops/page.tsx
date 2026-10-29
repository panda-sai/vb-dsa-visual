
'use client';

import { useState } from 'react';
import styles from './page.module.css';
import TopicNavigator from '@/components/TopicNavigator';

type LoopType = 'for' | 'while';

interface LoopState {
    counter: number;
    isRunning: boolean;
    currentPhase: 'init' | 'condition' | 'body' | 'increment' | 'complete' | 'idle';
}

const pseudocode = {
    for: `INITIALIZE counter = start
WHILE counter <= end DO
    execute loop body
    INCREMENT counter
END WHILE`,
    while: `WHILE condition is TRUE DO
    execute loop body
    UPDATE variables
END WHILE`,
};

export default function LoopsPage() {
    const [loopType, setLoopType] = useState<LoopType>('for');
    const [startValue, setStartValue] = useState(1);
    const [endValue, setEndValue] = useState(5);
    const [loopState, setLoopState] = useState<LoopState>({
        counter: 0,
        isRunning: false,
        currentPhase: 'idle',
    });
    const [iterations, setIterations] = useState<number[]>([]);
    const [speed, setSpeed] = useState(800);
    const [highlightedLine, setHighlightedLine] = useState(-1);
    const [statusMessage, setStatusMessage] = useState('Configure loop parameters and run to see iteration in action');

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const resetState = () => {
        setLoopState({ counter: 0, isRunning: false, currentPhase: 'idle' });
        setIterations([]);
        setHighlightedLine(-1);
    };

    const runForLoop = async () => {
        resetState();
        setLoopState({ counter: startValue, isRunning: true, currentPhase: 'init' });

        setHighlightedLine(0);
        setStatusMessage(`Initializing counter = ${startValue}`);
        await sleep(speed);

        const iterationList: number[] = [];

        for (let i = startValue; i <= endValue; i++) {
            // Check condition
            setLoopState({ counter: i, isRunning: true, currentPhase: 'condition' });
            setHighlightedLine(1);
            setStatusMessage(`Checking condition: ${i} <= ${endValue} → TRUE`);
            await sleep(speed);

            // Execute body
            setLoopState({ counter: i, isRunning: true, currentPhase: 'body' });
            setHighlightedLine(2);
            setStatusMessage(`Executing loop body (iteration ${i})`);
            iterationList.push(i);
            setIterations([...iterationList]);
            await sleep(speed);

            // Increment
            setLoopState({ counter: i, isRunning: true, currentPhase: 'increment' });
            setHighlightedLine(3);
            setStatusMessage(`Incrementing counter: ${i} → ${i + 1}`);
            await sleep(speed);
        }

        // Final condition check (false)
        setLoopState({ counter: endValue + 1, isRunning: true, currentPhase: 'condition' });
        setHighlightedLine(1);
        setStatusMessage(`Checking condition: ${endValue + 1} <= ${endValue} → FALSE`);
        await sleep(speed);

        // Complete
        setLoopState({ counter: endValue + 1, isRunning: false, currentPhase: 'complete' });
        setHighlightedLine(4);
        setStatusMessage(`Loop complete! Executed ${iterationList.length} iterations`);
    };

    const runWhileLoop = async () => {
        resetState();
        const iterationList: number[] = [];
        let counter = startValue;

        setLoopState({ counter, isRunning: true, currentPhase: 'condition' });

        while (counter <= endValue) {
            // Check condition
            setLoopState({ counter, isRunning: true, currentPhase: 'condition' });
            setHighlightedLine(0);
            setStatusMessage(`Checking condition: ${counter} <= ${endValue} → TRUE`);
            await sleep(speed);

            // Execute body
            setLoopState({ counter, isRunning: true, currentPhase: 'body' });
            setHighlightedLine(1);
            setStatusMessage(`Executing loop body (iteration ${counter})`);
            iterationList.push(counter);
            setIterations([...iterationList]);
            await sleep(speed);

            // Update
            setHighlightedLine(2);
            setStatusMessage(`Updating counter: ${counter} → ${counter + 1}`);
            await sleep(speed);
            counter++;
            setLoopState({ counter, isRunning: true, currentPhase: 'condition' });
        }

        // Final condition check (false)
        setLoopState({ counter, isRunning: true, currentPhase: 'condition' });
        setHighlightedLine(0);
        setStatusMessage(`Checking condition: ${counter} <= ${endValue} → FALSE`);
        await sleep(speed);

        // Complete
        setLoopState({ counter, isRunning: false, currentPhase: 'complete' });
        setHighlightedLine(3);
        setStatusMessage(`Loop complete! Executed ${iterationList.length} iterations`);
    };

    const handleRun = () => {
        if (loopType === 'for') {
            runForLoop();
        } else {
            runWhileLoop();
        }
    };

    return (
        <div className={styles.page}>
            <div className="container">
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <span className={styles.headerIcon}>🔄</span>
                        <div>
                            <h1>Loops</h1>
                            <p className={styles.headerSubtitle}>
                                Repeat code execution with for and while loops
                            </p>
                        </div>
                    </div>
                </header>

                <div className={styles.mainGrid}>
                    <section className={styles.visualizationPanel}>
                        <div className={styles.panelHeader}>
                            <h2>Visualization</h2>
                        </div>

                        {/* Loop Visualization */}
                        <div className={styles.loopVisualization}>
                            {/* Counter Display */}
                            <div className={styles.counterDisplay}>
                                <div className={styles.counterLabel}>Counter Value</div>
                                <div className={`${styles.counterValue} ${loopState.isRunning ? styles.active : ''}`}>
                                    {loopState.counter}
                                </div>
                            </div>

                            {/* Loop Phases */}
                            <div className={styles.phasesContainer}>
                                {loopType === 'for' && (
                                    <div className={`${styles.phase} ${loopState.currentPhase === 'init' ? styles.activePhase : ''}`}>
                                        <div className={styles.phaseNumber}>1</div>
                                        <div className={styles.phaseContent}>
                                            <div className={styles.phaseTitle}>Initialize</div>
                                            <div className={styles.phaseCode}>counter = {startValue}</div>
                                        </div>
                                    </div>
                                )}

                                <div className={`${styles.phase} ${loopState.currentPhase === 'condition' ? styles.activePhase : ''}`}>
                                    <div className={styles.phaseNumber}>{loopType === 'for' ? '2' : '1'}</div>
                                    <div className={styles.phaseContent}>
                                        <div className={styles.phaseTitle}>Check Condition</div>
                                        <div className={styles.phaseCode}>counter ≤ {endValue}</div>
                                    </div>
                                </div>

                                <div className={`${styles.phase} ${loopState.currentPhase === 'body' ? styles.activePhase : ''}`}>
                                    <div className={styles.phaseNumber}>{loopType === 'for' ? '3' : '2'}</div>
                                    <div className={styles.phaseContent}>
                                        <div className={styles.phaseTitle}>Execute Body</div>
                                        <div className={styles.phaseCode}>Process iteration</div>
                                    </div>
                                </div>

                                <div className={`${styles.phase} ${loopState.currentPhase === 'increment' ? styles.activePhase : ''}`}>
                                    <div className={styles.phaseNumber}>{loopType === 'for' ? '4' : '3'}</div>
                                    <div className={styles.phaseContent}>
                                        <div className={styles.phaseTitle}>{loopType === 'for' ? 'Increment' : 'Update'}</div>
                                        <div className={styles.phaseCode}>counter++</div>
                                    </div>
                                </div>
                            </div>

                            {/* Iterations Display */}
                            <div className={styles.iterationsContainer}>
                                <div className={styles.iterationsLabel}>Iterations Completed:</div>
                                <div className={styles.iterationsList}>
                                    {iterations.length === 0 ? (
                                        <div className={styles.noIterations}>No iterations yet</div>
                                    ) : (
                                        iterations.map((value, index) => (
                                            <div key={index} className={styles.iterationItem}>
                                                <span className={styles.iterationNumber}>#{index + 1}</span>
                                                <span className={styles.iterationValue}>counter = {value}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Completion Badge */}
                            {loopState.currentPhase === 'complete' && (
                                <div className={styles.completeBadge}>
                                    ✓ Loop Complete
                                </div>
                            )}
                        </div>

                        {/* Status Message */}
                        <div className={`status-message ${loopState.currentPhase === 'complete' ? 'success' : ''}`}>
                            {statusMessage}
                        </div>

                        {/* Controls */}
                        <div className={styles.controlsSection}>
                            <div className={styles.typeSelector}>
                                <label className="control-label">Loop Type:</label>
                                <div className={styles.typeButtons}>
                                    <button
                                        className={`btn ${loopType === 'for' ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => { setLoopType('for'); resetState(); }}
                                        disabled={loopState.isRunning}
                                    >
                                        FOR Loop
                                    </button>
                                    <button
                                        className={`btn ${loopType === 'while' ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => { setLoopType('while'); resetState(); }}
                                        disabled={loopState.isRunning}
                                    >
                                        WHILE Loop
                                    </button>
                                </div>
                            </div>

                            <div className={styles.variableControls}>
                                <div className="control-group">
                                    <label className="control-label">Start Value:</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={startValue}
                                        onChange={(e) => setStartValue(parseInt(e.target.value) || 0)}
                                        disabled={loopState.isRunning}
                                    />
                                </div>
                                <div className="control-group">
                                    <label className="control-label">End Value:</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={endValue}
                                        onChange={(e) => setEndValue(parseInt(e.target.value) || 0)}
                                        disabled={loopState.isRunning}
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
                                        disabled={loopState.isRunning}
                                    />
                                </div>
                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={handleRun}
                                disabled={loopState.isRunning || startValue > endValue}
                                style={{ marginTop: '1rem' }}
                            >
                                {loopState.isRunning ? '⏳ Running...' : '▶ Run'}
                            </button>
                            {startValue > endValue && (
                                <div style={{ color: '#f56565', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                    Start value must be ≤ end value
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className={styles.infoPanel}>
                        <div className={styles.infoCard}>
                            <h3>About Loops</h3>
                            <p>
                                Loops allow programs to repeat code execution multiple times, making it easy to process collections or perform repetitive tasks.
                            </p>
                            <div className={styles.quickInfo}>
                                <h4>Loop Types:</h4>
                                <ul>
                                    <li><strong>FOR:</strong> Used when iteration count is known</li>
                                    <li><strong>WHILE:</strong> Used when iteration depends on a condition</li>
                                </ul>
                                <h4 style={{ marginTop: '1rem' }}>Key Concepts:</h4>
                                <ul>
                                    <li>Initialization: Set starting values</li>
                                    <li>Condition: Determines when to stop</li>
                                    <li>Body: Code to execute each iteration</li>
                                    <li>Update: Modify variables for next iteration</li>
                                </ul>
                            </div>
                        </div>

                        <div className={styles.codeCard}>
                            <div className={styles.codeHeader}>
                                <span>Pseudocode</span>
                            </div>
                            <div className="code-block">
                                {pseudocode[loopType].split('\n').map((line, index) => (
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
                <TopicNavigator currentSlug="loops" />
            </div>
        </div>
    );
}
