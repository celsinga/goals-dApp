// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CADCoin is ERC20, Ownable {
  constructor() ERC20("Canadian Dollar Coin", "CADC") {}

  function addReserveSupply(uint256 cents) public onlyOwner {
    _mint(msg.sender, cents);
  }

  function removeReserveSupply(uint256 cents) public onlyOwner {
    _burn(msg.sender, cents);
  }

  function decimals() public view virtual override returns(uint8) {
    return 2;
  }
}
