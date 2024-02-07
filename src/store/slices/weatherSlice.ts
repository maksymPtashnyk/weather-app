import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { City, WeatherState } from '../../types/types';

const initialState: WeatherState = {
  language: 'en',
  cities: [],
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    addCity: (state, action: PayloadAction<City>) => {
      state.cities.push(action.payload);
    },
    removeCity: (state, action: PayloadAction<number>) => {
      const cityIdToRemove = action.payload;
      state.cities = state.cities.filter(city => city.id !== cityIdToRemove);
    },
    setTemperatureUnit: (state, action: PayloadAction<{ cityId: number; temperatureUnit: 'metric' | 'imperial' }>) => {
      const { cityId, temperatureUnit } = action.payload;
      const city = state.cities.find(city => city.id === cityId);
      if (city) {
        city.temperatureUnit = temperatureUnit;
      }
    },
  },
});

export const { setLanguage, addCity, removeCity, setTemperatureUnit } = weatherSlice.actions;
export default weatherSlice.reducer;
