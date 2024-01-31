// LocalTime.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const LocalTime = ({ city }) => {
  const [localTime, setLocalTime] = useState(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchCityTime = async () => {
      try {
        const response = await axios.get(`http://api.geonames.org/timezoneJSON?formatted=true&lat=${city.lat}&lng=${city.lon}&username=ptaha.mx`);
        const cityTime = new Date(response.data.time);
        setLocalTime(cityTime);
      } catch (error) {
        console.error('Error fetching city time:', error);
      }
    };

    fetchCityTime();
    const intervalId = setInterval(fetchCityTime, 1000000);

    return () => clearInterval(intervalId);
  }, [city]);

  console.log(city.coord)

  const formatDateTime = (date) => {
    if (!date) {
      return '';
    }

    const months = i18n.t('months', { returnObjects: true });
    const daysOfWeek = i18n.t('daysOfWeek', { returnObjects: true });

    const day = date.getDate();
    const month = months[date.getMonth()];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const dayOfWeek = daysOfWeek[date.getDay()];

    return `${dayOfWeek}, ${day} ${month}, ${hours}:${minutes}`;
  };

  return (
    <p className='time'>{formatDateTime(localTime)}</p>
  );
};

export default LocalTime;


