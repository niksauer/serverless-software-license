import test from 'ava';
import { ILicenseRegistry } from './interfaces/registry';
import { ILicenseStorage } from './interfaces/manager';
import { LicenseManager } from './LicenseManager';

test('isValid is initialized with false', (t) => {
  const registry = {} as ILicenseRegistry;
  const storage = {} as ILicenseStorage;

  const manager = new LicenseManager(registry, storage);

  t.deepEqual(manager.isValid, false);
});
