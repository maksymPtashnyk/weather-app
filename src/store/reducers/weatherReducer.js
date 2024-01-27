const initialState = {
  temperatureUnit: 'celsius',
  language: 'en',
  cities: [],
  currentWeather: null,
};

const weatherReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TEMPERATURE_UNIT':
      return { ...state, temperatureUnit: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'ADD_CITY':
      return { ...state, cities: [...state.cities, action.payload] };
    case 'SET_CURRENT_WEATHER':
      return { ...state, currentWeather: action.payload };
    default:
      return state;
  }
};

export default weatherReducer;