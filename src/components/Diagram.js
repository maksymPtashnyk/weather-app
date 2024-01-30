import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  LabelList,
} from 'recharts';
import _ from 'lodash';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}`;
};

const WeatherForecastChart = ({ city }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=068df69e3f782e51feb0b40621ccbc34`);
        
        // Групування даних за день і обчислення середньої температури
        const dailyData = _(response.data.list)
          .groupBy(item => item.dt_txt.split(' ')[0]) // Групування за днем
          .map((group, date) => ({
            dt_txt: date,
            main: {
              temp: Math.round(_.meanBy(group, 'main.temp')), // Обчислення і округлення середньої температури
            },
          }))
          .value();

        setData(dailyData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [city]);

  return (
    <AreaChart width="100%" height={100} data={data}>
      <defs>
        <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
        </linearGradient>
      </defs>
      <XAxis dataKey="dt_txt" tickMargin={0} tickFormatter={formatDate} axisLine={false} tickLine={false} />
      <YAxis hide={true} />
      <Area type="monotone" dataKey="main.temp" fill="url(#temperatureGradient)" baseValue={'dataMin'} strokeWidth={0}>
        <LabelList dataKey="main.temp" position="top" />
      </Area>
    </AreaChart>
  );
};

export default WeatherForecastChart;
