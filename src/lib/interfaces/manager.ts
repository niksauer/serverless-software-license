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
}

export interface ILicenseManager {
  readonly isValid: boolean;
  readonly emitter: EventEmitter;
  startActivation(address: string): string;
  completeActivation(challengeResponse: string): Promise<void>;
  activate(
    challenge: AddressOwnershipChallenge,
    response: string
  ): Promise<void>;
  checkValidity(): Promise<void>;
}
