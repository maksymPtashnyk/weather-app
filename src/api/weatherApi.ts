import axios, { AxiosResponse } from 'axios';
import _ from 'lodash';
import { City, CitySuggestion, CitySuggestionResponse, Coords, Forecast, GeoNamesResponse, WeatherData } from '../types/types';
const apiKey = process.env.REACT_APP_WEATHER_USER_KEY || '068df69e3f782e51feb0b40621ccbc34';

export const fetchWeatherByCity = async (cityName: string): Promise<WeatherData> => {
  try {
    const response: AxiosResponse<WeatherData> = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    throw error;
  }
};

export const fetchWeatherByLocation = async ({ lat, lon }: Coords): Promise<City> => {
  try {
    const response: AxiosResponse<City> = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    const userLocationData: City = {
      id: response.data.id,
      name: response.data.name,
      temperatureUnit: 'metric',
      location: true,
    };
    return userLocationData;
    
  } catch (error) {
    console.error('Error fetching weather data by location:', error);
    throw error;
  }
};

export const fetchCitySuggestions = async (input: string): Promise<CitySuggestionResponse[]> => {
  try {
    const response: AxiosResponse<{ list: CitySuggestion[] }> = await axios.get(
      `https://api.openweathermap.org/data/2.5/find?q=${input}&type=like&sort=population&cnt=5&appid=${apiKey}`
    );

    const cityMap = new Map<string, CitySuggestion>();
    response.data.list.forEach(city => {
      cityMap.set(city.name, city);
    });

    const uniqueNewSuggestions = Array.from(cityMap.values()).map(city => ({
      id: city.id,
      name: city.name,
      country: city.sys.country,
    }));

    return uniqueNewSuggestions;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw error;
  }
};


export const fetchWeatherCard = async (city: string, temperatureUnit: string, language: string): Promise<WeatherData> => {
  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${temperatureUnit}&lang=${language}&appid=${apiKey}`;
    const response: AxiosResponse<WeatherData> = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const fetchCityTime = async ({ lat, lon }: Coords): Promise<Date> => {
  try {
    const response: AxiosResponse<GeoNamesResponse> = await axios.get(`https://secure.geonames.org/timezoneJSON?formatted=true&lat=${lat}&lng=${lon}&username=ptaha.mx`);
    return new Date(response.data.time);
  } catch (error) {
    console.error('Error fetching city time:', error);
    throw error;
  }
};

export const fetchWeatherForecastData = async (city: City): Promise<Forecast[]> => {
  try {
    const response: AxiosResponse<{ list: Forecast[] }> = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city.name}&units=${city.temperatureUnit}&appid=${apiKey}`);
    return _(response.data.list)
      .groupBy((item) => item.dt_txt.split(' ')[0])
      .map((group, date) => ({
        dt_txt: date,
        main: {
          temp: Math.round(_.meanBy(group, (item) => item.main.temp)),
        },
      }))
      .value();
  } catch (error) {
    console.error('Error fetching weather forecast data:', error);
    throw error;
  }
};
