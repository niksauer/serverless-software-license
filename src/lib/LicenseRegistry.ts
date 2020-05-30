/* eslint-disable */
import { Contract, Signer } from 'ethers';
import {
  ILicenseRegistry,
  LicenseTokenEventHandler,
  LicenseTokenEvent,
  ContractResponse,
} from './interfaces/registry';
import { Provider } from 'ethers/providers';
import abi from '../abi/LicenseToken.json';
import { Transaction, BigNumber } from 'ethers/utils';

export class LicenseRegistry implements ILicenseRegistry {
  // MARK: - Public Properties

  // MARK: - Private Properties
  private contract: Contract;
  private provider: Provider;

  // MARK: - Initialization
  constructor(address: string, signerOrProvider: Signer | Provider) {
    if (signerOrProvider instanceof Signer) {
      this.provider = signerOrProvider.provider!;
    } else {
      this.provider = signerOrProvider;
    }

    this.contract = new Contract(
      address,
      (abi as any)['abi'],
      signerOrProvider
    );
  }

  // MARK: - Public Methods
  async numberOfLicenses(address: string): Promise<number> {
    const count: BigNumber = await this.contract.balanceOf(address);

    return count.toNumber();
  }

  async hasLicense(address: string): Promise<boolean> {
    return (await this.numberOfLicenses(address)) >= 1;
  }

  async purchaseLicense(
    address: string,
    value: BigNumber
  ): Promise<ContractResponse> {
    const tx: Transaction = await this.contract.purchaseLicense(address, {
      value: value,
    });

    return {
      txHash: tx.hash!,
    };
  }

  generatePurchaseTransaction(address: string): string {
    throw new Error('Method not implemented.');
  }

  subscribe<Event extends LicenseTokenEvent>(
    event: Event,
    handler: LicenseTokenEventHandler<Event>
  ): void {
    this.contract.addListener(LicenseTokenEvent[event], handler);
  }

  // MARK: - Private Methods
}
