import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LocalTime from '../LocalTime/LocalTime';
import { setTemperatureUnit } from '../../store/slices/weatherSlice';
import styles from './WeatherCard.module.scss';
import classNames from 'classnames';
import WeatherForecastChart from '../Diagram/Diagram';
import { useTranslation } from 'react-i18next';
import { fetchWeatherCard } from '../../api/weatherApi';

const WeatherCard = ({ city, onRemove }) => {
  const [weatherData, setWeatherData] = useState(null);
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWeatherCard(city.name, city.temperatureUnit, language);
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchData();
  }, [city, language]);

  const handleTemperatureUnitChange = (unit) => {
    dispatch(setTemperatureUnit({ cityId: city.id, temperatureUnit: unit }));
  };

  const currentTemp = Math.round(weatherData?.main.temp);
  const feelsLike = Math.round(weatherData?.main.feels_like);
  const isHebrew = language === 'he';
  return (
    <div className={classNames(
      styles.weather__card,
      currentTemp < 0 ? styles.cold__bg : '',
      isHebrew ? styles.hebrew : '')}>

      {weatherData && (
        <div className={classNames(styles.weather_card_content, isHebrew ? styles.hebrew : '')}>
          <button className={styles.remove__btn} onClick={() => onRemove(city.id)}>
            <img src="close-icon.svg" alt="Close the card" className={styles.remove__btn__img} />
          </button>
          <div className={styles.top__content}>
            <h2 className={classNames(styles.location, isHebrew ? styles.hebrew : '')}>
              {`${weatherData.sys.country}, ${weatherData.name}`}
            </h2>
            <div className={styles.description}>
              <img
                className={styles.weather__icon}
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt="Weather Icon"
              />
              <p className={styles.text}>{weatherData.weather[0].description}</p>
            </div>
          </div>
          <LocalTime city={weatherData.coord} />
          <WeatherForecastChart city={city} temp={currentTemp} />
          <div className={styles.battom__block}>
            <div className={styles.temperature__block}>
              <div className={styles.temperature}>
                <p>{currentTemp > 0 ? `+${currentTemp}` : currentTemp}</p>
                <div className={styles.unit__buttons}>
                  <button
                    className={classNames(city.temperatureUnit === 'metric' ? styles.selected : '', styles.button)}
                    onClick={() => handleTemperatureUnitChange('metric')}
                  >
                    °C
                  </button>
                  <div className={styles.line} />
                  <button
                    className={classNames(city.temperatureUnit === 'imperial' ? styles.selected : '', styles.button)}
                    onClick={() => handleTemperatureUnitChange('imperial')}
                  >
                    °F
                  </button>
                </div>
              </div>
              <p className={styles.feels__like}>
                {t('feelsLike')}  <span>{feelsLike > 0 ? `+${feelsLike}` : feelsLike}
                  {city.temperatureUnit === 'metric' ? '°C' : '°F'}</span>
              </p>
            </div>
            <div className={styles.aditional__info}>
              <p className={styles.wind}>
                {t('wind')} <span className={currentTemp < 0 ? styles.cold : styles.warm}>{weatherData.wind.speed}{city.temperatureUnit === 'metric' ? 'm/s' : 'mph'}</span>
              </p>
              <p className="humidity">
                {t('humidity')} <span className={currentTemp < 0 ? styles.cold : styles.warm}>{weatherData.main.humidity} %</span>
              </p>
              <p className="pressure">
                {t('pressure')} <span className={currentTemp < 0 ? styles.cold : styles.warm}>{weatherData.main.pressure}Pa</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default WeatherCard;


