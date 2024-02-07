import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/index';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { Resources } from './types/types';

i18n.init({
  interpolation: { escapeValue: false },
  lng: 'en',
  resources: {
    en: {
      translation: require('./locales/en.json') as Resources['translation'],
    },
    uk: {
      translation: require('./locales/uk.json') as Resources['translation'],
    },
    he: {
      translation: require('./locales/he.json') as Resources['translation'],
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <I18nextProvider i18n={i18n}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </I18nextProvider>
    </PersistGate>
  </Provider>
);
