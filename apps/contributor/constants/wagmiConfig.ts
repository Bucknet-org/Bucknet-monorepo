import { http, createConfig } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [bscTestnet],
  connectors: [
    metaMask()
  ],
  transports: {
    [bscTestnet.id]: http(),
  },
})