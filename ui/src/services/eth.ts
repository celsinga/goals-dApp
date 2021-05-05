import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';

let web3: Web3;

declare const ENV_TYPE: string;

export async function init(): Promise<string[]> {
  // await (window as any).ethereum.enable();
  web3 = new Web3(ENV_TYPE === 'production' ? Web3.givenProvider : 'ws://localhost:7545');
  const accounts = await web3.eth.getAccounts();
  web3.eth.defaultAccount = accounts[0];
  return accounts;
}

export async function loadContract(abi: any,
                                   networks: { [id: string]: { address: string } } | null,
                                   address: string | null): Promise<Contract> {
  const contractAddress = address || networks![await web3.eth.net.getId()].address;
  const contract = new web3.eth.Contract(abi, contractAddress);
  contract.options.from = web3.eth.defaultAccount!;
  contract.options.gas = 200000;
  return contract;
}
