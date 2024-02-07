import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage, addCity, removeCity } from '../../store/slices/weatherSlice';
import styles from './WeatherApp.module.scss';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import { fetchWeatherByLocation } from '../../api/weatherApi';
import { City, RootState } from '../../types/types';
import CityInput from '../CityInput/CityInput';
import WeatherCard from '../WeatherCard/WeatherCard';
import classNames from 'classnames';

const WeatherApp: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [weatherFetched, setWeatherFetched] = useState<boolean>(false);
  const [showAddCityModal, setShowAddCityModal] = useState<boolean>(false);
  const [modalCityData, setModalCityData] = useState<City | null>(null);
  const dispatch = useDispatch();
  const cities = useSelector((state: RootState) => state.weather.cities);
  const language = useSelector((state: RootState) => state.weather.language)
  const { i18n, t } = useTranslation();

  const languages = [
    { name: 'EN', value: 'en' },
    { name: 'UK', value: 'uk' },
    { name: 'HE', value: 'he' },
  ];

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const changeLanguage = (lang: string) => {
    dispatch(setLanguage(lang));
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
    }
  };
  useEffect(() => {
    getLocation();
  }, []);


  const fetchedWeatherByLocator = async () => {
    try {
      if (userLocation && !weatherFetched) {
        const userLocationData = await fetchWeatherByLocation(userLocation);

        const isCityAlreadyAdded = cities.some(
          (city: { id: number }) => city.id === userLocationData.id
        );

        if (!isCityAlreadyAdded) {
          setShowAddCityModal(true);
          setModalCityData(userLocationData);
        }

        setWeatherFetched(true);
      }
    } catch (error) {
      console.error('Error fetching weather data by location:', error);
    }
  };

  useEffect(() => {
    fetchedWeatherByLocator();
  }, [userLocation]);

  const handleAddCityConfirmed = () => {
    if (modalCityData) {
      dispatch(addCity(modalCityData));
      setShowAddCityModal(false);
    }
  };

  const handleModalClose = () => {
    setShowAddCityModal(false);
  };

  const handleRemoveCity = (cityToRemove: number) => {
    dispatch(removeCity(cityToRemove));
  };

  const isHebrew = i18n.language === 'he';
  const isUkrainian = i18n.language === 'uk';
  return (
    <div
      className={classNames(
        styles.weather__app,
        isHebrew ? styles.hebrew : '',
        isUkrainian ? styles.uk : '',
      )}
    >

      <Dropdown
        value={language}
        onChange={(e) => changeLanguage(e.value)}
        options={languages}
        optionLabel="name"
        className={styles.dropdown}
      />

      <CityInput setShowModal={setShowModal} />

      {cities &&
        <div className={styles.weather__container}>
          {cities.map((city: City) => (
            <WeatherCard
              key={city.id}
              city={city}
              onRemove={() => handleRemoveCity(city.id)}
            />
          ))}
        </div>
      }
      {showAddCityModal &&
        <div className={styles.modal}>
          <div className={styles.modal__content}>
            <h2>{t('modalQuestion')}</h2>
            <p>{modalCityData?.name}</p>
            <div className={styles.modal__button}>
              <button onClick={handleAddCityConfirmed}>{t('addButton')}</button>
              <button onClick={handleModalClose}>{t('modalCancel')}</button>
            </div>
          </div>
        </div>
      }
      {showModal &&
        <div className={styles.modal}>
          <div className={styles.modal__content}>
            <h2>{t('error')}</h2>
            <p>{t('errorMessage')}</p>
            <button onClick={() => setShowModal(false)}>{t('errorButton')}</button>
          </div>
        </div>
      }
    </div>
  );
};

export default WeatherApp;
