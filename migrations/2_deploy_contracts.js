const GoalsHeavy = artifacts.require("GoalsHeavy");
const GoalsLight = artifacts.require("GoalsLight");
const TasksHeavy = artifacts.require("TasksHeavy");

module.exports = function(deployer) {
  deployer.deploy(TasksHeavy).then(() => {
    deployer.deploy(GoalsHeavy, TasksHeavy.address);
  });
  deployer.deploy(GoalsLight);
};
