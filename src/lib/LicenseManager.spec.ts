import test from 'ava';
import { ILicenseRegistry } from './interfaces/registry';
import { ILicenseStorage } from './interfaces/manager';
import { LicenseManager } from './LicenseManager';

test('startActivation() sets activeChallenge and returns a string', (t) => {
  const registry = {} as ILicenseRegistry;
  const storage = {} as ILicenseStorage;

  const manager = new LicenseManager(registry, storage);
  const address = 'test';
  const data = manager.startActivation(address);

  t.deepEqual(typeof data, 'string');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  t.deepEqual((manager as any).activeChallenge, { address, data });
});
