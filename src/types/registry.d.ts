export enum LicenseRegistryEvent {
  LicensePurchased,
}

type LicenseRegistryEventHandler = (event: LicenseRegistryEvent) => void;

export interface ILicenseRegistry {
  hasLicense(address: string): Promise<boolean>;
  generatePurchaseTransaction(address: string): string;
  subscribe(
    handler: LicenseRegistryEventHandler,
    filter?: LicenseRegistryEvent[]
  ): void;
}
