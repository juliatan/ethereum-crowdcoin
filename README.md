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
- Deploy contract to Rinkeby test network. In the ethereum directory, run `node deploy.js`. Make a note of the contract address that is returned and save to `.env.local` file in the root folder (this is what NextJS will automatically use to load environment variables). Be sure to prefix the variable name with "NEXT*PUBLIC*" e.g. `NEXT_PUBLIC_FACTORY_ADDRESS=xxxxx`.

### Frontend UI

- Install NextJS using `yarn add next react react-dom`. In `package.json`, be sure to add a script for `"dev": "next dev"`.
- Install Typescript and other dev dependencies for linting and typechecking (see `package.json`).
- Create `pages` directory and add routes.

### Set up Campaign List and Campaign creation pages

- Configure web3 with a provider from Metamask in `ethereum/web3.js`.
- Tell web3 that a deployed copy of the CampaignFactory exists on the Rinkeby network in `ethereum/factory.js`. Be sure to use the `NEXT_PUBLIC_FACTORY_ADDRESS` environment here.
- Use the factory instance to retrieve a list of deployed campaigns. To set up dummy data (i.e. create a deployed campaign), use Remix. Check the environment is "injected Web3", selected "CampaignFactory" contract and add the contract address we deployed. The click "createCampaign" with some minimum contribution value (e.g. 100 wei).
- Setup `pages/index.tsx` to render details on each campaign by calling the factory instance methods. We want the calling of the contract to happen before the component is rendered, hence the use of getStaticProps.
- Use Semantic UI React to style the page, including adding Layout component.
- Setup `pages/campaigns/new.tsx` which will be the gateway to creating a new campaign.

### Add routes and Link tags

- Use NextJS routing to add routes to Header component
- Set up dynamic routes in `pages/campaigns/[address].tsx` to link to each campaign.

### Add some helper methods to original contract

- We want to minimise API calls made to our contract when displaying each campaign's details. To do this, create some helper methods to get the summary for a campaign in the original `Campaign.sol` contract.
- In the ethereum directory, run `node compile.js` then `node deploy.js`. Remember to amnd the env var for the new contract address.
- Create a new file in `/ethereum/campaign.js` and export a function that allows us to create a new campaign contract instance based on an address we pass in.

### Display individual campaign data

- In `pages/campaigns/[address].tsx`, we want to display the details of a campaign. We can use `getServerSideProps` to get the address from the URL, and pass that into our `createCampaignContractInstance()` function. This gives us back the summary, which we can then render on the page.
- Create a contribute form component in `components/ContributeForm.tsx`. Create a campaign contract instance so that we can call the `contribute()` method.

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
- Semantic UI React + Semantic UI CSS

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
