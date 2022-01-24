import React, { FC, useState } from 'react'
import { Button, Form, Input } from 'semantic-ui-react'
import Layout from '../../components/Layout'
import factory from '../../ethereum/factory'
import web3 from '../../ethereum/web3'

export const CampaignNew: FC = () => {
  const [minContribution, setMinContribution] = useState('')

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const accounts = await web3.eth.getAccounts()

    // Note: don't need to specify gas amount as Metamask tries to calculate this automatically
    await factory.methods.createCampaign(minContribution).send({ from: accounts[0] })
  }

  return (
    <Layout>
      <h3>Create a campaign!</h3>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Minimum contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            value={minContribution}
            onChange={(event) => setMinContribution(event?.target.value)}
          />
        </Form.Field>
        <Button primary>Create</Button>
      </Form>
    </Layout>
  )
}

export default CampaignNew
