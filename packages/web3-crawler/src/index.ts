import { EVMCrawler } from "./evm/base/EVMCrawler";

(async () => {
    const rpcUrls = [
        'https://rpc.ankr.com/bsc',
        'https://bscrpc.com',
        'https://binance.nodereal.io',
        'https://bsc.blockpi.network/v1/rpc/public'
    ];

    const crawler = new EVMCrawler(rpcUrls);
    
    crawler.watchNewBlocks();

    // await crawler.fetchBlocksInRange(16000000, 16000010);
})();
