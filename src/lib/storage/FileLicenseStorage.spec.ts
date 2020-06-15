import test from 'ava';
import { FileLicenseStorage } from './FileLicenseStorage';
import { ILicenseStorage, License } from "../interfaces/manager";
import { utils } from 'ethers';
import { LicenseTokenEvent } from '../interfaces/registry';

const validLicenseStorage = new FileLicenseStorage(process.cwd() + "/test-data/validLicense.json");
const validLicenseStorage2 = new FileLicenseStorage(process.cwd() + "/test-data/validLicense2.json");
const invalidLicenseStorage = new FileLicenseStorage(process.cwd() + "/test-data/invalidLicense.json");

test("getLicense() fails if disk contents don't match a license", async (t) => {
    await t.throwsAsync(invalidLicenseStorage.getLicense());
});

test("getLicense() should return the license object", async (t) => {
    await t.notThrowsAsync(validLicenseStorage.getLicense());
});

test("setLicense() fails if the contents to be written don't match a License.", async (t) => {
    const data = "{'address': 'testAddress',´/n'data': 'testData',/n'response': 42/n}";
    const license: License = JSON.parse(data);
    t.throws(() => validLicenseStorage.setLicense(license));
});

test("setLicense() test if the contents written to disk match those retrieved.", async (t) => {
    const data = "{'address': 'testAddress',´/n'data': 'testData',/n'response': 'testResponse/n}";
    const license: License = JSON.parse(data);
    validLicenseStorage2.setLicense(license)
    const license2 = await validLicenseStorage.getLicense();
    t.notThrows(() => {
        if (license != license2 || license.challenge.response != license2.challenge.response) {
            throw new Error("Contents written to disk does not match those retrieved.")
        };
    });
});

/*test("setLicense() fails if the contents written to disk do not match those retrieved.", async (t) => {
    const data = "{'address': 'testAddress',´/n'data': 'testData',/n'response': 'testResponse/n}";
    const wrongData = "{'address': 'testAddress',´/n'data': 'testData',/n'response': 'testResponse2/n}";
    const license: License = JSON.parse(data);
    const wrongLicense: License = JSON.parse(wrongData);
    validLicenseStorage2.setLicense(license)
    const license2 = await validLicenseStorage.getLicense();
    t.throws(() => {
        if (wrongLicense != license2 || wrongLicense.challenge.response != license2.challenge.response) {
            throw new Error("Contents written to disk does not match those retrieved.");
        }
    });
});*/