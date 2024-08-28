import { WrapperHeader } from "@/pages/styled"
import { memo } from "react"
import { Connect } from "@/components/ConnectButton"

export default memo(function Header() {
  return (
    <WrapperHeader>
      <Connect />
    </WrapperHeader>
  )
})
