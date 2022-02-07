import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Button, Form, Input, Message } from 'semantic-ui-react'
import { createCampaignContractInstance } from '../ethereum/campaign'
import web3 from '../ethereum/web3'

interface ContributeFormProps {
  address: string
}

export const ContributeForm: React.FC<ContributeFormProps> = ({ address }) => {
  const router = useRouter()

  const [value, setValue] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage('')

    const campaign = createCampaignContractInstance(address)

    try {
      const accounts = await web3.eth.getAccounts()
      await campaign.methods.contribute().send({ from: accounts[0], value: web3.utils.toWei(value, 'ether') })
      router.reload()
    } catch (err: any) {
      setErrorMessage(err.message)
    }
    setLoading(false)
    setValue('')
  }

  return (
    <Form onSubmit={onSubmit} error={!!errorMessage}>
      <Form.Field>
        <label>Amount to contribute</label>
        <Input label="ether" labelPosition="right" value={value} onChange={(event) => setValue(event?.target.value)} />
      </Form.Field>
      <Message error header="Oops!" content={errorMessage} />
      <Button primary loading={loading}>
        Create
      </Button>
    </Form>
  )
}
