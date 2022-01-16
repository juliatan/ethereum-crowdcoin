## About

- This is a test project that I've written to learn Solidity.
- It's a smart contract that a user to create a Kickerstarter-like campaign.
- This request goes through a CampaignFactory smart contract, which in turn creates a Campaign contract with some minimum value of contribution required from backers of a campaign.
- The frontend UI is built using React and NextJS.

## How I set up this project from scratch

### Smart contract

- In the folder directory, run `npm init` and create a `package.json` file.
- Install dependencies using `yarn add ganache-cli mocha solc@0.8.9 fs-extra web3`.
- Set up the `Campaign.sol` file containing the 2 contracts (Campaign and CampaignFactory).
- Set up the `compile.js` script. To run this in cli, go to the relevant directory and run `node compile.js`.
- Create `test` folder and write tests. If you run into any errors around "digital envelope routines", use a lower version of node e.g. `nvm use 15.8.0`.
- Create `deploy.js` script.
  - As part of this, install truffle using `yarn add @truffle/hdwallet-provider`.
  - Also `yarn add dotenv`, create a `.env` file in the same directory as the `deploy.js` script, with `INFURA_API` and `MNEMONIC` environment variables for the Rinkeby test network.
  - Load the .env file at the top of the `deploy.js` file.
- Deploy contract to Rinkeby test network. In the ethereum directory, run `node deploy.js`.

### Frontend UI

- Install NextJS using `yarn add next react react-dom`. In `package.json`, be sure to add a script for `"dev": "next dev"`.
- Install Typescript and other dev dependencies for linting and typechecking (see `package.json`).
- Create `pages` directory and add routes.

## Packages

### Smart contract

- Web3 (JavaScript interface to Ethereum blockchain)
- Ganache (testing)
- Mocha (testing)
- fs-extra (file system - it's like fs but with additional helpers)
- Infura (deploying to test network node)
- Truffle (wallet + deployment provider)
- dotenv (storing environment variables)

### Frontend UI

- NextJS (React framework)
- Typescript

## To run

### Smart contract

- `npm run test` - run test suite
- `node deploy.js` - deploy contract to test network
  - If you get an error to do with `ERR_OSSL_EVP_UNSUPPORTED`, it'll be due to an issue with the node version you're using. I used `nvm` to switch to version 15.8.0, which does the trick. Alternatively if you don't want to do this, set this option `export NODE_OPTIONS=--openssl-legacy-provider`.

### Frontend UI

- `yarn dev` - run the NextJS development server and access at `http://localhost:3000/`.

### Resources

- https://infura.io/ - Free API to connect to an Ethereum test network node
- https://rinkeby.etherscan.io/ - Etherscan Rinkeby test network
- https://faucets.chain.link/rinkeby - request test ether
- https://eth-converter.com/extended-converter.html - Eth converter
