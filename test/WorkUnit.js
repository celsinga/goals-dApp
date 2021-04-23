const WorkUnit = artifacts.require('WorkUnit');
const { reportGas } = require('./util');

contract('WorkUnit', (accounts) => {
  it('should create work unit', async () => {
    const instance = await WorkUnit.deployed();

    let receipt = await instance.create('A good task to do');
    reportGas('Create', receipt);

    assert.equal(receipt.logs.length, 2, 'Two logs should be emitted');
    assert.equal(receipt.logs[0].event, 'Transfer', 'Log should be Transfer event');
    assert.equal(receipt.logs[1].event, 'Minted', 'Log should be Minted event');
    assert.equal(receipt.logs[1].args.tokenId, 1, 'Token ID should be 1');
    assert.equal(receipt.logs[1].args.worker, accounts[0], 'Worker should be own account');
    assert.equal(receipt.logs[1].args.description, 'A good task to do',
      'Description should be correct');

    receipt = await instance.create('To get more stuff done');
    reportGas('Create', receipt);

    assert.equal(receipt.logs.length, 2, 'Two logs should be emitted');
    assert.equal(receipt.logs[0].event, 'Transfer', 'Log should be Transfer event');
    assert.equal(receipt.logs[1].event, 'Minted', 'Log should be Minted event');
    assert.equal(receipt.logs[1].args.tokenId, 2, 'Token ID should be 2');
    assert.equal(receipt.logs[1].args.worker, accounts[0], 'Worker should be own account');
    assert.equal(receipt.logs[1].args.description, 'To get more stuff done',
      'Description should be correct');
  });

});

