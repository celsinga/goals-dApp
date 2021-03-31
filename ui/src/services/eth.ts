import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

let web3: Web3;

declare const ENV_TYPE: string;

export async function init(): Promise<string[]> {
  web3 = new Web3(ENV_TYPE === 'production' ? Web3.givenProvider : 'ws://localhost:7545');
  const accounts = await web3.eth.personal.getAccounts();
  web3.eth.defaultAccount = accounts[0];
  return accounts;
}

export function loadContract(contractName: String): Contract {
  const jsonInterface = require(`../../../build/contracts/${contractName}.json`);
  const networks = Object.values(jsonInterface.networks as { address: string }[]);
  const contractAddress = networks[0].address;
  const contract = new web3.eth.Contract(jsonInterface.abi, contractAddress);
  contract.options.from = web3.eth.defaultAccount!;
  return contract;
}
