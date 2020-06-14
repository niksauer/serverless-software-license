import { ILicenseStorage, License } from "../interfaces/manager";
import fs from "fs";

class FileLicenseStorage implements ILicenseStorage {

    path: string;

    constructor(path: string) {
        this.path = path;
    }

    getLicense(): Promise<License> {
        throw new Error("Method not implemented.");
    }

    setLicense(license: License): void {
        throw new Error("Method not implemented.");
    }
}