import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTemperatureUnit, setLanguage, addCity } from '../store/actions/weatherActions';
import WeatherCard from './WeatherCard';

const WeatherApp = () => {
  const [newCity, setNewCity] = useState('');
  const dispatch = useDispatch();
  const cities = useSelector((state) => state.cities);
  const language = useSelector((state) => state.language);

  useEffect(() => {
    // Fetch current weather for the user's location if geolocation is granted
    // You can implement this based on the user's geolocation (navigator.geolocation) and dispatch the result using setCurrentWeather action
  }, []);

  const handleTemperatureUnitChange = (unit) => {
    dispatch(setTemperatureUnit(unit));
  };

  const handleLanguageChange = (lang) => {
    dispatch(setLanguage(lang));
  };

  const handleAddCity = () => {
    dispatch(addCity(newCity));
    setNewCity('');
  };

  return (
    <div>
      <div>
        <label>
          Temperature Unit:
          <select onChange={(e) => handleTemperatureUnitChange(e.target.value)}>
            <option value="metric">Celsius</option>
            <option value="imperial">Fahrenheit</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Language:
          <select onChange={(e) => handleLanguageChange(e.target.value)}>
            <option value="en">English</option>
            <option value="uk">Ukrainian</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Add City:
          <input type="text" value={newCity} onChange={(e) => setNewCity(e.target.value)} />
          <button onClick={handleAddCity}>Add</button>
        </label>
      </div>
      <div>
        {cities.map((city) => (
          <WeatherCard key={city} city={city} />
        ))}
      </div>
    </div>
  );
};

export default WeatherApp;
