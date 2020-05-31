import { AddressOwnershipChallenge, EventEmitter } from './util';

export interface License {
  challenge: AddressOwnershipChallenge & { response: string };
}

export enum LicenseManagerEvent {
  LicenseValidityChanged = 'LicenseValidityChanged',
}

export interface ILicenseStorage {
  getLicense(): Promise<License>;
  setLicense(license: License): void;
}

export interface ILicenseManager {
  readonly isValid: boolean;
  readonly emitter: EventEmitter;
  startRegistration(address: string): string;
  completeRegistration(challengeResponse: string): Promise<void>;
  register(
    challenge: AddressOwnershipChallenge,
    response: string
  ): Promise<void>;
  checkValidity(): Promise<void>;
}
