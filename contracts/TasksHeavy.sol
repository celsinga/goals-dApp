// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TasksHeavy {
  struct Task {
    string description;
    bool done;
    bool active;
    uint workUnitId;
  }

  struct TaskWithId {
    Task task;
    uint id;
  }

  uint constant maxTasksPerGoal = 100;
  mapping(address => mapping(uint => uint)) taskCounts;
  mapping(address => mapping(uint => mapping(uint => Task))) tasks;

  event Created(uint indexed goalId, uint taskId);
  event CompletedGoalTasks(uint indexed goalId, string[] descriptions);

  function create(uint goalId, string calldata description) public returns(uint taskId) {
    require(taskCounts[msg.sender][goalId] < maxTasksPerGoal, "Max tasks per goal is 100");
    taskId = ++taskCounts[msg.sender][goalId];
    tasks[msg.sender][goalId][taskId].description = description;
    tasks[msg.sender][goalId][taskId].active = true;

    emit Created(goalId, taskId);
  }

  function createBulk(uint goalId, string[] calldata descriptions) public returns(uint[] memory taskIds) {
    require(descriptions.length <= 50, "Can only bulk create 50 tasks at a time");
    require((taskCounts[msg.sender][goalId] + descriptions.length) <= maxTasksPerGoal,
            "Max tasks per goal is 100");

    taskIds = new uint[](descriptions.length);

    for (uint i = 0; i < descriptions.length; i++) {
      taskIds[i] = ++taskCounts[msg.sender][goalId];
      tasks[msg.sender][goalId][taskIds[i]].description = descriptions[i];
      tasks[msg.sender][goalId][taskIds[i]].active = true;

      emit Created(goalId, taskIds[i]);
    }
  }

  function get(uint goalId, uint taskId) private view returns(Task storage task) {
    task = tasks[msg.sender][goalId][taskId];
    require(task.active, "Task must be active");
  }

  function updateDesc(uint goalId, uint taskId, string calldata description) public {
    Task storage task = get(goalId, taskId);
    task.description = description;
  }

  function updateDone(uint goalId, uint taskId, bool done) public {
    Task storage task = get(goalId, taskId);
    task.done = done;
  }

  function assignWorkUnit(uint goalId, uint taskId, uint workUnitId) public {
    Task storage task = get(goalId, taskId);
    task.workUnitId = workUnitId;
  }

  function deleteTask(uint goalId, uint taskId) public {
    delete tasks[msg.sender][goalId][taskId];
  }

  function completeGoalTasks(uint goalId) public {
    string[maxTasksPerGoal] memory descriptions;
    uint descCount;
    for (uint i = 1; i <= taskCounts[msg.sender][goalId]; i++) {
      Task storage task = tasks[msg.sender][goalId][i];
      if (task.active) {
        descriptions[descCount++] = task.description;
        delete tasks[msg.sender][goalId][i];
      }
    }
    delete taskCounts[msg.sender][goalId];
    string[] memory loggedDescriptions = new string[](descCount);
    for (uint i = 0; i < descCount; i++) {
      loggedDescriptions[i] = descriptions[i];
    }
    emit CompletedGoalTasks(goalId, loggedDescriptions);
  }

  function listActive(uint goalId) public view returns(TaskWithId[] memory tasksResult) {
    mapping(uint => Task) storage goalTasks = tasks[msg.sender][goalId];
    uint taskCount = taskCounts[msg.sender][goalId];

    uint[maxTasksPerGoal] memory taskKeys;

    uint keyCount;
    uint itCount;
    for (uint i = 1; i <= taskCount && itCount <= maxTasksPerGoal; i++) {
      if (goalTasks[i].active) {
        taskKeys[keyCount++] = i;
      }
      itCount++;
    }

    tasksResult = new TaskWithId[](keyCount);

    for (uint i = 0; i < keyCount; i++) {
      tasksResult[i].id = taskKeys[i];
      tasksResult[i].task = tasks[msg.sender][goalId][taskKeys[i]];
    }
  }
}
