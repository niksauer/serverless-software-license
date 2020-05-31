import { ethers, BigNumber, UnsignedTransaction, Transaction } from 'ethers';

export interface ContractResponse {
  txHash: string;
}

export enum LicenseTokenEvent {
  LicensePurchased,
}

export type LicensePurchasedHandler = (
  address: string,
  // tokenID: number,
  event: ethers.Event
) => void;

export type LicenseTokenEventHandler<
  Event extends LicenseTokenEvent
> = Event extends LicenseTokenEvent.LicensePurchased
  ? LicensePurchasedHandler
  : undefined;

export interface ILicenseRegistry {
  numberOfLicenses(address: string): Promise<number>;
  hasLicense(address: string): Promise<boolean>;
  purchaseLicense(address: string, value: BigNumber): Promise<Transaction>;
  generatePurchaseTransaction(
    address: string,
    value: BigNumber
  ): Promise<UnsignedTransaction>;
  subscribe<Event extends LicenseTokenEvent>(
    event: Event,
    handler: LicenseTokenEventHandler<Event>
  ): void;
}
