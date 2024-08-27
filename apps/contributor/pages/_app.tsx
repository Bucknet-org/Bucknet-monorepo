// import "./globals.css";
import { wagmiConfig } from "@/constants/providerConfig";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { AppWarpper } from "./styled";
import Header from "@/components/Layout/Header";

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

// 1. Your WalletConnect Cloud project ID
const projectId = '59bbcc5ab6b0b9f0a838bddb9f03ecc6'

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}

// 3. Create a metadata object
const metadata = {
  name: 'bucknet',
  description: 'AppKit Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: '...', // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
})

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  enableAnalytics: true // Optional - defaults to your Cloud configuration
})

// const queryClient = new QueryClient()

interface AppProps {
  Component: any,
  pageProps: any,
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    // <WagmiProvider config={wagmiConfig}>
    //   <QueryClientProvider client={queryClient}>
    //     <RainbowKitProvider coolMode modalSize="compact">
          <Component {...pageProps} />
    //     </RainbowKitProvider>
    //   </QueryClientProvider>
    // </WagmiProvider>
  );
}

