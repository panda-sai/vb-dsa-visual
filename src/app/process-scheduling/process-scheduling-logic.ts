export interface ProcessInput {
    id: string;
    arrivalTime: number;
    burstTime: number;
}

export interface GanttSegment {
    id: string;
    start: number;
    end: number;
    kind: 'process' | 'idle';
}

export interface ProcessResult {
    id: string;
    arrivalTime: number;
    burstTime: number;
    startTime: number;
    completionTime: number;
    turnaroundTime: number;
    waitingTime: number;
}

export interface FcfsSchedule {
    segments: GanttSegment[];
    results: ProcessResult[];
    totalTime: number;
}

export function calculateFcfsSchedule(processes: ProcessInput[]): FcfsSchedule {
    const orderedProcesses = processes
        .map((process, index) => ({ ...process, originalOrder: index }))
        .sort((a, b) => a.arrivalTime - b.arrivalTime || a.originalOrder - b.originalOrder);

    const segments: GanttSegment[] = [];
    const results: ProcessResult[] = [];
    let currentTime = 0;

    for (const process of orderedProcesses) {
        if (process.arrivalTime > currentTime) {
            segments.push({
                id: 'IDLE',
                start: currentTime,
                end: process.arrivalTime,
                kind: 'idle',
            });
            currentTime = process.arrivalTime;
        }

        const startTime = currentTime;
        const completionTime = startTime + process.burstTime;
        const turnaroundTime = completionTime - process.arrivalTime;
        const waitingTime = turnaroundTime - process.burstTime;

        segments.push({
            id: process.id,
            start: startTime,
            end: completionTime,
            kind: 'process',
        });
        results.push({
            id: process.id,
            arrivalTime: process.arrivalTime,
            burstTime: process.burstTime,
            startTime,
            completionTime,
            turnaroundTime,
            waitingTime,
        });

        currentTime = completionTime;
    }

    return { segments, results, totalTime: currentTime };
}
