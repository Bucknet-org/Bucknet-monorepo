'use client'

import { useContext, useEffect, useState, createContext } from 'react'
import createMetaMaskProvider from 'metamask-extension-provider';
import { ChainId } from '@/constants/chainid'

interface IWalletContext {
    provider: any | null
    loggedIn: boolean
    address: string
    chainId: ChainId | null
    login: () => Promise<void>
    logout: () => Promise<void>
    getAccounts: () => Promise<string[] | undefined>
    getBalance: () => Promise<string | undefined>
    signMessage: () => Promise<void>
    getUserInfo: () => Promise<void>
}

export const WalletContext = createContext<IWalletContext>({
    provider: null,
    loggedIn: false,
    address: '',
    chainId: null,
    login: async () => { },
    logout: async () => { },
    getAccounts: async () => [],
    getBalance: async () => '0',
    signMessage: async () => { },
    getUserInfo: async () => { },
})

export function useWallet() {
    return useContext<IWalletContext>(WalletContext)
}

export function WalletProvider({ children }: { children: any }) {
    const [provider, setProvider] = useState<any | null>(null)
    const [loggedIn, setLoggedIn] = useState(false)
    const [address, setAddress] = useState('')
    const [chainId, setChainId] = useState<ChainId | null>(null)

    useEffect(() => {
        // Check if MetaMask is installed
        if (window.ethereum) {
            setProvider(window.ethereum)
            window.ethereum.on('accountsChanged', handleAccountsChanged)
            window.ethereum.on('chainChanged', handleChainChanged)
        } else {
            const provider = createMetaMaskProvider()
            setProvider(provider)
        }
    }, [])

    const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
            setAddress(accounts[0])
        } else {
            setAddress('')
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
            if (accounts.length > 0) {
                setLoggedIn(true)
                setAddress(accounts[0])
            }
        } catch (error) {
            console.error(error)
        }
    }

    const logout = async () => {
        setLoggedIn(false)
        setAddress('')
        console.log('logged out')
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

    const getUserInfo = async () => {
        if (!provider || !address) {
            console.error('MetaMask provider or address not available')
            return
        }
        // MetaMask does not provide user info directly, you may need to use third-party services or APIs
        console.log('User info is not directly accessible via MetaMask')
    }

    const contextProvider = {
        provider,
        loggedIn,
        address,
        chainId,
        login,
        logout,
        getAccounts,
        getBalance,
        signMessage,
        getUserInfo,
    }

    return <WalletContext.Provider value={contextProvider}>{children}</WalletContext.Provider>
}
