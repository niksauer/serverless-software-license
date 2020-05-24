export enum RegistryContractEvent {
  LicensePurchased,
}

type ContractEventHandler = (event: RegistryContractEvent) => void;

export interface IRegistryContract {
  hasLicense(address: string): Promise<boolean>;
  generatePurchaseTransaction(address: string): string;
  subscribe(
    handler: ContractEventHandler,
    filter?: RegistryContractEvent[]
  ): void;
}
