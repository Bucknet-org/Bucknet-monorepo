import React, { memo, useEffect, useState } from 'react'
import { AppWarpper, BoxFlex, BoxFlexColumn, BoxFlexEnd, BoxFlexSpaceBetween } from '@/pages/styled'
import githubApi from '@/services/github/api'
import { Typography } from '@mui/material';

interface Member {
  member: string;
  works: any;
}

interface Work {
  work: string;
  pow: string;
}

const RenderWork = ({ work, pow }: Work) => {
  return (
    <BoxFlexEnd>
      <Typography>{work}</Typography>
      <a>{pow}</a>
    </BoxFlexEnd>
  )
} 

const RenderMember = ({ member, works }: Member) => {
  console.log('type of works', typeof(works))
  return (
    <BoxFlexColumn pl={3} sx={{ cursor: 'pointer' }}>
      <BoxFlexSpaceBetween>
        <BoxFlex>
          <Typography>{member}</Typography>
        </BoxFlex>
        <BoxFlexColumn>
          {
            Object.keys(works).map((item: string, index: number) => {
              return <RenderWork key={index} work={item} pow={works[item]} />
            })
          }
        </BoxFlexColumn>
      </BoxFlexSpaceBetween>
    </BoxFlexColumn>
  )
}

export default memo(function BrowserHome() {
  const [wvs, setWvs] = useState<any>()

  useEffect(() => {
    const getWVS = async () => {
      let res = await githubApi.wvs(1);
      console.log('wvs', JSON.parse(res.data))
      setWvs(JSON.parse(res.data));
    }

    getWVS()
  }, [])

  return (
    <AppWarpper>
      {wvs && wvs?.wvs?.map((item: Member, index: number) => {
        return <RenderMember key={index} member={item.member} works={item.works} />
      })}
    </AppWarpper>
  )
})