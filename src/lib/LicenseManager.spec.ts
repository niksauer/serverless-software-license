import test from 'ava';
import { ILicenseRegistry } from './interfaces/registry';
import { LicenseManager } from './LicenseManager';
import {
  ILicenseStorage,
  License,
  LicenseManagerEvent,
} from './interfaces/manager';
import { ethers } from 'ethers';
import { AddressOwnershipChallenge } from '..';

const wallet = ethers.Wallet.createRandom();

function getRandomData(): string {
  return Math.random().toString(36).substring(7);
}

test('isValid is initialized with false', (t) => {
  const registry = {} as ILicenseRegistry;
  const storage = {} as ILicenseStorage;

  const manager = new LicenseManager(registry, storage);

  t.false(manager.isValid);
});

test('checkValidity() throws if no license is stored', async (t) => {
  const registry = {} as ILicenseRegistry;
  const storage = {} as ILicenseStorage;

  const manager = new LicenseManager(registry, storage);

  await t.throwsAsync(manager.checkValidity());
});

test("checkValidity() returns false if license's address ownership challenge does not pass", async (t) => {
  const registry = {} as ILicenseRegistry;

  const license: License = {
    challenge: {
      address: wallet.address,
      data: getRandomData(),
      response: getRandomData(),
    },
  };

  const storage = {
    getLicense: () => Promise.resolve(license),
  } as ILicenseStorage;

  const manager = new LicenseManager(registry, storage);

  t.plan(3);

  manager.emitter.on(
    LicenseManagerEvent.LicenseValidityChanged,
    (isValid: boolean) => {
      t.false(isValid);
    }
  );

  t.false(await manager.checkValidity());
  t.false(manager.isValid);
});

test("checkValidity() returns false if license's address ownership challenge passes but address doesn't have license according to registry", async (t) => {
  const registry = {
    hasLicense: (address: string) => Promise.resolve(false),
  } as ILicenseRegistry;

  const challenge: AddressOwnershipChallenge = {
    address: wallet.address,
    data: getRandomData(),
  };

  const license: License = {
    challenge: {
      address: challenge.address,
      data: challenge.data,
      response: await wallet.signMessage(challenge.data),
    },
  };

  const storage = {
    getLicense: () => Promise.resolve(license),
  } as ILicenseStorage;

  const manager = new LicenseManager(registry, storage);

  t.plan(3);

  manager.emitter.on(
    LicenseManagerEvent.LicenseValidityChanged,
    (isValid: boolean) => {
      t.false(isValid);
    }
  );

  t.false(await manager.checkValidity());
  t.false(manager.isValid);
});

test("checkValidity() returns true if license's address ownership challenge passes and address has license according to registry", async (t) => {
  const registry = {
    hasLicense: (address: string) => Promise.resolve(true),
  } as ILicenseRegistry;

  const challenge: AddressOwnershipChallenge = {
    address: wallet.address,
    data: getRandomData(),
  };

  const license: License = {
    challenge: {
      address: challenge.address,
      data: challenge.data,
      response: await wallet.signMessage(challenge.data),
    },
  };

  const storage = {
    getLicense: () => Promise.resolve(license),
  } as ILicenseStorage;

  const manager = new LicenseManager(registry, storage);

  t.plan(3);

  manager.emitter.on(
    LicenseManagerEvent.LicenseValidityChanged,
    (isValid: boolean) => {
      t.true(isValid);
    }
  );

  t.true(await manager.checkValidity());
  t.true(manager.isValid);
});

test('startActivation() sets active challenge and returns a string', async (t) => {
  const registry = {} as ILicenseRegistry;
  const storage = {} as ILicenseStorage;

  const manager = new LicenseManager(registry, storage);
  const address = 'test';

  const challengeData = await manager.startActivation(address);

  t.deepEqual(typeof challengeData, 'string');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  t.deepEqual((manager as any).activeChallenge, {
    address,
    data: challengeData,
  });
});

test('completeActivation() throws if activation has not been started', async (t) => {
  const registry = {} as ILicenseRegistry;
  const storage = {} as ILicenseStorage;

  const manager = new LicenseManager(registry, storage);

  try {
    await manager.completeActivation('response');
  } catch (error) {
    t.deepEqual((error as Error).message, 'No pending activation');
  }
});

test('completeActivation() throws if address does not have license according to registry', async (t) => {
  const registry = {
    hasLicense: (address: string) => Promise.resolve(false),
  } as ILicenseRegistry;

  const storage = {} as ILicenseStorage;

  const manager = new LicenseManager(registry, storage);

  await manager.startActivation(wallet.address);

  try {
    await manager.completeActivation('response');
  } catch (error) {
    t.deepEqual((error as Error).message, 'Address does not have a license');
  }
});

test('completeActivation() throws if response to address ownership challenge does not match', async (t) => {
  const registry = {
    hasLicense: (address: string) => Promise.resolve(true),
  } as ILicenseRegistry;

  const storage = {} as ILicenseStorage;

  const manager = new LicenseManager(registry, storage);

  await manager.startActivation(wallet.address);

  try {
    await manager.completeActivation('response');
  } catch (error) {
    t.deepEqual((error as Error).message, 'Address ownership challenge failed');
  }
});

test('completeActivation() writes license to storage, sets status to true and resets active challenge if address has license according to registry and response matches address ownership challenge', async (t) => {
  const registry = {
    hasLicense: (address: string) => Promise.resolve(true),
  } as ILicenseRegistry;

  let storedLicense: License | undefined;

  const storage = {
    setLicense: (license: License) => {
      storedLicense = license;
      return Promise.resolve();
    },
  } as ILicenseStorage;

  const manager = new LicenseManager(registry, storage);
  const address = wallet.address;

  const challengeData = await manager.startActivation(address);

  t.plan(4);

  manager.emitter.on(
    LicenseManagerEvent.LicenseValidityChanged,
    (isValid: boolean) => {
      t.true(isValid);
    }
  );

  const signedChallengeData = await wallet.signMessage(challengeData);

  await manager.completeActivation(signedChallengeData);

  t.true(manager.isValid);
  t.deepEqual(storedLicense, {
    challenge: {
      address: address,
      data: challengeData,
      response: signedChallengeData,
    },
  } as License);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  t.deepEqual((manager as any).activeChallenge, undefined);
});
