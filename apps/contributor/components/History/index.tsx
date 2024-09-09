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

const History = () => {
  const [activeTab, setActiveTab] = React.useState('pts')
  const contract = useContributorContract()
  const {address} = useWallet()

  const refetch = async () => {
    if (!contract || !address) return
    const numOfEpochs = await contract.epoch()

    chrome.storage.local.get({ptsHistories: []}, async (result) => {
      const ptsHistories = result.ptsHistories;

      if (ptsHistories.length == 0) {
        // fetch all
        for (let i = 1; i < Number(numOfEpochs); ++i) {
          const epochPts = await contract.getEpochPoints(address, i)
          ptsHistories.push({time: new Date(Number(epochPts[0]) * 1000).toLocaleString("en-US", timeFormat).replace(',', ''), pts: Number(epochPts[1] / BigInt(10000))})
        }
      } else {
        // fetch start latest epoch
        const latestEpoch = ptsHistories.length + 1;
        for (let i = latestEpoch; i < Number(numOfEpochs); ++i) {
          const epochPts = await contract.getEpochPoints(address, i)
          ptsHistories.push({time: new Date(Number(epochPts[0]) * 1000).toLocaleString("en-US", timeFormat).replace(',', ''), pts: Number(epochPts[1] / BigInt(10000)) })
        }
      }
      chrome.storage.local.set({ptsHistories: ptsHistories}, () => {
        chrome.storage.local.get('ptsHistories', (result) => {
            console.log(result.ptsHistories)
        });
      })
    });
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
