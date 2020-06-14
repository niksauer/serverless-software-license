import { ILicenseStorage, License } from "../interfaces/manager";
import fs from "fs";
import { promisify } from "util";
import { getJsonWalletAddress } from "ethers/lib/utils";
import { LicenseManager } from "../LicenseManager";

export class FileLicenseStorage implements ILicenseStorage {

    path: string;

    constructor(path: string) {
        this.path = path;
    }

    async getLicense(): Promise<License> {

        const readFileAsync = promisify(fs.readFile);
        const data = (await readFileAsync(this.path)).toString();
        const license = JSON.parse(data);
        if (license == null || license.response == null)
            throw new Error("The disk contents don't match a License.");
        return license;
    }

    //TODO implement method
    setLicense(license: License): void {

        if (license.challenge == null || license.challenge.response == null) {
            throw new Error("The contents to be written don't match a License!");
        }

        try {

            const licenseString = JSON.stringify(license);
        } catch (e) {
            const data = JSON.stringify()
        }
    }
}