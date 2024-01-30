import React, { useState, useEffect } from 'react';
import './LocalTime.css'

const LocalTime = () => {
  const [localTime, setLocalTime] = useState(null);

  useEffect(() => {
    const updateLocalTime = () => {
      const now = new Date();
      setLocalTime(now);
    };
    const intervalId = setInterval(updateLocalTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const formatDateTime = (date) => {
    if (!date) {
      return '';
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
      <p className='time'>{formatDateTime(localTime)}</p>
  );
};

export default LocalTime;

