import { configureStore, type EnhancedStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './api/apiSlice';
import { programsSlice } from './slices/programsSlice';
import { dashboardSlice } from './slices/dashboardSlice';
import { uiSlice } from './slices/uiSlice';
import { localStorageMiddleware } from './middleware/localStorageMiddleware';
import { performanceMiddleware, batchingMiddleware } from './middleware/performanceMiddleware';

const rootReducer = {
  // RTK Query API slice
  api: apiSlice.reducer,
  // Feature slices
  programs: programsSlice.reducer,
  dashboard: dashboardSlice.reducer,
  ui: uiSlice.reducer,
};

const createStore = (): EnhancedStore => configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore RTK Query actions that contain non-serializable data
          'api/executeQuery/pending',
          'api/executeQuery/fulfilled',
          'api/executeQuery/rejected',
          'api/executeMutation/pending',
          'api/executeMutation/fulfilled',
          'api/executeMutation/rejected',
        ],
        ignoredPaths: ['api.queries', 'api.mutations'],
      },
    })
    .concat(apiSlice.middleware)
    .concat(localStorageMiddleware)
    .concat(performanceMiddleware)
    .concat(batchingMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const store = createStore();

// Enable listener behavior for the store
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof createStore>;