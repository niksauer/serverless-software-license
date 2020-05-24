import { AddressOwnershipChallenge } from '../types/util';

/**
 * Verifies the ownership of an Ethereum address by checking the signature of a challenge response
 *
 * @param response Signed challenge data
 * @returns True if the response matches the challenge data and its signature stems from the challenged address
 */
export function verifyOwnership(
  challenge: AddressOwnershipChallenge,
  response: string
): boolean {
  return false;
}

/**
 * Broadcasts a signed Ethereum transaction
 */
export async function relayTransaction(
  signedTransaction: string
): Promise<void> {
  return;
}
