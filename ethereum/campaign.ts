import web3 from "./web3";
import Campaign from "./build/Campaign.json";

// Need to prefic with NEXT_PUBLIC_ to ensure variable is exposed to the browser
const campaign = (address: any) => {
  const instance = new web3.eth.Contract(Campaign.abi as any, address);
  return instance;
};

export default campaign;
