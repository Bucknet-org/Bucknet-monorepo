import Connect from "@/components/ConnectButton"
import { WrapperHeader } from "@/pages/styled"
import { memo } from "react"

export default memo(function Header() {
  return (
    <WrapperHeader>
      <Connect />
    </WrapperHeader>
  )
})
