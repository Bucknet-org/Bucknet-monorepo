import React, { memo } from 'react'
import Home from './home'
import Connect from '@/components/ConnectButton'
import { AppWarpperExtension } from './styled'

export default memo(function Index() {
  return (
    <AppWarpperExtension>
      <Connect />
      <Home />
    </AppWarpperExtension>
  )
})
