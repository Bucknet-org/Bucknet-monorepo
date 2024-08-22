import { http, createConfig } from 'wagmi'
import { metaMask } from 'wagmi/connectors'
import { connectorsForWallets, getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { bscTestnet } from 'wagmi/chains';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [coinbaseWallet, metaMaskWallet],
    },
    {
      groupName: 'Others',
      wallets: [rainbowWallet],
    },
  ],
  { appName: 'RainbowKit App', projectId: 'YOUR_PROJECT_ID' },
);

export const wagmiConfig = createConfig({
  chains: [bscTestnet],
  connectors: connectors,
  transports: {
    [bscTestnet.id]: http(),
  },
})