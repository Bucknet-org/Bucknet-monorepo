import { getPtsHistory } from '@/selectors/appState.selector'
import { PtsHistoryType } from '@/store/reducers/app.reducer'
import { formatTime } from '@/utils/function'
import { Box, styled, Typography } from '@mui/material'
import { useSelector } from 'react-redux'

const PtsHistory = () => {
  const ptsHistory = useSelector(getPtsHistory)

  return (
    <ListContainer>
      {ptsHistory?.map((item: PtsHistoryType, index: number) => (
        <ListItem key={index}>
          <TimeText>{formatTime(item.timestamp)}</TimeText>
          <PointText>{item.avgPoints} pts</PointText>
        </ListItem>
      ))}
    </ListContainer>
  )
}

export default PtsHistory

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
