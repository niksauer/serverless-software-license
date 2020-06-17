import {
  ILicenseManager,
  LicenseManagerEvent,
  ILicenseStorage,
} from './interfaces/manager';
import { ILicenseRegistry } from './interfaces/registry';
import { AddressOwnershipChallenge, EventEmitter } from './interfaces/util';
import Events from 'events';
import { verifyOwnership } from './util';

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

  async checkValidity(): Promise<void> {
    const license = await this.storage.getLicense();

    const challenge = license.challenge;
    const response = challenge.response;
    const address = challenge.address;

    const ownsAddress = verifyOwnership(challenge, response);

    if (!ownsAddress) {
      this.setIsValid(false);
      return;
    }

    const ownsLicense = await this.registry.hasLicense(address);

    if (!ownsLicense) {
      this.setIsValid(false);
      return;
    }

    this.setIsValid(true);
  }

  // MARK: - Private Methods
  private setIsValid(value: boolean) {
    this._isValid = value;
    this.emitter.emit(LicenseManagerEvent.LicenseValidityChanged, value);
  }
}
