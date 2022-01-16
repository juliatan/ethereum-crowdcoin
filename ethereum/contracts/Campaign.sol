// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract CampaignFactory {
  address public manager;
  address[] public deployedCampaigns;

  function createCampaign(uint minimum) public {
    address newCampaign = address(new Campaign(minimum, msg.sender));
    deployedCampaigns.push(newCampaign);
  }

  function getDeployedCampaigns() public view returns (address[] memory) {
    return deployedCampaigns;
  }

}


contract Campaign {

  struct Request {
    string description;
    uint value;
    address payable recipient;
    bool complete;
    uint approvalCount;
    mapping(address => bool) approvals;
  }

  address public manager;
  uint public minimumContribution;
  mapping(address => bool) public approvers;
  uint public approversCount;

  // Request[] public requests;
  mapping(uint => Request) public requests;
  uint private currentIndex = 0;

  modifier restricted() {
    require(msg.sender == manager);
    _;
  }

  constructor(uint minimum, address creator) {
    manager = creator;
    minimumContribution = minimum;
  }

  // function Campaign(uint minimum, address creator) public {
  //   manager = creator;
  //   minimumContribution = minimum;
  // }

  function contribute() public payable {
    require(msg.value > minimumContribution);
    approvers[msg.sender] = true;
    approversCount++;
  }

  function createRequest(string memory description, uint value, address payable recipient) public restricted {
    // Request memory newRequest = Request({
    //   description: description,
    //   value: value,
    //   recipient: recipient,
    //   complete: false,
    //   approvalCount: 0
    // });
    // requests.push(newRequest);

    Request storage newRequest = requests[currentIndex];
    newRequest.description = description;
    newRequest.value = value;
    newRequest.recipient = recipient;
    newRequest.complete = false;
    newRequest.approvalCount = 0;
    currentIndex++;
  }

  function approveRequest(uint index) public {
    Request storage request = requests[index];

    require(approvers[msg.sender]); // must have contributed already
    require(!request.approvals[msg.sender]); // must NOT have already voted

    request.approvals[msg.sender] = true;
    request.approvalCount++;
  }

  function finaliseRequest(uint index) public restricted {
    Request storage request = requests[index];
    require(!request.complete);
    require(request.approvalCount > approversCount / 2);

    request.recipient.transfer(request.value);
    request.complete = true;
  }
}