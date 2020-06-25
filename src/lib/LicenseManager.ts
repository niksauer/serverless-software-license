import {
  ILicenseManager,
  LicenseManagerEvent,
  ILicenseStorage,
  License,
} from './interfaces/manager';
import { ILicenseRegistry } from './interfaces/registry';
import { AddressOwnershipChallenge, EventEmitter } from './interfaces/util';
import Events from 'events';
import { getRandomData } from './util';
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
  async activate(
    challenge: AddressOwnershipChallenge,
    response: string
  ): Promise<void> {
    if (!(await this.registry.hasLicense(challenge.address))) {
      throw new Error('Address does not have a license');
    }

    const ownsAddress = verifyOwnership(challenge, response);

    if (!ownsAddress) {
      throw new Error('Address ownership challenge failed');
    }

    const license: License = {
      challenge: {
        ...challenge,
        response: response,
      },
    };

    await this.storage.setLicense(license);
    this.setIsValid(true);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async startActivation(address: string): Promise<string> {
    const data = getRandomData(32);

    this.activeChallenge = { address, data };

    return data;
  }

  async completeActivation(challengeResponse: string): Promise<void> {
    if (!this.activeChallenge) {
      throw new Error('No pending activation');
    }

    await this.activate(this.activeChallenge, challengeResponse);

    this.activeChallenge = undefined;
  }

  stopActivation(): void {
    this.activeChallenge = undefined;
  }

  async checkValidity(): Promise<boolean> {
    const license = await this.storage.getLicense();

    const challenge = license.challenge;
    const response = challenge.response;
    const address = challenge.address;

    const ownsAddress = verifyOwnership(challenge, response);

    if (!ownsAddress) {
      return this.setIsValid(false);
    }

    const ownsLicense = await this.registry.hasLicense(address);

    if (!ownsLicense) {
      return this.setIsValid(false);
    }

    return this.setIsValid(true);
  }

  // MARK: - Private Methods
  private setIsValid(value: boolean): boolean {
    this._isValid = value;
    this.emitter.emit(LicenseManagerEvent.LicenseValidityChanged, value);

    return value;
  }
}
