import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage, addCity, removeCity } from '../../store/slices/weatherSlice';
import WeatherCard from '../WeatherCard/WeatherCard';
import { useDebounce } from 'use-debounce';
import axios from 'axios';
import './WeatherApp.css'
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';

const WeatherApp = () => {
  const [newCity, setNewCity] = useState('');
  const [debouncedNewCity] = useDebounce(newCity, 500);
  const [suggestions, setSuggestions] = useState([]);
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

  const handleAddCity = async () => {
    if (debouncedNewCity) {
      try {
        const apiKey = '068df69e3f782e51feb0b40621ccbc34';
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${debouncedNewCity}&units=metric&appid=${apiKey}`
        );

        const newCityData = {
          id: response.data.id,
          name: response.data.name,
          temperatureUnit: 'metric',
        };

        // Check if the city already exists in the list based on id
        if (!cities.some(city => city.id === newCityData.id)) {
          dispatch(addCity(newCityData));
          setNewCity('');
          setSuggestions([]);
        } else {
          setShowModal(true);
          setNewCity('');
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching temperature data:', error);
        // Handle error, e.g., show an alert to the user
      }
    }
  };

  useEffect(() => {
    const getUserLocation = () => {
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

    getUserLocation();
  }, []);

  useEffect(() => {
    const fetchWeatherByLocation = async () => {
      try {
        if (userLocation && !weatherFetched) {
          const { latitude, longitude } = userLocation;
          const apiKey = '068df69e3f782e51feb0b40621ccbc34'; // Замініть на свій ключ API
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
          );

          const userLocationData = {
            id: response.data.id,
            name: response.data.name,
            temperatureUnit: 'metric',
          };
          const isCityAlreadyAdded = cities.some(
            (city) => city.id === userLocationData.id || city.name.toLowerCase() === userLocationData.name.toLowerCase()
          );

          if (!isCityAlreadyAdded) {
            // Встановлюємо стан для відображення модального вікна
            setShowAddCityModal(true);
            // Передаємо дані для відображення в модальному вікні
            setModalCityData(userLocationData);
          }

          setWeatherFetched(true);
        }
      } catch (error) {
        console.error('Error fetching weather data by location:', error);
      }
    };

    fetchWeatherByLocation();
  }, [userLocation, cities, dispatch, weatherFetched]);

  const handleAddCityConfirmed = () => {
    dispatch(addCity(modalCityData));
    setShowAddCityModal(false);
  };

  // Додайте функцію для закриття модального вікна
  const handleModalClose = () => {
    setShowAddCityModal(false);
  };



  const handleRemoveCity = (cityToRemove) => {
    dispatch(removeCity(cityToRemove));
  };

  const handleInputChange = async (input) => {
    setNewCity(input);

    // Check if the input is valid (not empty and has more than 2 characters, adjust as needed)
    if (input.trim() !== '' && input.trim().length > 2) {
      try {
        const apiKey = '068df69e3f782e51feb0b40621ccbc34';
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${input}&type=like&sort=population&cnt=5&appid=${apiKey}`
        );

        // Check if the API response contains the expected data
        if (response.data && response.data.list) {
          const uniqueNewSuggestions = Array.from(new Set(response.data.list.map((result) => result.name)))
            .map((name) => response.data.list.find((result) => result.name === name))
            .map((result) => ({
              id: result.id, // Assuming 'id' is available in the API response
              name: result.name,
              country: result.sys.country,
            }));

          setSuggestions(uniqueNewSuggestions);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    } else {
      // If input is not valid, clear suggestions
      setSuggestions([]);
    }
  };


  const handleSuggestionClick = (suggestion) => {
    setNewCity(suggestion);
    handleAddCity();
  };

  const isHebrew = i18n.language === 'he';

  const handleClearInput = () => {
    setNewCity('');
    setSuggestions([]);
  };


  return (
    <div className={`weather-app ${isHebrew ? 'hebrew' : ''}`}>
      <div>
        <Dropdown value={language} onChange={(e) => changeLanguage(e.value)} options={languages} optionLabel="name" className="drop-down" />
      </div>

      <div>
        <div className='input-block'>
          <div class="input">
            <input
              className='input-element'
              type="text"
              value={newCity}
              onChange={(e) => handleInputChange(e.target.value)}
            />
            <div className='suggestions'>
              {suggestions.map((suggestion) => (
                <div className='suggestion-item' key={suggestion.name} onClick={() => handleSuggestionClick(suggestion)}>
                  {`${suggestion.name}, ${suggestion.country}`}
                </div>
              ))}
            </div>
          </div>

          <div class="button-container">
            <button className='input-button' onClick={handleAddCity}>{t('addButton')}</button>
            <button className={`clear-button ${debouncedNewCity ? 'show' : ''}`} onClick={handleClearInput}>Clear</button>
          </div>
        </div>

      </div>
      <div className="weather-container">
        {cities.map((city) => (
          <WeatherCard key={city.id} city={city} onRemove={() => handleRemoveCity(city.id)} />
        ))}
      </div>
      {showAddCityModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{t('modalQuestion')}</h2>
            <p>{modalCityData.name}</p>
            <div class="modal-button">
              <button onClick={handleAddCityConfirmed}>{t('addButton')}</button>
              <button onClick={handleModalClose}>{t('modalCancel')}</button>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
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
