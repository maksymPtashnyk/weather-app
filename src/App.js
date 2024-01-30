import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/index';

import WeatherApp from './components/WeatherApp/WeatherApp';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <WeatherApp />
      </PersistGate>
    </Provider>
  );
}

export default App;
