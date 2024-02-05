# Weather App

## Introduction
This is a weather application built with React using Create-React-App. It utilizes the OpenWeatherMap API for weather data. The app allows users to view the current weather of their location by default, add cities to the list, switch between Celsius and Fahrenheit, and change the language globally for all displayed cities. The temperature and date dependencies are graphically represented using the OpenWeatherMap forecast data. State management is handled with Redux, and application settings are stored in LocalStorage.

## Prerequisites
- Node.js and npm installed on your machine.

## Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/weather-app.git
   ```
2. Change into the project directory:
  ```bash
   cd weather-app
  ```
3. Install dependencies:
  ```bash
  npm install
  ```
4. Create a .env file in the root directory and add your OpenWeatherMap API key:
  ```bash
  REACT_APP_WEATHER_USER_KEY=your_openweathermap_api_key
  ```
5. Start the development server:
  ```bash
  npm start
  ```
  The app will be running at http://localhost:3000.

## Features

- Displaying the current weather of the user's location by default if the user grants location access.
- Adding a city to the list by autocompleting search and saving it to application settings.
- Switching from Celsius to Fahrenheit for each card separately. The settings are saved in LocalStorage.
- Global language switching for all displayed cities. Available languages are English, Ukrainian, and Hebrew (RTL). The language settings are saved in LocalStorage.
- Displaying an icon from the OpenWeatherMap service.
- Graphical representation of temperature and date dependencies using the OpenWeatherMap forecast data.
- Application settings stored in LocalStorage.
- State management using Redux.

## Libraries and Technologies Used

- React
- Redux
- Axios
- Recharts
- React-i18next
- Create-React-App

## Acknowledgments

- The app design is based on the provided design specifications.
- Thanks to OpenWeatherMap and for providing the APIs.
- React, Redux, and other open-source libraries used in the project.
