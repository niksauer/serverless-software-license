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
  private isLicense(license: License): boolean {
    return (
      typeof license.challenge.address == 'string' &&
      license.challenge.data == 'string' &&
      license.challenge.response == 'string'
    );
  }
}
