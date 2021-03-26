import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

let web3: Web3;

export async function init(): Promise<string[]> {

  web3 = new Web3(process.env.NODE_ENV === 'production' ? Web3.givenProvider : 'ws://localhost:7545');
  return await web3.eth.personal.getAccounts();
}

export function loadContract(contractName: String): Contract {
  const jsonInterface = require(`../../../build/contracts/${contractName}.json`);
  const networks = Object.values(jsonInterface.networks as { address: string }[]);
  const contractAddress = networks[0].address;
  return new web3.eth.Contract(jsonInterface.abi, contractAddress);
}
