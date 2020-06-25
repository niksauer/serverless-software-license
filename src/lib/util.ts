import { AddressOwnershipChallenge } from './interfaces/util';
import { ethers } from 'ethers';
import crypto from 'crypto';

/**
 * Verifies the ownership of an Ethereum address by checking the signature of a challenge response
 *
 * @param response Signed challenge data
 *
 * @returns True if the response matches the challenge data and its signature stems from the challenged address
 */
export function verifyOwnership(
  challenge: AddressOwnershipChallenge,
  response: string
): boolean {
  try {
    const signerAddress = ethers.utils.verifyMessage(challenge.data, response);

    return signerAddress == challenge.address;
  } catch {
    return false;
  }
}

/**
 * Broadcasts a signed Ethereum transaction
 *
 * @param provider Provider used to broadcast the transaction
 * @param signedTransaction Transaction to be broadcasted
 *
 * @returns Transaction that can be waited upon to reach a desired number of confirmations
 */
export async function relayTransaction(
  provider: ethers.providers.Provider,
  signedTransaction: string
): Promise<ethers.providers.TransactionResponse> {
  return provider.sendTransaction(signedTransaction);
}

export function getRandomData(size: number): string {
  return crypto.randomBytes(size).toString();
}
