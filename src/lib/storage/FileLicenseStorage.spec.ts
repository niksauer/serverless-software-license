import test from 'ava';
import { FileLicenseStorage } from './FileLicenseStorage';
import { License } from '../interfaces/manager';
import fs from 'fs';
import mockFs, { restore as restoreFs } from 'mock-fs';

const storagePath = '/license.json';

test.afterEach(() => {
  restoreFs();
});

test.serial(
  "getLicense() fails if disk contents don't match a license",
  async (t) => {
    const invalidLicense = ({
      challenge: {
        address: 22,
        data: 'testData',
        response: '22',
      },
    } as unknown) as License;

    mockFs({
      [storagePath]: JSON.stringify(invalidLicense),
    });

    const storage = new FileLicenseStorage(storagePath);

    try {
      await storage.getLicense();
    } catch (error) {
      t.deepEqual(
        (error as Error).message,
        "The disk contents don't match a License."
      );
    }
  }
);

test.serial(
  'getLicense() does not fail if disk content match a license',
  async (t) => {
    const validLicense = ({
      challenge: {
        address: '22',
        data: 'testData',
        response: '22',
      },
    } as unknown) as License;

    mockFs({
      [storagePath]: JSON.stringify(validLicense),
    });

    const storage = new FileLicenseStorage(storagePath);

    const storedLicense = await storage.getLicense();
    t.deepEqual(storedLicense, validLicense);
  }
);

test.serial(
  "setLicense() fails if the contents to be written don't match a license.",
  async (t) => {
    const invalidLicense = {} as License;

    mockFs();

    const storage = new FileLicenseStorage(storagePath);

    await t.throwsAsync(() => storage.setLicense(invalidLicense));
  }
);

test.serial(
  'setLicense() does not fail if the contents to be written match a license',
  async (t) => {
    const validLicense: License = {
      challenge: {
        address: '0x',
        data: 'hell',
        response: 'no',
      },
    };

    mockFs();

    const storage = new FileLicenseStorage(storagePath);

    await t.notThrowsAsync(storage.setLicense(validLicense));

    const storedLicense = fs.readFileSync(storagePath).toString();
    const parsedLicense = JSON.parse(storedLicense) as unknown;

    t.deepEqual(parsedLicense, validLicense);
  }
);

test.serial('removeLicense() fails if no license is stored', async (t) => {
  mockFs();

  const storage = new FileLicenseStorage(storagePath);

  await t.throwsAsync(storage.removeLicense());
});

test.serial(
  'removeLicense() does not fail if license file exists',
  async (t) => {
    mockFs({
      [storagePath]: 'hello',
    });

    const storage = new FileLicenseStorage(storagePath);

    await t.notThrowsAsync(storage.removeLicense());

    t.false(fs.existsSync(storagePath));
  }
);
