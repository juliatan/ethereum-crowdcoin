import React, { FC } from 'react'
import { Button, Card } from 'semantic-ui-react'
import Layout from '../components/Layout'
import factory from '../ethereum/factory'

interface CampaignIndexProps {
  campaigns: string[]
}

const CampaignIndex: FC<CampaignIndexProps> = (props) => {
  const renderCampaigns = () => {
    const items = props.campaigns.map((address) => {
      return { header: address, description: <a>View campaign</a>, fluid: true }
    })
    return <Card.Group items={items} />
  }

  return (
    <Layout>
      <link async rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css" />
      <h1>Campaign list page</h1>
      <h3>Open Campaigns</h3>
      {renderCampaigns()}
      <Button content="Create campaign" icon="add circle" primary />
    </Layout>
  )
}

export async function getStaticProps() {
  const campaigns = await factory.methods.getDeployedCampaigns().call()

  return {
    props: {
      campaigns,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in, at most once every 1 second
    revalidate: 1, // In seconds
  }
}
export default CampaignIndex
