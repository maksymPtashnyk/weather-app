import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  language: 'en',
  cities: [],
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    addCity: (state, action) => {
      state.cities.push(action.payload);
    },
    removeCity: (state, action) => {
      const cityIdToRemove = action.payload;
      state.cities = state.cities.filter(city => city.id !== cityIdToRemove);
    },
    setTemperatureUnit: (state, action) => {
      const { cityId, temperatureUnit } = action.payload;
      const city = state.cities.find((city) => city.id === cityId);
      if (city) {
        city.temperatureUnit = temperatureUnit;
      }
    },
  },
});


export const { setLanguage, addCity, setCurrentWeather, removeCity, setTemperatureUnit } = weatherSlice.actions;
export default weatherSlice.reducer;