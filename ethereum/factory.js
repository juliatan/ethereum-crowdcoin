import web3 from './web3'
import CampaignFactory from './build/CampaignFactory.json'

// Need to prefix with NEXT_PUBLIC_ to ensure variable is exposed to the browser
const instance = new web3.eth.Contract(CampaignFactory.abi, process.env.NEXT_PUBLIC_FACTORY_ADDRESS)

export default instance
