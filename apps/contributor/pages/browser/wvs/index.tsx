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
import { getState, getWVS } from '@/selectors/appState.selector';
import { getStrTruncateMiddle } from '@/utils/function'

interface Member {
  member: string
  works: any
  setPointObj: (obj: { [member in string]: number | undefined }) => void
  pointObj: { [member in string]: number | undefined }
  wvsPoints: { [member in string]: {[work in string]: number | undefined} }
  setWvsPoints: (obj: {[member in string]: {[work in string]: number | undefined}}) => void
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
        {getStrTruncateMiddle(pow, 10)}
      </Link>
      <EvalScoring setPoint={setPoint} />
    </Stack>
  )
}

const RenderMember = ({ member, works, pointObj, setPointObj, wvsPoints, setWvsPoints }: Member) => {
  const [workPoints, setWorkPoints] = useState<{ [work: string]: number }>({});

  const setPoint = (work: string, point: number) => {
    setWorkPoints(prev => {
      const newPoints = {
        ...prev,
        [work]: (prev[work] || 0) + point
      };

      // Update workPoints state
      setWvsPoints({
        ...wvsPoints,
        [member]: {
          ...wvsPoints[member],
          ...newPoints
        }
      });

      return newPoints;
    });
  };

  useEffect(() => {
    const memberTotalPoints = Object.values(workPoints).reduce((sum, points) => sum + points, 0);
    
    if (memberTotalPoints > 0) {
      const newPointObj = {
        ...pointObj,
        [member]: memberTotalPoints
      };
      setPointObj(newPointObj);
    }

    return () => {
      setPointObj({
        ...pointObj,
        [member]: 0
      });
    };
  }, [workPoints, member, pointObj, setPointObj, setWorkPoints]);

  return (
    <MemeberWrap pl={3} borderBottom={'1px solid white'}>
      <BoxFlex>
        <BoxFlex maxWidth={150}>
          <Typography>{member}</Typography>
        </BoxFlex>
        <ContentContainer>
          {Object.keys(works).map((item: string, index: number) => {
            return <RenderWork key={index} work={item} pow={works[item]} setPoint={(point: number) => setPoint(item, point)} />
          })}
        </ContentContainer>
      </BoxFlex>
    </MemeberWrap>
  )
}

export default memo(function WVS() {
  const wvs = useSelector(getWVS)
  const dispatch = useDispatch()

  const [pointObj, setPointObj] = useState<{
    [member in string]: number | undefined
  }>({})

  const [wvsPoints, setWvsPoints] = useState<{
    [member in string]: {[work: string]: number | undefined}
  }>({})

  const contributorContract = useContributorContract()
  const accessManagerContract = useAccessManagerV2Contract()
  const { address } = useWallet()
  const [isContributor, setIsContributor] = useState(false)

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
        epoch: wvs.epoch,
        timestamp: new Date().getTime(),
        txHash: receipt.hash,
        wvs: wvsPoints
      }

      console.log('eval history', evalHistory)

      dispatch(addNewEvalHistory(evalHistory))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (address) {
      accessManagerContract
        ?.hasRole(Roles.CONTRIBUTOR_ROLE, address)
        .then((res: boolean) => {
          console.log({ res })
          setIsContributor(res)
        })
        .catch((err) => {
          console.log(err)
          console.error(err)
          setIsContributor(false)
        })
    }
  }, [accessManagerContract])

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
          <Typography flex={1}>PoW</Typography>
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
              pointObj={pointObj}
              setPointObj={setPointObj}
              wvsPoints={wvsPoints}
              setWvsPoints={setWvsPoints}
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
      {/* {isAdmin && <SubmitButton onClick={openEvalSession}>Open Evaluate Session</SubmitButton>} */}
      {isContributor && <SubmitButton onClick={evaluate}>Submit</SubmitButton>}
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