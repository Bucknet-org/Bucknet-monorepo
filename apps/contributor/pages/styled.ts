import { STYLE } from '@/constants/style'
import { styled, Box } from '@mui/material'

export default function appStyle() {}

export const AppWarpper = styled(Box)(({ theme }) => ({}))

export const AppWarpperExtension = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: STYLE.SIZE.VIEW_HEIGHT_EXTENSION,
  width: STYLE.SIZE.VIEW_WIDTH_EXTENSION,
  maxWidth: '100%',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxShadow: '0px 4px 24px 0px #00000026',
}))

export const BoxFlex = styled(Box)(({ theme }) => ({
  width: '100%',
  justifyContent: 'flex-start',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
}))
