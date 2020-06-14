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

        try {
            const licenseString: string = fs.readFileSync(this.path).toString();
            const license = await JSON.parse(licenseString);
            if (license == null || license.response == null)
                throw new Error("The disk contents don't match a License.");
            return license;
        } catch (e) {
            throw e;
        }
    }

    //TODO implement method
    setLicense(license: License): void {
        if (license.challenge == null || license.challenge.response == null) {
            throw new Error("The contents to be written don't match a License!");
        }

        const licenseString = JSON.stringify(license);
    }
}