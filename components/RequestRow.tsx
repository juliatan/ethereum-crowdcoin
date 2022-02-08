import React, { FC } from 'react'
import { Button, Table } from 'semantic-ui-react'
import { createCampaignContractInstance } from '../ethereum/campaign'
import web3 from '../ethereum/web3'
import { RequestType } from '../pages/campaigns/[address]/requests'

interface RequestRowProps {
  request: RequestType
  id: number
  address: string
  approversCount: number
}
export const RequestRow: FC<RequestRowProps> = ({ request, id, address, approversCount }) => {
  const { Row, Cell } = Table
  const readyToFinalise = request.approvalCount > approversCount / 2

  const onApprove = async () => {
    const campaign = createCampaignContractInstance(address)

    const accounts = await web3.eth.getAccounts()
    await campaign.methods.approveRequest(id).send({
      from: accounts[0],
    })
  }

  const onFinalise = async () => {
    const campaign = createCampaignContractInstance(address)

    const accounts = await web3.eth.getAccounts()
    await campaign.methods.finaliseRequest(id).send({
      from: accounts[0],
    })
  }

  return (
    <Row disabled={request.complete} positive={readyToFinalise && !request.complete}>
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>
        {request.approvalCount} / {approversCount}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button color="green" basic onClick={onApprove}>
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button color="teal" basic onClick={onFinalise}>
            Finalise
          </Button>
        )}
      </Cell>
    </Row>
  )
}
