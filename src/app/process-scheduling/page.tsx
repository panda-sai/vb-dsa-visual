'use client';

import { useState } from 'react';
import TopicNavigator from '@/components/TopicNavigator';
import styles from './page.module.css';
import {
    calculateFcfsSchedule,
    type FcfsSchedule,
    type ProcessInput,
} from './process-scheduling-logic';

const DEFAULT_PROCESSES: ProcessInput[] = [
    { id: 'P1', arrivalTime: 0, burstTime: 4 },
    { id: 'P2', arrivalTime: 1, burstTime: 3 },
    { id: 'P3', arrivalTime: 2, burstTime: 2 },
];

const codeLines = [
    'processes.sort((a, b) => a.arrivalTime - b.arrivalTime);',
    'let currentTime = 0;',
    'for (const process of processes) {',
    '  if (currentTime < process.arrivalTime) {',
    '    currentTime = process.arrivalTime;',
    '  }',
    '  const startTime = currentTime;',
    '  currentTime += process.burstTime;',
    '  const completionTime = currentTime;',
    '}',
];

export default function ProcessSchedulingPage() {
    const [processes, setProcesses] = useState<ProcessInput[]>(DEFAULT_PROCESSES);
    const [nextProcessNumber, setNextProcessNumber] = useState(4);
    const [schedule, setSchedule] = useState<FcfsSchedule | null>(null);
    const [visibleSegments, setVisibleSegments] = useState<FcfsSchedule['segments']>([]);
    const [showResults, setShowResults] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [highlightedLine, setHighlightedLine] = useState(-1);
    const [statusMessage, setStatusMessage] = useState('Edit the processes, then run FCFS to build the Gantt chart.');
    const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const clearPreviousRun = () => {
        setSchedule(null);
        setVisibleSegments([]);
        setShowResults(false);
        setHighlightedLine(-1);
    };

    const updateProcess = (id: string, field: 'arrivalTime' | 'burstTime', value: string) => {
        const parsedValue = value === '' ? 0 : Number(value);
        if (!Number.isInteger(parsedValue) || parsedValue < 0) return;

        setProcesses(current => current.map(process =>
            process.id === id ? { ...process, [field]: parsedValue } : process
        ));
        clearPreviousRun();
        setStatusMessage('Process details updated. Run FCFS to refresh the schedule.');
        setStatusType('info');
    };

    const handleAddProcess = () => {
        if (processes.length >= 8) return;
        const id = `P${nextProcessNumber}`;
        setProcesses(current => [...current, { id, arrivalTime: 0, burstTime: 2 }]);
        setNextProcessNumber(current => current + 1);
        clearPreviousRun();
        setStatusMessage(`${id} added. Set its arrival and burst times.`);
        setStatusType('info');
    };

    const handleRemoveProcess = (id: string) => {
        if (processes.length <= 1 || isAnimating) return;
        setProcesses(current => current.filter(process => process.id !== id));
        clearPreviousRun();
        setStatusMessage(`${id} removed from the process list.`);
        setStatusType('info');
    };

    const handleReset = () => {
        setProcesses(DEFAULT_PROCESSES);
        setNextProcessNumber(4);
        clearPreviousRun();
        setStatusMessage('Restored the default process set.');
        setStatusType('info');
    };

    const handleRun = async () => {
        const invalidProcess = processes.find(process =>
            !Number.isInteger(process.arrivalTime) ||
            !Number.isInteger(process.burstTime) ||
            process.arrivalTime < 0 ||
            process.burstTime <= 0
        );

        if (invalidProcess) {
            setStatusMessage(`${invalidProcess.id} must have an arrival time of 0 or more and a burst time greater than 0.`);
            setStatusType('error');
            return;
        }

        const result = calculateFcfsSchedule(processes);
        setSchedule(result);
        setVisibleSegments([]);
        setShowResults(false);
        setIsAnimating(true);
        setStatusType('info');
        setStatusMessage('CPU is scheduling processes in arrival order...');

        for (const segment of result.segments) {
            setHighlightedLine(segment.kind === 'idle' ? 3 : 6);
            await sleep(550);
            setVisibleSegments(current => [...current, segment]);
            if (segment.kind === 'process') {
                setHighlightedLine(7);
                await sleep(250);
                setHighlightedLine(8);
            }
        }

        setHighlightedLine(-1);
        setShowResults(true);
        setIsAnimating(false);
        setStatusMessage('FCFS scheduling complete. Review the Gantt chart and process metrics below.');
        setStatusType('success');
    };

    const averageWaitingTime = schedule
        ? schedule.results.reduce((total, process) => total + process.waitingTime, 0) / schedule.results.length
        : 0;
    const averageTurnaroundTime = schedule
        ? schedule.results.reduce((total, process) => total + process.turnaroundTime, 0) / schedule.results.length
        : 0;

    return (
        <main className={styles.page}>
            <div className="container">
                <header className={styles.header}>
                    <div className={styles.headerIcon} aria-hidden="true">🖥️</div>
                    <div>
                        <p className={styles.eyebrow}>Operating Systems</p>
                        <h1>Process Scheduling</h1>
                        <p className={styles.subtitle}>
                            See how the CPU runs processes using First-Come, First-Served scheduling.
                        </p>
                    </div>
                </header>

                <div className={styles.contentGrid}>
                    <section className={styles.mainPanel}>
                        <div className={styles.sectionHeading}>
                            <div>
                                <h2>Process queue</h2>
                                <p>Arrival time and burst time are measured in time units.</p>
                            </div>
                            <span className={styles.count}>{processes.length}/8 processes</span>
                        </div>

                        <div className={styles.processTableWrap}>
                            <table className={styles.processTable}>
                                <thead>
                                    <tr>
                                        <th scope="col">Process</th>
                                        <th scope="col">Arrival time</th>
                                        <th scope="col">Burst time</th>
                                        <th scope="col"><span className={styles.srOnly}>Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {processes.map(process => (
                                        <tr key={process.id}>
                                            <th scope="row"><span className={styles.processId}>{process.id}</span></th>
                                            <td>
                                                <input
                                                    aria-label={`${process.id} arrival time`}
                                                    className={styles.numberInput}
                                                    type="number"
                                                    min="0"
                                                    step="1"
                                                    value={process.arrivalTime}
                                                    disabled={isAnimating}
                                                    onChange={event => updateProcess(process.id, 'arrivalTime', event.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    aria-label={`${process.id} burst time`}
                                                    className={styles.numberInput}
                                                    type="number"
                                                    min="1"
                                                    step="1"
                                                    value={process.burstTime}
                                                    disabled={isAnimating}
                                                    onChange={event => updateProcess(process.id, 'burstTime', event.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    className={styles.removeButton}
                                                    type="button"
                                                    aria-label={`Remove ${process.id}`}
                                                    disabled={isAnimating || processes.length === 1}
                                                    onClick={() => handleRemoveProcess(process.id)}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className={styles.actions}>
                            <button
                                className="btn btn-secondary"
                                type="button"
                                onClick={handleAddProcess}
                                disabled={isAnimating || processes.length >= 8}
                            >
                                + Add process
                            </button>
                            <div className={styles.primaryActions}>
                                <button className="btn btn-secondary" type="button" onClick={handleReset} disabled={isAnimating}>
                                    Reset
                                </button>
                                <button className="btn btn-primary" type="button" onClick={handleRun} disabled={isAnimating}>
                                    {isAnimating ? 'Scheduling…' : '▶ Run FCFS'}
                                </button>
                            </div>
                        </div>

                        <div className={`status-message ${statusType === 'success' ? 'success' : statusType === 'error' ? 'error' : ''}`} role="status" aria-live="polite">
                            {statusMessage}
                        </div>

                        <section className={styles.ganttSection} aria-labelledby="gantt-heading">
                            <div className={styles.sectionHeading}>
                                <div>
                                    <h2 id="gantt-heading">Gantt chart</h2>
                                    <p>{schedule ? `CPU timeline · ${schedule.totalTime} time units` : 'The execution timeline will appear here.'}</p>
                                </div>
                                {isAnimating && <span className={styles.running}>CPU running</span>}
                            </div>

                            {visibleSegments.length > 0 ? (
                                <div className={styles.ganttScroll}>
                                    <div className={styles.ganttTrack} aria-label="FCFS CPU execution timeline">
                                        {visibleSegments.map((segment, index) => (
                                            <div
                                                key={`${segment.id}-${segment.start}-${index}`}
                                                className={`${styles.ganttSegment} ${segment.kind === 'idle' ? styles.idleSegment : styles.processSegment}`}
                                                style={{ flexGrow: segment.end - segment.start }}
                                                title={`${segment.id}: ${segment.start} to ${segment.end}`}
                                            >
                                                <strong>{segment.id}</strong>
                                                <span>{segment.start}–{segment.end}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.timelineCaption}>
                                        <span>0</span>
                                        <span>Time (units)</span>
                                        <span>{visibleSegments[visibleSegments.length - 1].end}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.emptyChart}>
                                    <span aria-hidden="true">▰</span>
                                    <p>Run the algorithm to watch each process take its turn on the CPU.</p>
                                </div>
                            )}
                        </section>

                        {showResults && schedule && (
                            <section className={styles.resultsSection} aria-labelledby="results-heading">
                                <div className={styles.sectionHeading}>
                                    <div>
                                        <h2 id="results-heading">Scheduling results</h2>
                                        <p>Processes are listed in the order they were executed.</p>
                                    </div>
                                </div>
                                <div className={styles.resultsTableWrap}>
                                    <table className={styles.resultsTable}>
                                        <thead>
                                            <tr>
                                                <th scope="col">Process</th>
                                                <th scope="col">CT</th>
                                                <th scope="col">TAT</th>
                                                <th scope="col">WT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schedule.results.map(process => (
                                                <tr key={process.id}>
                                                    <th scope="row">{process.id}</th>
                                                    <td>{process.completionTime}</td>
                                                    <td>{process.turnaroundTime}</td>
                                                    <td>{process.waitingTime}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className={styles.averageCards}>
                                    <div className={styles.averageCard}>
                                        <span>Average turnaround time</span>
                                        <strong>{averageTurnaroundTime.toFixed(2)}</strong>
                                    </div>
                                    <div className={styles.averageCard}>
                                        <span>Average waiting time</span>
                                        <strong>{averageWaitingTime.toFixed(2)}</strong>
                                    </div>
                                </div>
                                <p className={styles.formulaNote}>
                                    CT = Completion Time · TAT = CT − Arrival Time · WT = TAT − Burst Time
                                </p>
                            </section>
                        )}
                    </section>

                    <aside className={styles.infoPanel}>
                        <section className={styles.infoCard}>
                            <h2>How FCFS works</h2>
                            <p>
                                First-Come, First-Served is a non-preemptive scheduling algorithm.
                                The process that arrives first gets the CPU first and keeps it until it finishes.
                            </p>
                            <ul>
                                <li>Processes are ordered by arrival time.</li>
                                <li>If the CPU has no process to run, it stays idle.</li>
                                <li>Once a process starts, it runs to completion.</li>
                            </ul>
                            <div className={styles.complexity}>Scheduling: O(n log n)</div>
                        </section>

                        <section className={styles.codeCard}>
                            <div className={styles.codeHeader}>FCFS · Pseudocode</div>
                            <div className={styles.codeBlock}>
                                {codeLines.map((line, index) => (
                                    <div
                                        key={index}
                                        className={`${styles.codeLine} ${highlightedLine === index ? styles.activeCodeLine : ''}`}
                                    >
                                        <span className={styles.lineNumber}>{index + 1}</span>
                                        <code>{line}</code>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className={styles.infoCard}>
                            <h2>Key terms</h2>
                            <dl className={styles.terms}>
                                <div><dt>Arrival Time (AT)</dt><dd>When a process enters the ready queue.</dd></div>
                                <div><dt>Burst Time (BT)</dt><dd>How long the process needs the CPU.</dd></div>
                                <div><dt>Completion Time (CT)</dt><dd>When the process finishes execution.</dd></div>
                                <div><dt>Turnaround Time (TAT)</dt><dd>Total time from arrival to completion.</dd></div>
                                <div><dt>Waiting Time (WT)</dt><dd>Time spent waiting in the ready queue.</dd></div>
                            </dl>
                        </section>
                    </aside>
                </div>

                <TopicNavigator currentSlug="process-scheduling" />
            </div>
        </main>
    );
}
