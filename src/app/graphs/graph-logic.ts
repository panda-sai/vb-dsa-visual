export interface GraphNode {
    id: string;
    x: number;
    y: number;
    value: string;
}

export interface GraphEdge {
    id: string;
    sourceId: string;
    targetId: string;
}

export type GraphMode = 'add-node' | 'add-edge' | 'move' | 'run-bfs' | 'run-dfs';

export class GraphLogic {
    nodes: GraphNode[];
    edges: GraphEdge[];
    isDirected: boolean;
    private nodeCounter: number = 0;
    private edgeCounter: number = 0;

    constructor() {
        this.nodes = [];
        this.edges = [];
        this.isDirected = false;
    }

    addNode(x: number, y: number, value?: string): GraphNode {
        const id = `node-${++this.nodeCounter}`;
        const newNode: GraphNode = {
            id,
            x,
            y,
            value: value || (this.nodes.length).toString()
        };
        this.nodes.push(newNode);
        return newNode;
    }

    addEdge(sourceId: string, targetId: string): void {
        // Prevent duplicate edges
        const exists = this.edges.some(e =>
            (e.sourceId === sourceId && e.targetId === targetId) ||
            (!this.isDirected && e.sourceId === targetId && e.targetId === sourceId)
        );

        if (!exists && sourceId !== targetId) {
            this.edges.push({
                id: `${sourceId}-${targetId}`,
                sourceId,
                targetId
            });
        }
    }

    getAdjacencyList(): Map<string, string[]> {
        const adj = new Map<string, string[]>();
        this.nodes.forEach(n => adj.set(n.id, []));

        this.edges.forEach(e => {
            adj.get(e.sourceId)?.push(e.targetId);
            if (!this.isDirected) {
                adj.get(e.targetId)?.push(e.sourceId);
            }
        });

        // Sort neighbors for consistent traversal order (optional but good for visuals)
        adj.forEach(neighbors => neighbors.sort());

        return adj;
    }

    *bfs(startNodeId: string): Generator<string> {
        const adj = this.getAdjacencyList();
        const visited = new Set<string>();
        const queue = [startNodeId];

        visited.add(startNodeId);

        while (queue.length > 0) {
            const nodeId = queue.shift()!;
            yield nodeId;

            const neighbors = adj.get(nodeId) || [];
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }
    }

    *dfs(startNodeId: string): Generator<string> {
        const adj = this.getAdjacencyList();
        const visited = new Set<string>();

        yield* this._dfsRecursive(startNodeId, adj, visited);
    }

    private *_dfsRecursive(nodeId: string, adj: Map<string, string[]>, visited: Set<string>): Generator<string> {
        visited.add(nodeId);
        yield nodeId;

        const neighbors = adj.get(nodeId) || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                yield* this._dfsRecursive(neighbor, adj, visited);
            }
        }
    }

    clear(): void {
        this.nodes = [];
        this.edges = [];
    }
}
