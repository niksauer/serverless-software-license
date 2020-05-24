import {
  IRegistryContract,
  ContractEventHandler,
  RegistryContractEvent,
} from '../types/registry';

export class RegistryContract implements IRegistryContract {
  // MARK: - Public Properties

  // MARK: - Private Properties

  // MARK: - Initialization
  constructor(address: string) {}

  // MARK: - Public Methods
  hasLicense(address: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  generatePurchaseTransaction(address: string): string {
    throw new Error('Method not implemented.');
  }

  subscribe(
    handler: ContractEventHandler,
    filter?: RegistryContractEvent[] | undefined
  ): void {
    throw new Error('Method not implemented.');
  }

  // MARK: - Private Methods
}
