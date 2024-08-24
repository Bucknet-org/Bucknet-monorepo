import { BoxFlex } from '@/pages/styled';
import { Box, Typography } from '@mui/material';
import type { NextPage } from 'next';
import createMetaMaskProvider from 'metamask-extension-provider';
import { useEffect, useState } from 'react';
import { connectMetamask } from '@/utils/function';

const ConnectMetamask: NextPage = () => {
  const[provider, setProvider] = useState();

  useEffect(() => {
    return () => {
        const provider = getProvider();
        setProvider(provider)
    }
  }, []);

  const getProvider = () => {
    if (window.ethereum) {
        console.log('found window.ethereum>>');
        return window.ethereum;
    } else {
        const provider = createMetaMaskProvider();
        return provider;
    }
  }

  const getAccounts = async (provider: any) => {
    if (provider) {
        const [accounts, chainId] = await Promise.all([
            provider.request({
                method: 'eth_requestAccounts',
            }),
            provider.request({ method: 'eth_chainId' }),
        ]);
        return [accounts, chainId];
    }
    return [null, null];
  }

  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 12,
      }}
    >
      <BoxFlex sx={{ cursor: 'pointer' }} onClick={() => getAccounts(provider)}>
        <Typography>Connect Metamask from browser</Typography>
      </BoxFlex>
      <BoxFlex sx={{ cursor: 'pointer' }} onClick={() => connectMetamask()}>
        <Typography>Connect Metamask from background</Typography>
      </BoxFlex>
    </Box>
  );
};

export default ConnectMetamask;