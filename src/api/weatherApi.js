import axios from 'axios';

const apiKey = '068df69e3f782e51feb0b40621ccbc34';

export const fetchWeatherByCity = async (cityName) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    throw error;
  }
};

export const fetchWeatherByLocation = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data by location:', error);
    throw error;
  }
};

export const fetchCitySuggestions = async (input) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/find?q=${input}&type=like&sort=population&cnt=5&appid=${apiKey}`
    );

    if (response.data && response.data.list) {
      const uniqueNewSuggestions = Array.from(new Set(response.data.list.map((result) => result.name)))
        .map((name) => response.data.list.find((result) => result.name === name))
        .map((result) => ({
          id: result.id,
          name: result.name,
          country: result.sys.country,
        }));
      return uniqueNewSuggestions;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw error;
  }
};
