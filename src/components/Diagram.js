import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const WeatherForecastChart = ({ city }) => {
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    const fetchWeatherForecast = async () => {
      try {
        const apiKey = '16409403db7f194037fec02b3688e5a1';
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
        const response = await axios.get(apiUrl);

        const filteredData = response.data.list.filter(item => item.dt_txt.includes('15:00'));

        setForecastData(filteredData);
      } catch (error) {
        console.error('Error fetching weather forecast:', error);
      }
    };

    fetchWeatherForecast();
  }, [city]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}.${month}`;
  };

  return (
    <ResponsiveContainer width="50%" height={300}>
      <AreaChart data={forecastData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <XAxis dataKey="dt_txt" tickFormatter={formatDate} axisLine={false} tickLine={false} />
        <YAxis hide mirror />
        <Tooltip />
        <Area type="monotone" dataKey="main.temp" fill="#8884d8" stroke="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default WeatherForecastChart;
