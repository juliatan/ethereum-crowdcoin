import { GetServerSidePropsContext } from 'next'
import React, { FC, ReactChildren } from 'react'
import { Card, Grid } from 'semantic-ui-react'
import { ContributeForm } from '../../components/ContributeForm'
import Layout from '../../components/Layout'
import { createCampaignContractInstance } from '../../ethereum/campaign'
import web3 from '../../ethereum/web3'

type CampaignSummary = {
  minimumContribution: number
  balance: number
  approversCount: number
  requestsCount: number
  manager: string
}

interface CampaignShowProps {
  address: string
  children: ReactChildren
  summary: CampaignSummary
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

const CampaignShow: FC<CampaignShowProps> = ({ summary, address }) => {
  const renderCards = () => {
    const { minimumContribution, balance, approversCount, requestsCount, manager } = summary
    const items = [
      {
        header: manager,
        meta: 'Address of manager',
        description: 'The manager created this campaign and can create requests to withdraw money',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: minimumContribution,
        description: 'Minimum contribution (wei)',
        meta: 'You must contribute at least this much wei to become an approver',
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        description: 'Campaign balance (ether)',
        meta: 'How much money this campaign has left to spend',
      },
      {
        header: approversCount,
        description: 'Number of people who have already donated to this campaign',
        meta: 'Number of approvers',
      },
      {
        header: requestsCount,
        description:
          'A request tries to withdraw money from the contract. This needs to be approved by the majority of approvers.',
        meta: 'Number of requests',
      },
    ]
    return <Card.Group items={items} />
  }

  return (
    <Layout>
      <h1>Campaign Show Page</h1>

      <Grid>
        <Grid.Column width={10}>{renderCards()}</Grid.Column>
        <Grid.Column width={6}>
          <ContributeForm address={address} />
        </Grid.Column>
      </Grid>
    </Layout>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { address } = context.query

  const summary = await getCampaignSummary(address as string)
  return { props: { summary, address } }
}

export default CampaignShow
