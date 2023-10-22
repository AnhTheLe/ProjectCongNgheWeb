import { useCallback, useState } from 'react';

export function useToggle(initialState: boolean) {
  const [value, setState] = useState(initialState);

  return {
    value,
    toggle: useCallback(() => setState((state) => !state), []),
    setTrue: useCallback(() => setState(true), []),
    setFalse: useCallback(() => setState(false), []),
  };
}
