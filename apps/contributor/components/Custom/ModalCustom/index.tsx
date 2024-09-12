import React, { ReactNode, useEffect } from 'react'
//mui
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'

//styled
import {
  LeftHeader,
  MainHeader,
  ModalBack,
  ModalClose,
  ModalHeader,
  ModalOverlay,
  ModalStyle,
  WrapperChildren,
  WrapperFooter,
  WrapperModal,
} from './styled'
import { Typography } from '@mui/material'
// import DividerGradient from '../DividerGradient';
export interface ModalProps {
  children: ReactNode | any
  onOpen: boolean
  onClose?: VoidFunction
  leftHeader?: string
  leftHeaderFn?: VoidFunction
  mainHeader?: string
  allowClose?: any
  allowBack?: any
  onBack?: VoidFunction
  style?: object
  styleChildren?: object
  isHasHeader?: boolean
  h?: string | 'auto'
}

const ModalCustom = ({
  children,
  onOpen,
  onClose,
  leftHeader,
  leftHeaderFn,
  onBack,
  mainHeader,
  allowClose = true,
  allowBack = false,
  style,
  isHasHeader = true,
  styleChildren,
  h = '70%',
}: ModalProps) => {
  useEffect(() => {
    if (onOpen) {
      document.body.classList.add('stop-scroll')
    } else {
      document.body.classList.remove('stop-scroll')
    }

    return () => {
      document.body.classList.remove('stop-scroll')
    }
  }, [onOpen])

  // handle esc to close the modal
  useEffect(() => {
    if (!onClose || !onOpen) return

    const escFunction = (event: any) => {
      if (event.key === 'Escape') {
        //Do whatever when esc is pressed

        window.removeEventListener('keydown', escFunction)
      }
    }

    window.addEventListener('keydown', escFunction, { passive: true })

    return () => {
      window.removeEventListener('keydown', escFunction)
    }
  }, [onOpen, onClose])

  if (!onOpen) {
    return null
  }

  return (
    <>
      <ModalOverlay onClick={onClose}> </ModalOverlay>,
      <WrapperModal>
        <ModalStyle sx={{ ...style }}>
          {allowClose && (
            <ModalClose onClick={onClose}>
              <CloseIcon
                sx={{
                  fontSize: 22,
                  cursor: 'pointer',
                }}
              />
            </ModalClose>
          )}
          {allowBack && (
            <ModalBack onClick={onBack}>
              <ArrowBackIosRoundedIcon sx={{ width: '18px', height: '18px' }} />{' '}
            </ModalBack>
          )}
          {isHasHeader && (
            <>
              <ModalHeader>
                <LeftHeader onClick={leftHeaderFn}>
                  {' '}
                  <Typography variant="h4">{leftHeader}</Typography>
                </LeftHeader>
                <MainHeader fontWeight="600">
                  <Typography variant="h4">{mainHeader}</Typography>
                </MainHeader>
              </ModalHeader>
              {/* {pathname !== '/drop' && <DividerGradient sx={{ mb: '1rem' }} />} */}
            </>
          )}

          <WrapperChildren sx={styleChildren}>{children}</WrapperChildren>
          {/* <WrapperFooter sx={styleChildren}>{children}</WrapperFooter> */}
        </ModalStyle>
      </WrapperModal>
    </>
  )
}

export default ModalCustom
