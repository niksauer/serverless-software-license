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
  /**
   * Price of a single license as recorded in the smart-contract
   */
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
  /**
   *
   * @param address Address to be queried
   *
   * @returns Number of licenses owned by the address
   */
  async numberOfLicenses(address: string): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return ((await this.contract.balanceOf(address)) as BigNumber).toNumber();
  }

  /**
   *
   * @param address Address to be queried
   *
   * @returns True if the address owns at least one license
   */
  async hasLicense(address: string): Promise<boolean> {
    return (await this.numberOfLicenses(address)) >= 1;
  }

  /**
   * Purchases a new license. By default, the current price will be auto-filled,
   * though may be overriden as a tip to the developer.
   *
   * @param address Address to be set as the license owner
   * @param value Amount of wei to pay for a license
   */
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

  /**
   * Populates a license purchase transaction that must be broadcasted manually.
   * Like 'purchaseLicense', the price will be auto-set, though may be overriden.
   *
   * @param address Address to be set as the license owner
   * @param value Amount of wei to pay for a license
   *
   * @returns Unsigned transaction to be relayed
   */
  async generatePurchaseTransaction(
    address: string,
    value?: BigNumber
  ): Promise<UnsignedTransaction> {
    return this.contract.populateTransaction['purchaseLicense'](address, {
      value: value ?? this.licensePrice,
    });
  }

  /**
   * Sets a listener that will be called for each contract event.
   *
   * @param event Events to be considered
   * @param handler Callback to be run for each event
   */
  subscribe<Event extends LicenseTokenEvent>(
    event: Event,
    handler: LicenseTokenEventHandler<Event>
  ): void {
    this.contract.on(event, handler);
  }

  // MARK: - Private Methods
}
