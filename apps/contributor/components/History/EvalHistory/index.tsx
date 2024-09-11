import { AppSpace } from '@/constants/assets_app/app_theme'
import { getEvalHistory } from '@/selectors/appState.selector'
import { EvalHistoryType } from '@/store/reducers/app.reducer'
import { formatTime, getStrTruncateMiddle } from '@/utils/function'
import { Box, Stack, styled, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

interface EvalItem {
  time: string,
  txhash: string
}

const EvalHistory = () => {
  const evalHistory = useSelector(getEvalHistory)

  return (
    <ListContainer>
      {evalHistory?.map((item: EvalHistoryType, index: number) => (
        <ListItem key={index}>
          <TimeText>{formatTime(item.timestamp)}</TimeText>
          <PointText>{getStrTruncateMiddle(item.txHash, 5)}</PointText>
        </ListItem>
      ))}
    </ListContainer>
  )
}

export default EvalHistory

//Style

// Styled components
const ListContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '8px 16px',
})

const ListItem = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 0',
  borderBottom: '1px solid #444',
})

const TimeText = styled(Typography)({
  fontSize: '14px',
  color: '#fff',
})

const PointText = styled(Typography)({
  fontSize: '14px',
  color: '#fff',
})
