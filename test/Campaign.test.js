const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

let accounts
let factory
let campaignAddress
let campaign

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()

  // Deploy a new instance of the CampaignFactory contract (don't need to pass in contract address)
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: '1500000' }) // gas amount is arbitrary, but Ganache sometimes complains about out of gas. Increase if so.

  // Set minimum contribution to campaign as 100 wei
  await factory.methods.createCampaign('100').send({ from: accounts[0], gas: '1000000' })

  const campaigns = await factory.methods.getDeployedCampaigns().call()
  campaignAddress = campaigns[0]

  // If contract is already deployed, get the ABI and pass in the campaign address as second argument
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress)
})

describe('Campaigns', () => {
  it('deploys a factory and campaign', () => {
    assert.ok(factory.options.address) // assert.ok checks for existence
    assert.ok(campaign.options.address) // assert.ok checks for existence
  })

  it('marks caller as campaign manager', async () => {
    assert.equal(await campaign.methods.manager().call(), accounts[0])
  })

  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1],
    })

    // Note: to access mapping, need to pass in the key as an argument
    assert.equal(await campaign.methods.approvers(accounts[1]).call(), true)
    assert.equal(await campaign.methods.approversCount().call(), 1)
  })

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        value: '5',
        from: accounts[1],
      })
      assert(false) // if this line is reached, the test fails because it meant the await function succeeded
    } catch (err) {
      assert(err) // checks for truthiness
    }
  })

  it('allows a manager to make a payment request', async () => {
    await campaign.methods.createRequest('Buy batteries', '100', accounts[2]).send({
      from: accounts[0],
      gas: '1000000',
    })

    const request = await campaign.methods.requests(0).call()
    assert(request.description, 'Buy batteries')
  })

  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether'),
    })

    await campaign.methods.createRequest('Buy car', web3.utils.toWei('5', 'ether'), accounts[1]).send({
      from: accounts[0],
      gas: '1000000',
    })

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000',
    })

    await campaign.methods.finaliseRequest(0).send({
      from: accounts[0],
      gas: '1000000',
    })

    let balance = await web3.eth.getBalance(accounts[1])
    balance = web3.utils.fromWei(balance, 'ether')
    balance = parseFloat(balance) // convert string to number

    // use more than because we don't know what Ganache sets the initial account balance to
    // account balances are not reset between tests
    assert(balance > 104)
  })
})
