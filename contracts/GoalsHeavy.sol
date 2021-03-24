// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GoalsHeavy {
  struct Goal {
    string description;
    uint deadline;
  }

  mapping(address => uint) goalCounts;
  mapping(address => mapping(uint => Goal)) activeGoals;

  event Created(uint indexed goalId);
  event Completed(uint indexed goalId, string description, uint deadline);

  function create(Goal calldata goal) public returns(uint goalId) {
    require(goal.deadline > 0, "Must have deadline");

    goalId = ++goalCounts[msg.sender];
    activeGoals[msg.sender][goalId] = goal;

    emit Created(goalId);
  }

  function complete(uint goalId) public {
    Goal storage goal = activeGoals[msg.sender][goalId];

    require(goal.deadline > 0, "Goal must exist and be active");

    emit Completed(goalId, goal.description, goal.deadline);

    delete activeGoals[msg.sender][goalId];
  }

  function getActiveGoals() public view returns(Goal[] memory goals) {
    mapping(uint => Goal) storage addressActiveGoals = activeGoals[msg.sender];
    uint goalCount = goalCounts[msg.sender];

    uint[100] memory goalKeys;

    uint keyCount;
    uint itCount;
    for (uint i = goalCount; i >= 0 && itCount < 100; i--) {
      if (addressActiveGoals[i].deadline > 0) {
        goalKeys[keyCount++] = i;
      }
      itCount++;
    }

    goals = new Goal[](keyCount);

    for (uint i = 0; i < keyCount; i++) {
      goals[i] = addressActiveGoals[goalKeys[i]];
    }
  }
}
