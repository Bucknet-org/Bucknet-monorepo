/// <reference types="chrome"/> 
import React, { memo, useEffect, useState } from 'react'
import { AppWarpper, BoxFlex, BoxFlexColumn, BoxFlexEnd, BoxFlexSpaceBetween } from '@/pages/styled'
import githubApi from '@/services/github/api'
import { Box, Button, ButtonBase, Checkbox, Link, Stack, styled, Typography } from '@mui/material'
import { useContributorContract } from '@/hooks/useContract'
import { useAccessManagerV2Contract } from '@/hooks/useContract'
import slotsJson from '@/jsons/slots.json'
import { MerkleTree } from '@bucknet/proof-generator'
import { Connect } from '@/components/ConnectButton'
import { Roles } from '@/constants/contracts'
import { useWallet } from '@/context/WalletProvider'
import { AppColors, AppSpace } from '@/constants/assets_app/app_theme'
import { timeFormat } from '@/constants/dateFormat';
import { useDispatch, useSelector } from 'react-redux';
import { addNewEvalHistory } from '@/store/actions/app.action';
import { EvalHistoryType } from '@/store/reducers/app.reducer';
import { getState } from '@/selectors/appState.selector';

interface Member {
  member: string
  works: any
  setPointObj: (obj: { [member in string]: number | undefined }) => void
  pointObj: { [member in string]: number | undefined }
}

interface Work {
  work: string
  pow: string
  setPoint: (point: number) => void
}

const EvalScoring = ({ setPoint }: { setPoint: (point: number) => void }) => {
  const [score, setScore] = useState<number | null>(null)
  const scores = [0, 1, 2, 3, 4, 5]

  return (
    <CheckPoint pl={12} flex={1} paddingRight={'16px'}>
      {scores.map((i) => {
        return (
          <IconCheck
            type="checkbox"
            key={(i + 1).toString()}
            onChange={(e) => {
              if (e.target.checked) {
                if (score) {
                  setPoint(-score + i)
                } else {
                  setPoint(i)
                }
                setScore(i)
              } else {
                if (score) setPoint(-score)
                setScore(null)
              }
            }}
            checked={score != null && score >= i}
          />
        )
      })}
    </CheckPoint>
  )
}

