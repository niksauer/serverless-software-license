import Events from 'events';

export type EventEmitter = Events.EventEmitter;

export interface AddressOwnershipChallenge {
  address: string;
  data: string;
}
