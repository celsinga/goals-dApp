import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';

let web3: Web3;

export class NoProviderError extends Error {
  static errName = 'NoProviderError';
  constructor() {
    super();
    this.name = NoProviderError.errName;
  }
};

export class NoContractOnNetworkError extends Error {
  static errName = 'NoContractOnNetworkError';
  constructor(msg: string) {
    super(msg);
    this.name = NoContractOnNetworkError.errName;
  }
};

declare const ENV_TYPE: string;
declare const USE_GIVEN_PROVIDER: string;

export async function init(): Promise<string[]> {
  const useGivenProvider = !!USE_GIVEN_PROVIDER || ENV_TYPE === 'production';

  if (useGivenProvider) {
    const provider = (window as any).ethereum;
    if (!provider) throw new NoProviderError();
    await provider.enable();
  }
  web3 = new Web3(useGivenProvider ? Web3.givenProvider : 'ws://localhost:7545');

  const accounts = await web3.eth.getAccounts();
  web3.eth.defaultAccount = accounts[0];
  return accounts;
}

export async function loadContract(name: string,
                                   abi: any,
                                   networks: { [id: string]: { address: string } | undefined } | null,
                                   address: string | null): Promise<Contract> {
  if (!!networks) {
    const networkId = await web3.eth.net.getId();
    const network = networks[networkId];  
    if (!network) {
      throw new NoContractOnNetworkError(`Missing '${name}' contract on network ${networkId}`); 
    }
    address = network.address;
  }

  if (!address) throw new Error('No address for contract!');

  const contract = new web3.eth.Contract(abi, address); 
  contract.options.from = web3.eth.defaultAccount!;
  contract.options.gas = 2000000;
  return contract;
}
