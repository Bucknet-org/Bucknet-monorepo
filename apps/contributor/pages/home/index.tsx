import React, { memo, useState } from 'react'
import { AppWarpperExtension, BoxFlex } from '../styled'
import { Box, Stack, styled, Typography } from '@mui/material'
import { expandView } from '@/utils/function'
import { AppColors, AppFont, AppSpace } from '@/constants/assets_app/app_theme'
import { Connect } from '@/components/ConnectButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Point from '@/components/Point'
import History from '@/components/History'
import ConnectMetamask from '@/components/ConnectMetamask'
import { useContributorContract } from '@/hooks/useContract'

export default memo(function Home() {
  const contributorContract = useContributorContract();
  const [evalData, setEvalData] = useState({"slots": [0], "points": [20]});
  const [openEvalData, setOpenEvalData] = useState({"poe": "0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929", "slots": [0], "numOfWorks": [4]});

  
  const evaluate = async () => {
    try {
      if (!contributorContract) return
      const receipt = await contributorContract.evaluate(evalData.slots, evalData.points)
      await receipt.wait()
      console.log(receipt)
    } catch (err) {
      console.log(err)
    }
  }

  const openEvalSession = async () => {
    try {
      if (!contributorContract) return
      const receipt = await contributorContract.openEvalSession(openEvalData.poe, openEvalData.slots, openEvalData.numOfWorks)
      await receipt.wait()
      console.log(receipt)
    } catch (err) {
      console.log(err)
    }
  }

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
          <button onClick={openEvalSession}>Open Eval Sessions</button>
          <button onClick={evaluate}>Evaluate</button>
        </Box>
        <BoxFlex sx={{ cursor: 'pointer' }}>
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
