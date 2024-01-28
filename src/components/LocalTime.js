import React, { useState, useEffect } from 'react';

const LocalTime = () => {
  const [localTime, setLocalTime] = useState(null);

  useEffect(() => {
    const updateLocalTime = () => {
      const now = new Date();
      setLocalTime(now);
    };
  
    // Оновлюємо місцевий час кожну секунду
    const intervalId = setInterval(updateLocalTime, 1000);
  
    // Очищаємо інтервал при виході з компоненту
    return () => clearInterval(intervalId);
  }, []);

  const formatDateTime = (date) => {
    if (!date) {
      return ''; // Перевіряємо, чи дата визначена
    }
  
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
    const day = date.getDate();
    const month = months[date.getMonth()];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const dayOfWeek = daysOfWeek[date.getDay()];
  
    return `${dayOfWeek}, ${day} ${month}, ${hours}:${minutes}`;
  };

  return (
      <p>{formatDateTime(localTime)}</p>
  );
};

export default LocalTime;

