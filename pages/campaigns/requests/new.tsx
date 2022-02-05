import React, { Component, useState } from "react";
import { Form, Button, Message, Input } from "semantic-ui-react";
import { useRouter } from "next/router";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import Layout from "../../../components/Layout";
import Link from "next/link";
const RequestNew = ({ address }: any) => {
  const router = useRouter();
  const [value, setValue] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState<string>();
  const [description, setDescription] = useState<string>();

  const onSubmit = async (event: any) => {
    event.preventDefault();

    const campaign = Campaign(address);

    setLoading(true);
    setErrorMessage("");

    try {
      const accounts = await web3.eth.getAccounts();
      if (!value) return;
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({ from: accounts[0] });
      router.push(`/campaigns/${address}/requests`);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <Link href={`/campaigns/${address}/requests`}>
        <a>Back</a>
      </Link>
      <h3>Create a Request</h3>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Value in Ether</label>
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
          />
        </Form.Field>
        <Message error header="Oops!" content={errorMessage} />
        <Button primary loading={loading}>
          Create!
        </Button>
      </Form>
    </Layout>
  );
};

export default RequestNew;
