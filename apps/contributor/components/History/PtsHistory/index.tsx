import { getPtsHistory } from '@/selectors/appState.selector'
import { PtsHistoryType } from '@/store/reducers/app.reducer'
import { formatTime, getStrTruncateMiddle } from '@/utils/function'
import { Box, Container, styled, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import ModalCustom from '@/components/Custom/ModalCustom'
import { useState } from 'react'
import { BoxBorderBottom, BoxFlex, BoxFlexColumn, BoxFlexSpaceBetween } from '@/pages/styled'
const PtsHistory = () => {
  const ptsHistory = useSelector(getPtsHistory)
  const [openActivityDetail, setOpenActivityDetail] = useState(false)
  const [currentActivity, setCurrentActivity] = useState<any>(null)

  const handleShowActivityDetail = (activity: any) => {
    console.log('activity', activity)
    setCurrentActivity(activity)
    setOpenActivityDetail(true)
  }

  return (
    <>
      <ListContainer>
        {ptsHistory?.map((item: PtsHistoryType, index: number) => (
          <ListItem key={index} onClick={() => handleShowActivityDetail(item)}>
            <TimeText>{formatTime(item.timestamp)}</TimeText>
            <PointText>{item.avgPoints} pts</PointText>
          </ListItem>
        ))}
      </ListContainer>
      <ModalCustom
        h="100%"
        style={{ color: '#fff', background: '#000000'}}
        mainHeader="Pts History Detail"
        onOpen={openActivityDetail}
        onClose={() => setOpenActivityDetail(false)}
      >
        <Container>
          <Box sx={{ padding: '20px 0', color: '#fff' }}>
            <BoxFlexColumn sx={{ gap: '20px' }}>
              <BoxFlexSpaceBetween>
                <Typography variant="caption">Epoch</Typography>
                <Typography>{currentActivity?.epoch}</Typography>
              </BoxFlexSpaceBetween>
              <BoxFlexSpaceBetween>
                <Typography variant="caption">Timestamp</Typography>
                <Typography>{formatTime(currentActivity?.timestamp)}</Typography>
              </BoxFlexSpaceBetween>
              <BoxFlexSpaceBetween>
                <Typography variant="caption">Tx Hash</Typography>
                <Typography>{getStrTruncateMiddle(currentActivity?.txHash, 6)}</Typography>
              </BoxFlexSpaceBetween>
              <BoxFlexSpaceBetween>
                <Typography variant="caption">Avg. Point</Typography>
                <Typography>{currentActivity?.avgPoints}</Typography>
              </BoxFlexSpaceBetween>
              <BoxFlexSpaceBetween>
                <Typography variant="caption">Value Works</Typography>
                <BoxFlexColumn sx={{ gap: '20px' }}>
                  {currentActivity?.valWorks?.map((work: any) => {
                    return <Typography variant="caption">{work}</Typography>
                  })}
                </BoxFlexColumn>
              </BoxFlexSpaceBetween>
            </BoxFlexColumn>
          </Box>
        </Container>
      </ModalCustom>
    </>
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
