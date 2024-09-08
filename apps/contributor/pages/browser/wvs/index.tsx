import React, { memo, useEffect, useState } from 'react'
import { AppWarpper, BoxFlex, BoxFlexColumn, BoxFlexEnd, BoxFlexSpaceBetween } from '@/pages/styled'
import githubApi from '@/services/github/api'
import { Button, ButtonBase, Checkbox, Link, Typography } from '@mui/material';
import { useContributorContract } from '@/hooks/useContract';
import { useAccessManagerV2Contract } from '@/hooks/useContract';
import slotsJson from '@/jsons/slots.json';
import { MerkleTree } from '@bucknet/proof-generator';
import { Connect } from '@/components/ConnectButton';
import { Roles } from '@/constants/contracts';
import { useWallet } from '@/context/WalletProvider';

interface Member {
  member: string;
  works: any;
  setPointObj: (obj: {[member in string]: number | undefined}) => void;
  pointObj: {[member in string]: number | undefined};
}

interface Work {
  work: string;
  pow: string;
  setPoint: (point: number) => void;
}

const EvalScoring = ({
  setPoint
}: {
  setPoint: (point: number) => void
}) => {
  const [score, setScore] = useState<number | null>(null)
  const scores = [0, 1, 2, 3, 4, 5]

  return (
    <BoxFlexEnd maxWidth={250} paddingRight={"40px"}>
      {
        scores.map((i) => {
          return (
            <input
              type="checkbox" 
              key={(i + 1).toString()} 
              onChange={(e) => {
                if(e.target.checked) {
                  if(score) {
                    setPoint(-score + i)
                  } else {
                    setPoint(i)
                  }
                  setScore(i)
                } else {
                  if(score) setPoint(-score)
                  setScore(null)
                }
              }} 
              checked={score != null && score >= i}
            />
          )
        })
      }
    </BoxFlexEnd>
  )
}

const RenderWork = ({ work, pow, setPoint }: Work) => {

  return (
    <BoxFlexSpaceBetween gap={20}>
      <Typography maxWidth={350}>{work}</Typography>
      <Link href={pow} target="_blank">{pow.slice(0, 20) + "..." + pow.slice(pow.length - 20, pow.length)}</Link>
      <EvalScoring setPoint={setPoint}/>
    </BoxFlexSpaceBetween>
  )
} 

const RenderMember = ({ member, works, pointObj, setPointObj }: Member) => {
  const [totalPoint, setTotalPoint] = useState(0)

  const setPoint = (point: number) => {
    const newPoint = totalPoint + point
    setTotalPoint(newPoint)
  }

  useEffect(() => {
    if(totalPoint > 0) {
      const newPointObj = {
        ...pointObj,
        [member]: totalPoint
      }
      setPointObj(newPointObj)
    }
    
    return () => {
      setPointObj({
        ...pointObj,
        [member]: 0
      })
    }
  }, [totalPoint])

  return (
    <BoxFlexColumn pl={3} sx={{ cursor: 'pointer' }} borderBottom={"1px solid black"}>
      <BoxFlex>
        <BoxFlex maxWidth={150}>
          <Typography>{member}</Typography>
        </BoxFlex>
        <BoxFlexColumn>
          {
            Object.keys(works).map((item: string, index: number) => {
              return <RenderWork key={index} work={item} pow={works[item]} setPoint={setPoint} />
            })
          }
        </BoxFlexColumn>
      </BoxFlex>
    </BoxFlexColumn>
  )
}

export default memo(function BrowserHome() {
  const [wvs, setWvs] = useState<any>()
  const [pointObj, setPointObj] = useState<{
    [member in string]: number | undefined
  }>({})
  const contributorContract = useContributorContract();
  const accessManagerContract = useAccessManagerV2Contract();
  const { address } = useWallet(); 
  const [isAdmin, setIsAdmin] = useState(false);

  
  useEffect(() => {
    const getWVS = async () => {
      let res = await githubApi.wvs(1);
      console.log('wvs', JSON.parse(res.data))
      setWvs(JSON.parse(res.data));
    }

    getWVS()
  }, [])

  useEffect(() => {
    if(address) {
      accessManagerContract?.hasRole(Roles.DEFAULT_ADMIN_ROLE, address)
      .then((res: boolean) => {
        console.log({res})
        setIsAdmin(res)
      })
      .catch(err => {
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
        if(point != undefined) {
          points.push(point)
          slots.push(slotsJsonObj[member.toLocaleLowerCase()])
        }
      })
      console.log(points)
      const receipt = await contributorContract.evaluate(slots, points)
      await receipt.wait()
      console.log(receipt)
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
        if(slotsJsonObj[item.member.toLocaleLowerCase()] !== undefined) {
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
    <AppWarpper>
      <Connect />
      {wvs && wvs?.wvs?.map((item: Member, index: number) => {
        return <RenderMember key={index} member={item.member} works={item.works} setPointObj={setPointObj} pointObj={pointObj} />
      })}
      <BoxFlexSpaceBetween>
        <BoxFlexSpaceBetween maxWidth={500}>
          <div style={{ fontWeight: 600 }}>Total Points:</div>
          {
            Object.entries(pointObj).map(([member, point]) => {
              return (
                <div key={member}>
                  {point !== undefined && (
                    <div>{member}: {point}</div>
                  )}
                </div>
              )
            })
          }
        </BoxFlexSpaceBetween>
        {
          isAdmin && (
            <ButtonBase sx={{
              width: "200px", 
              background: "blue", 
              color: "white", 
              padding: 1.5
            }}
            onClick={openEvalSession}
            >
              Open Evaluate Session
            </ButtonBase>
          )
        }
        <ButtonBase sx={{
          width: "100px", 
          background: "blue", 
          color: "white", 
          padding: 1.5
        }}
        onClick={evaluate}
        >
          Submit
        </ButtonBase>
      </BoxFlexSpaceBetween>
    </AppWarpper>
  )
})