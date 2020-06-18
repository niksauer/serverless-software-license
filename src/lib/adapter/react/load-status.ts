export enum LoadStatus {
  Loading,
  Success,
  Error,
  None,
}

export enum LoadActionType {
  Begin,
  End,
  Fail,
  Reset,
}

export type LoadAction<P> =
  | { type: LoadActionType.Begin }
  | { type: LoadActionType.End; payload: P }
  | { type: LoadActionType.Fail }
  | { type: LoadActionType.Reset };

export type LoadState<T = Record<string, unknown>> = {
  status: LoadStatus;
} & T;

export default function reducer<P, T>(
  onEnd: (payload: P) => T
): (state: LoadState<T>, action: LoadAction<P>) => LoadState<T> {
  return (state: LoadState<T>, action: LoadAction<P>): LoadState<T> => {
    switch (action.type) {
      case LoadActionType.Begin:
        return { ...state, status: LoadStatus.Loading };
      case LoadActionType.End:
        return { status: LoadStatus.Success, ...onEnd(action.payload) };
      case LoadActionType.Fail:
        return { ...state, status: LoadStatus.Error };
      case LoadActionType.Reset:
        return { ...state, status: LoadStatus.None };
      default:
        return state;
    }
  };
}
