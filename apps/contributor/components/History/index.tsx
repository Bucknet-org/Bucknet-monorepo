import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { Button, Stack, styled, Typography } from '@mui/material'
import { AppColors, AppFont, AppSpace } from '@/constants/assets_app/app_theme'
import CachedIcon from '@mui/icons-material/Cached'
import { relative } from 'path'
import PtsHistory from './PtsHistory'
import EvalHistory from './EvalHistory'
import { useContributorContract } from '@/hooks/useContract'
import { useWallet } from '@/context/WalletProvider'
import { timeFormat } from '@/constants/dateFormat'
import { useDispatch, useSelector } from 'react-redux'
import slotsJson from '@/jsons/slots.json'
import { getCurrentEpoch, getPtsHistory, getState } from '@/selectors/appState.selector'
import githubApi from '@/services/github/api'
import { PtsHistoryType } from '@/store/reducers/app.reducer'
import { addNewPtsHistory, updateEpoch, updateWVS } from '@/store/actions/app.action'

const History = () => {
  const [activeTab, setActiveTab] = React.useState('pts')
  const contributorContract = useContributorContract()
  const {address} = useWallet()
  const dispatch = useDispatch()
  const state = useSelector(getState)
  const ptsHistories = useSelector(getPtsHistory)
  const currentEpoch = useSelector(getCurrentEpoch)
  console.log('epoch in history', currentEpoch)

  const refetch = async () => {
    console.log('state', state)
    
    let epoch = Number(await contributorContract?.epoch()) || 2
    if (epoch != currentEpoch) {
      console.log('epoch', typeof(epoch))
      dispatch(updateEpoch(epoch))
      try {
        let res = await githubApi.wvs(epoch)
        console.log('WVS', JSON.parse(res.data))
        dispatch(updateWVS(JSON.parse(res.data)))
      } catch (error) {
        console.log(error)
      }
    }

    if (!contributorContract || !address || epoch == 1) return
    const currentHisLength = ptsHistories.length
    console.log('length of history', currentHisLength)
    if (Number(currentHisLength) < Number(epoch)) {
      const slot = await contributorContract.slotOfMember(address)
      const slotsJsonObj: { [member: string]: number } = slotsJson;
      const key = Object.keys(slotsJsonObj).find(key => slotsJsonObj[key] === Number(slot));

      if (!key) {
        console.error("No matching key found in slotsJsonObj");
        return;
      }

      for (let i = 1; i < currentEpoch - currentHisLength; i++) {
        try {
          const epochPts: any = await contributorContract.getPointsHistory(address, currentHisLength + i);
          let wvs = await githubApi.wvs(currentHisLength + i) || {};
          const wvsData = JSON.parse(wvs.data);

          let ptsHistory: PtsHistoryType = {
            epoch: currentHisLength + i,
            timestamp: new Date(Number(epochPts[0]) * 1000).getTime(),
            txHash: JSON.parse(wvs.data).txsData.txHash,
            avgPoints: (epochPts[1] / BigInt(10000)).toString(),
            valWorks: wvsData.wvs.filter((item: any) => item.member.toLowerCase() === key).flatMap((item: any) => Object.keys(item.works))
          };

          console.log('pts history', ptsHistory)

          dispatch(addNewPtsHistory(ptsHistory));
        } catch (error) {
            console.error(`Error processing epoch ${i}:`, error);
        }
      }
    }
  }


  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <ReloadIconWrap onClick={refetch}>
        <CachedIcon />
      </ReloadIconWrap>
      <TabsContainer>
        <TabButton active={activeTab === 'pts' ? "true" : "false"} onClick={() => setActiveTab('pts')}>
          <TabTitle>Pts History</TabTitle>
        </TabButton>
        <TabButton active={activeTab === 'eval' ?  "true" : "false"} onClick={() => setActiveTab('eval')}>
          Eval. History
        </TabButton>
      </TabsContainer>

      {/* Tabs content */}
      <TabContent>{activeTab === 'pts' ? <PtsHistory /> : <EvalHistory />}</TabContent>
    </Box>
  )
}
export default History

//Style

const TabsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: AppSpace(2),
  marginBottom: AppSpace(1),
})

const TabButton = styled(Button)<{ active: string }>(({ active }) => ({
  display: 'flex',
  flexDirection: 'row',
  background: 'none',
  border: 'none',
  padding: '8px 16px',
  fontSize: AppFont.medium,
  cursor: 'pointer',
  color: active == "true" ? AppColors.primary : AppColors.disable,
  borderBottom: active == "true" ? `2px solid ${AppColors.primary}` : '2px solid transparent',
  transition: 'all 0.3s ease',
  textTransform: 'none',
  borderRadius: 0,
  '&:hover': {
    color: AppColors.primary,
  },
}))

const TabTitle = styled(Typography)({
  fontSize: AppFont.medium,
})

const TabContent = styled(Box)({
  padding: AppSpace(1),
})

const ReloadIconWrap = styled(Button)({
  position: 'absolute',
  color: AppColors.primary,
  minWidth: '0px',
  right: '0',
  top: AppSpace(0.5),
  background: AppColors.primaryDark,
})
