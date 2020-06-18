import {
  ILicenseManager,
  LicenseManagerEvent,
  ILicenseStorage,
} from './interfaces/manager';
import { ILicenseRegistry } from './interfaces/registry';
import { AddressOwnershipChallenge, EventEmitter } from './interfaces/util';
import Events from 'events';
import { getRandomData } from './util';

export class LicenseManager implements ILicenseManager {
  // MARK: - Public Properties
  get isValid(): boolean {
    return this._isValid;
  }

  get emitter(): EventEmitter {
    return this._emitter;
  }

  // MARK: - Private Properties
  private registry: ILicenseRegistry;
  private storage: ILicenseStorage;

  private _isValid = false;

  private _emitter: EventEmitter;

  private activeChallenge?: AddressOwnershipChallenge;

  // MARK: - Initialization
  constructor(registry: ILicenseRegistry, storage: ILicenseStorage) {
    this.registry = registry;
    this.storage = storage;

    this._emitter = new Events.EventEmitter();
  }

  // MARK: - Public Methods
  activate(
    challenge: AddressOwnershipChallenge,
    response: string
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  startActivation(address: string): string {
    const data = getRandomData(32);

    this.activeChallenge = { address, data };

    return data;
  }

  completeActivation(challengeResponse: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  stopActivation(): void {
    throw new Error('Method not implemented.');
  }

  checkValidity(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  // MARK: - Private Methods
  private setIsValid(value: boolean): boolean {
    this.setIsValid(value);
    this.emitter.emit(LicenseManagerEvent.LicenseValidityChanged, value);

    return value;
  }
}
