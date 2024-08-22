import "./globals.css";
import { wagmiConfig } from "@/constants/wagmiConfig";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import ConnectWallet from "@/components/ConnectWallet";

const queryClient = new QueryClient()

interface AppProps {
  Component: any,
  pageProps: any,
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectWallet />
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

