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

import LicenseToken from './abi/LicenseToken.json';

export { LicenseToken as LicenseTokenContractAbi };
