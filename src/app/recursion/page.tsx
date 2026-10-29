


'use client';

import { useState } from 'react';
import styles from './page.module.css';
import TopicNavigator from '@/components/TopicNavigator';

type RecursionType = 'factorial' | 'fibonacci';

interface CallStackFrame {
    id: number;
    depth: number;
    param: number;
    result: number | null;
    state: 'calling' | 'waiting' | 'returning';
}

interface TreeNode {
    id: number;
    param: number;
    result: number | null;
    children: TreeNode[];
    state: 'calling' | 'waiting' | 'returning' | 'complete';
    depth: number;
}

const pseudocode = {
    factorial: `FUNCTION factorial(n)
    IF n <= 1 THEN
        RETURN 1
    ELSE
        RETURN n * factorial(n - 1)
    END IF
END FUNCTION`,
    fibonacci: `FUNCTION fibonacci(n)
    IF n <= 1 THEN
        RETURN n
    ELSE
        RETURN fibonacci(n - 1) + fibonacci(n - 2)
    END IF
END FUNCTION`,
};

export default function RecursionPage() {
    const [recursionType, setRecursionType] = useState<RecursionType>('factorial');
    const [inputValue, setInputValue] = useState(4);
    const [callStack, setCallStack] = useState<CallStackFrame[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [speed, setSpeed] = useState(800);
    const [highlightedLine, setHighlightedLine] = useState(-1);
    const [statusMessage, setStatusMessage] = useState('Configure input and run to see recursive call stack in action');
    const [finalResult, setFinalResult] = useState<number | null>(null);
    const [treeRoot, setTreeRoot] = useState<TreeNode | null>(null);
    const [activeNodeId, setActiveNodeId] = useState<number | null>(null);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const resetState = () => {
        setCallStack([]);
        setHighlightedLine(-1);
        setFinalResult(null);
        setTreeRoot(null);
        setActiveNodeId(null);
    };

    const updateStack = (stack: CallStackFrame[]) => {
        setCallStack([...stack]);
    };

    const runFactorial = async () => {
        resetState();
        setIsAnimating(true);
        const stack: CallStackFrame[] = [];
        let frameId = 0;
        let root: TreeNode | null = null;
        const nodeMap = new Map<number, TreeNode>();

        const factorial = async (n: number, depth: number, parentNode: TreeNode | null = null): Promise<number> => {
            frameId++;
            const currentId = frameId;

            const currentFrame: CallStackFrame = {
                id: currentId,
                depth,
                param: n,
                result: null,
                state: 'calling',
            };

            // Create tree node
            const treeNode: TreeNode = {
                id: currentId,
                param: n,
                result: null,
                children: [],
                state: 'calling',
                depth,
            };
            nodeMap.set(currentId, treeNode);

            // Add to tree structure
            if (parentNode) {
                parentNode.children.push(treeNode);
            } else {
                root = treeNode;
                setTreeRoot(root);
            }

            // Add to stack
            stack.push(currentFrame);
            updateStack(stack);
            setActiveNodeId(currentId);
            setTreeRoot(root ? { ...root } : null);
            setHighlightedLine(0);
            setStatusMessage(`Calling factorial(${n}) - depth ${depth}`);
            await sleep(speed);

            // Check base case
            setHighlightedLine(1);
            setStatusMessage(`Checking base case: ${n} <= 1?`);
            await sleep(speed);

            if (n <= 1) {
                setHighlightedLine(2);
                currentFrame.result = 1;
                currentFrame.state = 'returning';
                treeNode.result = 1;
                treeNode.state = 'returning';
                updateStack(stack);
                setTreeRoot(root ? { ...root } : null);
                setStatusMessage(`Base case reached! factorial(${n}) = 1`);
                await sleep(speed);

                // Mark as complete
                treeNode.state = 'complete';
                setTreeRoot(root ? { ...root } : null);

                // Remove from stack
                stack.pop();
                updateStack(stack);
                setActiveNodeId(stack.length > 0 ? stack[stack.length - 1].id : null);
                return 1;
            }

            // Recursive case
            setHighlightedLine(4);
            currentFrame.state = 'waiting';
            treeNode.state = 'waiting';
            updateStack(stack);
            setTreeRoot(root ? { ...root } : null);
            setStatusMessage(`Computing: ${n} * factorial(${n - 1})`);
            await sleep(speed);

            const recursiveResult = await factorial(n - 1, depth + 1, treeNode);

            // Calculate result
            const result = n * recursiveResult;
            currentFrame.result = result;
            currentFrame.state = 'returning';
            treeNode.result = result;
            treeNode.state = 'returning';
            updateStack(stack);
            setActiveNodeId(currentId);
            setTreeRoot(root ? { ...root } : null);
            setStatusMessage(`factorial(${n}) = ${n} * ${recursiveResult} = ${result}`);
            await sleep(speed);

            // Mark as complete
            treeNode.state = 'complete';
            setTreeRoot(root ? { ...root } : null);

            // Remove from stack
            stack.pop();
            updateStack(stack);
            setActiveNodeId(stack.length > 0 ? stack[stack.length - 1].id : null);

            return result;
        };

        const result = await factorial(inputValue, 0);
        setFinalResult(result);
        setHighlightedLine(-1);
        setActiveNodeId(null);
        setStatusMessage(`Recursion complete! factorial(${inputValue}) = ${result}`);
        setIsAnimating(false);
    };

    const runFibonacci = async () => {
        resetState();
        setIsAnimating(true);
        const stack: CallStackFrame[] = [];
        let frameId = 0;
        let root: TreeNode | null = null;
        const nodeMap = new Map<number, TreeNode>();

        const fibonacci = async (n: number, depth: number, parentNode: TreeNode | null = null): Promise<number> => {
            frameId++;
            const currentId = frameId;

            const currentFrame: CallStackFrame = {
                id: currentId,
                depth,
                param: n,
                result: null,
                state: 'calling',
            };

            // Create tree node
            const treeNode: TreeNode = {
                id: currentId,
                param: n,
                result: null,
                children: [],
                state: 'calling',
                depth,
            };
            nodeMap.set(currentId, treeNode);

            // Add to tree structure
            if (parentNode) {
                parentNode.children.push(treeNode);
            } else {
                root = treeNode;
                setTreeRoot(root);
            }

            // Add to stack
            stack.push(currentFrame);
            updateStack(stack);
            setActiveNodeId(currentId);
            setTreeRoot(root ? { ...root } : null);
            setHighlightedLine(0);
            setStatusMessage(`Calling fibonacci(${n}) - depth ${depth}`);
            await sleep(speed);

            // Check base case
            setHighlightedLine(1);
            setStatusMessage(`Checking base case: ${n} <= 1?`);
            await sleep(speed);

            if (n <= 1) {
                setHighlightedLine(2);
                currentFrame.result = n;
                currentFrame.state = 'returning';
                treeNode.result = n;
                treeNode.state = 'returning';
                updateStack(stack);
                setTreeRoot(root ? { ...root } : null);
                setStatusMessage(`Base case reached! fibonacci(${n}) = ${n}`);
                await sleep(speed);

                // Mark as complete
                treeNode.state = 'complete';
                setTreeRoot(root ? { ...root } : null);

                // Remove from stack
                stack.pop();
                updateStack(stack);
                setActiveNodeId(stack.length > 0 ? stack[stack.length - 1].id : null);
                return n;
            }

            // Recursive case - first call
            setHighlightedLine(4);
            currentFrame.state = 'waiting';
            treeNode.state = 'waiting';
            updateStack(stack);
            setTreeRoot(root ? { ...root } : null);
            setStatusMessage(`Computing: fibonacci(${n - 1}) + fibonacci(${n - 2})`);
            await sleep(speed);

            const result1 = await fibonacci(n - 1, depth + 1, treeNode);
            const result2 = await fibonacci(n - 2, depth + 1, treeNode);

            // Calculate result
            const result = result1 + result2;
            currentFrame.result = result;
            currentFrame.state = 'returning';
            treeNode.result = result;
            treeNode.state = 'returning';
            updateStack(stack);
            setActiveNodeId(currentId);
            setTreeRoot(root ? { ...root } : null);
            setStatusMessage(`fibonacci(${n}) = ${result1} + ${result2} = ${result}`);
            await sleep(speed);

            // Mark as complete
            treeNode.state = 'complete';
            setTreeRoot(root ? { ...root } : null);

            // Remove from stack
            stack.pop();
            updateStack(stack);
            setActiveNodeId(stack.length > 0 ? stack[stack.length - 1].id : null);

            return result;
        };

        const result = await fibonacci(inputValue, 0);
        setFinalResult(result);
        setHighlightedLine(-1);
        setActiveNodeId(null);
        setStatusMessage(`Recursion complete! fibonacci(${inputValue}) = ${result}`);
        setIsAnimating(false);
    };

    const handleRun = () => {
        if (recursionType === 'factorial') {
            runFactorial();
        } else {
            runFibonacci();
        }
    };

    // Recursion Tree Node Component
    const RecursionTreeNode = ({ node, isActive }: { node: TreeNode; isActive: boolean }) => {
        const nodeIsActive = activeNodeId === node.id;
        const hasResult = node.result !== null;

        return (
            <div className={styles.treeNodeWrapper}>
                <div
                    className={`${styles.treeNode} ${nodeIsActive ? styles.activeNode : ''
                        } ${hasResult && !nodeIsActive ? styles.completedNode : ''
                        }`}
                >
                    <div className={styles.treeNodeContent}>
                        <div className={styles.treeNodeParam}>
                            {recursionType}({node.param})
                        </div>
                        {hasResult && (
                            <div className={styles.treeNodeResult}>
                                → {node.result}
                            </div>
                        )}
                    </div>
                </div>
                {node.children.length > 0 && (
                    <div className={styles.treeNodeChildren}>
                        {node.children.map((child) => (
                            <div key={child.id} className={styles.treeChildWrapper}>
                                <div className={styles.treeConnection} />
                                <RecursionTreeNode node={child} isActive={isActive} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={styles.page}>
            <div className="container">
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <span className={styles.headerIcon}>🔁</span>
                        <div>
                            <h1>Recursion</h1>
                            <p className={styles.headerSubtitle}>
                                Functions that call themselves to solve problems by breaking them into smaller subproblems
                            </p>
                        </div>
                    </div>
                </header>

                <div className={styles.mainGrid}>
                    <section className={styles.visualizationPanel}>
                        <div className={styles.panelHeader}>
                            <h2>Visualization</h2>
                        </div>

                        {/* Recursion Tree Visualization */}
                        {treeRoot && (
                            <div className={styles.treeVisualization}>
                                <div className={styles.stackHeader}>
                                    <h3>Recursion Tree</h3>
                                    <div className={styles.stackInfo}>
                                        Shows the hierarchical structure of recursive calls
                                    </div>
                                </div>
                                <div className={styles.treeContainer}>
                                    <div style={{ minWidth: '100%', width: 'max-content' }}>
                                        <RecursionTreeNode node={treeRoot} isActive={true} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Call Stack Visualization */}
                        <div className={styles.stackVisualization}>
                            <div className={styles.stackHeader}>
                                <h3>Call Stack</h3>
                                <div className={styles.stackInfo}>
                                    Depth: {callStack.length} {callStack.length > 0 ? `| Current: ${recursionType}(${callStack[callStack.length - 1].param})` : ''}
                                </div>
                            </div>

                            <div className={styles.stackContainer}>
                                {callStack.length === 0 ? (
                                    <div className={styles.emptyStack}>
                                        <div className={styles.emptyStackIcon}>📭</div>
                                        <div>Call stack is empty</div>
                                    </div>
                                ) : (
                                    <div className={styles.stackFrames}>
                                        {[...callStack].reverse().map((frame, index) => (
                                            <div
                                                key={frame.id}
                                                className={`${styles.stackFrame} ${styles[frame.state]}`}
                                                style={{
                                                    animationDelay: `${index * 0.1}s`,
                                                    marginLeft: `${frame.depth * 20}px`,
                                                }}
                                            >
                                                <div className={styles.frameHeader}>
                                                    <span className={styles.frameTitle}>
                                                        {recursionType}({frame.param})
                                                    </span>
                                                    <span className={styles.frameDepth}>
                                                        Depth: {frame.depth}
                                                    </span>
                                                </div>
                                                <div className={styles.frameBody}>
                                                    <div className={styles.frameParam}>
                                                        <span className={styles.paramLabel}>n =</span>
                                                        <span className={styles.paramValue}>{frame.param}</span>
                                                    </div>
                                                    {frame.result !== null && (
                                                        <div className={styles.frameResult}>
                                                            <span className={styles.resultLabel}>returns</span>
                                                            <span className={styles.resultValue}>{frame.result}</span>
                                                        </div>
                                                    )}
                                                    <div className={styles.frameState}>
                                                        {frame.state === 'calling' && '📞 Calling...'}
                                                        {frame.state === 'waiting' && '⏳ Waiting for recursive call...'}
                                                        {frame.state === 'returning' && '↩️ Returning...'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {finalResult !== null && (
                                <div className={styles.finalResult}>
                                    <span className={styles.finalLabel}>Final Result:</span>
                                    <span className={styles.finalValue}>{finalResult}</span>
                                </div>
                            )}
                        </div>

                        {/* Status Message */}
                        <div className={`status-message ${finalResult !== null ? 'success' : ''}`}>
                            {statusMessage}
                        </div>

                        {/* Controls */}
                        <div className={styles.controlsSection}>
                            <div className={styles.typeSelector}>
                                <label className="control-label">Recursion Type:</label>
                                <div className={styles.typeButtons}>
                                    <button
                                        className={`btn ${recursionType === 'factorial' ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => { setRecursionType('factorial'); resetState(); }}
                                        disabled={isAnimating}
                                    >
                                        Factorial
                                    </button>
                                    <button
                                        className={`btn ${recursionType === 'fibonacci' ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => { setRecursionType('fibonacci'); resetState(); }}
                                        disabled={isAnimating}
                                    >
                                        Fibonacci
                                    </button>
                                </div>
                            </div>

                            <div className={styles.variableControls}>
                                <div className="control-group">
                                    <label className="control-label">Input Value (n):</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={inputValue}
                                        min="0"
                                        max={recursionType === 'fibonacci' ? 6 : 8}
                                        onChange={(e) => setInputValue(parseInt(e.target.value) || 0)}
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
                                onClick={handleRun}
                                disabled={isAnimating || inputValue < 0}
                                style={{ marginTop: '1rem' }}
                            >
                                {isAnimating ? '⏳ Running...' : '▶ Run'}
                            </button>
                            <div style={{ color: '#718096', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                Recommended: Keep n ≤ {recursionType === 'fibonacci' ? '6' : '8'} for better visualization
                            </div>
                        </div>
                    </section>

                    <aside className={styles.infoPanel}>
                        <div className={styles.infoCard}>
                            <h3>About Recursion</h3>
                            <p>
                                Recursion is when a function calls itself to solve a problem by breaking it down into smaller, similar subproblems.
                            </p>
                            <div className={styles.quickInfo}>
                                <h4>Key Components:</h4>
                                <ul>
                                    <li><strong>Base Case:</strong> Condition to stop recursion</li>
                                    <li><strong>Recursive Case:</strong> Function calls itself with modified parameters</li>
                                    <li><strong>Call Stack:</strong> Tracks active function calls</li>
                                </ul>
                                <h4 style={{ marginTop: '1rem' }}>Examples:</h4>
                                <ul>
                                    <li><strong>Factorial:</strong> n! = n × (n-1)!</li>
                                    <li><strong>Fibonacci:</strong> F(n) = F(n-1) + F(n-2)</li>
                                </ul>
                                <h4 style={{ marginTop: '1rem' }}>Important:</h4>
                                <ul>
                                    <li>Always define a base case</li>
                                    <li>Ensure progress toward base case</li>
                                    <li>Watch for stack overflow with deep recursion</li>
                                </ul>
                            </div>
                        </div>

                        <div className={styles.codeCard}>
                            <div className={styles.codeHeader}>
                                <span>Pseudocode</span>
                            </div>
                            <div className="code-block">
                                {pseudocode[recursionType].split('\n').map((line, index) => (
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
                <TopicNavigator currentSlug="recursion" />
            </div>
        </div>
    );
}
