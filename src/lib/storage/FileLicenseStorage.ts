import { ILicenseStorage, License } from '../interfaces/manager';
import fs from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

export class FileLicenseStorage implements ILicenseStorage {
  // MARK: - Public Properties
  path: string;

  // MARK: - Initialization
  constructor(path: string) {
    this.path = path;
  }

  // MARK: - Public Methods
  /**TODO:
   * @returns return the license object.
   */
  async getLicense(): Promise<License> {
    const data = (await readFileAsync(this.path)).toString();
    const license = JSON.parse(data) as License;

    if (!this.isLicense(license)) {
      throw new Error("The disk contents don't match a License.");
    }

    return license;
  }

  /**
   * TODO:
   * @param license
   */
  async setLicense(license: License): Promise<void> {
    if (!this.isLicense(license)) {
      throw new Error("The contents to be written don't match a License.");
    }

    await writeFileAsync(this.path, JSON.stringify(license));
  }

  // MARK: - Private Methods
  /**
   *TODO
   * @param license
   * @returns true if given license has all necessary fields set.
   */
  private isLicense(value: unknown): value is License {
    if (typeof value != 'object' || !value) {
      return false;
    }

    const license = value as { [index: string]: string };

    if (!('challenge' in license) || typeof license['challenge'] != 'object') {
      return false;
    }

    const challenge = license['challenge'] as { [index: string]: string };

    if (
      !('address' in challenge) ||
      !('data' in challenge) ||
      !('response' in challenge)
    ) {
      return false;
    }

    return (
      typeof challenge.address == 'string' &&
      typeof challenge.data == 'string' &&
      typeof challenge.response == 'string'
    );
  }
}
