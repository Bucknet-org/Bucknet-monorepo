import { EVMCrawler } from "./evm/base/EVMCrawler";
import { AlchemyCrawler } from "./AlchemyCrawler";
import { AlchemyConfig, Network } from "alchemy-sdk";
import 'dotenv/config'
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';

const saveFile = (path: string, data: any): void => {
    const dirPath = join(path, '..');
    if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
    }
    writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Data written to ${path}`);
}

const writeOrAppendToFile = (path: string, data: any) => {
    try {
        let existingData: any[] = [];
        
        if (existsSync(path)) {
            const fileContents = readFileSync(path, 'utf-8');
            existingData = JSON.parse(fileContents);
        } 
        
        existingData.push(data);

        writeFileSync(path, JSON.stringify(existingData, null, 2), 'utf-8');
    } catch (err) {
        console.error('Error appending to file:', err);
        if (err instanceof SyntaxError) {
            console.error('File contents are not valid JSON. Initializing a new file.');
            writeFileSync(path, JSON.stringify([data], null, 2), 'utf-8');
        }
    }
};

const fetchAllNFTBalances = async (crawler: any, path: string, address: string, pageKey?: string) => {
    const res = await crawler.fetchNFTBalances(address, { pageKey });
    writeOrAppendToFile(path, res);
    if (res.pageKey) {
        await fetchAllNFTBalances(crawler, path, address, res.pageKey);
    }
};

(async () => {
    const testDir = join(__dirname, 'test');

    const config = {
        apiKey: process.env.API_KEY,
        network: Network.ETH_MAINNET
    }

    const crawler = new AlchemyCrawler(config as AlchemyConfig)

    const res1 = await crawler.fetchTransferHistories(20793747,"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
    saveFile(join(testDir, "testAddressHistory.json"), res1);

    const res2 = await crawler.fetchTransferHistories(20793747, "vitalik.eth")
    saveFile(join(testDir, "testENSHistory.json"), res2);

    const res3 = await crawler.fetchTransferHistories(0, "vitalik.eth")
    saveFile(join(testDir, "testHistoryFromGenesisBlock.json"), res3);

    const bal1 = await crawler.fetchERC20Balances("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
    saveFile(join(testDir, "testAddressTokenBalances.json"), bal1);

    const bal2 = await crawler.fetchERC20Balances("vitalik.eth");
    saveFile(join(testDir, "testENSTokenBalances.json"), bal2);

    // TODO: fix this
    fetchAllNFTBalances(crawler, join(testDir, "testFetchAllNFTBalances.json"), 'vitalik.eth')
        .then(() => console.log('All NFT balances fetched successfully.'))
        .catch(err => console.error('Error fetching NFT balances:', err));
})();





