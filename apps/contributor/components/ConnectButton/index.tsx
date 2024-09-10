import { useState } from 'react'
import { useWallet } from '@/context/WalletProvider'
import { Box, Button, Stack, styled } from '@mui/material'
import { AppColors, AppFont, AppSpace } from '@/constants/assets_app/app_theme'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

export const Connect = () => {
  const [openModal, setOpenModal] = useState(false)
  const { login, loggedIn, logout, address } = useWallet()

  const toggleModal = () => {
    setOpenModal(!openModal)
  }

  const onClickLogout = () => {
    setOpenModal(false)
    logout()
  }

  return (
    <div className="relative">
      {loggedIn ? (
        <AddressWraper>
          <Address onClick={toggleModal}>{address?.slice(0, 6) + '...' + address?.slice(-4)}</Address>
          <ButtonDefault>
            <ContentCopyIcon sx={{ fontSize: AppFont.small }} />
          </ButtonDefault>
        </AddressWraper>
      ) : (
        <button className="w-fit h-fit px-4 py-2 rounded-md bg-slate-400" onClick={login}>
          Login
        </button>
      )}

      {openModal && (
        <div className=" absolute w-full top-12 right-0 bg-slate-300 px-4 py-2 cursor-pointer" onClick={onClickLogout}>
          Logout
        </div>
      )}
    </div>
  )
}

const AddressWraper = styled(Stack)({
  background: AppColors.background,
  flexDirection: 'row',
  alignItems: 'center',
  gap: AppSpace(1),
  paddingLeft: '8px'
})

const Address = styled(Button)({
  color: AppColors.white,
  padding: AppSpace(0),
  fontSize: AppFont.small,
})

const ButtonDefault = styled(Button)({
  color: AppColors.white,
  padding: AppSpace(0),
  minWidth: AppSpace(0),
})
