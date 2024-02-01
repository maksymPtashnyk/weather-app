// CityInput.js
import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { fetchCitySuggestions, fetchWeatherByCity } from '../../api/weatherApi';
import { useDispatch, useSelector } from 'react-redux';
import { addCity } from '../../store/slices/weatherSlice';
import { useTranslation } from 'react-i18next'
import './CityInput.css'

const CityInput = ({ setShowModal }) => {
  const [newCity, setNewCity] = useState('');
  const [debouncedNewCity] = useDebounce(newCity, 500);
  const [suggestions, setSuggestions] = useState([]);

  const {t} = useTranslation();

  const dispatch = useDispatch();
  const cities = useSelector((state) => state.cities);

  const handleInputChange = (input) => {
    setNewCity(input);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (newCity.trim() !== '' && newCity.trim().length > 2) {
        try {
          const suggestions = await fetchCitySuggestions(newCity);
          setSuggestions(suggestions);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [newCity]);

  const handleAddCity = async () => {
    if (debouncedNewCity) {
      try {
        const response = await fetchWeatherByCity(debouncedNewCity);

        const newCityData = {
          id: response.id,
          name: response.name,
          temperatureUnit: 'metric',
        };

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
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setNewCity(suggestion.name);
    handleAddCity();
    setSuggestions([]);
  };

  const handleClearInput = () => {
    setNewCity('');
    setSuggestions([]);
  };

  return (
    <div className="input-block">
      <div className="input">
        <input
          className="input-element"
          type="text"
          value={newCity}
          onChange={(e) => handleInputChange(e.target.value)}
        />
        <div className="suggestions">
          {suggestions.map((suggestion) => (
            <div
              className="suggestion-item"
              key={suggestion.name}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {`${suggestion.name}, ${suggestion.country}`}
            </div>
          ))}
        </div>
      </div>

      <div className="button-container">
        <button className="input-button" onClick={handleAddCity}>
          {t('addButton')}
        </button>
        <button
          className={`clear-button ${debouncedNewCity ? 'show' : ''}`}
          onClick={handleClearInput}
        >
          {t('clearButton')}
        </button>
      </div>
    </div>
  );
};

export default CityInput;