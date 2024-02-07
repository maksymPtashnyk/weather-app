import React, { useEffect, useState } from 'react';
import styles from './Diagram.module.scss';
import { format, parseISO } from 'date-fns';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, LabelList } from 'recharts';
import { fetchWeatherForecastData } from '../../api/weatherApi';
import i18next from 'i18next';
import { City, Forecast } from '../../types/types';
import classNames from 'classnames';

interface Props {
  city: City;
  temp: number;
}

const formatDate = (dateString: string) => {
  try {
    const parsedDate = parseISO(dateString);

    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date:', dateString);
      return '';
    }

    return format(parsedDate, 'dd.MM');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

const Diagram: React.FC<Props> = ({ city, temp }) => {
  const [data, setData] = useState<Forecast[]>([]);
  const gradientId = `temperatureGradient-${city.name.replace(/\s+/g, '')}`;

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

  const getColor = (temperature: number) => (temperature < 0 ? '#5B8CFF' : '#FFA25B');

  const isHebrew = i18next.language === 'he';

  return (
    <ResponsiveContainer
      width="100%"
      height={220}
      className={classNames(
        styles.wrapper,
        isHebrew ? styles.hebrew : '',
      )}
    >
      <AreaChart data={data}>
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="5%"
              stopColor={getColor(temp)}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor={getColor(temp)}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <YAxis width={0} opacity={0} />
        <XAxis
          dataKey="dt_txt"
          tickMargin={1}
          tickFormatter={formatDate}
          axisLine={false}
          tickLine={false}
          height={window.innerWidth < 500 ? 30 : 50}
          widths='15'
          className={styles.date}
          interval="preserveStartEnd"
        />
        <Area
          type="monotone"
          dataKey="main.temp"
          fill={`url(#${gradientId})`}
          baseValue={'dataMin'}
          strokeWidth={0}
        >
          <LabelList
            dataKey="main.temp"
            position={{ x: 0, y: 0 }}
            className={styles.temperature__text}
          />
        </Area>
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Diagram;

