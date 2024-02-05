import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage, addCity, removeCity } from '../../store/slices/weatherSlice';
import WeatherCard from '../WeatherCard/WeatherCard';
import styles from './WeatherApp.module.scss';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import { fetchWeatherByLocation } from '../../api/weatherApi';
import CityInput from '../CityInput/CityInput';

const WeatherApp = () => {
  const [showModal, setShowModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [weatherFetched, setWeatherFetched] = useState(false);
  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [modalCityData, setModalCityData] = useState(null);
  const dispatch = useDispatch();
  const cities = useSelector((state) => state.cities);
  const language = useSelector((state) => state.language)
  const { i18n, t } = useTranslation();

  const languages = [
    { name: 'EN', value: 'en' },
    { name: 'UK', value: 'uk' },
    { name: 'HE', value: 'he' },
  ];

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const changeLanguage = (lang) => {
    dispatch(setLanguage(lang));
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
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

  const fetchWeatherByLocator = async () => {
    try {
      if (userLocation && !weatherFetched) {
        const { latitude, longitude } = userLocation;
        const response = await fetchWeatherByLocation(latitude, longitude);

        const userLocationData = {
          id: response.id,
          name: response.name,
          temperatureUnit: 'metric',
          location: true,
        };

        const isCityAlreadyAdded = cities.some(
          (city) => city.id === userLocationData.id || city.name.toLowerCase() === userLocationData.name.toLowerCase()
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
    fetchWeatherByLocator();
  });

  const handleAddCityConfirmed = () => {
    dispatch(addCity(modalCityData));
    setShowAddCityModal(false);
  };

  const handleModalClose = () => {
    setShowAddCityModal(false);
  };

  const handleRemoveCity = (cityToRemove) => {
    dispatch(removeCity(cityToRemove));
  };

  const isHebrew = i18n.language === 'he';
  const isUkrainian = i18n.language === 'uk';
  return (
    <div className={`${styles.weather__app} ${isHebrew ? styles.hebrew : ''} ${isUkrainian ? styles.uk : ''}`}>

      <Dropdown value={language} onChange={(e) => changeLanguage(e.value)} options={languages} optionLabel="name" className={styles.dropdown}/>

      <CityInput setShowModal={setShowModal} />
      <div className={styles.weather__container}>
        {cities.map((city) => (
          <WeatherCard key={city.id} city={city} onRemove={() => handleRemoveCity(city.id)} />
        ))}
      </div>
      {showAddCityModal && (
        <div className={styles.modal}>
          <div className={styles.modal__content}>
            <h2>{t('modalQuestion')}</h2>
            <p>{modalCityData.name}</p>
            <div class={styles.modal__button}>
              <button onClick={handleAddCityConfirmed}>{t('addButton')}</button>
              <button onClick={handleModalClose}>{t('modalCancel')}</button>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modal__content}>
            <h2>{t('error')}</h2>
            <p>{t('errorMessage')}</p>
            <button onClick={() => setShowModal(false)}>{t('errorButton')}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
