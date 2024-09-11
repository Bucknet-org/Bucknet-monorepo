import { AppColors, AppFont, AppSpace } from '@/constants/assets_app/app_theme'
import { expandView } from '@/utils/function'
import { Box, Stack, styled, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useContributorContract } from '@/hooks/useContract'
import { useWallet } from '@/context/WalletProvider'
import { useRouter } from 'next/router'
import { ROUTE } from '@/constants/route'

const Point = () => {
  const [point, setPoint] = useState(0)
  const contract = useContributorContract()
  const {address} = useWallet()
  const router = useRouter()

  useEffect(() => {
    if(address) {
      contract?.contribPts.staticCall(address)
      .then(res => {
        console.log(res)
        setPoint(Number(res / BigInt(10000)))
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
      <GradientBorderBox onClick={() => router.push(ROUTE.BROWSER.WVS)}>
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
