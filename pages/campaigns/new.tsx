import React, { FC, useState } from 'react'
import { Button, Form, Input, Message } from 'semantic-ui-react'
import Layout from '../../components/Layout'
import factory from '../../ethereum/factory'
import web3 from '../../ethereum/web3'

export const CampaignNew: FC = () => {
  const [minContribution, setMinContribution] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage('')
    try {
      const accounts = await web3.eth.getAccounts()
      // Note: don't need to specify gas amount as Metamask tries to calculate this automatically
      await factory.methods.createCampaign(minContribution).send({ from: accounts[0] })
    } catch (err: any) {
      setErrorMessage(err.message)
    }
    setLoading(false)
  }

  return (
    <Layout>
      <h3>Create a campaign!</h3>
      {/* error prop needed to tell semantic UI we have a message component with error styling within Form */}
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Minimum contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            value={minContribution}
            onChange={(event) => setMinContribution(event?.target.value)}
          />
        </Form.Field>
        <Message error header="Oops!" content={errorMessage} />
        <Button primary loading={loading}>
          Create
        </Button>
      </Form>
    </Layout>
  )
}

export default CampaignNew
