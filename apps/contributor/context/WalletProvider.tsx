'use client'

import { useContext, useEffect, useState, createContext } from 'react'
import createMetaMaskProvider from 'metamask-extension-provider';
import { ChainId } from '@/constants/chainid'
import { EthereumEvents } from '@/constants/events';
import { ethers } from 'ethers';
interface IWalletContext {
    provider: any | null
    signer: any | null
    loggedIn: boolean
    address: string
    chainId: ChainId | null
    login: () => Promise<void>
    logout: () => Promise<void>
    getAccounts: () => Promise<string[] | undefined>
    getBalance: () => Promise<string | undefined>
    signMessage: () => Promise<void>
}

export const WalletContext = createContext<IWalletContext>({
    provider: null,
    signer: null,
    loggedIn: false,
    address: '',
    chainId: null,
    login: async () => { },
    logout: async () => { },
    getAccounts: async () => [],
    getBalance: async () => '0',
    signMessage: async () => { },
})

export function useWallet() {
    return useContext<IWalletContext>(WalletContext)
}

export function WalletProvider({ children }: { children: any }) {
    const [signer, setSigner] = useState<any | null>(null)
    const [provider, setProvider] = useState<any | null>(null)
    const [loggedIn, setLoggedIn] = useState(false)
    const [address, setAddress] = useState('')
    const [chainId, setChainId] = useState<ChainId | null>(null)

    useEffect(() => {
        if (window.ethereum) {
            setProvider(window.ethereum)
        } else {
            const provider = createMetaMaskProvider()
            setProvider(provider)
        }
    }, [])

    useEffect(() => {
        if (provider?.isConnected()) {
            provider.request({ method: 'eth_accounts' }).then(handleAccountsChanged).catch(console.error)
            provider.on(EthereumEvents.CHAIN_CHANGED, handleChainChanged);
            provider.on("accountsChanged", handleAccountsChanged);            
            login()

            return () => {
                provider.removeListener(EthereumEvents.CHAIN_CHANGED, handleChainChanged);
            };
        }
    }, [provider])

    const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
            setAddress(accounts[0])
            setLoggedIn(true)
        } else {
            setAddress('')
            setLoggedIn(false)
        }
    }

    const handleChainChanged = (chainId: string) => {
        setChainId(Number(chainId))
    }

    const login = async () => {
        if (!provider) {
            console.error('MetaMask provider not available')
            return
        }
        try {
            const accounts = await provider.request({ method: 'eth_requestAccounts' })
            const _signer = await (new ethers.BrowserProvider(provider)).getSigner(0)
            setSigner(_signer)
            handleAccountsChanged(accounts)
        } catch (error) {
            console.error(error)
        }
    }

    const logout = async () => {
        setLoggedIn(false)
        setAddress('')
        setSigner(null)
        await provider.request({ method: 'wallet_revokePermissions', params: [{"eth_accounts": {}}]})
    }

    const getAccounts = async () => {
        if (!provider) {
            console.error('MetaMask provider not available')
            return []
        }
        try {
            const accounts = await provider.request({ method: 'eth_accounts' })
            return accounts
        } catch (error) {
            console.error(error)
            return []
        }
    }

    const getBalance = async () => {
        if (!provider || !address) {
            console.error('MetaMask provider or address not available')
            return '0'
        }
        try {
            const balance = await provider.request({ method: 'eth_getBalance', params: [address, 'latest'] })
            return parseFloat(balance).toString()
        } catch (error) {
            console.error(error)
            return '0'
        }
    }

    const signMessage = async () => {
        if (!provider || !address) {
            console.error('MetaMask provider or address not available')
            return
        }
        try {
            const message = 'YOUR_MESSAGE'
            const signature = await provider.request({
                method: 'personal_sign',
                params: [message, address],
            })
            console.log(signature)
        } catch (error) {
            console.error(error)
        }
    }

    const contextProvider = {
        provider,
        signer,
        loggedIn,
        address,
        chainId,
        login,
        logout,
        getAccounts,
        getBalance,
        signMessage,
    }

    return <WalletContext.Provider value={contextProvider}>{children}</WalletContext.Provider>
}
