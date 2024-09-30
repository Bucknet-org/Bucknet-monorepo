import slotsJson from '@/jsons/slots.json'
import githubApi from '@/services/github/api'
import { PtsHistoryType } from '@/store/reducers/app.reducer'
import { addNewPtsHistory, updateEpoch, updateWVS } from '@/store/actions/app.action'
import { useContributorContract } from '@/hooks/useContract'
import { useEffect, useState } from 'react'
import { useWallet } from '@/context/WalletProvider'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentEpoch, getPtsHistory, getState } from '@/selectors/appState.selector'

const StorageUpdater = () => {
  const contributorContract = useContributorContract()
  const {address} = useWallet()
  const dispatch = useDispatch()
  const state = useSelector(getState)
  const ptsHistories = useSelector(getPtsHistory)
  const currentEpoch = useSelector(getCurrentEpoch)
  console.log('current epoch', currentEpoch)
  
  const refetch = async () => {
    console.log('state>>>', state)

    if (!contributorContract || !address) return
    // const currentHisLength = ptsHistories.length
    // console.log('length of history', currentHisLength)
    let epoch = await contributorContract?.epoch.staticCall()
    if (epoch != currentEpoch) {
      console.log('epoch', epoch)
      dispatch(updateEpoch(Number(epoch)))
      try {
        let res = await githubApi.wvs(epoch)
        console.log('WVS', res)
        dispatch(updateWVS(JSON.parse(res.data)))
      } catch (error) {
        console.log(error)
      }
    }
    // if (Number(currentHisLength) < Number(epoch)) {
    //   const slot = await contributorContract.slotOfMember(address)
    //   const slotsJsonObj: { [member: string]: number } = slotsJson;
    //   const key = Object.keys(slotsJsonObj).find(key => slotsJsonObj[key] === Number(slot));

    //   if (!key) {
    //     console.error("No matching key found in slotsJsonObj");
    //     return;
    //   }

    //   for (let i = 1; i < Number(epoch) - Number(currentHisLength); i++) {
    //     try {
    //       const epochPts: any = await contributorContract.getPointsHistory(address, currentHisLength + i);
    //       let wvs = await githubApi.wvs(currentHisLength + i);
    //       const wvsData = JSON.parse(wvs.data);
    //       let txHashinWvs = await githubApi.wvs(currentHisLength + i + 1);
    //       console.log('WVS i', currentHisLength + i + 1, JSON.parse(txHashinWvs.data))
    //       const txHashinWvsData = JSON.parse(txHashinWvs.data);

    //       let ptsHistory: PtsHistoryType = {
    //         epoch: currentHisLength + i,
    //         timestamp: new Date(Number(epochPts[0]) * 1000).getTime(),
    //         txHash: txHashinWvsData.txsData.txHash,
    //         avgPoints: (epochPts[1] / BigInt(10000)).toString(),
    //         valWorks: wvsData.wvs.filter((item: any) => item.member.toLowerCase() === key).flatMap((item: any) => Object.keys(item.works))
    //       };

    //       console.log('pts history', ptsHistory)

    //       dispatch(addNewPtsHistory(ptsHistory));
    //     } catch (error) {
    //         console.error(`Error processing epoch ${i}:`, error);
    //     }
    //   }
    // }
  }

  useEffect(() => {
    refetch()
  }, [contributorContract, address])

  return null
}

export default StorageUpdater