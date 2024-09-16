import { ethers, TransactionResponse } from 'ethers';

export class EVMCrawler {
    private providers: ethers.JsonRpcProvider[];
    private currentProviderIndex: number;

    constructor(rpcUrls: string[]) {
        this.providers = rpcUrls.map((url) => new ethers.JsonRpcProvider(url));
        this.currentProviderIndex = 0;  
    }

    private getProvider(): ethers.JsonRpcProvider {
        return this.providers[this.currentProviderIndex];
    }

    private switchProvider(): void {
        this.currentProviderIndex = (this.currentProviderIndex + 1) % this.providers.length;
        console.log(`Switched to provider: ${this.getProvider()._getConnection().url}`);
    }

    // Fetch transactions from a specific block number with retry logic on failure
    async fetchTransactionsFromBlock(blockNumber: number): Promise<TransactionResponse[]> {
        try {
            console.log(`Process block: ${blockNumber}`);

            const provider = this.getProvider();
            
            const block = await provider.getBlock(blockNumber, true)
            
            if (!block) throw Error(`Failed to get block at ${blockNumber}`)
            
            const txs: TransactionResponse[] = []

            for (const txHash of block.transactions) {
                const tx = await block.getTransaction(txHash)
                if (tx) {
                    txs.push(tx)
                }
            }

            return txs
        } catch (error: any) {
            console.error(`Error fetching transactions for block ${blockNumber}:`, error.message)

            if (this.isRecoverableError(error)) {
                this.switchProvider();
                return this.fetchTransactionsFromBlock(blockNumber)
            }

            return [] as TransactionResponse[];
        }
    }

    watchNewBlocks() {
        this.getProvider().on('block', async (blockNumber) => {
            console.log(`New block received: ${blockNumber}`);
            const transactions = await this.fetchTransactionsFromBlock(blockNumber);
            console.log(transactions.length)
        });
    }

    async fetchBlocksInRange(startBlock: number, endBlock: number): Promise<void> {
        for (let i = startBlock; i <= endBlock; i++) {
            const transactions = await this.fetchTransactionsFromBlock(i);
            console.log(transactions.length)
        }
    }

    private isRecoverableError(error: any): boolean {
        const message = error.message.toLowerCase();
        return message.includes('limit') || message.includes('exceeded') || message.includes('timeout') || message.includes('connection');
    }
}
