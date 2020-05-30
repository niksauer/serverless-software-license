/* eslint-disable */
import { Contract } from 'ethers';
import {
  ILicenseRegistry,
  LicenseTokenEventHandler,
  LicenseTokenEvent,
} from '../types/registry';
import { Provider } from 'ethers/providers';
import abi from '../abi/LicenseToken.json';

export class LicenseRegistry implements ILicenseRegistry {
  // MARK: - Public Properties

  // MARK: - Private Properties
  private contract: Contract;

  // MARK: - Initialization
  constructor(address: string, provider: Provider) {
    this.contract = new Contract(address, (abi as any)['abi'], provider);
  }

  // MARK: - Public Methods
  async hasLicense(address: string): Promise<boolean> {
    const numberOfLicenses = await this.contract.balanceOf(address);

    return numberOfLicenses >= 1;
  }

  generatePurchaseTransaction(address: string): string {
    throw new Error('Method not implemented.');
  }

  subscribe<Event extends LicenseTokenEvent>(
    event: Event,
    handler: LicenseTokenEventHandler<Event>
  ): void {
    this.contract.addListener(event, handler);
  }

  // MARK: - Private Methods
}
