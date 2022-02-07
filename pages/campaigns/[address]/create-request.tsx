import { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import { Button, Form, Input, Message } from 'semantic-ui-react'
import Layout from '../../../components/Layout'
import { createCampaignContractInstance } from '../../../ethereum/campaign'
import web3 from '../../../ethereum/web3'

interface CreateCampaignRequestProps {
  address: string
}

const CreateCampaignRequest: FC<CreateCampaignRequestProps> = ({ address }) => {
  const [value, setValue] = useState('')
  const [description, setDescription] = useState('')
  const [recipient, setRecipient] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage('')

    const campaign = createCampaignContractInstance(address)

    try {
      const accounts = await web3.eth.getAccounts()
      await campaign.methods
        // Recipient address must be a real address
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({ from: accounts[0] })
      router.push(`/campaigns/${address}/requests`)
    } catch (err: any) {
      setErrorMessage(err.message)
    }
    setLoading(false)
  }

  return (
    <Layout>
      <Link href={`/campaigns/${address}/requests`}>
        <a>Back</a>
      </Link>
      <h3>Create a request</h3>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input value={description} onChange={(event) => setDescription(event?.target.value)} />
        </Form.Field>

        <Form.Field>
          <label>Value in ether</label>
          <Input
            label="ether"
            labelPosition="right"
            value={value}
            onChange={(event) => setValue(event?.target.value)}
          />
        </Form.Field>

        <Form.Field>
          <label>Recipient</label>
          <Input value={recipient} onChange={(event) => setRecipient(event?.target.value)} />
        </Form.Field>

        <Message error header="Oops!" content={errorMessage} />
        <Button primary loading={loading}>
          Create
        </Button>
      </Form>
    </Layout>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { address } = context.query

  return { props: { address } }
}

export default CreateCampaignRequest
