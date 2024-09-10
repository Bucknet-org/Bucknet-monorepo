import { join } from 'path';
import { MerkleTree } from '@bucknet/proof-generator';
import { loadFile } from './utils';
import { RawData } from './types';

export async function processData(dirPath: string, epoch: Number): Promise<string> {
    const rawData = loadFile(join(dirPath, `${epoch.toString()}.json`));
    // const leaves = rawData['wvs'].map((item: RawData) => {
    //     return `${item.member}:${item.works.toString()}`;
    // });
    // const merkleTree = new MerkleTree(leaves);
    // const merkleRoot = merkleTree.getHexRoot();

    // rawData.PoE = merkleRoot;
    // saveFile(join(dirPath, `${epoch.toString()}.json`), rawData);
    // return merkleRoot;

    //member-taskname-pow
    const leaves: string[] = []
    rawData['wvs'].map((item: RawData) => {
        Object.entries(item.works).map(([task, pow]) => {
            leaves.push(`${item.member}-${task}-${pow}`)
        })
    });

    const merkleTree = new MerkleTree(leaves)
    return merkleTree.getHexRoot()
}