import { AppSpace } from '@/constants/assets_app/app_theme'
import { Box, Stack, styled, Typography } from '@mui/material'
import React from 'react'

const MockData = [
  { id: 1, time: 'Aug 26, 2024 01:11 PM', address: '0x3d8..5e2' },
  { id: 2, time: 'Aug 19, 2024 07:52 AM', address: '0x9e6...1t5' },
  { id: 3, time: 'Aug 12, 2024 03:20 PM', address: '0xf35...3bn' },
  { id: 4, time: 'Aug 05, 2024 11:11 AM', address: '0x1e6...1e4' },
]

const EvalHistory = () => {
  return (
    <ListContainer>
      {MockData.map((item) => (
        <ListItem key={item.id}>
          <TimeText>{item.time}</TimeText>
          <PointText>{item.address}</PointText>
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
