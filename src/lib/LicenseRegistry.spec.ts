import test from 'ava';
import { LicenseRegistry } from './LicenseRegistry';
import { ethers } from 'ethers';

const contractAddress = '0x7133cC83694C1bE27A9433e4782ce91CEC74BeBb';
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
const deployerAddress = '0x41c1c3d1F21a46aB84E4535167044676c30875BE';

test('hasLicense() returns boolean', async (t) => {
  const registry = new LicenseRegistry(contractAddress, provider);
  const response = await registry.hasLicense(deployerAddress);

  t.true(typeof response == 'boolean');
});
