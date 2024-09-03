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

const History = () => {
  const [activeTab, setActiveTab] = React.useState('pts')

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <ReloadIconWrap>
        <CachedIcon />
      </ReloadIconWrap>
      <TabsContainer>
        <TabButton active={activeTab === 'pts'} onClick={() => setActiveTab('pts')}>
          <TabTitle>Pts History</TabTitle>
        </TabButton>
        <TabButton active={activeTab === 'eval'} onClick={() => setActiveTab('eval')}>
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

const TabButton = styled(Button)<{ active: boolean }>(({ active }) => ({
  display: 'flex',
  flexDirection: 'row',
  background: 'none',
  border: 'none',
  padding: '8px 16px',
  fontSize: AppFont.medium,
  cursor: 'pointer',
  color: active ? AppColors.primary : AppColors.disable,
  borderBottom: active ? `2px solid ${AppColors.primary}` : '2px solid transparent',
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
