// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

import './WorkUnit.sol';

contract WorkUnitMarket is ERC721Holder {
  struct Sale {
    IERC20 buyingToken;
    uint value;
    address buyer;
    address seller;
  }

  WorkUnit workUnit;
  mapping(uint => Sale) sales;

  event SaleListed(uint indexed tokenId, address indexed buyer, address indexed seller);
  event SaleStarted(uint indexed tokenId, uint value, address buyingToken);
  event SaleCancelled(uint indexed tokenId);
  event SaleCompleted(uint indexed tokenId);

  constructor(address workUnitContract) {
    workUnit = WorkUnit(workUnitContract);
  }

  function listSale(string calldata description, address buyer) public {
    require(buyer != msg.sender, "You're the seller, you can't be the buyer");

    uint tokenId = workUnit.create(description);

    sales[tokenId].seller = msg.sender;
    sales[tokenId].buyer = buyer;

    emit SaleListed(tokenId, buyer, msg.sender);
  }

  function startSale(uint tokenId, uint value, address tokenContract) public {
    require(value > 0, "Order amount must be non-zero");

    Sale storage sale = sales[tokenId];

    require(sale.buyer == msg.sender, "No sale exists for buyer");
    require(sale.value == 0, "Sale escrow already exists");

    sale.buyingToken = IERC20(tokenContract);
    
    require(sale.buyingToken.transferFrom(msg.sender, address(this), value),
            "Failed to transfer funds into escrow");

    sale.value = value;

    emit SaleStarted(tokenId, value, tokenContract);
  }

  function cancelSale(uint tokenId) public {
    Sale storage sale = sales[tokenId];
    require(sale.buyer == msg.sender || sale.seller == msg.sender, "Must be either buyer or seller");

    if (sale.value > 0) {
      require(sale.buyingToken.transfer(sale.buyer, sale.value),
              "Failed to refund funds from escrow. Shit.");
    }
    workUnit.burn(tokenId);

    delete sales[tokenId];

    emit SaleCancelled(tokenId);
  }

  function completeSale(uint tokenId) public {
    Sale storage sale = sales[tokenId];
    require(sale.buyer == msg.sender, "No order exists for buyer");

    require(sale.buyingToken.transfer(sale.seller, sale.value),
            "Failed to transfer funds from escrow. Shit!");
    workUnit.transferFrom(address(this), sale.buyer, tokenId);

    delete sales[tokenId];

    emit SaleCompleted(tokenId);
  }
}
