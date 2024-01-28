// WeatherCard.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import LocalTime from './LocalTime';
import WeatherForecastChart from './Diagram';

const WeatherCard = ({ city }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [temperatureUnit, setTemperatureUnit] = useState('metric'); // Default to metric
  const language = useSelector((state) => state.language);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const apiKey = '16409403db7f194037fec02b3688e5a1';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${temperatureUnit}&lang=${language}&appid=${apiKey}`;
        const response = await axios.get(apiUrl);

        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [city, temperatureUnit, language]);

  return (
    <div>
      {weatherData && (
        <div>
          <h2> {`${weatherData.sys.country}, ${weatherData.name}`}</h2>
          <LocalTime />
          <WeatherForecastChart city={city} />
          <p>{weatherData.weather[0].description}</p>
          <p>
            Temperature: {weatherData.main.temp}
            {temperatureUnit === 'metric' ? '°C' : '°F'}
          </p>
          <p>
            Feels like: {weatherData.main.feels_like}
            {temperatureUnit === 'metric' ? '°C' : '°F'}
          </p>
          <p>
            Wind: {weatherData.wind.speed} m/s
          </p>
          <p>
            Humidity: {weatherData.main.humidity} %
          </p>
          <p>
            Pressure: {weatherData.main.pressure}Pa
          </p>
        </div>
      )}

      <div>
        <label>
          <button
            className={temperatureUnit === 'metric' ? 'selected' : ''}
            onClick={() => setTemperatureUnit('metric')}
          >
            °C
          </button>
        </label>
        <label>
          <button
            className={temperatureUnit === 'imperial' ? 'selected' : ''}
            onClick={() => setTemperatureUnit('imperial')}
          >
            °F
          </button>
        </label>
      </div>
    </div>
  );
};

export default WeatherCard;

