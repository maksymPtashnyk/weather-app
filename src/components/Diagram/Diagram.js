import React, { useEffect, useState } from 'react';
import './Diagram.css';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, LabelList } from 'recharts';
import { fetchWeatherForecastData } from '../../api/weatherApi';

const formatDate = (dateString) => {
  const date = new Date(dateString + ' UTC');
  const localDate = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Kyiv' }));
  const day = localDate.getDate();
  const month = localDate.getMonth() + 1;
  return `${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}`;
};

const WeatherForecastChart = ({ city, temp }) => {
  const [data, setData] = useState([]);
  const gradientId = `temperatureGradient-${city.replace(/\s+/g, '')}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const forecastData = await fetchWeatherForecastData(city);
        setData(forecastData);
      } catch (error) {
        console.error(error)
      }
    };

    fetchData();
  }, [city]);

  const getColor = (temperature) => (temperature < 0 ? '#5B8CFF' : '#FFA25B');

  return (
    <ResponsiveContainer width="100%" height={150} className='box'>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={getColor(temp)} stopOpacity={0.8} />
            <stop offset="95%" stopColor={getColor(temp)} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis width={16} interval={0} className='y-axis'/>
        <XAxis dataKey="dt_txt" tickMargin={10} tickFormatter={formatDate} axisLine={false} tickLine={false} height={50} className='data' margin={{ left: 20, right: 20 }} />
        <Area type="monotone" dataKey="main.temp" fill={`url(#${gradientId})`} baseValue={'dataMin'} strokeWidth={0} className='area'>
          <LabelList dataKey="main.temp" position="top" className='temperature' />
        </Area>
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default WeatherForecastChart;
