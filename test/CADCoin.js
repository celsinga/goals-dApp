const CADCoin = artifacts.require('CADCoin');
const { reportGas } = require('./util');

contract('CADCoin', (accounts) => {
  it('should add reserve coins', async () => {
    const instance = await CADCoin.deployed();

    let receipt = await instance.addReserveSupply(10000);
    reportGas('Add', receipt);

    assert.equal(receipt.logs.length, 1, 'One log should be emitted');
    assert.equal(receipt.logs[0].event, 'Transfer', 'Log should be Transfer event');
    assert.equal(receipt.logs[0].args.from, '0x0000000000000000000000000000000000000000',
      'Tokens should be from contract');
    assert.equal(receipt.logs[0].args.to, accounts[0], 'Tokens should be recv by sender');

    assert.equal((await instance.balanceOf(accounts[0])), 10000, 'Balance should be 10000');
  });
  
  it('should not add reserve coins if not owner', async () => {
    const instance = await CADCoin.deployed();

    try {
      await instance.addReserveSupply.sendTransaction(100, { from: accounts[1] });
      assert.fail('Operation completed');
    } catch (e) {
      assert.equal(e.reason, 'Ownable: caller is not the owner', 'Error must be of correct type');
    }

    assert.equal((await instance.balanceOf(accounts[0])), 10000, 'Balance should be 10000');
  });

  it('should burn reserve coins', async () => {
    const instance = await CADCoin.deployed();

    let receipt = await instance.removeReserveSupply(10000);
    reportGas('Remove', receipt);

    assert.equal(receipt.logs.length, 1, 'One log should be emitted');
    assert.equal(receipt.logs[0].event, 'Transfer', 'Log should be Transfer event');
    assert.equal(receipt.logs[0].args.from, accounts[0], 'Tokens should be from contract');
    assert.equal(receipt.logs[0].args.to, '0x0000000000000000000000000000000000000000',
      'Tokens should be recv by sender');

    assert.equal((await instance.balanceOf(accounts[0])), 0, 'Balance should be 0');
  });
  
  it('should not burn reserve coins if not owner', async () => {
    const instance = await CADCoin.deployed();

    try {
      await instance.removeReserveSupply.sendTransaction(100, { from: accounts[1] });
      assert.fail('Operation completed');
    } catch (e) {
      assert.equal(e.reason, 'Ownable: caller is not the owner', 'Error must be of correct type');
    }
  });
});

