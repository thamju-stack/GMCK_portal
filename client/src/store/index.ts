import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import bootstrapReducer from './bootstrapSlice';
import prefsReducer from './prefsSlice';

const rootReducer = combineReducers({
  prefs: prefsReducer,
  bootstrap: bootstrapReducer,
});

const persisted = persistReducer(
  { key: 'gmc', storage, whitelist: ['prefs'] },
  rootReducer,
);

export const store = configureStore({
  reducer: persisted,
  middleware: (gDM) =>
    gDM({
      serializableCheck: { ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'] },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();