import { getProvider } from '@/selectors/appState.selector'
import { BigNumberish, JsonRpcProvider } from 'ethers'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

interface Provider {
  address: string
  balance: BigNumberish
  provider?: JsonRpcProvider
}

const useProvider = (): Provider => {
  const [address, setAddress] = useState<string>('')
  const [balance, setBalance] = useState<BigNumberish>(0)

  const provider = useSelector(getProvider)

  return {
    address,
    balance,
    provider
  }
}

export default useProvider;