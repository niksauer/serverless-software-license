import { ethers, BigNumber, UnsignedTransaction, Transaction } from 'ethers';

export enum LicenseTokenEvent {
  All = '*',
  LicensePurchased = 'LicensePurchased',
}

export type LicenseRegistryEventHandler = (...args: []) => void;

export type LicensePurchasedEventHandler = (
  address: string,
  // tokenID: number,
  event: ethers.Event
) => void;

export type LicenseTokenEventHandler<
  Event extends LicenseTokenEvent
> = Event extends LicenseTokenEvent.All
  ? LicenseRegistryEventHandler
  : Event extends LicenseTokenEvent.LicensePurchased
  ? LicensePurchasedEventHandler
  : undefined;

export interface ILicenseRegistry {
  licensePrice(): Promise<BigNumber>;
  numberOfLicenses(address: string): Promise<number>;
  hasLicense(address: string): Promise<boolean>;
  purchaseLicense(address: string, value: BigNumber): Promise<Transaction>;
  generatePurchaseTransaction(
    address: string,
    value?: BigNumber
  ): Promise<UnsignedTransaction>;
  subscribe<Event extends LicenseTokenEvent>(
    event: Event,
    handler: LicenseTokenEventHandler<Event>
  ): void;
}
