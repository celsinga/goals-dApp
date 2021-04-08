import * as ethService from './eth';
import { Contract } from 'web3-eth-contract';

export interface Task {
  description: string,
  done: boolean,
  active: boolean
}

export interface TaskWithId {
  id: number,
  task: Task
}

let contract: Contract;

export async function init(): Promise<void> {
  contract = ethService.loadContract('TasksHeavy');
}

export async function listActive(goalId: number): Promise<TaskWithId[]> {
  const activeTasks = await contract.methods.listActive(goalId).call();
  return activeTasks.map((v: any) => {
    return Object.assign({}, v, { id: parseInt(v.id) });
  });
}

export async function create(goalId: number, description: string): Promise<TaskWithId> {
  const receipt = await contract.methods.create(goalId, description).send();
  const id = parseInt(receipt.events.Created.returnValues.taskId);
  return {
    id,
    task: {
      description,
      done: false,
      active: true
    }
  };
}

export async function updateDone(goalId: number, taskId: number, done: boolean): Promise<void> {
  await contract.methods.updateDone(goalId, taskId, done).send();
}
