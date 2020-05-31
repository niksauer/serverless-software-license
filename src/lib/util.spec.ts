import test from 'ava';
import { verifyOwnership } from './util';
import { AddressOwnershipChallenge } from './interfaces/util';

test('verifyOwnership() returns a boolean', (t) => {
  const challenge: AddressOwnershipChallenge = {
    address: '',
    data: '',
  };

  const response = '';

  t.true(typeof verifyOwnership(challenge, response) == 'boolean');
});
