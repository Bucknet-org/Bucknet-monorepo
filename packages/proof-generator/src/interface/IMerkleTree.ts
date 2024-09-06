export interface IMerkleTree {
    /**
     * Gets the root of the Merkle Tree.
     * @returns The root of the tree as a Buffer.
     */
    getRoot(): Buffer;

    /**
     * Gets the root of the Merkle Tree as a hexadecimal string.
     * @returns The root of the tree as a hexadecimal string.
     */
    getHexRoot(): string;

    /**
     * Gets the proof for a given leaf.
     * @param leaf - The leaf to generate a proof for.
     * @returns An array of Buffers representing the proof.
     */
    getProof(leaf: string): Buffer[];

    /**
     * Gets the proof for a given leaf as an array of hexadecimal strings.
     * @param leaf - The leaf to generate a proof for.
     * @returns An array of hexadecimal strings representing the proof.
     */
    getHexProof(leaf: string): string[];

    /**
     * Gets the index of a leaf in the leaves array.
     * @param leaf - The leaf to find the index for.
     * @returns The index of the leaf or undefined if the leaf is not found.
     */
    getLeaveIndex(leaf: string): number | undefined;

    /**
     * Verifies a proof against a root.
     * @param leaf - The leaf to verify.
     * @param proof - The proof array to verify.
     * @param root - The root of the Merkle Tree.
     * @returns True if the proof is valid, false otherwise.
     */
    verifyProof(leaf: string, proof: Buffer[], root: Buffer): boolean;
}
