export type HeapType = 'Min' | 'Max';

export class HeapLogic {
    heap: number[];
    type: HeapType;

    constructor(type: HeapType = 'Min') {
        this.heap = [];
        this.type = type;
    }

    clear() {
        this.heap = [];
    }

    setType(type: HeapType) {
        this.type = type;
    }

    private compare(a: number, b: number): boolean {
        if (this.type === 'Min') return a < b;
        return a > b;
    }

    *insert(value: number): Generator<{ heap: number[], highlight: number[], active: number | null }> {
        this.heap.push(value);
        let index = this.heap.length - 1;

        yield { heap: [...this.heap], highlight: [index], active: index };

        // Sift Up
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);

            yield { heap: [...this.heap], highlight: [index, parentIndex], active: index };

            if (this.compare(this.heap[index], this.heap[parentIndex])) {
                // Swap
                [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
                index = parentIndex;
                yield { heap: [...this.heap], highlight: [index], active: index };
            } else {
                break;
            }
        }

        yield { heap: [...this.heap], highlight: [], active: null };
    }

    *extract(): Generator<{ heap: number[], highlight: number[], active: number | null }> {
        if (this.heap.length === 0) return;

        const last = this.heap.pop()!;

        if (this.heap.length > 0) {
            this.heap[0] = last;
            yield { heap: [...this.heap], highlight: [0], active: 0 };
            yield* this.siftDown(0);
        } else {
            yield { heap: [], highlight: [], active: null };
        }
    }

    private *siftDown(index: number): Generator<{ heap: number[], highlight: number[], active: number | null }> {
        const length = this.heap.length;
        let element = index;

        while (true) {
            const leftChild = 2 * element + 1;
            const rightChild = 2 * element + 2;
            let swap = null;

            if (leftChild < length) {
                yield { heap: [...this.heap], highlight: [element, leftChild], active: element };

                if (this.compare(this.heap[leftChild], this.heap[element])) {
                    swap = leftChild;
                }
            }

            if (rightChild < length) {
                yield { heap: [...this.heap], highlight: [element, rightChild], active: element };

                if (
                    (swap === null && this.compare(this.heap[rightChild], this.heap[element])) ||
                    (swap !== null && this.compare(this.heap[rightChild], this.heap[leftChild]))
                ) {
                    swap = rightChild;
                }
            }

            if (swap === null) break;

            // Swap
            [this.heap[element], this.heap[swap]] = [this.heap[swap], this.heap[element]];
            yield { heap: [...this.heap], highlight: [element, swap], active: swap };

            element = swap;
        }

        yield { heap: [...this.heap], highlight: [], active: null };
    }
}
