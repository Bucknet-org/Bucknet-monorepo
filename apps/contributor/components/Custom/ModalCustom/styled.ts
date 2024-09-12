import { STYLE } from '@/constants/style'
import { styled, Box } from '@mui/material'

export const WrapperModal = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  right: '50%',
  bottom: '50%',
  transform: 'translate(-50%, -50%)',
  width: STYLE.SIZE.VIEW_WIDTH_EXTENSION,
  height: '100vh',
  zIndex: 1200,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px',
}))
export const ModalOverlay = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  right: '50%',
  bottom: '50%',
  transform: 'translate(-50%, -50%)',
  height: '100vh',
  width: '100vw',
  backgroundColor: 'rgba(0,0,0,0.1)',
  backdropFilter: 'blur(8px)',
  zIndex: 1200,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px',
}))

export const ModalStyle = styled(Box)(({ theme }) => ({
  position: 'relative',
  boxSizing: 'border-box',
  width: '95%',
  height: STYLE.SIZE.VIEW_HEIGHT_EXTENSION,
  maxHeight: '100%',
  borderRadius: '5px',
  alignSelf: 'center',
  background: '#ffff',
  paddingBottom: '15px',
  zIndex: 12000,
  overflow: 'hidden',
}))

export const ModalHeader = styled(Box)(({ theme }) => ({
  width: '100%',
  position: 'sticky',
  top: '0',
  height: '4rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}))

export const LeftHeader = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  position: 'absolute',
  top: '1rem',
  left: '1rem',
  lineHeight: 1,
}))

export const MainHeader = styled(Box)(({ theme }) => ({
  alignSelf: 'center',
  fontSize: 22,
  padding: '10px 40px',
  textAlign: 'center',
  '@media screen and (max-width: 500px)': {
    fontSize: 16,
  },
}))

export const ModalClose = styled(Box)({
  cursor: 'pointer',
  position: 'absolute',
  zIndex: 1001,
  top: '20px',
  right: '24px',
  ':hover': {
    opacity: 0.5,
  },
})

export const ModalBack = styled(Box)({
  cursor: 'pointer',
  position: 'absolute',
  zIndex: 1001,
  top: '20px',
  left: '24px',
  ':hover': {
    opacity: 0.5,
  },
})
export const WrapperChildren = styled(Box)({
  // padding: '0 1rem',
  height: 'calc(100% - 64px )',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '5px',
    height: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#bbc0c4',
    borderRadius: '6px',
  },
})
export const WrapperFooter = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  // padding: '0 1rem',
  height: '60px',
  background: 'red',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '5px',
    height: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#bbc0c4',
    borderRadius: '6px',
  },
})
