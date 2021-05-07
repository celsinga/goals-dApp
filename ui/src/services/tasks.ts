import * as ethService from './eth';
import { Contract } from 'web3-eth-contract';
import contractInfo from '../../../build/contracts/TasksHeavy.json';

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
  contract = await ethService.loadContract('Tasks', contractInfo.abi, contractInfo.networks, null);
}

export async function deleteTask(goalId: number, taskId: number): Promise<void> {
  await contract.methods.deleteTask(goalId, taskId).send();
}

export async function listActive(goalId: number): Promise<TaskWithId[]> {
  const activeTasks = await contract.methods.listActive(goalId).call();
  return activeTasks.map((v: any) => {
    return Object.assign({}, v, { id: parseInt(v.id) });
  });
}

export async function createBulk(goalId: number, descriptions: string[]): Promise<TaskWithId[]> {
  const receipt = await contract.methods.createBulk(goalId, descriptions).send();
  const result = [];
  for (let i = 0; i < descriptions.length; i++) {
    const createdEvent = descriptions.length === 1 ?
      receipt.events.Created : receipt.events.Created[i];
    result.push({
      id: parseInt(createdEvent.returnValues.taskId),
      task: {
        description: descriptions[i],
        done: false,
        active: true
      }
    });
  }
  return result;
}

export async function updateDone(goalId: number, taskId: number, done: boolean): Promise<void> {
  await contract.methods.updateDone(goalId, taskId, done).send();
}

export async function updateDesc(goalId: number, taskId: number, desc: string): Promise<void> {
  await contract.methods.updateDesc(goalId, taskId, desc).send();
}
