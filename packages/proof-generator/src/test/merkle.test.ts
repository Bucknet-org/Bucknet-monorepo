import { MerkleTree} from "../base/MerkleTree"

describe("Merkle Tree", () => {
    it("Should build and verify even tree success", () => {
        const leaves = ['a', 'b', 'c', 'd'];
        const merkleTree = new MerkleTree(leaves);
        const leaf = 'a';
        const proof = merkleTree.getProof(leaf);

        const isValid = merkleTree.verifyProof(leaf, proof, merkleTree.getRoot());
        expect(isValid).toEqual(true)
    })

    it("Should build and verify odd tree success", () => {
        const leaves = ['a', 'b', 'c', 'd', 'e'];
        const merkleTree = new MerkleTree(leaves);
        const leaf = 'e';
        const proof = merkleTree.getProof(leaf);

        const isValid = merkleTree.verifyProof(leaf, proof, merkleTree.getRoot());
        expect(isValid).toEqual(true)
    })
})