import { GetServerSidePropsContext } from 'next'
import React, { FC, ReactChildren } from 'react'
import Layout from '../../components/Layout'
import { createCampaignContractInstance } from '../../ethereum/campaign'

type CampaignSummary = {
  minimumContribution: number
  balance: number
  approversCount: number
  requestsCount: number
  manager: string
}

interface CampaignShowProps {
  summary: CampaignSummary
  children: ReactChildren
}

const getCampaignSummary = async (address: string): Promise<CampaignSummary> => {
  const campaign = createCampaignContractInstance(address)
  const summary = await campaign.methods.getSummary().call() // Note, this gives us back an object where the keys are numbers

  return {
    minimumContribution: summary[0],
    balance: summary[1],
    approversCount: summary[2],
    requestsCount: summary[3],
    manager: summary[4],
  }
}

const CampaignShow: FC<CampaignShowProps> = ({ summary }) => {
  return (
    <Layout>
      <h1>Campaign Show Page</h1>
      {summary.minimumContribution}
    </Layout>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { address } = context.query

  const summary = await getCampaignSummary(address as string)
  return { props: { summary } }
}

export default CampaignShow
