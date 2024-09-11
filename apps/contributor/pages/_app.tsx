import Header from "@/components/Layout/Header";
import { MESSAGE } from "@/constants/message";
import { WalletProvider } from "@/context/WalletProvider";
import { useContributorContract } from "@/hooks/useContract";
import { getCurrentEpoch } from "@/selectors/appState.selector";
import githubApi from "@/services/github/api";
import { updateEpoch, updateWVS } from "@/store/actions/app.action";
import configureStore from "@/store/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";

// const queryClient = new QueryClient()

interface AppProps {
  Component: any,
  pageProps: any,
}

export default function App({ Component, pageProps }: AppProps) {
  const contributorContract = useContributorContract()
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
        {/* <Header/> */}
        <Component {...pageProps} />
      </Provider>
    </WalletProvider>
  );
}

