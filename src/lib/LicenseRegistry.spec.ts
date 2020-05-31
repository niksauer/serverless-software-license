import test from 'ava';
import { LicenseRegistry } from './LicenseRegistry';
import {
  setupTestEnvironment,
  TestEnvironment,
  advanceBlock,
} from './test-util';
import { ethers } from 'ethers';

test.beforeEach(async (t) => {
  const environment = await setupTestEnvironment();

  (t.context as TestEnvironment) = {
    provider: environment.provider,
    accounts: environment.accounts,
    deployerAddress: environment.deployerAddress,
    deployerSigner: environment.deployerSigner,
    contractAddress: environment.contractAddress,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    getSigner: environment.getSigner,
  };
});

test('numberOfLicenses() returns a number', async (t) => {
  const {
    provider,
    deployerAddress,
    contractAddress,
  } = t.context as TestEnvironment;

  const registry = new LicenseRegistry(contractAddress, provider);
  const response = await registry.numberOfLicenses(deployerAddress);

  t.true(typeof response == 'number');
});

test('hasLicense() returns a boolean', async (t) => {
  const {
    provider,
    deployerAddress,
    contractAddress,
  } = t.context as TestEnvironment;

  const registry = new LicenseRegistry(contractAddress, provider);
  const response = await registry.hasLicense(deployerAddress);

  t.true(typeof response == 'boolean');
});

test("purchaseLicense() increases the callee's number of licenses", async (t) => {
  const {
    deployerAddress,
    deployerSigner,
    contractAddress,
  } = t.context as TestEnvironment;

  const registry = new LicenseRegistry(contractAddress, deployerSigner);

  const oldBalance = await registry.numberOfLicenses(deployerAddress);
  await registry.purchaseLicense(deployerAddress);
  const newBalance = await registry.numberOfLicenses(deployerAddress);

  t.deepEqual(newBalance, oldBalance + 1);
});

// test.serial('purchaseLicense() can auto fill the license value', async (t) => {
//   const address = deployerAddress;
//   const signer = deployer;

//   const registry = new LicenseRegistry(contractAddress, signer);

//   const oldBalance = await registry.numberOfLicenses(address);
//   await registry.purchaseLicense(deployerAddress);
//   const newBalance = await registry.numberOfLicenses(address);

//   t.deepEqual(newBalance, oldBalance + 1);
// });

test('purchaseLicense() fails when provided with wrong Ether amount', async (t) => {
  const {
    deployerAddress,
    deployerSigner,
    contractAddress,
  } = t.context as TestEnvironment;

  const registry = new LicenseRegistry(contractAddress, deployerSigner);

  await t.throwsAsync(
    registry.purchaseLicense(deployerAddress, ethers.utils.parseEther('0.4'))
  );
});

// https://github.com/ethers-io/ethers.js/issues/615
// test.serial('subscribe() notifies on LicensePurchased event', async (t) => {
//   const {
//     deployerAddress,
//     contractAddress,
//     deployerSigner,
//   } = t.context as TestEnvironment;

//   t.plan(1);

//   const registry = new LicenseRegistry(contractAddress, deployerSigner);

//   registry.subscribe(LicenseTokenEvent.LicensePurchased, (address, event) => {
//     t.true(typeof address == 'string');
//   });

//   await registry.purchaseLicense(deployerAddress);
// });

test('generatePurchaseTransaction() creates an unsigned contract transaction', async (t) => {
  const {
    provider,
    contractAddress,
    deployerAddress,
  } = t.context as TestEnvironment;

  const registry = new LicenseRegistry(contractAddress, provider);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const unsignedTransaction = await registry.generatePurchaseTransaction(
    deployerAddress
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  t.true(unsignedTransaction.data != undefined);
});
