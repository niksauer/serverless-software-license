export * from './lib/LicenseManager';
export * from './lib/LicenseRegistry';
export * from './lib/util';
export * from './lib/storage/FileLicenseStorage';

export {
  ILicenseManager,
  License,
  LicenseManagerEvent,
  ILicenseStorage,
} from './lib/interfaces/manager';

export {
  ILicenseRegistry,
  LicenseTokenEvent,
  LicenseTokenEventHandler,
} from './lib/interfaces/registry';

export { AddressOwnershipChallenge } from './lib/interfaces/util';

export { setupTestEnvironment, TestEnvironment } from './lib/test-util';
