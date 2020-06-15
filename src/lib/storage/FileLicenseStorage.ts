import { ILicenseStorage, License } from "../interfaces/manager";
import fs from "fs";
import { promisify } from "util";
import { getJsonWalletAddress } from "ethers/lib/utils";
import { LicenseManager } from "../LicenseManager";

const readFileAsync = promisify(fs.readFile);

export class FileLicenseStorage implements ILicenseStorage {

    path: string;

    constructor(path: string) {
        this.path = path;
    }

    async getLicense(): Promise<License> {

        const data = (await readFileAsync(this.path)).toString();
        const license: License = JSON.parse(data);
        if (typeof license.challenge.response != "string")
            throw new Error("The disk contents don't match a License.");
        return license;
    }

    setLicense(license: License): void {

        if (license.challenge == null || license.challenge.response == null) {
            throw new Error("The contents to be written don't match a License!");
        }

        fs.writeFile(this.path, JSON.stringify(license), err => {
            if (err) throw err;
        });
    }
}