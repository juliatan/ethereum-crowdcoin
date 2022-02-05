import Web3 from "web3";

// Using NextJS means SSR - the window object is not available in Node
// We should therefore use the Next server to talk directly to the Ethereum blockchain if this is the case.
// This is also what we need to do if the user does not have Metamask installed.

declare global {
  interface Window {
    ethereum?: any;
  }
}

let web3: Web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    process.env.INFURA_API as string
  );
  web3 = new Web3(provider);
}

export default web3;
