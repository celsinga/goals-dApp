const WorkUnit = artifacts.require('WorkUnit');
const WorkUnitMarket = artifacts.require('WorkUnitMarket');
const CADCoin = artifacts.require('CADCoin');
const { reportGas } = require('./util');

contract('WorkUnitMarket', (accounts) => {
  before(async () => {
    const cadCoin = await CADCoin.deployed();
    await cadCoin.addReserveSupply(10000);
    await cadCoin.transfer(accounts[1], 10000);
  });

  it('should list token for sale', async () => {
    const workUnit = await WorkUnit.deployed();
    const workUnitMarket = await WorkUnitMarket.deployed();

    const receipt = await workUnitMarket.listSale('A cool work unit', accounts[1]);
    reportGas('List', receipt);

    assert.equal(receipt.logs.length, 1, 'One log should be emitted');
    assert.equal(receipt.logs[0].event, 'SaleListed', 'Log should be SaleListed event');
    assert.equal(receipt.logs[0].args.tokenId, 1, 'Token ID should be 1');
    assert.equal(receipt.logs[0].args.buyer, accounts[1], 'Buyer should be second account');
    assert.equal(await workUnit.ownerOf(1), workUnitMarket.address, 'Contract should own work unit');
  });

  it('should not list token with self as buyer', async () => {
    const workUnitMarket = await WorkUnitMarket.deployed();

    try {
      await workUnitMarket.listSale("Another task to do", accounts[0]);
    } catch (e) {
      assert.equal(e.reason, 'You\'re the seller, you can\'t be the buyer', 'Error must be of correct type');
      return;
    }

    assert.fail('Operation completed');
  });

  it('should start sale', async () => {
    const cadCoin = await CADCoin.deployed();
    const workUnitMarket = await WorkUnitMarket.deployed();

    await cadCoin.approve.sendTransaction(workUnitMarket.address, 2500, {
      from: accounts[1]
    });

    const receipt = await workUnitMarket.startSale.sendTransaction(1, 2500, cadCoin.address, {
      from: accounts[1]
    });
    reportGas('Start', receipt);

    assert.equal(receipt.logs.length, 1, 'One log should be emitted');
    assert.equal(receipt.logs[0].event, 'SaleStarted', 'Log should be SaleStarted event');
    assert.equal(receipt.logs[0].args.tokenId, 1, 'Token ID should be 1');
    assert.equal(receipt.logs[0].args.buyingToken, cadCoin.address, 'Buying token address should be correct');
    assert.equal(receipt.logs[0].args.value, 2500, 'Value should be correct');

    assert.equal(await cadCoin.balanceOf(accounts[1]), 7500, 'Balance should not be 7500');
  });


  it('should not start sale if sale already started', async () => {
    const cadCoin = await CADCoin.deployed();
    const workUnitMarket = await WorkUnitMarket.deployed();

    try {
      await workUnitMarket.startSale.sendTransaction(1, 2500, cadCoin.address, {
        from: accounts[1]
      });
    } catch (e) {
      assert.equal(e.reason, 'Sale escrow already exists', 'Error must be of correct type');
      return;
    }

    assert.fail('Operation completed');
  });

  it('should not start sale if no sale exists', async () => {
    const cadCoin = await CADCoin.deployed();
    const workUnitMarket = await WorkUnitMarket.deployed();

    try {
      await workUnitMarket.startSale.sendTransaction(2, 2500, cadCoin.address, {
        from: accounts[1]
      });
    } catch (e) {
      assert.equal(e.reason, 'No sale exists for buyer', 'Error must be of correct type');
      return;
    }

    assert.fail('Operation completed');
  });

  it('should cancel sale', async () => {
    const cadCoin = await CADCoin.deployed();
    const workUnit = await WorkUnit.deployed();
    const workUnitMarket = await WorkUnitMarket.deployed();

    await workUnitMarket.listSale("A cool task to do", accounts[1]);

    await cadCoin.approve.sendTransaction(workUnitMarket.address, 2500, {
      from: accounts[1]
    });
    await workUnitMarket.startSale.sendTransaction(2, 2500, cadCoin.address, {
      from: accounts[1]
    });

    const receipt = await workUnitMarket.cancelSale(2);

    assert.equal(receipt.logs.length, 1, 'One log should be emitted');
    assert.equal(receipt.logs[0].event, 'SaleCancelled', 'Log should be SaleCancelled event');
    assert.equal(receipt.logs[0].args.tokenId, 2, 'Token ID should be 2');

    assert.equal(await cadCoin.balanceOf(accounts[1]), 7500, 'Balance should be 7500 after refund');
    assert.equal(await workUnit.exists(2), false, 'Token should be gone');
  });

  it('should not cancel sale if not buyer/seller', async () => {
    const workUnitMarket = await WorkUnitMarket.deployed();

    try {
      await workUnitMarket.cancelSale.sendTransaction(1, { from: accounts[2] });
    } catch (e) {
      assert.equal(e.reason, 'Must be either buyer or seller', 'Error must be of correct type');
      return;
    }

    assert.fail('Operation completed');
  });

  it('should not cancel sale if no sale exists', async () => {
    const workUnitMarket = await WorkUnitMarket.deployed();

    try {
      await workUnitMarket.cancelSale(3);
    } catch (e) {
      assert.equal(e.reason, 'Must be either buyer or seller', 'Error must be of correct type');
      return;
    }

    assert.fail('Operation completed');
  });

  it('should complete sale', async () => {
    const cadCoin = await CADCoin.deployed();
    const workUnit = await WorkUnit.deployed();
    const workUnitMarket = await WorkUnitMarket.deployed();

    await workUnitMarket.listSale('A task', accounts[1]);
    await cadCoin.approve.sendTransaction(workUnitMarket.address, 2500, {
      from: accounts[1]
    });
    await workUnitMarket.startSale.sendTransaction(3, 2500, cadCoin.address, {
      from: accounts[1]
    });

    const receipt = await workUnitMarket.completeSale.sendTransaction(3, {
      from: accounts[1]
    });

    assert.equal(receipt.logs.length, 1, 'One log should be emitted');
    assert.equal(receipt.logs[0].event, 'SaleCompleted', 'Log should be SaleCompleted event');
    assert.equal(receipt.logs[0].args.tokenId, 3, 'Token ID should be 3');

    assert.equal(await cadCoin.balanceOf(accounts[0]), 2500, 'Balance should be 2500 after completion');
    assert.equal(await workUnit.ownerOf(3), accounts[1], 'Token should be delivered to buyer');
  });

  it('should not complete sale if no sale exists', async () => {
    const workUnitMarket = await WorkUnitMarket.deployed();

    try {
      await workUnitMarket.completeSale(4);
    } catch (e) {
      assert.equal(e.reason, 'No order exists for buyer', 'Error must be of correct type');
      return;
    }

    assert.fail('Operation completed');
  });

  it('should not complete sale if not buyer', async () => {
    const cadCoin = await CADCoin.deployed();
    const workUnit = await WorkUnit.deployed();
    const workUnitMarket = await WorkUnitMarket.deployed();

    await workUnitMarket.listSale('Another task', accounts[1]);
    await cadCoin.approve.sendTransaction(workUnitMarket.address, 2500, {
      from: accounts[1]
    });
    await workUnitMarket.startSale.sendTransaction(4, 2500, cadCoin.address, {
      from: accounts[1]
    });

    try {
      await workUnitMarket.completeSale(4);
    } catch (e) {
      assert.equal(e.reason, 'No order exists for buyer', 'Error must be of correct type');
      return;
    }

    assert.fail('Operation completed');
  });
});

