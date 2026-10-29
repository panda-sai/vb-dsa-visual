export class TreeNode {
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;
    height: number;
    x: number;
    y: number;
    id: string;

    constructor(value: number) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
        this.x = 0;
        this.y = 0;
        this.id = Math.random().toString(36).substr(2, 9);
    }
}

export type TreeType = 'BST' | 'AVL';
export type TraversalType = 'inorder' | 'preorder' | 'postorder' | 'bfs';

export class TreeLogic {
    root: TreeNode | null;

    constructor() {
        this.root = null;
    }

    clear() {
        this.root = null;
    }

    // --- Helper Methods ---

    getHeight(node: TreeNode | null): number {
        return node ? node.height : 0;
    }

    getBalance(node: TreeNode | null): number {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }

    updateHeight(node: TreeNode): void {
        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    }

    // --- Rotations (AVL) ---

    rightRotate(y: TreeNode): TreeNode {
        const x = y.left!;
        const T2 = x.right;

        // Perform rotation
        x.right = y;
        y.left = T2;

        // Update heights
        this.updateHeight(y);
        this.updateHeight(x);

        return x;
    }

    leftRotate(x: TreeNode): TreeNode {
        const y = x.right!;
        const T2 = y.left;

        // Perform rotation
        y.left = x;
        x.right = T2;

        // Update heights
        this.updateHeight(x);
        this.updateHeight(y);

        return y;
    }

    // --- Insert ---

    insert(value: number, type: TreeType): void {
        this.root = this._insert(this.root, value, type);
        this.recalculatePositions();
    }

    private _insert(node: TreeNode | null, value: number, type: TreeType): TreeNode {
        // 1. Perform the normal BST insertion
        if (!node) return new TreeNode(value);

        if (value < node.value) {
            node.left = this._insert(node.left, value, type);
        } else if (value > node.value) {
            node.right = this._insert(node.right, value, type);
        } else {
            return node; // Duplicate values not allowed
        }

        // 2. Update height of this ancestor node
        this.updateHeight(node);

        // 3. If BST, return here (no balancing)
        if (type === 'BST') return node;

        // 4. Get the balance factor
        const balance = this.getBalance(node);

        // 5. If unbalanced, then there are 4 cases

        // Left Left Case
        if (balance > 1 && value < node.left!.value) {
            return this.rightRotate(node);
        }

        // Right Right Case
        if (balance < -1 && value > node.right!.value) {
            return this.leftRotate(node);
        }

        // Left Right Case
        if (balance > 1 && value > node.left!.value) {
            node.left = this.leftRotate(node.left!);
            return this.rightRotate(node);
        }

        // Right Left Case
        if (balance < -1 && value < node.right!.value) {
            node.right = this.rightRotate(node.right!);
            return this.leftRotate(node);
        }

        return node;
    }

    // --- Delete ---

    delete(value: number, type: TreeType): void {
        this.root = this._delete(this.root, value, type);
        this.recalculatePositions();
    }

    private _delete(node: TreeNode | null, value: number, type: TreeType): TreeNode | null {
        if (!node) return null;

        if (value < node.value) {
            node.left = this._delete(node.left, value, type);
        } else if (value > node.value) {
            node.right = this._delete(node.right, value, type);
        } else {
            // node with only one child or no child
            if (!node.left || !node.right) {
                const temp = node.left ? node.left : node.right;
                if (!temp) {
                    // No child case
                    node = null;
                } else {
                    // One child case
                    node = temp;
                }
            } else {
                // node with two children: Get the inorder successor (smallest in the right subtree)
                const temp = this.minValueNode(node.right);
                node.value = temp.value;
                // Delete the inorder successor
                node.right = this._delete(node.right, temp.value, type);
            }
        }

        if (!node) return null;

        // Update height
        this.updateHeight(node);

        // If BST, return here
        if (type === 'BST') return node;

        // Balance the tree
        const balance = this.getBalance(node);

        // Left Left Case
        if (balance > 1 && this.getBalance(node.left) >= 0) {
            return this.rightRotate(node);
        }

        // Left Right Case
        if (balance > 1 && this.getBalance(node.left) < 0) {
            node.left = this.leftRotate(node.left!);
            return this.rightRotate(node);
        }

        // Right Right Case
        if (balance < -1 && this.getBalance(node.right) <= 0) {
            return this.leftRotate(node);
        }

        // Right Left Case
        if (balance < -1 && this.getBalance(node.right) > 0) {
            node.right = this.rightRotate(node.right!);
            return this.leftRotate(node);
        }

        return node;
    }

    minValueNode(node: TreeNode): TreeNode {
        let current = node;
        while (current.left) {
            current = current.left;
        }
        return current;
    }

    // --- Search ---

    search(value: number): boolean {
        let current = this.root;
        while (current) {
            if (value === current.value) return true;
            if (value < current.value) current = current.left;
            else current = current.right;
        }
        return false;
    }

    // --- Traversal Generators ---

    *traverse(type: TraversalType): Generator<number> {
        if (!this.root) return;

        if (type === 'bfs') {
            const queue = [this.root];
            while (queue.length > 0) {
                const node = queue.shift()!;
                yield node.value;
                if (node.left) queue.push(node.left);
                if (node.right) queue.push(node.right);
            }
        } else {
            yield* this._dfs(this.root, type);
        }
    }

    private *_dfs(node: TreeNode | null, type: TraversalType): Generator<number> {
        if (!node) return;

        if (type === 'preorder') {
            yield node.value;
            yield* this._dfs(node.left, type);
            yield* this._dfs(node.right, type);
        } else if (type === 'inorder') {
            yield* this._dfs(node.left, type);
            yield node.value;
            yield* this._dfs(node.right, type);
        } else if (type === 'postorder') {
            yield* this._dfs(node.left, type);
            yield* this._dfs(node.right, type);
            yield node.value;
        }
    }

    // --- Layout Calculation ---

    recalculatePositions(): void {
        if (!this.root) return;
        // Simple layout: Width based
        // Root at 50% width.
        // Level 1: +/- 25%
        // Level 2: +/- 12.5%
        // etc.
        // Or fixed pixel offsets that halve each level.

        // Let's use a fixed canvas coordinate system.
        // Center x = 0.
        // We can map this to SVG viewbox later.

        this._calculateNodePosition(this.root, 0, 0, 200);
    }

    private _calculateNodePosition(node: TreeNode | null, x: number, y: number, offset: number): void {
        if (!node) return;
        node.x = x;
        node.y = y;

        this._calculateNodePosition(node.left, x - offset, y + 60, offset / 2);
        this._calculateNodePosition(node.right, x + offset, y + 60, offset / 2);
    }
}
