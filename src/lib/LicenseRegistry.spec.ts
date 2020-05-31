import test from 'ava';
import { LicenseRegistry } from './LicenseRegistry';
import { ethers } from 'ethers';
import { LicenseTokenEvent } from './interfaces/registry';

const contractAddress = '0xF3762058d77d3d5929127af3E5492920D27Ac0c2';
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
const deployerAddress = '0x41c1c3d1F21a46aB84E4535167044676c30875BE';
const deployerKey =
  '0x48be9279c51432bc32d62b69eb5581ac68578304ee79cd528f427994d6c51e41';
const deployerWallet = new ethers.Wallet(deployerKey, provider);
const licensePrice = ethers.utils.parseEther('0.5');

test('numberOfLicenses() returns a number', async (t) => {
  const address = deployerAddress;

  const registry = new LicenseRegistry(contractAddress, provider);

  const response = await registry.numberOfLicenses(address);
  t.true(typeof response == 'number');
});

test('hasLicense() returns a boolean', async (t) => {
  const address = deployerAddress;

  const registry = new LicenseRegistry(contractAddress, provider);
  const response = await registry.hasLicense(address);

  t.true(typeof response == 'boolean');
});

test.serial(
  "purchaseLicense() increases the callee's number of licenses",
  async (t) => {
    const address = deployerAddress;
    const signer = deployerWallet;
    const txValue = licensePrice;

    const registry = new LicenseRegistry(contractAddress, signer);

    const oldBalance = await registry.numberOfLicenses(address);
    await registry.purchaseLicense(deployerAddress, txValue);
    const newBalance = await registry.numberOfLicenses(address);

    t.deepEqual(newBalance, oldBalance + 1);
  }
);

test.serial('purchaseLicense() can auto fill the license value', async (t) => {
  const address = deployerAddress;
  const signer = deployerWallet;

  const registry = new LicenseRegistry(contractAddress, signer);

  const oldBalance = await registry.numberOfLicenses(address);
  await registry.purchaseLicense(deployerAddress);
  const newBalance = await registry.numberOfLicenses(address);

  t.deepEqual(newBalance, oldBalance + 1);
});

test.serial(
  'purchaseLicense() fails when provided with wrong Ether amount',
  async (t) => {
    const signer = deployerWallet;
    const txValue = ethers.utils.parseEther('0.4');

    const registry = new LicenseRegistry(contractAddress, signer);

    await t.throwsAsync(registry.purchaseLicense(deployerAddress, txValue));
  }
);

test.serial('subscribe() notifies on LicensePurchased event', async (t) => {
  const signer = deployerWallet;
  const txValue = licensePrice;

  t.plan(1);

  const registry = new LicenseRegistry(contractAddress, signer);

  registry.subscribe(LicenseTokenEvent.LicensePurchased, (address, event) => {
    t.true(typeof address == 'string');
  });

  await registry.purchaseLicense(deployerAddress, txValue);
});

test('generatePurchaseTransaction() creates an unsigned contract transaction', async (t) => {
  const address = deployerAddress;
  const signer = deployerWallet;
  const txValue = licensePrice;

  const registry = new LicenseRegistry(contractAddress, signer);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const unsignedTransaction = await registry.generatePurchaseTransaction(
    address,
    txValue
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  t.true(unsignedTransaction.data != undefined);
});
