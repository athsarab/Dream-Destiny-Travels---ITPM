import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { WiDaySunny, WiRain, WiCloudy, WiDayHaze, WiStrongWind, WiHumidity, WiThermometer, WiDayRainMix, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi';
import { motion } from 'framer-motion';

const WEATHER_API_KEY = '2beb470d89e2444e59870f9e1b143a04';

const locations = {
  Colombo: { lat: 6.9271, lon: 79.8612 },
  Kandy: { lat: 7.2906, lon: 80.6337 },
  Galle: { lat: 6.0535, lon: 80.2210 },
  'Nuwara Eliya': { lat: 6.9497, lon: 80.7891 },
  Jaffna: { lat: 9.6615, lon: 80.0255 },
  Trincomalee: { lat: 8.5922, lon: 81.2357 },
  Matale: { lat: 7.4675, lon: 80.6234 }
};

const WeatherWidget = ({ selectedLocation: propSelectedLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(propSelectedLocation || 'Colombo');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');

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

        // Fetch forecast
        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        );

        setCurrentWeather(currentResponse.data);
        
        // Process forecast data to get daily forecasts
        const groupedByDay = {};
        forecastResponse.data.list.forEach(item => {
          const date = item.dt_txt.split(' ')[0];
          if (!groupedByDay[date]) {
            groupedByDay[date] = [];
          }
          groupedByDay[date].push(item);
        });
        
        const dailyForecasts = Object.keys(groupedByDay).map(date => {
          const dayData = groupedByDay[date];
          const noonForecast = dayData.reduce((closest, current) => {
            const currentHour = parseInt(current.dt_txt.split(' ')[1].split(':')[0]);
            const closestHour = parseInt(closest.dt_txt.split(' ')[1].split(':')[0]);
            return Math.abs(currentHour - 12) < Math.abs(closestHour - 12) ? current : closest;
          }, dayData[0]);
          
          return noonForecast;
        }).slice(0, 7);
        
        setForecast(dailyForecasts);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
      setLoading(false);
    };

    fetchWeatherData();
  }, [selectedLocation]);

  const getWeatherIcon = (condition, size = 42) => {
    const iconProps = { size, className: "weather-icon" };
    
    switch (condition) {
      case 'Clear': return <WiDaySunny {...iconProps} className={`${iconProps.className} text-yellow-400`} />;
      case 'Rain': 
      case 'Drizzle': return <WiRain {...iconProps} className={`${iconProps.className} text-blue-400`} />;
      case 'Clouds': return <WiCloudy {...iconProps} className={`${iconProps.className} text-gray-300`} />;
      case 'Snow': return <WiSnow {...iconProps} className={`${iconProps.className} text-blue-100`} />;
      case 'Thunderstorm': return <WiThunderstorm {...iconProps} className={`${iconProps.className} text-purple-400`} />;
      case 'Mist':
      case 'Fog': return <WiFog {...iconProps} className={`${iconProps.className} text-gray-300`} />;
      case 'Haze': return <WiDayHaze {...iconProps} className={`${iconProps.className} text-gray-400`} />;
      default: return <WiDaySunny {...iconProps} className={`${iconProps.className} text-yellow-400`} />;
    }
  };

  const getBackgroundGradient = () => {
    if (!currentWeather) return 'from-gray-800 to-gray-900';
    
    const hour = moment().hour();
    const isDaytime = hour > 6 && hour < 18;
    const weatherCondition = currentWeather.weather[0].main;
    
    if (weatherCondition === 'Clear') {
      return isDaytime ? 'from-blue-400 to-blue-600' : 'from-blue-900 to-indigo-900';
    } else if (weatherCondition === 'Rain' || weatherCondition === 'Drizzle') {
      return 'from-gray-600 to-blue-800';
    } else if (weatherCondition === 'Clouds') {
      return 'from-gray-500 to-gray-700';
    } else if (weatherCondition === 'Thunderstorm') {
      return 'from-purple-800 to-gray-900';
    } else {
      return 'from-gray-800 to-gray-900';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-800 rounded-xl shadow-lg">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mb-4"></div>
          <span className="text-gray-300">Loading weather data...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-r ${getBackgroundGradient()} rounded-xl p-6 shadow-2xl text-white`}
    >
      {/* Location Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {Object.keys(locations).map((loc) => (
          <motion.button
            key={loc}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedLocation(loc)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
              ${selectedLocation === loc
                ? 'bg-white text-gray-900 shadow-md'
                : 'bg-gray-700/50 text-gray-200 hover:bg-gray-600/70'
              }`}
          >
            {loc}
          </motion.button>
        ))}
      </div>

      {/* Current Weather */}
      {currentWeather && (
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div className="mb-4 md:mb-0">
              <h2 className="text-3xl font-bold mb-1">{selectedLocation}</h2>
              <p className="text-gray-200/90">{moment().format('dddd, MMMM D, YYYY')}</p>
              <div className="flex items-center mt-2">
                {getWeatherIcon(currentWeather.weather[0].main, 24)}
                <span className="ml-2 capitalize text-gray-200/90">
                  {currentWeather.weather[0].description}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-6xl font-bold">
                {Math.round(currentWeather.main.temp)}°C
              </div>
              <div className="text-gray-200/90">
                H: {Math.round(currentWeather.main.temp_max)}° L: {Math.round(currentWeather.main.temp_min)}°
              </div>
            </div>
          </div>

          {/* Weather Tabs */}
          <div className="flex border-b border-gray-600/50 mb-6">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-4 py-2 font-medium ${activeTab === 'today' ? 'text-white border-b-2 border-white' : 'text-gray-300 hover:text-white'}`}
            >
              Today
            </button>
            <button
              onClick={() => setActiveTab('week')}
              className={`px-4 py-2 font-medium ${activeTab === 'week' ? 'text-white border-b-2 border-white' : 'text-gray-300 hover:text-white'}`}
            >
              This Week
            </button>
          </div>

          {/* Today's Weather Details */}
          {activeTab === 'today' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-gray-200 mb-2">
                  <WiThermometer size={24} />
                  <span>Feels Like</span>
                </div>
                <div className="text-2xl font-semibold">
                  {Math.round(currentWeather.main.feels_like)}°C
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-gray-200 mb-2">
                  <WiHumidity size={24} />
                  <span>Humidity</span>
                </div>
                <div className="text-2xl font-semibold">
                  {currentWeather.main.humidity}%
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-gray-200 mb-2">
                  <WiStrongWind size={24} />
                  <span>Wind</span>
                </div>
                <div className="text-2xl font-semibold">
                  {Math.round(currentWeather.wind.speed)} m/s
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-gray-200 mb-2">
                  <WiDayHaze size={24} />
                  <span>Pressure</span>
                </div>
                <div className="text-2xl font-semibold">
                  {currentWeather.main.pressure} hPa
                </div>
              </div>
            </div>
          )}

          {/* Weekly Forecast */}
          {activeTab === 'week' && forecast && forecast.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
              {forecast.map((day, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10 ${index === 0 ? 'bg-white/20' : ''}`}
                >
                  <div className="font-medium mb-1">
                    {index === 0 ? 'Today' : moment(day.dt_txt).format('ddd')}
                  </div>
                  <div className="text-sm text-gray-200/90 mb-2">
                    {moment(day.dt_txt).format('MMM D')}
                  </div>
                  <div className="flex justify-center my-3">
                    {getWeatherIcon(day.weather[0].main, 36)}
                  </div>
                  <div className="flex justify-center gap-2">
                    <span className="font-semibold">{Math.round(day.main.temp_max)}°</span>
                    <span className="text-gray-300">{Math.round(day.main.temp_min)}°</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sunrise/Sunset */}
      {currentWeather && activeTab === 'today' && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="text-lg font-semibold mb-4">Sunrise & Sunset</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-yellow-200 mb-2">
                <WiDaySunny size={24} />
                <span>Sunrise</span>
              </div>
              <div className="text-xl">
                {moment.unix(currentWeather.sys.sunrise).format('h:mm A')}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-orange-200 mb-2">
                <WiDaySunny size={24} />
                <span>Sunset</span>
              </div>
              <div className="text-xl">
                {moment.unix(currentWeather.sys.sunset).format('h:mm A')}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WeatherWidget;