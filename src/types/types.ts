import { store } from '../store';

export interface City {
  id: number;
  name: string;
  temperatureUnit: 'metric' | 'imperial';
  location?: boolean;
}

export interface WeatherState {
  language: string;
  cities: City[];
}

export interface RootState {
  weather: WeatherState;
}

export interface WeatherData {
  id: number;
  sys: {
    country: string
  };
  name: string;
  coord: {
    lat: number;
    lon: number
  };
  weather: {
    icon: string;
    description: string
  }[];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number
  };
  wind: {
    speed: number
  };
}

export type Coords = {
  lat: number;
  lon: number;
};

export interface OpenWeatherResponse {
  name: string;
  id: number;
  main: {
    temp: number;
  };
};

export interface CitySuggestion {
  name: string;
  id: number;
  sys: {
    country: string;
  };
}

export interface CitySuggestionResponse {
  id: number;
  name: string;
  country: string;
}

export interface GeoNamesResponse {
  time: string;
}

export interface Forecast {
  dt_txt: string;
  main: {
    temp: number
  };
}

export interface Resources {
  translation: Record<string, string>;
}