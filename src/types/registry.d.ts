import { ethers } from 'ethers';

export enum LicenseTokenEvent {
  LicensePurchased = 'LICENSE_PURCHASED',
}

export type LicensePurchasedHandler = (
  address: string,
  event: ethers.Event
) => void;

export type LicenseTokenEventHandler<
  Event extends LicenseTokenEvent
> = Event extends LicenseTokenEvent.LicensePurchased
  ? LicensePurchasedHandler
  : undefined;

export interface ILicenseRegistry {
  hasLicense(address: string): Promise<boolean>;
  generatePurchaseTransaction(address: string): string;
  subscribe<Event extends LicenseTokenEvent>(
    event: Event,
    handler: LicenseTokenEventHandler<Event>
  ): void;
}
