import {
  ILicenseRegistry,
  LicenseRegistryEventHandler,
  LicenseRegistryEvent,
} from '../types/registry';

export class LicenseRegistry implements ILicenseRegistry {
  // MARK: - Public Properties

  // MARK: - Private Properties

  // MARK: - Initialization
  constructor(address: string) {}

  // MARK: - Public Methods
  hasLicense(address: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  generatePurchaseTransaction(address: string): string {
    throw new Error('Method not implemented.');
  }

  subscribe(
    handler: LicenseRegistryEventHandler,
    filter?: LicenseRegistryEvent[] | undefined
  ): void {
    throw new Error('Method not implemented.');
  }

  // MARK: - Private Methods
}
