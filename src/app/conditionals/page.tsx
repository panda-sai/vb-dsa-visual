
'use client';

import { useState } from 'react';
import styles from './page.module.css';
import TopicNavigator from '@/components/TopicNavigator';

type ConditionType = 'simple' | 'if-else' | 'if-elseif-else';
type ExecutionState = 'idle' | 'evaluating' | 'executing' | 'complete';

interface Variable {
    name: string;
    value: number;
}

const pseudocode = {
    simple: `IF condition is TRUE THEN
    execute this block
END IF`,
    'if-else': `IF condition is TRUE THEN
    execute block A
ELSE
    execute block B
END IF`,
    'if-elseif-else': `IF condition1 is TRUE THEN
    execute block A
ELSE IF condition2 is TRUE THEN
    execute block B
ELSE
    execute block C
END IF`,
};

export default function ConditionalsPage() {
    const [conditionType, setConditionType] = useState<ConditionType>('simple');
    const [variable, setVariable] = useState<Variable>({ name: 'x', value: 5 });
    const [threshold, setThreshold] = useState(10);
    const [threshold2, setThreshold2] = useState(3);
    const [isAnimating, setIsAnimating] = useState(false);
    const [executionState, setExecutionState] = useState<ExecutionState>('idle');
    const [activeBlock, setActiveBlock] = useState<string | null>(null);
    const [conditionResult, setConditionResult] = useState<boolean | null>(null);
    const [condition2Result, setCondition2Result] = useState<boolean | null>(null);
    const [statusMessage, setStatusMessage] = useState('Configure variables and run to see conditional logic in action');
    const [speed, setSpeed] = useState(800);
    const [highlightedLine, setHighlightedLine] = useState(-1);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const resetState = () => {
        setExecutionState('idle');
        setActiveBlock(null);
        setConditionResult(null);
        setCondition2Result(null);
        setHighlightedLine(-1);
    };

    const runSimple = async () => {
        setIsAnimating(true);
        resetState();

        setHighlightedLine(0);
        setStatusMessage(`Evaluating: ${variable.name} > ${threshold}...`);
        setExecutionState('evaluating');
        await sleep(speed);

        const result = variable.value > threshold;
        setConditionResult(result);
        setHighlightedLine(1);
        setStatusMessage(`Condition is ${result ? 'TRUE' : 'FALSE'}`);
        await sleep(speed);

        if (result) {
            setExecutionState('executing');
            setActiveBlock('if');
            setHighlightedLine(1);
            setStatusMessage('Executing IF block');
            await sleep(speed);
        } else {
            setStatusMessage('IF block skipped (condition was FALSE)');
        }

        setHighlightedLine(2);
        setExecutionState('complete');
        setStatusMessage('Execution complete');
        setIsAnimating(false);
    };

    const runIfElse = async () => {
        setIsAnimating(true);
        resetState();

        setHighlightedLine(0);
        setStatusMessage(`Evaluating: ${variable.name} > ${threshold}...`);
        setExecutionState('evaluating');
        await sleep(speed);

        const result = variable.value > threshold;
        setConditionResult(result);
        setStatusMessage(`Condition is ${result ? 'TRUE' : 'FALSE'}`);
        await sleep(speed);

        setExecutionState('executing');
        if (result) {
            setActiveBlock('if');
            setHighlightedLine(1);
            setStatusMessage('Executing IF block (Block A)');
        } else {
            setActiveBlock('else');
            setHighlightedLine(3);
            setStatusMessage('Executing ELSE block (Block B)');
        }
        await sleep(speed);

        setHighlightedLine(4);
        setExecutionState('complete');
        setStatusMessage('Execution complete');
        setIsAnimating(false);
    };

    const runIfElseIfElse = async () => {
        setIsAnimating(true);
        resetState();

        setHighlightedLine(0);
        setStatusMessage(`Evaluating first condition: ${variable.name} > ${threshold}...`);
        setExecutionState('evaluating');
        await sleep(speed);

        const result1 = variable.value > threshold;
        setConditionResult(result1);
        setStatusMessage(`First condition is ${result1 ? 'TRUE' : 'FALSE'}`);
        await sleep(speed);

        if (result1) {
            setExecutionState('executing');
            setActiveBlock('if');
            setHighlightedLine(1);
            setStatusMessage('Executing IF block (Block A)');
            await sleep(speed);
        } else {
            setHighlightedLine(2);
            setStatusMessage(`Evaluating second condition: ${variable.name} < ${threshold2}...`);
            await sleep(speed);

            const result2 = variable.value < threshold2;
            setCondition2Result(result2);
            setStatusMessage(`Second condition is ${result2 ? 'TRUE' : 'FALSE'}`);
            await sleep(speed);

            setExecutionState('executing');
            if (result2) {
                setActiveBlock('elseif');
                setHighlightedLine(3);
                setStatusMessage('Executing ELSE IF block (Block B)');
            } else {
                setActiveBlock('else');
                setHighlightedLine(5);
                setStatusMessage('Executing ELSE block (Block C)');
            }
            await sleep(speed);
        }

        setHighlightedLine(6);
        setExecutionState('complete');
        setStatusMessage('Execution complete');
        setIsAnimating(false);
    };

    const handleRun = () => {
        switch (conditionType) {
            case 'simple':
                runSimple();
                break;
            case 'if-else':
                runIfElse();
                break;
            case 'if-elseif-else':
                runIfElseIfElse();
                break;
        }
    };

    const getConditionDisplay = () => {
        switch (conditionType) {
            case 'simple':
                return `${variable.name} > ${threshold}`;
            case 'if-else':
                return `${variable.name} > ${threshold}`;
            case 'if-elseif-else':
                return `${variable.name} > ${threshold}`;
        }
    };

    const getCondition2Display = () => {
        return `${variable.name} < ${threshold2}`;
    };

    return (
        <div className={styles.page}>
            <div className="container">
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <span className={styles.headerIcon}>🔀</span>
                        <div>
                            <h1>Conditionals</h1>
                            <p className={styles.headerSubtitle}>
                                Control program flow with if, else if, and else statements
                            </p>
                        </div>
                    </div>
                </header>

                <div className={styles.mainGrid}>
                    <section className={styles.visualizationPanel}>
                        <div className={styles.panelHeader}>
                            <h2>Visualization</h2>
                        </div>

                        {/* Flow Diagram */}
                        <div className={styles.flowDiagram}>
                            {/* Variables Display */}
                            <div className={styles.variablesBox}>
                                <strong>Variables:</strong> {variable.name} = {variable.value}
                            </div>

                            {/* Condition 1 */}
                            <div className={`${styles.conditionBox} ${executionState === 'evaluating' ? styles.evaluating : ''} ${conditionResult !== null ? (conditionResult ? styles.conditionTrue : styles.conditionFalse) : ''}`}>
                                <div className={styles.conditionLabel}>Condition</div>
                                <div className={styles.conditionText}>{getConditionDisplay()}</div>
                                {conditionResult !== null && (
                                    <div className={styles.conditionResult}>
                                        {conditionResult ? '✓ TRUE' : '✗ FALSE'}
                                    </div>
                                )}
                            </div>

                            {/* Branches */}
                            <div className={styles.branches}>
                                {/* IF Block */}
                                <div className={`${styles.branch} ${activeBlock === 'if' ? styles.active : ''}`}>
                                    <div className={styles.branchLabel}>IF (TRUE)</div>
                                    <div className={styles.branchBox}>
                                        Execute Block A
                                    </div>
                                </div>

                                {/* ELSE IF Block (only for if-elseif-else) */}
                                {conditionType === 'if-elseif-else' && (
                                    <>
                                        <div className={`${styles.conditionBox} ${styles.secondaryCondition} ${condition2Result !== null && !conditionResult ? (condition2Result ? styles.conditionTrue : styles.conditionFalse) : ''}`}>
                                            <div className={styles.conditionLabel}>ELSE IF</div>
                                            <div className={styles.conditionText}>{getCondition2Display()}</div>
                                            {condition2Result !== null && (
                                                <div className={styles.conditionResult}>
                                                    {condition2Result ? '✓ TRUE' : '✗ FALSE'}
                                                </div>
                                            )}
                                        </div>
                                        <div className={`${styles.branch} ${activeBlock === 'elseif' ? styles.active : ''}`}>
                                            <div className={styles.branchLabel}>ELSE IF (TRUE)</div>
                                            <div className={styles.branchBox}>
                                                Execute Block B
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* ELSE Block */}
                                {conditionType !== 'simple' && (
                                    <div className={`${styles.branch} ${activeBlock === 'else' ? styles.active : ''}`}>
                                        <div className={styles.branchLabel}>ELSE</div>
                                        <div className={styles.branchBox}>
                                            Execute Block {conditionType === 'if-elseif-else' ? 'C' : 'B'}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* End */}
                            <div className={`${styles.endBox} ${executionState === 'complete' ? styles.complete : ''}`}>
                                END
                            </div>
                        </div>

                        {/* Status Message */}
                        <div className={`status-message ${executionState === 'complete' ? 'success' : ''}`}>
                            {statusMessage}
                        </div>

                        {/* Controls */}
                        <div className={styles.controlsSection}>
                            <div className={styles.typeSelector}>
                                <label className="control-label">Conditional Type:</label>
                                <div className={styles.typeButtons}>
                                    <button
                                        className={`btn ${conditionType === 'simple' ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => { setConditionType('simple'); resetState(); }}
                                        disabled={isAnimating}
                                    >
                                        IF
                                    </button>
                                    <button
                                        className={`btn ${conditionType === 'if-else' ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => { setConditionType('if-else'); resetState(); }}
                                        disabled={isAnimating}
                                    >
                                        IF-ELSE
                                    </button>
                                    <button
                                        className={`btn ${conditionType === 'if-elseif-else' ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => { setConditionType('if-elseif-else'); resetState(); }}
                                        disabled={isAnimating}
                                    >
                                        IF-ELSEIF-ELSE
                                    </button>
                                </div>
                            </div>

                            <div className={styles.variableControls}>
                                <div className="control-group">
                                    <label className="control-label">Variable ({variable.name}):</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={variable.value}
                                        onChange={(e) => setVariable({ ...variable, value: parseInt(e.target.value) || 0 })}
                                        disabled={isAnimating}
                                    />
                                </div>
                                <div className="control-group">
                                    <label className="control-label">Threshold 1:</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={threshold}
                                        onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
                                        disabled={isAnimating}
                                    />
                                </div>
                                {conditionType === 'if-elseif-else' && (
                                    <div className="control-group">
                                        <label className="control-label">Threshold 2:</label>
                                        <input
                                            type="number"
                                            className="input"
                                            value={threshold2}
                                            onChange={(e) => setThreshold2(parseInt(e.target.value) || 0)}
                                            disabled={isAnimating}
                                        />
                                    </div>
                                )}
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
                                onClick={handleRun}
                                disabled={isAnimating}
                                style={{ marginTop: '1rem' }}
                            >
                                {isAnimating ? '⏳ Running...' : '▶ Run'}
                            </button>
                        </div>
                    </section>

                    <aside className={styles.infoPanel}>
                        <div className={styles.infoCard}>
                            <h3>About Conditionals</h3>
                            <p>
                                Conditionals allow programs to make decisions and execute different code paths based on conditions.
                            </p>
                            <div className={styles.quickInfo}>
                                <h4>Types:</h4>
                                <ul>
                                    <li><strong>IF:</strong> Execute code only if condition is true</li>
                                    <li><strong>IF-ELSE:</strong> Execute one of two blocks</li>
                                    <li><strong>IF-ELSEIF-ELSE:</strong> Check multiple conditions</li>
                                </ul>
                            </div>
                        </div>

                        <div className={styles.codeCard}>
                            <div className={styles.codeHeader}>
                                <span>Pseudocode</span>
                            </div>
                            <div className="code-block">
                                {pseudocode[conditionType].split('\n').map((line, index) => (
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
                <TopicNavigator currentSlug="conditionals" />
            </div>
        </div>
    );
}
