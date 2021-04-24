// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract WorkUnitMarket {
  struct Sale {
    IERC20 buyingToken;
    uint value;
    address buyer;
    address seller;
  }

  IERC721 workUnit;
  mapping(uint => Sale) sales;

  event SaleListed(uint indexed tokenId);
  event SaleStarted(uint indexed tokenId, Sale sale);
  event SaleCancelled(uint indexed tokenId);
  event SaleCompleted(uint indexed tokenId);

  constructor(address workUnitContract) {
    workUnit = IERC721(workUnitContract);
  }

  function listSale(uint tokenId) public {
    require(sales[tokenId].seller == address(0), "Sale exists for token");

    workUnit.transferFrom(msg.sender, address(this), tokenId);

    sales[tokenId].seller = msg.sender;

    emit SaleListed(tokenId);
  }

  function startSale(uint tokenId, uint value, address tokenContract) public {
    require(value > 0, "Order amount must be non-zero");

    Sale storage sale = sales[tokenId];

    require(sale.seller != address(0), "Token not listed");
    require(sale.seller != msg.sender, "You're the seller, you can't be the buyer");
    require(sale.value == 0, "Sale escrow already exists");

    sale.buyingToken = IERC20(tokenContract);
    
    require(sale.buyingToken.transferFrom(msg.sender, address(this), value),
            "Failed to transfer funds into escrow");

    sale.value = value;
    sale.buyer = msg.sender;

    emit SaleStarted(tokenId, sale);
  }

  function cancelSale(uint tokenId) public {
    Sale storage sale = sales[tokenId];
    require(sale.buyer == msg.sender || sale.seller == msg.sender, "Must be either buyer or seller");

    if (sale.value > 0) {
      require(sale.buyingToken.transfer(sale.buyer, sale.value),
              "Failed to refund funds from escrow. Shit.");
    }
    workUnit.transferFrom(address(this), sale.seller, tokenId);

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