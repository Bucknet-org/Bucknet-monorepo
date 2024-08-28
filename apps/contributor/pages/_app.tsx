// import "./globals.css";
import Header from "@/components/Layout/Header";
import { WalletProvider } from "@/context/WalletProvider";

// const queryClient = new QueryClient()

interface AppProps {
  Component: any,
  pageProps: any,
}

export default function App({ Component, pageProps }: AppProps) {

  return (
    <WalletProvider>
      <Header/>
      <Component {...pageProps} />
    </WalletProvider>
  );
}

