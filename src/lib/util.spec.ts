import test from 'ava';
import { verifyOwnership } from './util';
import { AddressOwnershipChallenge } from '../types/util';

test('verify ownership', (t) => {
  const challenge: AddressOwnershipChallenge = {
    address: '',
    data: '',
  };

  const response = '';

  t.true(verifyOwnership(challenge, response));
});
