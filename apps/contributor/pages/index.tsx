import React, { memo } from 'react'
import Home from './home'
import Connect from '@/components/ConnectButton'
import { AppWarpperExtension } from './styled'
import ConnectMetamask from '@/components/ConnectMetamask'

export default memo(function Index() {
  return (
    <AppWarpperExtension>
      <Connect />
      <ConnectMetamask />
      <Home />
    </AppWarpperExtension>
  )
})
