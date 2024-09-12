import ModalCustom from '@/components/Custom/ModalCustom'
import { AppSpace } from '@/constants/assets_app/app_theme'
import { BoxFlexColumn, BoxFlexSpaceBetween } from '@/pages/styled'
import { getEvalHistory } from '@/selectors/appState.selector'
import { EvalHistoryType } from '@/store/reducers/app.reducer'
import { formatTime, getStrTruncateMiddle } from '@/utils/function'
import { Box, Container, Stack, styled, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const EvalHistory = () => {
  const evalHistory = useSelector(getEvalHistory)
  const [openActivityDetail, setOpenActivityDetail] = useState(false)
  const [currentActivity, setCurrentActivity] = useState<any>()

  const handleShowActivityDetail = (activity: any) => {
    console.log('activity')
    setCurrentActivity(activity)
    setOpenActivityDetail(true)
  }

  return (
    <>
      <ListContainer>
        {evalHistory?.map((item: EvalHistoryType, index: number) => (
          <ListItem key={index} onClick={() => handleShowActivityDetail(item)}>
            <TimeText>{item.timestamp}</TimeText>
            <PointText>{getStrTruncateMiddle(item.txHash, 5)}</PointText>
          </ListItem>
        ))}
      </ListContainer>
      <ModalCustom
        h="100%"
        style={{ color: '#fff', background: '#000000'}}
        mainHeader="Evaluation History Detail"
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
            </BoxFlexColumn>
            <BoxFlexColumn>
              <Typography variant="caption">Value Works</Typography>
              <BoxFlexColumn sx={{ gap: '20px' }}>
                {currentActivity?.wvs && Object.keys(currentActivity?.wvs).map((item: string, index: number) => {
                  return (<BoxFlexSpaceBetween key={index}>
                    <Typography variant="caption">{item}</Typography>
                    <BoxFlexColumn>
                    {currentActivity?.wvs[item] && Object.keys(currentActivity?.wvs[item]).map((work: string, indexV: number) => {
                      return <BoxFlexSpaceBetween key={indexV}>
                        <Typography variant="caption">{work}</Typography>
                        <Typography>{currentActivity?.wvs[item][work]}</Typography>
                      </BoxFlexSpaceBetween>
                    })}
                    </BoxFlexColumn>
                  </BoxFlexSpaceBetween>)
                })}
              </BoxFlexColumn>
            </BoxFlexColumn>
          </Box>
        </Container>
      </ModalCustom>
    </>
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
