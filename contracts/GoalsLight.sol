// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GoalsLight {
  struct Goal {
    string description;
    uint deadline;
  }

  mapping(address => uint) goalCounts;
  mapping(address => mapping(uint => bool)) activeGoals;

  event Created(uint indexed goalId, Goal goal);
  event Completed(uint indexed goalId);

  function create(Goal calldata goal) public returns(uint goalId) {
    require(goal.deadline > 0, "Must have deadline");

    goalId = ++goalCounts[msg.sender];
    activeGoals[msg.sender][goalId] = true;

    emit Created(goalId, goal);
  }

  function complete(uint goalId) public {
    require(activeGoals[msg.sender][goalId], "Goal must exist and be active");

    emit Completed(goalId);

    delete activeGoals[msg.sender][goalId];
  }

  function getActiveGoalIds() public view returns(uint[] memory goalIds) {
    mapping(uint => bool) storage addressActiveGoals = activeGoals[msg.sender];
    uint goalCount = goalCounts[msg.sender];

    uint[100] memory tmpGoalIds;

    uint keyCount;
    uint itCount;
    for (uint i = goalCount; i >= 1 && itCount < 100; i--) {
      if (addressActiveGoals[i]) {
        tmpGoalIds[keyCount++] = i;
      }
      itCount++;
    }

    goalIds = new uint[](keyCount);
    for (uint i = 0; i < keyCount; i++) {
      goalIds[i] = tmpGoalIds[i];
    }
  }
}
