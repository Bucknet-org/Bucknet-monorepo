import React, { memo } from 'react'
import Home from './home'
import { AppWarpperExtension } from './styled'

export default memo(function Index() {
  
  return (
    <AppWarpperExtension>
      <Home />
    </AppWarpperExtension>
  )
})
