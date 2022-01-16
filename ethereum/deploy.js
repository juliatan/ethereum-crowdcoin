if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')

// We only need to deploy our Factory contract at this stage. Campaign contract is deployed later by a user.
const compiledFactory = require('./build/CampaignFactory.json')

const provider = new HDWalletProvider(process.env.MNEMONIC, process.env.INFURA_API)
const web3 = new Web3(provider)

const deploy = async () => {
  const accounts = await web3.eth.getAccounts()

  console.log('Attempting to deploy factory contract from account', accounts[0])

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: '0x' + compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0] })

  console.log('Factory contract deployed to', result.options.address)
  provider.engine.stop()
}
deploy()
