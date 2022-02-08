import Link from 'next/link'
import { GetServerSidePropsContext } from 'next'

import React, { FC } from 'react'
import { Button, Grid, Table } from 'semantic-ui-react'
import Layout from '../../../components/Layout'
import { createCampaignContractInstance } from '../../../ethereum/campaign'
import { RequestRow } from '../../../components/RequestRow'

export type RequestType = {
  '0': string
  '1': string
  '2': string
  '3': false
  '4': string
  description: string
  value: string
  recipient: string
  complete: false
  approvalCount: string
}
interface CampaignRequestsProps {
  address: string
  approversCount: number
  requests: RequestType[]
  requestsCount: number
}

const CampaignRequests: FC<CampaignRequestsProps> = ({ address, approversCount, requests, requestsCount }) => {
  const { Header, Row, HeaderCell, Body } = Table

  // console.log(requests[0])

  const renderRows = () => {
    return requests.map((request: RequestType, index: number) => {
      return <RequestRow key={index} request={request} id={index} address={address} approversCount={approversCount} />
    })
  }

  return (
    <Layout>
      <h3>Requests</h3>
      <Grid>
        <Grid.Column>
          <Link href={`/campaigns/${address}/create-request`}>
            <a>
              <Button primary floated="right" style={{ marginBottom: '10px' }}>
                Create Request
              </Button>
            </a>
          </Link>
          <Table>
            <Header>
              <Row>
                <HeaderCell>ID</HeaderCell>
                <HeaderCell>Description</HeaderCell>
                <HeaderCell>Amount</HeaderCell>
                <HeaderCell>Recipient</HeaderCell>
                <HeaderCell>Approval Count</HeaderCell>
                <HeaderCell>Approve</HeaderCell>
                <HeaderCell>Finalise</HeaderCell>
              </Row>
            </Header>
            <Body>{renderRows()}</Body>
          </Table>
          <div>Found {requestsCount} requests</div>
        </Grid.Column>
      </Grid>
    </Layout>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { address } = context.query
  const campaign = createCampaignContractInstance(address)
  const requestsCount: number = await campaign.methods.getRequestsCount().call()
  const approversCount: number = await campaign.methods.approversCount().call()

  // Solidity does not allow us to get an array of structs, so we need to manually iterate through the requests count
  // This returns [Object Object, Object Object] hence the need to stringify and convert to JSON
  const requestsResponse = await Promise.all(
    [...Array(requestsCount).keys()].map((index) => campaign.methods.requests(index).call()),
  )

  const requests = JSON.parse(JSON.stringify(requestsResponse))

  return { props: { address, requests, requestsCount, approversCount } }
}

export default CampaignRequests
