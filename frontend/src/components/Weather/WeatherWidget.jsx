import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { WiDaySunny, WiRain, WiCloudy, WiDayHaze, WiStrongWind, WiHumidity, WiThermometer } from 'react-icons/wi';
import { motion } from 'framer-motion';

const WEATHER_API_KEY = '2beb470d89e2444e59870f9e1b143a04'; // Replace with your OpenWeatherMap API key

const locations = {
  Colombo: { lat: 6.9271, lon: 79.8612 },
  Kandy: { lat: 7.2906, lon: 80.6337 },
  Galle: { lat: 6.0535, lon: 80.2210 },
  Nuwara_Eliya: { lat: 6.9497, lon: 80.7891 },
  Jaffna: { lat: 9.6615, lon: 80.0255 }
};

const WeatherWidget = ({ selectedLocation: propSelectedLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(propSelectedLocation || 'Colombo');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propSelectedLocation) {
      setSelectedLocation(propSelectedLocation);
    }
  }, [propSelectedLocation]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const { lat, lon } = locations[selectedLocation] || locations['Colombo'];
        
        // Fetch current weather
        const currentResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        );

        // Fetch 5-day forecast (this is the correct endpoint for the free tier)
        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        );

        setCurrentWeather(currentResponse.data);
        
        // Process forecast data to get daily forecasts
        const dailyForecasts = forecastResponse.data.list.filter(item => 
          item.dt_txt.includes('12:00:00')
        ).slice(0, 5);
        
        setForecast(dailyForecasts);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
      setLoading(false);
    };

    fetchWeatherData();
  }, [selectedLocation]);

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Clear': return <WiDaySunny className="text-yellow-400" />;
      case 'Rain': return <WiRain className="text-blue-400" />;
      case 'Clouds': return <WiCloudy className="text-gray-400" />;
      case 'Haze': return <WiDayHaze className="text-gray-300" />;
      default: return <WiDaySunny className="text-yellow-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800 rounded-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl"
    >
      {/* Location Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {Object.keys(locations).map((loc) => (
          <button
            key={loc}
            onClick={() => setSelectedLocation(loc)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
              ${selectedLocation === loc
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            {loc.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Current Weather */}
      {currentWeather && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {selectedLocation.replace('_', ' ')}
              </h2>
              <p className="text-gray-400">{moment().format('dddd, MMMM D, YYYY')}</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-white">
                {Math.round(currentWeather.main.temp)}°C
              </div>
              <div className="flex items-center justify-end gap-2 text-gray-300">
                {getWeatherIcon(currentWeather.weather[0].main)}
                <span className="capitalize">{currentWeather.weather[0].description}</span>
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <WiThermometer className="text-2xl" />
                <span>Feels Like</span>
              </div>
              <div className="text-xl font-semibold text-white">
                {Math.round(currentWeather.main.feels_like)}°C
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <WiHumidity className="text-2xl" />
                <span>Humidity</span>
              </div>
              <div className="text-xl font-semibold text-white">
                {currentWeather.main.humidity}%
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <WiStrongWind className="text-2xl" />
                <span>Wind Speed</span>
              </div>
              <div className="text-xl font-semibold text-white">
                {Math.round(currentWeather.wind.speed)} m/s
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5-Day Forecast */}
      {forecast && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">5-Day Forecast</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <div
                key={index}
                className="bg-gray-700/50 rounded-lg p-4 text-center"
              >
                <div className="text-gray-400 mb-2">
                  {moment(day.dt_txt).format('ddd')}
                </div>
                <div className="text-3xl mb-2">
                  {getWeatherIcon(day.weather[0].main)}
                </div>
                <div className="text-white font-semibold">
                  {Math.round(day.main.temp_max)}°
                </div>
                <div className="text-gray-400 text-sm">
                  {Math.round(day.main.temp_min)}°
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WeatherWidget;
