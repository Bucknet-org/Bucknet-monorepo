// Setup: npm install alchemy-sdk
import { Alchemy, AlchemyConfig, TokenBalancesResponse, AssetTransfersWithMetadataResponse, OwnedBaseNftsResponse, GetBaseNftsForOwnerOptions } from "alchemy-sdk";

export class AlchemyCrawler {
    private alchemy: Alchemy

    constructor(config: AlchemyConfig) {
        this.alchemy = new Alchemy(config)
    }

    async fetchTransferHistories(this: any, fromBlock: number, fromAddressOrName: string): Promise<AssetTransfersWithMetadataResponse> {
        return await this.alchemy.core.getAssetTransfers({
            fromBlock: `0x${fromBlock.toString(16)}`,
            fromAddress: fromAddressOrName,
            excludeZeroValue: false,
            category: ["external", "internal", "erc20", "erc721", "erc1155", "specialnft"]
        })
    }

    async fetchERC20Balances(this: any, fromAddressOrName: string): Promise<TokenBalancesResponse> {
        return await this.alchemy.core.getTokenBalances(fromAddressOrName)
    }

    fetchNFTBalances(this: any, fromAddressOrName: string, options?: GetBaseNftsForOwnerOptions): Promise<OwnedBaseNftsResponse> {
        return this.alchemy.nft.getNftsForOwner(fromAddressOrName, options)
    }
}