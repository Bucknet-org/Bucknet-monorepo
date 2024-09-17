import { AppColors, AppFont, AppSpace } from '@/constants/assets_app/app_theme'
import { expandView } from '@/utils/function'
import { Box, Stack, styled, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useContributorContract } from '@/hooks/useContract'
import { useWallet } from '@/context/WalletProvider'
import { useRouter } from 'next/router'

const Point = () => {
  const [point, setPoint] = useState<string>('0')
  const contract = useContributorContract()
  const {address} = useWallet()
  const router = useRouter()

  useEffect(() => {
    if(address) {
      contract?.contribPts.staticCall(address)
      .then(res => {
        console.log(res)
        setPoint((Number(res) / Number(10000)).toFixed(2))
      })
      .catch(err => {
        console.log(err)
      })
    }

  }, [address, contract])

  return (
    <Container>
      <PointWrap>
        <PointNumber>{point}</PointNumber>
        <PointCurrency>pts</PointCurrency>
      </PointWrap>
      <GradientBorderBox onClick={() => expandView('browser/wvs')}>
        Weekly Evaluation
      </GradientBorderBox>
    </Container>
  )
}

export default Point

//Style

//Point
const Container = styled(Stack)({
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})

const PointWrap = styled(Stack)({
  marginTop: AppSpace(4),
  flexDirection: 'row',
  alignItems: 'baseline',
})

const PointNumber = styled(Typography)({
  fontSize: AppFont.s60,
  color: AppColors.primary,
})
const PointCurrency = styled(Typography)({
  fontSize: AppFont.s35,
  color: AppColors.primary,
})
//
//Weekly Evaluation
const GradientBorderBox = styled(Box)({
  marginTop: AppSpace(2),
  cursor: 'pointer',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid',
  borderColor: AppColors.primary,
  color: AppColors.primary,
  fontSize: AppFont.small,
})
