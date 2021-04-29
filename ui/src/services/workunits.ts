import * as ethService from './eth';
import { Contract } from 'web3-eth-contract';
import workUnitContractInfo from '../../../build/contracts/WorkUnit.json';
import marketContractInfo from '../../../build/contracts/WorkUnitMarket.json';
import erc20Abi from './ext_abis/erc20.json';

let workUnitContract: Contract;
let marketContract: Contract;

export enum SaleStatus {
  Listed = 'Listed',
  Started = 'In Escrow',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface BuyingToken {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
}

export interface WorkUnitSale {
  id: number;
  description: string | null;
  buyer: string;
  seller: string;
  owner: string | null;
  value: number | null;
  buyingToken: BuyingToken | null;
  saleStatus: SaleStatus;
}

export type TokenMap = { [id: number]: WorkUnitSale };

export interface RelevantTokens {
  selling: TokenMap | null,
  buying: TokenMap | null
}

export async function init(): Promise<void> {
  workUnitContract = await ethService.loadContract(workUnitContractInfo.abi,
                                                   workUnitContractInfo.networks,
                                                   null);
  marketContract = await ethService.loadContract(marketContractInfo.abi,
                                                 marketContractInfo.networks,
                                                 null);
}

export async function createToken(description: string, buyer: string): Promise<WorkUnitSale> {
  const receipt = await marketContract.methods.listSale(description, buyer).send();
  const id = parseInt(receipt.events.SaleListed.returnValues.tokenId);

  return {
    id,
    description,
    buyer,
    seller: marketContract.options.from!,
    owner: marketContract.options.address,
    value: null,
    buyingToken: null,
    saleStatus: SaleStatus.Listed
  };
}

export async function startSale(token: WorkUnitSale, value: number,
                                tokenAddress: string): Promise<WorkUnitSale> {
  await marketContract.methods.startSale(token.id, value, tokenAddress);

  const result: WorkUnitSale = Object.assign({}, token);
  result.value = value;
  result.buyingToken = await getBuyingToken(tokenAddress);
  result.saleStatus = SaleStatus.Started;
  return result
}

export async function cancelSale(token: WorkUnitSale): Promise<WorkUnitSale> {
  await marketContract.methods.cancelSale(token.id);

  const result: WorkUnitSale = Object.assign({}, token);
  result.saleStatus = SaleStatus.Cancelled;
  return result
}

export async function completeSale(token: WorkUnitSale): Promise<WorkUnitSale> {
  await marketContract.methods.completeSale(token.id);

  const result: WorkUnitSale = Object.assign({}, token);
  result.saleStatus = SaleStatus.Completed;
  result.owner = result.buyer;
  return result
}

export async function getBuyingToken(contractAddress: string): Promise<BuyingToken> {
  const tokenContract = await ethService.loadContract(erc20Abi, null, contractAddress);
  return {
    name: await tokenContract.methods.name.call(),
    symbol: await tokenContract.methods.symbol.call(),
    decimals: await tokenContract.methods.decimals.call(),
    address: contractAddress
  };
}

async function listTokensHelper(isBuyer: boolean): Promise<TokenMap> {
  const result: TokenMap = {};
  const buyingTokens: { [address: string]: BuyingToken } = {};
  const filter: { [key: string]: string } = {};
  if (isBuyer) {
    filter.buyer = marketContract.options.from!;
  } else {
    filter.seller = marketContract.options.from!;
  }
  const listedTokens = await marketContract.getPastEvents('SaleListed', {
    filter,
    fromBlock: 0
  });

  for (const listedToken of listedTokens) {
    const tokenId = listedToken.returnValues.tokenId;
    result[tokenId] = {
      id: tokenId,
      description: null,
      buyer: listedToken.returnValues.buyer,
      seller: listedToken.returnValues.seller,
      owner: marketContract.options.address,
      saleStatus: SaleStatus.Listed,
      value: null,
      buyingToken: null
    };

    const tokenEvents = await marketContract.events.allEvents('allEvents', {
      filter: { tokenId },
      fromBlock: listedToken.blockNumber
    });

    for (const tokenEvent of tokenEvents) {
      switch (tokenEvent.event) {
        case 'SaleStarted':
          result[tokenId].saleStatus = SaleStatus.Started;
          result[tokenId].value = tokenEvent.returnValues.value;
          const tokenAddress = tokenEvent.returnValues.buyingToken;
          if (!buyingTokens[tokenAddress])
            buyingTokens[tokenAddress] = await getBuyingToken(tokenAddress);
          result[tokenId].buyingToken = buyingTokens[tokenAddress];
          break;
        case 'SaleCancelled':
          result[tokenId].saleStatus = SaleStatus.Cancelled;
          result[tokenId].owner = null;
          break;
        case 'SaleCompleted':
          result[tokenId].saleStatus = SaleStatus.Completed;
          try {
            result[tokenId].owner = await workUnitContract.methods.ownerOf(tokenId);
          } catch (e) {}
          break;
      }
    }

    result[tokenId].description = (await workUnitContract.getPastEvents('Minted', {
      filter: { tokenId },
      fromBlock: 0
    }))[0].returnValues.description;
  }
  return result;
}

export async function listTokens(): Promise<RelevantTokens> {
  return {
    buying: await listTokensHelper(true),
    selling: await listTokensHelper(false)
  };
}
