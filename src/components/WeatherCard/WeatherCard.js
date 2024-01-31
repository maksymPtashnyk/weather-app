// WeatherCard.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import LocalTime from '../LocalTime/LocalTime';
import { setTemperatureUnit } from '../../store/slices/weatherSlice';
import './WeatherCard.css';
import classNames from 'classnames';
import WeatherForecastChart from '../Diagram/Diagram';
import { useTranslation } from 'react-i18next';

const WeatherCard = ({ city, onRemove }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const apiKey = '068df69e3f782e51feb0b40621ccbc34';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=${city.temperatureUnit}&lang=${language}&appid=${apiKey}`;
        const response = await axios.get(apiUrl);

        setWeatherData(response.data);
        setFadeIn(true);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [city, language]);

  const handleTemperatureUnitChange = (unit) => {
    dispatch(setTemperatureUnit({ cityId: city.id, temperatureUnit: unit }));
  };

  let currentTemp = Math.round(weatherData?.main.temp);
  const isHebrew = language === 'he';
  return (
    <div className={classNames(
      "weather-card",
      currentTemp < 0 ? 'cold-bg' : '',
      isHebrew ? 'hebrew' : '',
      fadeIn ? '' : 'fade-out')}>

      {weatherData && (
        <div className={classNames("weather-card-content", isHebrew ? 'hebrew' : '')}>
          <button className="remove-btn" onClick={() => onRemove(city.id)}>
            <img src="close-icon.svg" alt="Close the card" className="remove-btn-img" />
          </button>
          <div className="top-content">
          <h2 className={classNames("location", isHebrew ? 'hebrew' : '')}>
              {`${weatherData.sys.country}, ${weatherData.name}`}
            </h2>
            <div className='description'>
              <img
                className="weather-icon"
                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt="Weather Icon"
              />
              <p className="text">{weatherData.weather[0].description}</p>
            </div>
          </div>
          <LocalTime city={weatherData.coord}/>
          <WeatherForecastChart city={city.name} temp={currentTemp} />
          <div className="battom-block">
            <div className="temperature-block">
              <div className="temperature">
                <p>{currentTemp > 0 ? `+${currentTemp}` : currentTemp}</p>
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
                {t('feelsLike')} {weatherData.main.feels_like > 0 ? `+${weatherData.main.feels_like}` : weatherData.main.feels_like}
                {city.temperatureUnit === 'metric' ? '°C' : '°F'}
              </p>
            </div>
            <div className="editional-info">
              <p className="wind">
                {t('wind')} <span className={currentTemp < 0 ? 'cold' : 'warm'}>{weatherData.wind.speed} m/s</span>
              </p>
              <p className="humidity">
                {t('humidity')} <span className={currentTemp < 0 ? 'cold' : 'warm'}>{weatherData.main.humidity} %</span>
              </p>
              <p className="pressure">
                {t('pressure')} <span className={currentTemp < 0 ? 'cold' : 'warm'}>{weatherData.main.pressure}Pa</span>
              </p>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};
export default WeatherCard;


