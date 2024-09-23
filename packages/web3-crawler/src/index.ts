import { EVMCrawler } from "./evm/base/EVMCrawler";
import { AlchemyCrawler } from "./AlchemyCrawler";
import { AlchemyConfig, Network } from "alchemy-sdk";
import 'dotenv/config'

(async () => {
    // const rpcUrls = [
    //     'https://rpc.ankr.com/bsc',
    //     'https://bscrpc.com',
    //     'https://binance.nodereal.io',
    //     'https://bsc.blockpi.network/v1/rpc/public'
    // ];

    const config = {
        apiKey: process.env.API_KEY,
        network: Network.ETH_MAINNET
    }

    const crawler = new AlchemyCrawler(config as AlchemyConfig);
    
    const res = await crawler.fetchHistory(20810700,"0x974CaA59e49682CdA0AD2bbe82983419A2ECC400");
    console.log(res)
    // await crawler.fetchBlocksInRange(16000000, 16000010);
})();
