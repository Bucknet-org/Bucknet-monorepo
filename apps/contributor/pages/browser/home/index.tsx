import React, { memo } from 'react'
import { AppWarpper } from '../../styled'
import Connect from '@/components/ConnectButton'

export default memo(function BrowserHome() {
  return (
    <AppWarpper>
      <Connect />
      <div>Browser Home</div>
    </AppWarpper>
  )
})
