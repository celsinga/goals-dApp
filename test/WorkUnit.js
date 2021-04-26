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

  it('should burn work unit', async () => {
    const instance = await WorkUnit.deployed();

    const receipt = await instance.burn(1);
    reportGas('Burn', receipt);

    assert.equal(receipt.logs.length, 3, 'One log should be emitted');
    assert.equal(receipt.logs[2].event, 'Burned', 'Log should be Burned event');
    assert.equal(receipt.logs[2].args.tokenId, 1, 'Token ID should be 1');
    assert.equal(await instance.exists(1), false, 'Token should no longer exist');
  });

  it('should not burn work unit if not owner', async () => {
    const instance = await WorkUnit.deployed();
    try {
      await instance.burn.sendTransaction(2, { from: accounts[1] });
    } catch (e) {
      assert.equal(e.reason, 'Must be owner of token', 'Error must be correct type');
      return;
    }

    assert.fail('Operation finished');
  });

  it('should not burn work unit if not existing', async () => {
    const instance = await WorkUnit.deployed();
    try {
      await instance.burn.sendTransaction(3);
    } catch (e) {
      assert.equal(e.reason, 'ERC721: owner query for nonexistent token',
        'Error must be correct type');
      return;
    }

    assert.fail('Operation finished');
  });
});

