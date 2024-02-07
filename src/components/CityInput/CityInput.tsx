import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { fetchCitySuggestions, fetchWeatherByCity } from '../../api/weatherApi';
import { useDispatch, useSelector } from 'react-redux';
import { addCity } from '../../store/slices/weatherSlice';
import { useTranslation } from 'react-i18next';
import styles from './CityInput.module.scss';
import { City, CitySuggestionResponse, RootState } from '../../types/types';
import classNames from 'classnames';

type Props = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const CityInput: React.FC<Props> = ({ setShowModal }) => {
  const [newCity, setNewCity] = useState<string>('');
  const [debouncedNewCity] = useDebounce(newCity, 500);
  const [suggestions, setSuggestions] = useState<CitySuggestionResponse[]>([]);

  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();
  const cities = useSelector((state: RootState) => state.weather.cities);

  const handleInputChange = (input: string) => {
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

        const newCityData: City = {
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

  const handleSuggestionClick = (suggestion: CitySuggestionResponse) => {
    setNewCity(suggestion.name);
    handleAddCity();
    setSuggestions([]);
  };

  const handleClearInput = () => {
    setNewCity('');
    setSuggestions([]);
  };

  const isHebrew = i18n.language === 'he';
  const isUkrainian = i18n.language === 'uk';

  return (
    <div className={classNames(
      styles.input__block,
      isHebrew ? styles.hebrew : '',
      isUkrainian ? styles.uk : '',
    )}>
      <div className={styles.input}>
        <input
          className={styles.input__element}
          type="text"
          value={newCity}
          onChange={(e) => handleInputChange(e.target.value)}
        />
        <div className={styles.suggestion}>
          {suggestions.map((suggestion) => (
            <div
              className={styles.suggestion__item}
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {`${suggestion.name}, ${suggestion.country}`}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.button__container}>
        <button className={styles.input__button} onClick={handleAddCity}>
          {t('addButton')}
        </button>
        <button
          className={classNames(
            styles.clear__button,
            debouncedNewCity ? styles.show : '',
          )}
          onClick={handleClearInput}
        >
          {t('clearButton')}
        </button>
      </div>
    </div >
  );
};

export default CityInput;
