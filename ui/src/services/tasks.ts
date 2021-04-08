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

export async function init(): Promise<TaskWithId[]> {
  contract = ethService.loadContract('TasksHeavy');
  return await listActive();
}

export async function listActive(): Promise<TaskWithId[]> {
  const activeTasks = await contract.methods.listActive().call();
  return activeTasks.map((v: any) => {
    const vo = Object.assign({}, v, { id: parseInt(v.id) });
    vo.tasksResult = Object.assign({}, vo.tasksResult, { Task: parseInt(v.tasksResult.task) });
    return vo;
  });
}

export async function create(task: Task): Promise<TaskWithId> {
  const receipt = await contract.methods.create(task).send();
  const id = parseInt(receipt.events.Created.returnValues.taskId);
  return { id, task };
}

export async function complete(taskId: TaskWithId): Promise<void> {
  await contract.methods.complete(taskId).send();
}