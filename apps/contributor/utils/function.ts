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

export const formatLongString = (str: string) => {
  const len = str.length;
  return `${str.slice(0,5)}...${str.slice(len - 5, len)}`
}