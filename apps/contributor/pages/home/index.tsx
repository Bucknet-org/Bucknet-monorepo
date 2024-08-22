import React, { memo } from 'react'
import { AppWarpperExtension, BoxFlex } from '../styled'
import { Typography } from '@mui/material'
import { expandView } from '@/utils/function'

export default memo(function Home() {
  return (
    <AppWarpperExtension>
      <div>Extension Home</div>
      <BoxFlex sx={{ cursor: 'pointer' }} onClick={() => expandView('browser')}>
        <Typography>Expand view</Typography>
      </BoxFlex>
    </AppWarpperExtension>
  )
})
