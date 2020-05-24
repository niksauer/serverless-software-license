import { ethers } from 'ethers';

export enum LicenseRegistryEvent {
  LicensePurchased = 'LICENSE_PURCHASED',
}

export type LicenePurchasedHandler = (
  address: string,
  event: ethers.Event
) => void;

export type LicenseRegistryEventHandler<
  Event extends LicenseRegistryEvent
> = Event extends LicenseRegistryEvent.LicensePurchased
  ? LicenePurchasedHandler
  : undefined;

export interface ILicenseRegistry {
  hasLicense(address: string): Promise<boolean>;
  generatePurchaseTransaction(address: string): string;
  subscribe<Event extends LicenseRegistryEvent>(
    event: Event,
    handler: LicenseRegistryEventHandler<Event>
  ): void;
}
