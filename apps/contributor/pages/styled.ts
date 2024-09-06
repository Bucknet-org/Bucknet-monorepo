import { AppColors } from '@/constants/assets_app/app_theme'
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
  background: AppColors.background,
}))

export const BoxFlex = styled(Box)(({ theme }) => ({
  width: '100%',
  justifyContent: 'flex-start',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
}))

export const BoxFlexEnd = styled(Box)(({ ...props }) => ({
  width: '100%',
  justifyContent: 'flex-end',
  display: 'flex',
  alignItems: 'center',
  gap: `${props.gap ? props.gap : 10}px`,
}))
export const BoxFlexSpaceBetween = styled(Box)(({ theme }) => ({
  width: '100%',
  justifyContent: 'space-between',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
}))
export const BoxFlexColumn = styled(Box)(({ theme }) => ({
  width: '100%',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
}))

export const WrapperHeader = styled(Box)(({}) => ({
  position: 'sticky',
  top: 0,
  left: 0,
  zIndex: '100',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '15px',
  paddingTop: '15px',
  paddingLeft: '16px!important',
  paddingRight: '16px!important',
  borderBottom: '1px solid #E7E8EC',
}))
