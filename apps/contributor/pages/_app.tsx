// import "./globals.css";
import { wagmiConfig } from "@/constants/providerConfig";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { AppWarpper } from "./styled";
import Header from "@/components/Layout/Header";

const queryClient = new QueryClient()

interface AppProps {
  Component: any,
  pageProps: any,
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider coolMode modalSize="compact">
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

