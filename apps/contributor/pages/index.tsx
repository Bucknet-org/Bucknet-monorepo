import React, { memo, useEffect } from 'react'
import Home from './home'
import { AppWarpperExtension } from './styled'
import ConnectMetamask from '@/components/ConnectMetamask'
import { useSelector, useDispatch } from "react-redux";
import { getCurrentEpoch } from '@/selectors/appState.selector';
import { useContributorContract } from '@/hooks/useContract';
import { updateEpoch, updateWVS } from '@/store/actions/app.action';
import githubApi from '@/services/github/api';

export default memo(function Index() {
  const currentEpoch = useSelector(getCurrentEpoch)
  const dispatch = useDispatch()
  const contributorContract = useContributorContract()

  useEffect(() => {
    (async () => {
      let epoch = await contributorContract?.epoch() || 1
      if (epoch != currentEpoch) {
        console.log('epoch', epoch)
        dispatch(updateEpoch(epoch))
        try {
          let res = await githubApi.wvs(epoch)
          console.log('WVS', JSON.parse(res.data))
          dispatch(updateWVS(JSON.parse(res.data)))
        } catch (error) {
          console.log(error)
        }
      }
    })()
  }, [])

  return (
    <AppWarpperExtension>
      <Home />
    </AppWarpperExtension>
  )
})
