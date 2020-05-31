/* eslint-disable */
import {
  Contract,
  Signer,
  providers,
  BigNumber,
  Transaction,
  UnsignedTransaction,
} from 'ethers';
import {
  ILicenseRegistry,
  LicenseTokenEventHandler,
  LicenseTokenEvent,
} from './interfaces/registry';
import abi from '../abi/LicenseToken.json';

export class LicenseRegistry implements ILicenseRegistry {
  // MARK: - Public Properties
  get licensePrice(): BigNumber {
    return this.contract.LICENSE_PRICE();
  }

  // MARK: - Private Properties
  private contract: Contract;
  private provider: providers.Provider | undefined;

  // MARK: - Initialization
  constructor(address: string, signerOrProvider: Signer | providers.Provider) {
    if (signerOrProvider instanceof Signer) {
      this.provider = signerOrProvider.provider;
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
    value?: BigNumber
  ): Promise<Transaction> {
    return this.contract.purchaseLicense(address, {
      value: value ?? this.licensePrice,
    });
  }

  async generatePurchaseTransaction(
    address: string,
    value?: BigNumber
  ): Promise<UnsignedTransaction> {
    return this.contract.populateTransaction['purchaseLicense'](address, {
      value: value ?? this.licensePrice,
    });
  }

  subscribe<Event extends LicenseTokenEvent>(
    event: Event,
    handler: LicenseTokenEventHandler<Event>
  ): void {
    this.contract.on(LicenseTokenEvent[event], handler);
  }

  // MARK: - Private Methods
}
