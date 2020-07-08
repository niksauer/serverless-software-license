import test from 'ava';
import { verifyOwnership, relayTransaction } from './util';
import { AddressOwnershipChallenge } from './interfaces/util';
import { ethers } from 'ethers';
import { setupTestEnvironment, ContractOptions } from './test-util';

const walletA = ethers.Wallet.createRandom();
const walletB = ethers.Wallet.createRandom();

function getRandomData(): string {
  return Math.random().toString(36).substring(7);
}

test('verifyOwnership() returns false for invalid inputs', (t) => {
  const challenge: AddressOwnershipChallenge = {
    address: '',
    data: '',
  };

  const response = '';

  t.true(typeof verifyOwnership(challenge, response) == 'boolean');
});

test('verifyOwnership() returns true if the response data is signed by the challenged address', async (t) => {
  const challenge: AddressOwnershipChallenge = {
    address: walletA.address,
    data: getRandomData(),
  };

  const response = await walletA.signMessage(challenge.data);

  t.true(verifyOwnership(challenge, response));
});

test('verifyOwnership() returns false if the response data is signed by a different address', async (t) => {
  const challenge: AddressOwnershipChallenge = {
    address: walletA.address,
    data: getRandomData(),
  };

  const response = await walletB.signMessage(challenge.data);

  t.false(verifyOwnership(challenge, response));
});

test('verifyOwnership() returns false if the challenged address signs different data', async (t) => {
  const challenge: AddressOwnershipChallenge = {
    address: walletA.address,
    data: getRandomData(),
  };

  const response = await walletA.signMessage(getRandomData());

  t.false(verifyOwnership(challenge, response));
});

test('relayTransaction() broadcasts a transaction', async (t) => {
  const contract: ContractOptions = {
    name: 'Fantastical',
    symbol: 'FANTA',
  };
  const { deployerSigner, provider } = await setupTestEnvironment(contract);

  // only accounts provided through environment are pre-funded,
  // however they don't support eth_signtransation
  await deployerSigner.sendTransaction({
    to: walletA.address,
    value: ethers.utils.parseEther('1'),
  });

  let request: ethers.providers.TransactionRequest = {
    to: walletB.address,
    value: ethers.utils.parseEther('0.5'),
  };

  const sender = walletA.connect(provider);

  request = await sender.populateTransaction(request);

  const signedTransaction = await sender.signTransaction(request);
  const transaction = await relayTransaction(provider, signedTransaction);

  t.true(transaction.hash != undefined);
  t.true(typeof transaction.hash == 'string');
});
