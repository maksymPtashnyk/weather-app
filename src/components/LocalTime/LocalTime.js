import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchCityTime } from '../../api/weatherApi';

const LocalTime = ({ city }) => {
  const [localTime, setLocalTime] = useState(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const time = await fetchCityTime(city.lat, city.lon);
        setLocalTime(time);
      } catch (error) {
        console.error('Error fetching time')
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000000);

    return () => clearInterval(intervalId);
  }, [city]);

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
