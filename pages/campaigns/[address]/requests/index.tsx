import Link from "next/link";
import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import Layout from "../../../../components/Layout";
import RequestRow from "../../../../components/RequestRow";
import Campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";

const RequestIndex = ({
  address,
  requests,
  requestCount,
  approversCount,
}: any) => {
  const { Header, Row, HeaderCell, Body } = Table;

  const renderRows = () => {
    const requestsJSON = JSON.parse(requests);
    return requestsJSON
      .filter((request: any) => {
        if (web3.utils.fromWei(request.value, "ether") === "0") return false;
        return true;
      })
      .map((request: any, index: number) => {
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
      <Link
        href={{
          pathname: `/campaigns/${address}/requests/new`,
          query: { address },
        }}
      >
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

  let requests = [];
  for (let i = 0; i < requestCount; i++) {
    const request = await campaign.methods.requests(i).call();
    requests.push(request);
  }
  const requestsString = JSON.stringify(requests);

  return {
    props: { address, requests: requestsString, requestCount, approversCount },
  };
}
