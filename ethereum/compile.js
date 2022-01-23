const path = require('path')
const fs = require('fs-extra')
const solc = require('solc')

// We only want to run the compile script once, and save the compiled output to the build folder.
// Every time we run the compile script, we want to:
// 1. Delete the build folder
// 2. Read Campaign.sol from the 'contracts' folder
// 3. Compile the Campaign.sol file (2 separate contracts)
// 4. Save the compiled output to the build folder

// Step 1
// Use path to ensure it works across windows, unix etc
// __dirname is the pwd provided by node
const buildPath = path.resolve(__dirname, 'build')
// Remove entire build folder. removeSync comes from the fs-extra package and makes deletion a lot easier that using standard fs library.
fs.removeSync(buildPath)

// Step 2
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol')
const source = fs.readFileSync(campaignPath, 'utf8')

fs.ensureDirSync(buildPath) // check that build folder exists, if not create it

// Step 3
const input = {
  language: 'Solidity',
  sources: {
    'Campaign.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
}

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol']
// The stringified output returns an object like this: {
//   contracts: { 'Campaign.sol': { Campaign: [Object], CampaignFactory: [Object] } },
//   sources: { 'Campaign.sol': { id: 0 } }
// }

// Step 4
const contracts = Object.keys(output)
contracts.forEach((contract) => {
  fs.outputJsonSync(path.resolve(buildPath, contract + '.json'), output[contract])
})
