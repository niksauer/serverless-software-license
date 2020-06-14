import test from 'ava';
import { FileLicenseStorage } from './FileLicenseStorage';
import { ILicenseStorage, License } from "../interfaces/manager";

//TODO: Ask about path
const validLicenseStorage = new FileLicenseStorage(process.cwd() + "/src/lib/storage/validLicense.json");
const invalidLicenseStorage = new FileLicenseStorage(process.cwd() + "/src/lib/storage/invalidLicense.json");

test("getLicense() fails if disk contents don't match a license", async (t) => {
    await t.throwsAsync(invalidLicenseStorage.getLicense());
});

test("getLicense() should return the license object", async (t) => {
    await t.notThrowsAsync(validLicenseStorage.getLicense());
});