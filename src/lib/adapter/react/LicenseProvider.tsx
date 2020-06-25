import React, { useMemo, useEffect, useCallback, useReducer } from 'react';
import { ethers } from 'ethers';
import reducer, { LoadStatus, LoadActionType } from './load-status';
import { ILicenseRegistry } from '../../interfaces/registry';
import {
  AddressOwnershipChallenge,
  ILicenseStorage,
  LicenseRegistry,
  LicenseManager,
  LicenseManagerEvent,
} from '../../..';

interface LicenseState {
  status: LoadStatus;
  isValid: boolean;
  checkValidity: () => void;
  reset: () => void;
  registry: ILicenseRegistry;
}

interface LicenseActivationState {
  activationStatus: LoadStatus;
  activate: (challenge: AddressOwnershipChallenge, response: string) => void;
  startActivation: (address: string) => Promise<string>;
  completeActivation: (response: string) => void;
  stopActivation: () => void;
}

const LicenseContext = React.createContext<
  LicenseState & LicenseActivationState
>({
  status: LoadStatus.None,
  isValid: false,
  checkValidity: () => null,
  reset: () => null,
  registry: {} as ILicenseRegistry,
  activationStatus: LoadStatus.None,
  activate: () => null,
  startActivation: () => Promise.resolve(''),
  completeActivation: () => null,
  stopActivation: () => null,
});

interface Props {
  storage: ILicenseStorage;
  provider: ethers.providers.Provider;
  contractAdddress: string;
  signer?: ethers.Signer;
  connectSigner?: boolean;
  children: React.ReactNode;
}

export const LicenseProvider: React.FC<Props> = ({
  storage,
  provider,
  contractAdddress,
  signer,
  connectSigner = false,
  children,
}) => {
  // MARK: - License
  const stateReducer = reducer<boolean, { isValid: boolean }>(
    (isValid: boolean) => {
      return { isValid };
    }
  );

  const [state, dispatch] = useReducer(stateReducer, {
    status: LoadStatus.None,
    isValid: false,
  });

  const registry = useMemo(() => {
    let providerOrSigner: ethers.providers.Provider | ethers.Signer = provider;

    if (signer) {
      if (connectSigner) {
        providerOrSigner = signer.connect(provider);
      } else {
        providerOrSigner = signer;
      }
    }

    return new LicenseRegistry(contractAdddress, providerOrSigner);
  }, [provider]);

  const manager = useMemo(() => new LicenseManager(registry, storage), [
    registry,
    storage,
  ]);

  const checkValidity = useCallback(() => {
    dispatch({ type: LoadActionType.Begin });

    manager
      .checkValidity()
      .then((isLicenseValid) =>
        dispatch({ type: LoadActionType.End, payload: isLicenseValid })
      )
      .catch(() => dispatch({ type: LoadActionType.Fail }));
  }, [manager, dispatch]);

  const reset = useCallback(async () => {
    await storage.removeLicense();
    dispatch({ type: LoadActionType.End, payload: false });
  }, [storage]);

  useEffect(() => {
    manager.emitter.on(
      LicenseManagerEvent.LicenseValidityChanged,
      (isValid: boolean) => {
        dispatch({ type: LoadActionType.End, payload: isValid });
      }
    );

    checkValidity();

    return () => {
      manager.emitter.removeAllListeners();
    };
  }, [manager]);

  // MARK: - Activation
  const activationStateReducer = reducer<boolean, {}>((isLicenseValid) => {
    dispatch({ type: LoadActionType.End, payload: isLicenseValid });

    return {};
  });

  const [activationState, activationDispatch] = useReducer(
    activationStateReducer,
    {
      status: LoadStatus.None,
    }
  );

  const activate = useCallback(
    (challenge: AddressOwnershipChallenge, response: string) => {
      activationDispatch({ type: LoadActionType.Begin });

      manager
        .activate(challenge, response)
        .then(() =>
          activationDispatch({
            type: LoadActionType.End,
            payload: true,
          })
        )
        .catch(() => activationDispatch({ type: LoadActionType.Fail }));
    },
    [manager]
  );

  const startActivation = useCallback(
    (address: string) => {
      return manager.startActivation(address);
    },
    [manager]
  );

  const completeActivation = useCallback(
    (challengeResponse: string) => {
      activationDispatch({ type: LoadActionType.Begin });

      manager
        .completeActivation(challengeResponse)
        .then(() =>
          activationDispatch({
            type: LoadActionType.End,
            payload: true,
          })
        )
        .catch(() => activationDispatch({ type: LoadActionType.Fail }));
    },
    [manager]
  );

  const stopActivation = useCallback(() => {
    manager.stopActivation();
    activationDispatch({ type: LoadActionType.Reset });
  }, [manager]);

  return (
    <LicenseContext.Provider
      value={{
        ...state,
        checkValidity,
        reset,
        registry,
        activationStatus: activationState.status,
        activate,
        startActivation,
        completeActivation,
        stopActivation,
      }}
    >
      {children}
    </LicenseContext.Provider>
  );
};

export const useLicense = () => React.useContext(LicenseContext);
