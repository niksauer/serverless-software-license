import { AddressOwnershipChallenge, EventEmitter } from './util';

export interface License {
  challenge: AddressOwnershipChallenge & { response: string };
}

export enum LicenseManagerEvent {
  LicenseValidityChanged = 'LicenseValidityChanged',
}

export interface ILicenseStorage {
  getLicense(): Promise<License>;
  setLicense(license: License): Promise<void>;
  removeLicense(): Promise<void>;
}

export interface ILicenseManager {
  readonly isValid: boolean;
  readonly emitter: EventEmitter;

  activate(
    challenge: AddressOwnershipChallenge,
    response: string
  ): Promise<void>;

  startActivation(address: string): Promise<string>;
  completeActivation(challengeResponse: string): Promise<void>;
  stopActivation(): void;

  checkValidity(): Promise<boolean>;
}
