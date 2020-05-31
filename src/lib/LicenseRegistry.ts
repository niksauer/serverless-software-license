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
import LicenseToken from '../abi/LicenseToken.json';

export class LicenseRegistry implements ILicenseRegistry {
  // MARK: - Public Properties
  get licensePrice(): BigNumber {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return this.contract.LICENSE_PRICE() as BigNumber;
  }

  // MARK: - Private Properties
  private contract: Contract;
  // private provider: providers.Provider | undefined;

  // MARK: - Initialization
  constructor(address: string, signerOrProvider: Signer | providers.Provider) {
    // if (signerOrProvider instanceof Signer) {
    //   this.provider = signerOrProvider.provider;
    // } else {
    //   this.provider = signerOrProvider;
    // }

    this.contract = new Contract(
      address,
      LicenseToken['abi'],
      signerOrProvider
    );
  }

  // MARK: - Public Methods
  async numberOfLicenses(address: string): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return ((await this.contract.balanceOf(address)) as BigNumber).toNumber();
  }

  async hasLicense(address: string): Promise<boolean> {
    return (await this.numberOfLicenses(address)) >= 1;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async purchaseLicense(
    address: string,
    value?: BigNumber
  ): Promise<Transaction> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return this.contract.purchaseLicense(address, {
      value: value ?? this.licensePrice,
    }) as Transaction;
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
    this.contract.on(event, handler);
  }

  // MARK: - Private Methods
}
