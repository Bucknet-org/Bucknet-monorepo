import { keccak256, bufferToHex } from "ethereumjs-util";
import { IMerkleTree } from "../interface/IMerkleTree";

export class MerkleTree implements IMerkleTree {
    private leaves: Buffer[];
    private leavesPositions: { [leaveHash in string]: number };
    private layers: Buffer[][];

    constructor(leaves: string[]) {
        this.leaves = leaves.map(leaf => Buffer.from(leaf)).map(leaf => this.hash(leaf));
        this.leavesPositions = this.leaves.reduce<{ [hexElement: string]: number }>((memo, el, index) => {
            memo[bufferToHex(el)] = index
            return memo
          }, {})
        this.layers = this.buildTree(this.leaves);
    }

    private hash(data: Buffer): Buffer {
        return keccak256(data);
    }

    private buildTree(leaves: Buffer[]): Buffer[][] {
        if (leaves.length === 0) {
            throw new Error('At least one leaf is required to build a Merkle Tree');
        }

        const layers: Buffer[][] = [];
        layers.push(leaves);

        while (layers[layers.length - 1].length > 1) {
            layers.push(this.createNextLayer(layers[layers.length - 1]));
        }

        return layers;
    }

    private createNextLayer(leaves: Buffer[]): Buffer[] {
        const nextLayer: Buffer[] = [];

        for (let i = 0; i < leaves.length; i += 2) {
            nextLayer.push(MerkleTree.combinedHash(leaves[i], leaves[i + 1]));
        }

        return nextLayer;
    }

    public getRoot(): Buffer {
        return this.layers[this.layers.length - 1][0];
    }

    public getHexRoot(): string {
        return bufferToHex(this.getRoot())
    }

    public getProof(leaf: string): Buffer[] {
        const index = this.getLeaveIndex(leaf)

        if (index === undefined) {
            throw new Error('Leaf not found in tree');
        }

        return this.buildProof(index);
    }

    public getHexProof(leave: string): string[] {
        const proof = this.getProof(leave)
        return MerkleTree.bufArrToHexArr(proof)
    }

    public getLeaveIndex(leaf: string): number | undefined {
        const leafHash = bufferToHex(this.hash(Buffer.from(leaf)))
        return this.leavesPositions[leafHash]
    }

    private buildProof(index: number): Buffer[] {
        const proof: Buffer[] = [];

        for (let i = 0; i < this.layers.length - 1; i++) {
            const layer = this.layers[i];
            const isRightNode = index % 2 === 1;
            const pairIndex = isRightNode ? index - 1 : index + 1;

            if (pairIndex < layer.length) {
                proof.push(layer[pairIndex]);
            }

            index = Math.floor(index / 2);
        }

        return proof;
    }

    public verifyProof(leaf: string, proof: Buffer[], root: Buffer): boolean {
        let hash = keccak256(Buffer.from(leaf));
        for (const proofElement of proof) {
            hash = MerkleTree.combinedHash(hash, proofElement)
        }

        return hash.equals(root);
    }

    static combinedHash(first: Buffer, second: Buffer): Buffer {
        if (!first) {
            return second
        }
        if (!second) {
            return first
        }

        return keccak256(MerkleTree.sortAndConcat(first, second))
    }

    private static sortAndConcat(...args: Buffer[]): Buffer {
        return Buffer.concat([...args].sort(Buffer.compare))
    }

    private static bufArrToHexArr(arr: Buffer[]): string[] {
        if (arr.some((el) => !Buffer.isBuffer(el))) {
          throw new Error('Array is not an array of buffers')
        }
        return arr.map((el) => '0x' + el.toString('hex'))
    }
}