const GoalsHeavy = artifacts.require("GoalsHeavy");
const GoalsLight = artifacts.require("GoalsLight");

module.exports = function(deployer) {
  deployer.deploy(GoalsHeavy);
  deployer.deploy(GoalsLight);
};
