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

  async create(goal: Goal): Promise<GoalWithId> {
    const receipt = await contract.methods.create(goal).send();
    const id = receipt.events.Created.returnValues.goalId;
    return { id, goal };
  }
}

function setup(): GoalService {
  switch (process.env.REACT_APP_BACKEND) {
    case 'heavy':
    default:
      return new HeavyGoalService();
  }
}

service = setup();

export default service;
