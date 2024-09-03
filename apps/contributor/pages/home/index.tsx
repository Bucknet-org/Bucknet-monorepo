import React, { memo } from 'react'
import { AppWarpperExtension, BoxFlex } from '../styled'
import { Box, Stack, styled, Typography } from '@mui/material'
import { expandView } from '@/utils/function'
import { AppColors, AppFont, AppSpace } from '@/constants/assets_app/app_theme'
import { Connect } from '@/components/ConnectButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Point from '@/components/Point'
import History from '@/components/History'

export default memo(function Home() {
  return (
    <AppWarpperExtension>
      <ContainerWrap>
        <HeaderWrap>
          <HeaderItemWrap>
            <AccountNameWrap>Account Name</AccountNameWrap>
            <Connect />
          </HeaderItemWrap>
          <MoreVertIcon sx={{ color: AppColors.primary, cursor: 'pointer' }} />
        </HeaderWrap>
        <Divider />
        <Box>
          <Point />
        </Box>
        <BoxFlex sx={{ cursor: 'pointer' }} onClick={() => expandView('browser')}>
          <History />
        </BoxFlex>
      </ContainerWrap>
    </AppWarpperExtension>
  )
})

//Style
const ContainerWrap = styled(Box)({
  background: AppColors.background,
  color: AppColors.text,

  borderRadius: AppSpace(1),
})

const AccountNameWrap = styled(Box)({
  fontSize: AppFont.small,
  color: AppColors.white,
})

const Divider = styled(Box)({
  background: AppColors.gradientPrimary,
  height: '1px',
})

const HeaderWrap = styled(Stack)({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const HeaderItemWrap = styled(Stack)({
  flexDirection: 'column',
  padding: AppSpace(1),
})
