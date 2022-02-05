import Link from "next/link";
import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import RequestRow from "../../../components/RequestRow";
import Campaign from "../../../ethereum/campaign";

const RequestIndex = ({
  address,
  requests,
  requestCount,
  approversCount,
}: any) => {
  const { Header, Row, HeaderCell, Body } = Table;

  const renderRows = () => {
    return requests.map((request: any, index: number) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={address}
          approversCount={approversCount}
        />
      );
    });
  };

  return (
    <Layout>
      <h3>Requests</h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <a>
          <Button primary floated="right" style={{ marginBottom: 10 }}>
            Add Request
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
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows()}</Body>
      </Table>
      <div>Found {requestCount} requests.</div>
    </Layout>
  );
};

export default RequestIndex;

export async function getServerSideProps(context: any) {
  const { address } = context.query;
  const campaign = Campaign(address);

  const requestCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.approversCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      //@ts-ignore
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );

  return { props: { address, requests, requestCount, approversCount } };
}
