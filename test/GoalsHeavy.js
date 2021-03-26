const GoalsHeavy = artifacts.require('GoalsHeavy');
const { reportGas } = require('./util');

const HOUR_FROM_NOW = Math.round(new Date().getTime() / 1000) + 3600;

contract('GoalsHeavy', (accounts) => {
  it('should create goals', async () => {
    const instance = await GoalsHeavy.deployed();

    let receipt = await instance.create({
      description: 'To get stuff done',
      deadline: HOUR_FROM_NOW
    });
    reportGas('Create', receipt);

    assert.equal(receipt.logs.length, 1, 'One log should be emitted');
    assert.equal(receipt.logs[0].event, 'Created', 'Log should be Created event');
    assert.equal(receipt.logs[0].args.goalId, 1, 'Goal ID should be 1');

    receipt = await instance.create({
      description: 'To get more stuff done',
      deadline: HOUR_FROM_NOW
    });
    reportGas('Create', receipt);

    assert.equal(receipt.logs.length, 1, 'One log should be emitted');
    assert.equal(receipt.logs[0].event, 'Created', 'Log should be Created event');
    assert.equal(receipt.logs[0].args.goalId, 2, 'Goal ID should be 2');
  });

  it('should not create goal without deadline', async () => {
    const instance = await GoalsHeavy.deployed();

    try {
      await instance.create({
        description: 'To get stuff done',
        deadline: 0
      });
    } catch (e) {
      assert.equal(e.reason, 'Must have deadline', 'Error must be of correct type');
      return;
    }

    assert.fail('Operation completed');
  });

  it('should get goals after creation', async () => {
    const instance = await GoalsHeavy.deployed();

    const goals = await instance.getActiveGoals();

    assert.equal(goals.length, 2, 'Two active goals should exist');
    assert.equal(goals[0].id, 2, 'First goal must have id of 2');
    assert.equal(goals[1].id, 1, 'Second goal must have id of 1');
    assert.equal(goals[0].goal.description, 'To get more stuff done', 'First goal description must be correct');
    assert.equal(goals[1].goal.description, 'To get stuff done', 'Second goal description must be correct');
  });

  it('should complete one goal', async () => {
    const instance = await GoalsHeavy.deployed();

    const receipt = await instance.complete(2);
    reportGas('Complete', receipt);

    assert.equal(receipt.logs.length, 1, 'One log should be emitted');
    assert.equal(receipt.logs[0].event, 'Completed', 'Log should be Completed event');
    assert.equal(receipt.logs[0].args.description, 'To get more stuff done', 'Description should be correct');   
    assert.equal(receipt.logs[0].args.deadline, HOUR_FROM_NOW, 'Deadline should be correct');   
  });

  it('should not complete goal that doesn\'t exist', async () => {
    const instance = await GoalsHeavy.deployed();

    try {
      await instance.complete(7);
    } catch (e) {
      assert.equal(e.reason, 'Goal must exist and be active', 'Error must be of correct type');
      return;
    }

    assert.fail('Operation completed');
  });

  it('should get goals after completion of one goal', async () => {
    const instance = await GoalsHeavy.deployed();

    const goals = await instance.getActiveGoals();

    assert.equal(goals.length, 1, 'One active goal should exist');
    assert.equal(goals[0].id, 1, 'Goal must have id of 1');
  });
});

