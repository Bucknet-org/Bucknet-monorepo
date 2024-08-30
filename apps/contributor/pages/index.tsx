import React, { memo, useEffect } from 'react'
import Home from './home'
import Connect from '@/components/ConnectButton'
import { AppWarpperExtension } from './styled'
import ConnectMetamask from '@/components/ConnectMetamask'
import { generatePoE } from '@/wvs/generatePoE'

export default memo(function Index() {
  useEffect(() => {
    (async () => {
      let poe = await generatePoE(1);
      console.log('PoE', poe)
    })()
  })
  return (
    <AppWarpperExtension>
      <Connect />
      <ConnectMetamask />
      <Home />
    </AppWarpperExtension>
  )
})
