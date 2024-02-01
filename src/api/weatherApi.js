import axios from 'axios';
import _ from 'lodash';

const apiKey = process.env.REACT_APP_WEATHER_USER_KEY || '068df69e3f782e51feb0b40621ccbc34';
console.log(process.env.REACT_APP_WEATHER_USER_KEY);

export const fetchWeatherByCity = async (cityName) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    throw error;
  }
};

export const fetchWeatherByLocation = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data by location:', error);
    throw error;
  }
};

export const fetchCitySuggestions = async (input) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/find?q=${input}&type=like&sort=population&cnt=5&appid=${apiKey}`
    );

    if (response.data && response.data.list) {
      const uniqueNewSuggestions = Array.from(new Set(response.data.list.map((result) => result.name)))
        .map((name) => response.data.list.find((result) => result.name === name))
        .map((result) => ({
          id: result.id,
          name: result.name,
          country: result.sys.country,
        }));
      return uniqueNewSuggestions;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw error;
  }
};

export const fetchWeatherCard = async (city, temperatureUnit, language) => {
  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${temperatureUnit}&lang=${language}&appid=${apiKey}`;
    const response = await axios.get(apiUrl);

    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const fetchCityTime = async (lat, lon) => {
  try {
    const response = await axios.get(`http://api.geonames.org/timezoneJSON?formatted=true&lat=${lat}&lng=${lon}&username=ptaha.mx`);
    return new Date(response.data.time);
  } catch (error) {
    console.error('Error fetching city time:', error);
    throw error;
  }
};

export const fetchWeatherForecastData = async (city) => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);

    return _(response.data.list)
      .groupBy(item => item.dt_txt.split(' ')[0])
      .map((group, date) => ({
        dt_txt: date,
        main: {
          temp: Math.round(_.meanBy(group, 'main.temp')),
        },
      }))
      .value();
  } catch (error) {
    console.error('Error fetching weather forecast data:', error);
    throw error;
  }
};