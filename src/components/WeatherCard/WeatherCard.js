// WeatherCard.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import LocalTime from '../LocalTime/LocalTime';
import { setTemperatureUnit } from '../../store/slices/weatherSlice';
import './WeatherCard.css';
import classNames from 'classnames';
import WeatherForecastChart from '../Diagram';

const WeatherCard = ({ city, onRemove }) => {
  const [weatherData, setWeatherData] = useState(null);
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const apiKey = '068df69e3f782e51feb0b40621ccbc34';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=${city.temperatureUnit}&lang=${language}&appid=${apiKey}`;
        const response = await axios.get(apiUrl);

        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [city, language]);

  const handleTemperatureUnitChange = (unit) => {
    dispatch(setTemperatureUnit({ cityId: city.id, temperatureUnit: unit }));
  };

  return (
    <div className="weather-card">
      {weatherData && (
        <div className="weather-card-content">
          <button className="remove-btn" onClick={() => onRemove(city.id)}>
            <img src="close-icon.svg" alt="Close the card" className="remove-btn-img" />
          </button>
          <div className="top-content">
            <h2 className="location">
              {`${weatherData.sys.country}, ${weatherData.name}`}
            </h2>
            <p className="description">{weatherData.weather[0].description}</p>
          </div>
          <LocalTime />
          <WeatherForecastChart city={city.name}/>
          <div className="battom-block">
            <div className="temperature-block">
              <div className="temperature">
                <p>{weatherData.main.temp > 0 ? `+${weatherData.main.temp}` : weatherData.main.temp}</p>
                <div className="unit-buttons">
                  <button
                    className={classNames(city.temperatureUnit === 'metric' ? 'selected' : '', 'button')}
                    onClick={() => handleTemperatureUnitChange('metric')}
                  >
                    °C
                  </button>
                  |
                  <button
                    className={classNames(city.temperatureUnit === 'imperial' ? 'selected' : '', 'button')}
                    onClick={() => handleTemperatureUnitChange('imperial')}
                  >
                    °F
                  </button>
                </div>
              </div>
              <p className="feels-like">
                Feels like: {weatherData.main.feels_like > 0 ? `+${weatherData.main.feels_like}` : weatherData.main.feels_like}
                {city.temperatureUnit === 'metric' ? '°C' : '°F'}
              </p>
            </div>
            <div className="editional-info">
              <p className="wind">
                Wind: {weatherData.wind.speed} m/s
              </p>
              <p className="humidity">
                Humidity: {weatherData.main.humidity} %
              </p>
              <p className="pressure">
                Pressure: {weatherData.main.pressure}Pa
              </p>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};
export default WeatherCard;


