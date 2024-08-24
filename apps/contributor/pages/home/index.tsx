import React, { memo } from 'react'
import { AppWarpperExtension, BoxFlex } from '../styled'
import { Box, Typography } from '@mui/material'
import { expandView } from '@/utils/function'

export default memo(function Home() {
  return (
    <AppWarpperExtension>
      <Box>Extension Home</Box>
      <BoxFlex sx={{ cursor: 'pointer' }} onClick={() => expandView('browser')}>
        <Typography>Expand view</Typography>
      </BoxFlex>
    </AppWarpperExtension>
  )
})
