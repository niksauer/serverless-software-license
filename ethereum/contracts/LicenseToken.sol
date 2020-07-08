// SPDX-License-Identifier: MIT
pragma solidity ^0.6.8;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
// import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

// https://docs.openzeppelin.com/contracts/3.x/erc20
contract LicenseToken is ERC20, Ownable {
    // MARK: - Events
    event LicensePurchased(address indexed buyer);

    // MARK: - Public Properties
    uint256 public price = 0.5 ether;

    // MARK: - Initialization
    constructor(string memory name, string memory symbol)
        public
        ERC20(name, symbol)
    {
        _setupDecimals(0);
        _mint(msg.sender, 1);
    }

    // MARK: - Public Methods
    function purchaseLicense(address owner) public payable {
        require(owner != address(0), 'INVALID_OWNER_ADDRESS');
        require(msg.value >= price, 'INSUFFICIENT_FUNDS');

        _mint(owner, 1);

        emit LicensePurchased(owner);
    }

    function purchaseLicenseInternal(address owner) public onlyOwner {
        require(owner != address(0), 'INVALID_OWNER_ADDRESS');

        _mint(owner, 1);

        emit LicensePurchased(owner);
    }

    function setLicensePrice(uint256 newPrice) public onlyOwner {
        price = newPrice;
    }
}

// contract LicenseToken is ERC721, Ownable {
//     // MARK: - Events
//     event LicensePurchased(address indexed buyer, uint256 tokenID);

//     // MARK: - Public Properties
//     uint256 public constant LICENSE_PRICE = 0.5 ether;

//     // MARK: - Initialization
//     constructor(string memory name, string memory symbol)
//         public
//         ERC721(name, symbol)
//     {
//         _mint(msg.sender, 1);
//     }

//     // MARK: - Public Methods
//     function purchaseLicense(address owner) public payable {
//         require(owner != address(0), 'INVALID_OWNER_ADDRESS');
//         require(msg.value >= LICENSE_PRICE, 'INSUFFICIENT_FUNDS');

//         _mint(owner, 1);
//     }
// }
