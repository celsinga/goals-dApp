import * as ethService from './eth';
import { Contract } from 'web3-eth-contract';

export interface Goal {
  description: string;
  deadline: number;
}

export interface GoalWithId {
  id: number;
  goal: Goal;
}

let contract: Contract;
let service: GoalService;

interface GoalService {

  init(): Promise<GoalWithId[]>;

  create(goal: Goal): Promise<GoalWithId>;

  complete(id: number): Promise<void>;

  listActive(): Promise<GoalWithId[]>;
}

class HeavyGoalService implements GoalService {

  async init(): Promise<GoalWithId[]> {
    contract = ethService.loadContract('GoalsHeavy');
    return await this.listActive();
  }

  async listActive(): Promise<GoalWithId[]> {
    const activeGoals = await contract.methods.getActiveGoals().call();
    return activeGoals.map((v: any) => {
      const vo = Object.assign({}, v);
      vo.goal = Object.assign({}, vo.goal);
      return vo;
    });
  }

  async complete(id: number): Promise<void> {
    await contract.methods.complete(id);
  }

  async create(goal: Goal): Promise<GoalWithId> {
    const receipt = await contract.methods.create(goal).send();
    const id = receipt.events.Created.returnValues.goalId;
    return { id, goal };
  }
}

class LightGoalService implements GoalService {

  async init(): Promise<GoalWithId[]> {
    contract = ethService.loadContract('GoalsLight');
    return await this.listActive();
  }

  async listActive(): Promise<GoalWithId[]> {
    const activeGoalIds: string[] = await contract.methods.getActiveGoalIds().call();
    const activeGoalEvents = await contract.getPastEvents('Created', {
      fromBlock: 'earliest',
      filter: {
        goalId: activeGoalIds
      }
    });
    return activeGoalIds.map((id) => {
      const goalEvent = activeGoalEvents.find((e) => e.returnValues.goalId === id);
      if (!goalEvent) {
        throw new Error(`Failed to retrieve goal event for id: ${id}`);
      }
      return {
        id: parseInt(id),
        goal: Object.assign({}, goalEvent.returnValues.goal)
      };
    });
  }

  async complete(id: number): Promise<void> {
    await contract.methods.complete(id).send();
  }

  async create(goal: Goal): Promise<GoalWithId> {
    const receipt = await contract.methods.create(goal).send();
    const id = receipt.events.Created.returnValues.goalId;
    return { id, goal };
  }
}

function setup(): GoalService {
  switch (process.env.REACT_APP_BACKEND) {
    case 'light':
      return new LightGoalService();
    case 'heavy':
    default:
      return new HeavyGoalService();
  }
}

service = setup();

export default service;
