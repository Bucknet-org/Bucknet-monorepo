import { useState } from 'react'
import { useWallet } from '@/context/WalletProvider'

export const Wallet = () => {
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
        <button className="w-fit h-fit px-4 py-2 rounded-md bg-slate-400" onClick={toggleModal}>
          {address?.slice(0, 6) + '...' + address?.slice(-4)}
        </button>
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
