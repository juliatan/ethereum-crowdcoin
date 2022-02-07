import Link from 'next/link'
import { GetServerSidePropsContext } from 'next'

import React, { FC } from 'react'
import { Button, Grid } from 'semantic-ui-react'
import Layout from '../../../components/Layout'

interface CampaignRequestsProps {
  address: string
}

const CampaignRequests: FC<CampaignRequestsProps> = ({ address }) => {
  return (
    <Layout>
      <h3>Requests</h3>
      <Grid>
        <Grid.Column>
          <Link href={`/campaigns/${address}/create-request`}>
            <a>
              <Button primary>Create Request</Button>
            </a>
          </Link>
        </Grid.Column>
      </Grid>
    </Layout>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { address } = context.query

  return { props: { address } }
}

export default CampaignRequests
