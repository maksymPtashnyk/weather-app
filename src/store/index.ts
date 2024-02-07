import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist/es/constants';
import { combineReducers } from 'redux';
import weatherReducer from './slices/weatherSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  weather: persistReducer(persistConfig, weatherReducer),
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
    immutableCheck: false,
  })
});

const persistor = persistStore(store);

export { store, persistor };
