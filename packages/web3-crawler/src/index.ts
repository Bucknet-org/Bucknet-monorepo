import { EVMCrawler } from "./evm/base/EVMCrawler";
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { TransactionResponse } from "ethers";

const saveFile = (path: string, data: any): void => {
    const dirPath = join(path, '..');
    if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
    }
    writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Data written to ${path}`);
}

const filterSample = (path: string, filterAddress: string): TransactionResponse[] => {
    if (!existsSync(path)) return [] as TransactionResponse[];

    const txsFiltered: TransactionResponse[] = []
    const raw = JSON.parse(readFileSync(path, 'utf-8')) as {[block: string]: TransactionResponse[]}

    Object.values(raw).flatMap((txs: TransactionResponse[]) => 
        txs.filter(tx => tx.from === filterAddress)
    ).forEach(tx => txsFiltered.push(tx));
    
    return txsFiltered;
}

(async () => {
    const testDir = join(__dirname, 'test');
    const crawler = new EVMCrawler(["https://ethereum-rpc.publicnode.com","https://rpc.graffiti.farm", "https://rpc.mevblocker.io/fullprivacy"]);
    const res = await crawler.fetchBlocksInRange(20824880, 20824890);
    saveFile(join(testDir, "test.json"), res);

    const filterAddress = "0xA9a01bDB8b9B600F321c1a70CcE9BB9D756C724f"
    const filterRes = filterSample(join(testDir, "test.json"), filterAddress);
    saveFile(join(testDir, `${filterAddress}.json`), filterRes);
    console.log("Txs match length: ", filterRes.length)
})();





