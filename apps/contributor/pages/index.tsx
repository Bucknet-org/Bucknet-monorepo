import React, { memo, useEffect } from 'react'
import Home from './home'
import { AppWarpperExtension } from './styled'
import ConnectMetamask from '@/components/ConnectMetamask'

export default memo(function Index() {
  return (
    <AppWarpperExtension>
      <Home />
    </AppWarpperExtension>
  )
})
