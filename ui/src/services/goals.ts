import * as ethService from './eth';
import { Contract } from 'web3-eth-contract';

export interface Goal {
  description: string
  deadline: Date
}

export interface GoalWithId {
  id: number,
  goal: Goal
}

let contract: Contract;

export async function init(): Promise<GoalWithId[]> {
  contract = ethService.loadContract('GoalsHeavy');
  return await listActive();
}

export async function listActive(): Promise<GoalWithId[]> {
  const activeGoals = await contract.methods.getActiveGoals().call();
  return activeGoals.map((v: any) => {
    return Object.assign(v.goal, { deadline: new Date(v.goal.deadline * 1000) });
  });
}
