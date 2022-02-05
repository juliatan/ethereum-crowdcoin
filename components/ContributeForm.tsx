import { useRouter } from "next/router";
import React, { Component, useState } from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";

const ContributeForm = ({ address }: any) => {
  const router = useRouter();
  const [value, setValue] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: any) => {
    event.preventDefault();

    const campaign = Campaign(address);
    setLoading(true);
    setErrorMessage("");

    try {
      const accounts = await web3.eth.getAccounts();
      if (!value) return;
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(value, "ether"),
      });
      router.push(`/campaigns/${address}`);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
    setLoading(false);
    setValue("");
  };

  return (
    <Form onSubmit={onSubmit} error={!!errorMessage}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          label="ether"
          labelPosition="right"
        />
      </Form.Field>
      <Message error header="Oops!" content={errorMessage} />
      <Button primary loading={loading}>
        Contribute!
      </Button>
    </Form>
  );
};

export default ContributeForm;
