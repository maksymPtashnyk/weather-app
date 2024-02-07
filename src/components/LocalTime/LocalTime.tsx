import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchCityTime } from '../../api/weatherApi';
import styles from './LocalTime.module.scss';
import { Coords } from '../../types/types';

type Props = {
  coords: Coords;
};

const LocalTime: React.FC<Props> = ({ coords }) => {
  const [localTime, setLocalTime] = useState<Date | null>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const time = await fetchCityTime(coords);
        setLocalTime(new Date(time));
      } catch (error) {
        console.error('Error fetching time');
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, [coords]);

  const formatDateTime = (date: Date | null) => {
    if (!date) {
      return '';
    }

    const months: string[] = i18n.t('months', { returnObjects: true });
    const daysOfWeek: string[] = i18n.t('daysOfWeek', { returnObjects: true });

    const day: number = date.getDate();
    const month: string = months[date.getMonth()];
    const hours: string = date.getHours().toString().padStart(2, '0');
    const minutes: string = date.getMinutes().toString().padStart(2, '0');
    const dayOfWeek: string = daysOfWeek[date.getDay()];

    return `${dayOfWeek}, ${day} ${month}, ${hours}:${minutes}`;
  };
  return <p className={styles.time}>{formatDateTime(localTime)}</p>;
};

export default LocalTime;

