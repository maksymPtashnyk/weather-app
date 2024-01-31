import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/index';

import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';

i18n.init({
  interpolation: { escapeValue: false },  // React схильний екранувати переклад
  lng: 'en',                               // Мова за замовчуванням
  resources: {
    en: {
      translation: require('./locales/en.json'),
    },
    uk: {
      translation: require('./locales/uk.json'),
    },
    he: {
      translation: require('./locales/he.json'),
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
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
