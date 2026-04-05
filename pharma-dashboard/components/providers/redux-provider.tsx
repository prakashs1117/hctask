'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { ReactNode } from 'react';

interface ReduxProviderProps {
  children: ReactNode;
}

/**
 * Redux Provider component that wraps the application with Redux store
 */
export function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}