import * as ethService from './eth';
import { Contract } from 'web3-eth-contract';

export interface Goal {
  description: string
  deadline: number
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
    const vo = Object.assign({}, v, { id: parseInt(v.id) });
    vo.goal = Object.assign({}, vo.goal, { deadline: parseInt(v.goal.deadline) });
    return vo;
  });
}

export async function create(goal: Goal): Promise<GoalWithId> {
  const receipt = await contract.methods.create(goal).send();
  const id = receipt.events.Created.returnValues.goalId;
  return { id, goal };
}

export async function complete(goalId: number): Promise<void> {
  await contract.methods.complete(goalId).send();
}