module.exports.reportGas = (op, receipt) => {
  console.log(`${op} operation, gas used: ${receipt.receipt.gasUsed}`);
}
