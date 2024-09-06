import { AppColors, AppFont, AppSpace } from '@/constants/assets_app/app_theme'
import { ROUTE } from '@/constants/route'
import { expandView } from '@/utils/function'
import { Box, Stack, styled, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'

const point = 56.6
const Point = () => {
  const router = useRouter()
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
