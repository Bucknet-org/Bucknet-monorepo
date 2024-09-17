import StorageUpdater from "@/components/StorageUpdater";
import { MESSAGE } from "@/constants/message";
import { WalletProvider } from "@/context/WalletProvider";
import configureStore from "@/store/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Provider } from "react-redux";

// const queryClient = new QueryClient()

interface AppProps {
  Component: any,
  pageProps: any,
}

export default function App({ Component, pageProps }: AppProps) {
  const [initState, setInitState] = useState<any>()

  const store = useMemo(() => {
    console.log('initState', initState)
    return configureStore(initState)
  }, [initState])

  const sendMessage = useCallback((message: any) => {
    navigator.serviceWorker.ready.then((registration) => {
      registration?.active?.postMessage(JSON.stringify(message))
    })
  }, [])

  useEffect(() => {
    sendMessage({
      method: MESSAGE.GET_INITIALIZE_DATA,
    })
  }, [])

  useEffect(() => {
    const getInitData = (event: any) => {
      const data = event.data
      if (data.method === MESSAGE.INITIALIZE_DATA) {
        setInitState(JSON.parse(data.data))
      }
    }
    navigator.serviceWorker.addEventListener('message', getInitData)
    return () => {
      navigator.serviceWorker.removeEventListener('message', getInitData)
    }
  }, [])

  useEffect(() => {
    const handleTabClose = () => {
      sendMessage({
        method: MESSAGE.SET_INITIALIZE_DATA,
        data: JSON.stringify(store.getState()),
      })
    }
    window.addEventListener('visibilitychange', handleTabClose)
    return () => {
      window.removeEventListener('visibilitychange', handleTabClose)
    }
  }, [store, sendMessage])

  return (
    <WalletProvider>
      <Provider store={store}>
        <StorageUpdater/>
        <Component {...pageProps} />
      </Provider>
    </WalletProvider>
  );
}

