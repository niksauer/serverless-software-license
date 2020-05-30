import {
  ILicenseManager,
  License,
  LicenseManagerEvent,
} from './interfaces/manager';
import { ILicenseRegistry } from './interfaces/registry';
import { AddressOwnershipChallenge, EventEmitter } from './interfaces/util';
import Events from 'events';

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
  private path: string;

  private _isValid = false;
  private _emitter: EventEmitter;

  private activeChallenge?: AddressOwnershipChallenge;

  // MARK: - Initialization
  constructor(registry: ILicenseRegistry, path: string) {
    this.registry = registry;
    this.path = path;

    this._emitter = new Events.EventEmitter();
  }

  // MARK: - Public Methods
  startRegistration(address: string): string {
    throw new Error('Method not implemented.');
  }

  completeRegistration(challengeResponse: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  register(
    challenge: AddressOwnershipChallenge,
    response: string
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  checkValidity(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  // MARK: - Private Methods
  private setIsValid(value: boolean) {
    this.setIsValid(value);
    this.emitter.emit(LicenseManagerEvent.LicenseValidityChanged, value);
  }

  private async readLicense(): Promise<License> {
    throw new Error('Method not implemented.');
  }

  private async writeLicense(license: License): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
