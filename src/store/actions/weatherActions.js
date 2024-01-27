export const setTemperatureUnit = (unit) => ({
  type: 'SET_TEMPERATURE_UNIT',
  payload: unit,
});

export const setLanguage = (language) => ({
  type: 'SET_LANGUAGE',
  payload: language,
});

export const addCity = (city) => ({
  type: 'ADD_CITY',
  payload: city,
});

export const setCurrentWeather = (weather) => ({
  type: 'SET_CURRENT_WEATHER',
  payload: weather,
});