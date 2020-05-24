import { Contract } from 'ethers';
import {
  ILicenseRegistry,
  LicenseRegistryEventHandler,
  LicenseRegistryEvent,
} from '../types/registry';
import { Provider } from 'ethers/providers';

export class LicenseRegistry implements ILicenseRegistry {
  // MARK: - Public Properties

  // MARK: - Private Properties
  private contract: Contract;

  // MARK: - Initialization
  constructor(address: string, provider: Provider, abi?: any) {
    this.contract = new Contract(address, [], provider);
  }

  // MARK: - Public Methods
  hasLicense(address: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  generatePurchaseTransaction(address: string): string {
    throw new Error('Method not implemented.');
  }

  subscribe<Event extends LicenseRegistryEvent>(
    event: Event,
    handler: LicenseRegistryEventHandler<Event>
  ): void {
    this.contract.addListener(event, handler);
  }

  // MARK: - Private Methods
}