const RenderWork = ({ work, pow, setPoint }: Work) => {
  return (
    <Stack
      sx={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <Typography flex={2}>{work}</Typography>

      <Link sx={{textDecoration: 'none'}} color={AppColors.primary} flex={1} href={pow} target="_blank">
        {/* {pow.slice(0, 20) + '...' + pow.slice(pow.length - 20, pow.length)} */}
        Check detail
      </Link>
      <EvalScoring setPoint={setPoint} />
    </Stack>
  )
}

const RenderMember = ({ member, works, pointObj, setPointObj }: Member) => {
  const [totalPoint, setTotalPoint] = useState(0)

  const setPoint = (point: number) => {
    const newPoint = totalPoint + point
    setTotalPoint(newPoint)
  }

  useEffect(() => {
    if (totalPoint > 0) {
      const newPointObj = {
        ...pointObj,
        [member]: totalPoint,
      }
      setPointObj(newPointObj)
    }

    return () => {
      setPointObj({
        ...pointObj,
        [member]: 0,
      })
    }
  }, [totalPoint])

  return (
    <MemeberWrap pl={3} borderBottom={'1px solid white'}>
      <BoxFlex>
        <BoxFlex maxWidth={150}>
          <Typography>{member}</Typography>
        </BoxFlex>
        <ContentContainer>
          {Object.keys(works).map((item: string, index: number) => {
            return <RenderWork key={index} work={item} pow={works[item]} setPoint={setPoint} />
          })}
        </ContentContainer>
      </BoxFlex>
    </MemeberWrap>
  )
}

export default memo(function BrowserHome() {
  const state = useSelector(getState)
  const dispatch = useDispatch()

  const [wvs, setWvs] = useState<any>()
  const [pointObj, setPointObj] = useState<{
    [member in string]: number | undefined
  }>({})
  const contributorContract = useContributorContract()
  const accessManagerContract = useAccessManagerV2Contract()
  const { address } = useWallet()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const getWVS = async () => {
      let res = await githubApi.wvs(1)
      console.log('wvs', JSON.parse(res.data))
      setWvs(JSON.parse(res.data))
    }

    getWVS()
  }, [])

  useEffect(() => {
    let evalHistory: EvalHistoryType = {
      timestamp: new Date().getTime(),
      txHash: 'asdfasd',
      wvs: wvs
    }

    console.log('test eval history', evalHistory)
    dispatch(addNewEvalHistory(evalHistory))
    console.log('state', state)
  }, [wvs])

  useEffect(() => {
    console.log('state', state)
  }, [state])

  useEffect(() => {
    let evalHistory: EvalHistoryType = {
      timestamp: new Date().getTime(),
      txHash: 'asdfasd',
      wvs: wvs
    }

    console.log('test eval history', evalHistory)
    dispatch(addNewEvalHistory(evalHistory))
    console.log('state', state)
  }, [wvs])

  useEffect(() => {
    console.log('state', state)
  }, [state])

  useEffect(() => {
    if (address) {
      accessManagerContract
        ?.hasRole(Roles.DEFAULT_ADMIN_ROLE, address)
        .then((res: boolean) => {
          console.log({ res })
          setIsAdmin(res)
        })
        .catch((err) => {
          console.log(err)
          console.error(err)
          setIsAdmin(false)
        })
    }
  }, [accessManagerContract])

  const evaluate = async () => {
    try {
      if (!contributorContract) return

      const slots: number[] = []
      const points: number[] = []
      const slotsJsonObj: { [member in string]: number } = slotsJson

      Object.entries(pointObj).map(([member, point]) => {
        if (point != undefined) {
          points.push(point)
          slots.push(slotsJsonObj[member.toLocaleLowerCase()])
        }
      })
      console.log(points)
      const receipt = await contributorContract.evaluate(slots, points)
      await receipt.wait()

      let evalHistory: EvalHistoryType = {
        timestamp: new Date().getTime(),
        txHash: receipt.hash,
        wvs: wvs
      }
      dispatch(addNewEvalHistory(evalHistory))

      // chrome.storage.local.get({evalHistories: []}, function (result) {
      //   const evalHistories = result.evalHistories;
      //   evalHistories.push({time: new Date().toLocaleString("en-US", timeFormat).replace(',', ''), txhash: receipt.hash})
      //   chrome.storage.local.set({evalHistories: evalHistories}, function () {
      //     chrome.storage.local.get('evalHistories', function (result) {
      //         console.log(result.evalHistories)
      //     });
      // });
      // })
    } catch (err) {
      console.log(err)
    }
  }

  const openEvalSession = async () => {
    try {
      if (!contributorContract && !wvs?.wvs) return
      //member-taskname-pow
      const leaves: string[] = []
      const slots: number[] = []
      const numOfWorks: number[] = []
      const slotsJsonObj: { [member in string]: number } = slotsJson

      wvs.wvs.map((item: Member) => {
        Object.entries(item.works).map(([task, pow]) => {
          leaves.push(`${item.member}-${task}-${pow}`)
        })
        if (slotsJsonObj[item.member.toLocaleLowerCase()] !== undefined) {
          slots.push(slotsJsonObj[item.member.toLocaleLowerCase()])
          numOfWorks.push(Object.keys(item.works).length)
        }
      })
      const tree = new MerkleTree(leaves)
      const poeRoot = tree.getHexRoot()
      console.log(poeRoot, slots, numOfWorks)
      const receipt = await contributorContract?.openEvalSession(poeRoot, slots, numOfWorks)
      await receipt.wait()
      console.log(receipt)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <AppContainer>
      <Connect />
      <Typography py={1} px={1} fontSize={24} color={AppColors.primary} >Weekly Evaluation</Typography>
      <Stack
        sx={{
          flexDirection: 'row',
          gap: '24px',
          paddingLeft: '12px',
          borderBottom: '1px solid white',
          paddingBottom: '12px',
        }}
      >
        <Box width="168px">
          <Typography>Member</Typography>
        </Box>
        <Stack
          sx={{
            flexDirection: 'row',
            width: '100%',
            gap: '12px',
          }}
        >
          <Typography flex={2}>Work</Typography>
          <Typography flex={1}>Detail</Typography>
          <Typography pl={12} flex={1} >Score</Typography>
        </Stack>
      </Stack>
      {wvs &&
        wvs?.wvs?.map((item: Member, index: number) => {
          return (
            <RenderMember
              key={index}
              member={item.member}
              works={item.works}
              setPointObj={setPointObj}
              pointObj={pointObj}
            />
          )
        })}
      
      <ContentWrap>
        <ContentWrap>
          <div style={{ fontWeight: 600 }}>Total Points:</div>
          {Object.entries(pointObj).map(([member, point]) => {
            return (
              <div key={member}>
                {point !== undefined && (
                  <div>
                    {member}: {point}
                  </div>
                )}
              </div>
            )
          })}
        </ContentWrap>
        
      </ContentWrap>
      <Stack flexDirection='row' gap={4} justifyContent='flex-end'>
      {isAdmin && <SubmitButton onClick={openEvalSession}>Open Evaluate Session</SubmitButton>}
      <SubmitButton onClick={evaluate}>Submit</SubmitButton>
      </Stack>
     
    </AppContainer>
  )
})

//Style

const AppContainer = styled(Box)({
  margin: 'auto',
  width: '90%',
  background: AppColors.background,
  color: AppColors.white,
})

const ContentWrap = styled(Box)(({ theme }) => ({
  width: '100%',
  flexWrap:'wrap',
  justifyContent: 'flex-start',
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
}))

const SubmitButton = styled(ButtonBase)({
  margin: '16px 12px',
  width: '100px',
  background: AppColors.gradientPrimary,
  borderRadius: 4,
  padding: '8px 12px',
  minWidth: 'fit-content',
  whiteSpace: 'nowrap',
  fontWeight: 'bold',
})

const CheckPoint = styled(Box)(({ ...props }) => ({
  width: '100%',
  justifyContent: 'flex-start',
  display: 'flex',
  alignItems: 'center',
  gap: `${props.gap ? props.gap : 10}px`,
}))

const IconCheck = styled('input')({
  appearance: 'none',
  width: '18px',
  height: '18px',
  borderRadius: '100%',
  backgroundColor: '#e0e0e0',
  cursor: 'pointer',
  outline: 'none',
  transition: 'background-color 0.2s',
  '&:checked': {
    backgroundColor: AppColors.primary, // Change to orange when checked
  },
})

const ContentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  paddingLeft: '12px',
  borderLeft: '1px solid white',
}))

const MemeberWrap = styled(Box)(({ theme }) => ({
  width: '100%',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',

  paddingLeft: '12px',
}))
