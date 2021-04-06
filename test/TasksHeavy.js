const TasksHeavy = artifacts.require('TasksHeavy');
const { reportGas } = require('./util');

contract('TasksHeavy', (accounts) => {
  it('should create tasks', async () => {
    const instance = await TasksHeavy.deployed();

    let receipt = await instance.create(10, 'A good task to do');
    reportGas('Create', receipt);

    assert.equal(receipt.logs.length, 1, 'One log should be emitted');
    assert.equal(receipt.logs[0].event, 'Created', 'Log should be Created event');
    assert.equal(receipt.logs[0].args.goalId, 10, 'Goal ID should be 10');
    assert.equal(receipt.logs[0].args.taskId, 1, 'Task ID should be 1');

    receipt = await instance.create(10, 'To get more stuff done');
    reportGas('Create', receipt);

    assert.equal(receipt.logs.length, 1, 'One log should be emitted');
    assert.equal(receipt.logs[0].event, 'Created', 'Log should be Created event');
    assert.equal(receipt.logs[0].args.goalId, 10, 'Goal ID should be 10');
    assert.equal(receipt.logs[0].args.taskId, 2, 'Task ID should be 2');
  });

  it('should get tasks after creation', async () => {
    const instance = await TasksHeavy.deployed();

    const tasks = await instance.listActive(10);

    assert.equal(tasks.length, 2, 'Two active tasks should exist');
    assert.equal(tasks[0].id, 1, 'First task must have id of 1');
    assert.equal(tasks[1].id, 2, 'Second task must have id of 2');
    assert.equal(tasks[0].task.description, 'A good task to do', 'First task description must be correct');
    assert.equal(tasks[1].task.description, 'To get more stuff done', 'Second task description must be correct');
  });

  it('should not create more than 100 tasks', async () => {
    const instance = await TasksHeavy.deployed();

    for (let i = 0; i < 100; i++) {
      await instance.create(20, 'To get stuff done');
    }

    try {
      await instance.create(20, 'To get stuff done');
    } catch (e) {
      assert.equal(e.reason, 'Max tasks per goal is 100', 'Error must be of correct type');
      return;
    }

    assert.fail('Operation completed');
  });

  it('should update one task description', async () => {
    const instance = await TasksHeavy.deployed();

    const receipt = await instance.updateDesc(10, 2, 'To get even more stuff done');
    reportGas('Update description', receipt);

    const tasks = await instance.listActive(10);

    assert.equal(tasks.length, 2, 'Two active tasks should exist');
    assert.equal(tasks[1].id, 2, 'Second task must have id of 2');
    assert.equal(tasks[1].task.description, 'To get even more stuff done', 'Second task description must be correct');
  });

  it('should not update task that doesn\'t exist', async () => {
    const instance = await TasksHeavy.deployed();

    try {
      await instance.updateDesc(10, 3, 'To get even more stuff done');
    } catch (e) {
      assert.equal(e.reason, 'Task must be active', 'Error must be of correct type');
      return;
    }

    assert.fail('Operation completed');
  });

  it('should complete one task', async () => {
    const instance = await TasksHeavy.deployed();

    const receipt = await instance.updateDone(10, 2, true);
    reportGas('Update done', receipt);

    const tasks = await instance.listActive(10);

    assert.equal(tasks.length, 2, 'Two active tasks should exist');
    assert.equal(tasks[1].id, 2, 'Second task must have id of 2');
    assert.equal(tasks[1].task.done, true, 'Second task must be done');
  });

  it('should not complete task that doesn\'t exist', async () => {
    const instance = await TasksHeavy.deployed();

    try {
      await instance.updateDone(10, 3, true);
    } catch (e) {
      assert.equal(e.reason, 'Task must be active', 'Error must be of correct type');
      return;
    }

    assert.fail('Operation completed');
  });

  it('should delete task', async () => {
    const instance = await TasksHeavy.deployed();

    const receipt = await instance.deleteTask(10, 1);
    reportGas('Delete', receipt);

    const tasks = await instance.listActive(10);

    assert.equal(tasks.length, 1, 'One active task should exist');
    assert.equal(tasks[0].id, 2, 'Task should have id of 2');
  });

  it('goal completion should archive all tasks', async () => {
    const instance = await TasksHeavy.deployed();

    const receipt = await instance.completeGoalTasks(20);
    reportGas('Complete', receipt);

    assert.equal(receipt.logs.length, 1, 'One log should be emitted');
    assert.equal(receipt.logs[0].event, 'CompletedGoalTasks', 'Log should be CompletedGoalTasks event');
    assert.equal(receipt.logs[0].args.goalId.toNumber(), 20, 'Goal ID should be 20');
    assert.equal(receipt.logs[0].args.descriptions.length, 100, 'Should have 100 descriptions');

    const tasks = await instance.listActive(20);

    assert.equal(tasks.length, 0, 'No tasks should exist');
  });

});

