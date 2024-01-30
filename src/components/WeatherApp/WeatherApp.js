import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage, addCity, removeCity } from '../../store/slices/weatherSlice';
import WeatherCard from '../WeatherCard/WeatherCard';
import { useDebounce } from 'use-debounce';
import axios from 'axios';
import './WeatherApp.css'
import { Dropdown } from 'primereact/dropdown';

const WeatherApp = () => {
  const [newCity, setNewCity] = useState('');
  const [debouncedNewCity] = useDebounce(newCity, 500);
  const [suggestions, setSuggestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const cities = useSelector((state) => state.cities);
  const language = useSelector((state) => state.language)
  console.log(cities);

  const languages = [
    {name: 'EN', value: 'en'},
    {name: 'UK', value: 'uk'},
    {name: 'HE', value: 'he'},
  ]

  const handleLanguageChange = (lang) => {
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
  return (
    <div className='weather-app'>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Помилка</h2>
            <p>Місто вже є в списку.</p>
            <button onClick={() => setShowModal(false)}>Закрити</button>
          </div>
        </div>
      )}
      <div>
        <Dropdown value={language} onChange={(e) => handleLanguageChange(e.value)} options={languages} optionLabel="name" className="drop-down" />
      </div>

      <div>
        <div className='input-block'>
          <input
            type="text"
            value={newCity}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <button onClick={handleAddCity}>Add</button>
        </div>
        <div>
          {suggestions.map((suggestion) => (
            <div key={suggestion.name} onClick={() => handleSuggestionClick(suggestion)}>
              {`${suggestion.name}, ${suggestion.country}`}
            </div>
          ))}
        </div>
      </div>
      <div className="weather-container">
        {cities.map((city) => (
          <WeatherCard key={city.id} city={city} onRemove={() => handleRemoveCity(city.id)} />
        ))}
      </div>
    </div>
  );
};

export default WeatherApp;
