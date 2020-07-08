# Test Environment (Ganache)

```
Available Accounts
==================
(0) 0x41c1c3d1F21a46aB84E4535167044676c30875BE (100 ETH)
(1) 0xDcD170da81aD6c04f6dDe9c4D0981651Ca4Cdf23 (100 ETH)
(2) 0x1F13D1EE1ABf9B58C5ff7F57effFBe03db6BF762 (100 ETH)

Private Keys
==================
(0) 0x48be9279c51432bc32d62b69eb5581ac68578304ee79cd528f427994d6c51e41
(1) 0x7b1815a484f4729b03db58e3253905e570772330948dd2013633c99d5c00ea4d
(2) 0x43f71c7e95218221b160c5f59250345c8b637d5a1d19c524478663b6e721ff84

HD Wallet
==================
Mnemonic:      make purchase caution interest current shiver amount flat donkey sun coyote corn
Base HD Path:  m/44'/60'/0'/0/{account_index}
```

# Deployment Instructions for Testnet (Goerli)

1. Start client and create new account

```
$ git clone git@github.com:niksauer/blockchain-lab.git
$ cd blockchain-lab
$ docker-compose -f docker-compose-geth.yml up

$ docker-compose -f docker-compose-geth.yml exec geth /bin/sh
$ > geth account new --datadir /root/.ethereum/goerli/

Your new account is locked with a password. Please give a password. Do not forget this password.
Password: <password>
Repeat password: <password>

Your new key was generated

Public address of the key:   0x0cBA519aC95879BDE88C975E918F78270972AF30
Path of the secret key file: /root/.ethereum/goerli/keystore/UTC--[...]

$ > geth account list --datadir /root/.ethereum/goerli

Account #0: {0cba519ac95879bde88c975e918f78270972af30} keystore:///root/.ethereum/goerli/keystore/UTC--[...]
```

2. Export private key (continued from above shell [`exec geth /bin/sh`])

```
$ > cd /root/.ethereum/goerli/keystore/

$ > cat UTC--[...]

{"address":"0cba519ac95879bde88c975e918f78270972af30","crypto":{"cipher":"aes-128-ctr","ciphertext":"cae237ba69ede3d821801efa04b7b33862cc20e70dfe2369bd47225d8cece5be","cipherparams":{"iv":"23fada8ebd4cd6194127075110715429"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"6fdd4c69b2f90d0d20065e1a081c466430e63b15c033b7d16b4e7a496bdd6521"},"mac":"76befc11647091428495151bfcad29bd2e2085565b68ba564c04614e8c2a36ee"},"id":"590fd5c3-3237-45d1-a864-fb34ae731c08","version":3}

$ > CTRL + C
```

Copy file to machine-local directory (`./keystore/UTC--[..]`)

```
$ node
$ > const keyethereum = require('keythereum')
$ > let key = keyethereum.importFromFile("0x0cba519ac95879bde88c975e918f78270972af30","./")
$ > let privateKey = keyethereum.recover("<password>", key)
$ > console.log(privateKey.toString('hex'))

<privateKey>
```

Verify that private key has been exported correctly

```
$ > let Web3 = require('web3')
$ > let provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545/")
$ > let web3Client = new Web3(provider);
$ > let account = web3Client.eth.accounts.privateKeyToAccount('0x<privateKey>')
$ > console.log(account.address)

0x0cBA519aC95879BDE88C975E918F78270972AF30
```

3. Unlock account for JSON-RPC usage

```
$ docker-compose -f docker-compose-geth.yml exec geth /bin/sh
$ > geth attach --datadir /root/.ethereum/goerli/
$ >> web3.personal.unlockAccount("0x0cBA519aC95879BDE88C975E918F78270972AF30")

Unlock account 0x0cBA519aC95879BDE88C975E918F78270972AF30
Passphrase: <password>
true
```

4. Show current account balance (continued from above shell)

```
$ >> web3.eth.getBalance('0x0cBA519aC95879BDE88C975E918F78270972AF30')

0

$ >> CTRL + C
```

5. Fund deployer address 8x via https://goerli-faucet.slock.it/ (verify through above command)

6. Update deployer address in `truffle-config.js`

7. Deploy smart-contract

```
$ pwd

/Users/nik/Developer/hsrm/serverless-software-license

$ cd ethereum
$ truffle migrate --network goerli --dry-run

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



Migrations dry-run (simulation)
===============================
> Network name:    'goerli-fork'
> Network id:      5
> Block gas limit: 8000000 (0x7a1200)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > block number:        3010942
   > block timestamp:     1594220218
   > account:             0x0cBA519aC95879BDE88C975E918F78270972AF30
   > balance:             0.399701218
   > gas used:            149391 (0x2478f)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.000298782 ETH

   -------------------------------------
   > Total cost:         0.000298782 ETH


2_deploy_contracts.js
=====================

   Deploying 'LicenseToken'
   ------------------------
   > block number:        3010944
   > block timestamp:     1594220219
   > account:             0x0cBA519aC95879BDE88C975E918F78270972AF30
   > balance:             0.396531474
   > gas used:            1557531 (0x17c41b)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.003115062 ETH

   -------------------------------------
   > Total cost:         0.003115062 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.003413844 ETH





Starting migrations...
======================
> Network name:    'goerli'
> Network id:      5
> Block gas limit: 8000000 (0x7a1200)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0xbe1782bafa9851d7efd47962c8b0d1d856ed008241f1a97ee738adf5c55aa138
   > Blocks: 0            Seconds: 12
   > contract address:    0x1C87AbeB6da182db792ff091d712760c60c1bB93
   > block number:        3010942
   > block timestamp:     1594220234
   > account:             0x0cBA519aC95879BDE88C975E918F78270972AF30
   > balance:             0.39671218
   > gas used:            164391 (0x28227)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00328782 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00328782 ETH


2_deploy_contracts.js
=====================

   Deploying 'LicenseToken'
   ------------------------
   > transaction hash:    0xba6f7b47e6c0005e45cde171d0fb229d1451bc20114cdf7e1eaf87caa650e86f
   > Blocks: 0            Seconds: 12
   > contract address:    0x9CcB19007Fa23CbEB7c74A62CD7aaBD255C183ab
   > block number:        3010945
   > block timestamp:     1594220279
   > account:             0x0cBA519aC95879BDE88C975E918F78270972AF30
   > balance:             0.36321474
   > gas used:            1632531 (0x18e913)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.03265062 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.03265062 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.03593844 ETH
```

8. Test via [serverless-software-license-example](https://github.com/niksauer/serverless-software-license-example)
