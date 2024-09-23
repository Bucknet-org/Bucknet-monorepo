// Setup: npm install alchemy-sdk
import { Alchemy, AlchemyConfig, AssetTransfersWithMetadataResponse } from "alchemy-sdk";

export class AlchemyCrawler {
    private alchemy: Alchemy

    constructor(config: AlchemyConfig) {
        this.alchemy = new Alchemy(config)
    }

    async fetchHistory(this: any, fromBlock: number, fromAddress: string): Promise<AssetTransfersWithMetadataResponse> {
        const response = await this.alchemy.core.getAssetTransfers({
            fromBlock: `0x${fromBlock.toString(16)}`,
            fromAddress: fromAddress,
            excludeZeroValue: true,
            category: ["external", "internal", "erc20", "erc721", "erc1155", "specialnft"]
        })
        return response;
    }
}