import { Box } from '@mui/material'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  return (
    <Box>
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && <Box>{ensName ? `${ensName} (${address})` : address}</Box>}
      <button onClick={() => disconnect()}>Disconnect</button>
    </Box>
  )
}