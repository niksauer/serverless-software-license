import { providers, ethers } from 'ethers';
import Ganache from 'ganache-core';
import LicenseToken from '../abi/LicenseToken.json';

export interface TestEnvironment {
  provider: providers.Provider;
  accounts: string[];
  deployerAddress: string;
  deployerSigner: ethers.Signer;
  contractAddress: string;
  getSigner(address: string): ethers.Signer;
}

async function deployContract(
  provider: ethers.providers.Provider,
  deployer: ethers.Signer
): Promise<string> {
  // https://docs.ethers.io/ethers.js/html/api-contract.html
  const contractFactory = new ethers.ContractFactory(
    LicenseToken['abi'],
    LicenseToken['bytecode'],
    deployer
  );

  const contract = await contractFactory.deploy('Fantastical', 'FANTA');

  // The address the contract WILL have once mined
  // console.log(contract.address);

  // The transaction that was sent to the network to deploy the contract
  // console.log(contract.deployTransaction.hash);
  // "0x159b76843662a15bd67e482dcfbee55e8e44efad26c5a614245e12a00d4b1a51"

  // The contract is NOT deployed yet; we must wait until it is mined
  await contract.deployed();

  return contract.address;
}

export async function setupTestEnvironment(
  mnemonic?: string
): Promise<TestEnvironment> {
  const blockchain = Ganache.provider({
    total_accounts: 3,
    default_balance_ether: 100,
    // blockTime: 5, // mine a block every two seconds in order to flush event listeners
    mnemonic: mnemonic,
  });

  const provider = new providers.Web3Provider(blockchain as any);

  const accounts = await provider.listAccounts();

  const deployerAddress = accounts[0];
  const deployerSigner = provider.getSigner(deployerAddress);

  const contractAddress = await deployContract(provider, deployerSigner);

  return {
    provider,
    accounts,
    deployerAddress,
    deployerSigner,
    contractAddress,
    getSigner: (address: string): ethers.Signer => provider.getSigner(address),
  };
}

// https://medium.com/edgefund/time-travelling-truffle-tests-f581c1964687
export async function advanceBlock(
  provider: providers.JsonRpcProvider
): Promise<void> {
  await provider.send('evm_mine', [{ id: new Date().getTime() }]);
}
