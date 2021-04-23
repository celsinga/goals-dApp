const GoalsHeavy = artifacts.require("GoalsHeavy");
const GoalsLight = artifacts.require("GoalsLight");
const TasksHeavy = artifacts.require("TasksHeavy");
const WorkUnit = artifacts.require("WorkUnit");
const WorkUnitMarket = artifacts.require("WorkUnitMarket");
const CADCoin = artifacts.require("CADCoin");

module.exports = function(deployer) {
  deployer.deploy(TasksHeavy).then(() => {
    deployer.deploy(GoalsHeavy, TasksHeavy.address);
  });
  deployer.deploy(GoalsLight);
  deployer.deploy(WorkUnit).then(() => {
    deployer.deploy(WorkUnitMarket, WorkUnit.address);
  });
  deployer.deploy(CADCoin);
};
