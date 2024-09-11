import { timeFormat } from "@/constants/dateFormat"
import { MESSAGE } from "@/constants/message"

export const expandView = (route: string = 'browser/home') => {
  navigator.serviceWorker.ready.then((registration) => {
    registration?.active?.postMessage(
      JSON.stringify({
        method: MESSAGE.EXPAND_VIEW,
        data: JSON.stringify({ route }),
      }),
    )
  })
}

export const connectMetamask = () => {
  navigator.serviceWorker.ready.then((registration) => {
    registration?.active?.postMessage(
      JSON.stringify({
        method: MESSAGE.CONNECT,
      }),
    )
  })
}

export const getStrTruncateMiddle = (str: string, numChars: number) => {
  if (!str) {
    return ''
  }
  const strLength = str.length
  if (strLength <= numChars * 2) return str

  const start = str.slice(0, numChars)
  const end = str.slice(-numChars)
  return `${start}....${end}`
}


export const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString("us-US", timeFormat)
}