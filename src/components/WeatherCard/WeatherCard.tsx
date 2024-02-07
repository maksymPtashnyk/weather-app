import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTemperatureUnit } from '../../store/slices/weatherSlice';
import styles from './WeatherCard.module.scss';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { fetchWeatherCard } from '../../api/weatherApi';
import { City, RootState, WeatherData } from '../../types/types';
import WeatherForecastChart from '../Diagram/Diagram';
import LocalTime from '../LocalTime/LocalTime';

type WeatherCardProps = {
  city: City;
  onRemove: (id: number) => void;
};

const WeatherCard: React.FC<WeatherCardProps> = ({ city, onRemove }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.weather.language);
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

  const handleTemperatureUnitChange = (unit: 'metric' | 'imperial') => {
    dispatch(setTemperatureUnit({ cityId: city.id, temperatureUnit: unit }));
  };

  const currentTemp = Math.round(weatherData?.main.temp || 0);
  const feelsLike = Math.round(weatherData?.main.feels_like || 0);

  const isHebrew = language === 'he';

  return (
    weatherData && (
      <div className={classNames(
        styles.weather__card,
        currentTemp < 0 ? styles.cold__bg : '',
        isHebrew ? styles.hebrew : '')}>


        <div className={classNames(
          styles.weather_card_content,
          isHebrew ? styles.hebrew : '',
        )}
        >
          <button
            className={styles.remove__btn}
            onClick={() => onRemove(city.id)}
          >
            <img
              src="close-icon.svg"
              alt="Close the card"
              className={styles.remove__btn__img}
            />
          </button>

          <div className={styles.top__content}>
            <h2 className={classNames(
              styles.location,
              isHebrew ? styles.hebrew : '',
            )}
            >
              {`${weatherData.sys.country}, ${weatherData.name}`}
              {city.location &&
                <img
                  src="geo-icon.png"
                  className={styles.geo__img}
                  alt="Geolocation icon"
                />
              }
            </h2>
            <div className={styles.description}>
              <img
                className={styles.weather__icon}
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt="Weather Icon"
              />
              <p className={styles.text}>
                {weatherData.weather[0].description}
              </p>
            </div>
          </div>

          <LocalTime coords={weatherData.coord}/>

          <div className="diagram">
            <WeatherForecastChart city={city} temp={currentTemp}/>
          </div>

          <div className={styles.battom__block}>
            <div className={styles.temperature__block}>
              <div className={styles.temperature}>
                <p>
                  {currentTemp > 0 ? `+${currentTemp}` : currentTemp}
                </p>
                <div className={styles.unit__buttons}>
                  <button
                    className={classNames(
                      city.temperatureUnit === 'metric' ? styles.selected : '',
                      styles.button
                    )}
                    onClick={() => handleTemperatureUnitChange('metric')}
                  >
                    °C
                  </button>
                  <div className={styles.line} />
                  <button
                    className={classNames(
                      city.temperatureUnit === 'imperial' ? styles.selected : '',
                      styles.button
                    )}
                    onClick={() => handleTemperatureUnitChange('imperial')}
                  >
                    °F
                  </button>
                </div>
              </div>
              <p className={styles.feels__like}>
                {t('feelsLike')}
                <span>
                  {feelsLike > 0 ? `+${feelsLike}` : feelsLike}
                  {city.temperatureUnit === 'metric' ? '°C' : '°F'}
                </span>
              </p>
            </div>

            <div className={styles.aditional__info}>
              <p className={styles.wind}>
                {t('wind')}
                <span className={currentTemp < 0 ? styles.cold : styles.warm}>
                  {weatherData.wind.speed}
                  {city.temperatureUnit === 'metric' ? 'm/s' : 'mph'}
                </span>
              </p>
              <p className={styles.humidity}>
                {t('humidity')}
                <span className={currentTemp < 0 ? styles.cold : styles.warm}>
                  {weatherData.main.humidity} %
                </span>
              </p>
              <p className={styles.pressure}>
                {t('pressure')}
                <span className={currentTemp < 0 ? styles.cold : styles.warm}>
                  {weatherData.main.pressure}Pa
                </span>
              </p>
            </div>

          </div>
        </div>

      </div>
    )
  )
}
export default WeatherCard;
