import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { FaExclamationTriangle, FaSun, FaUmbrella, FaSnowflake, FaBolt } from 'react-icons/fa';
import { WiDaySunny, WiRain, WiCloudy, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi';

const WEATHER_API_KEY = '2beb470d89e2444e59870f9e1b143a04'; // Using your existing API key

const locations = {
  Colombo: { lat: 6.9271, lon: 79.8612 },
  Kandy: { lat: 7.2906, lon: 80.6337 },
  Galle: { lat: 6.0535, lon: 80.2210 },
  'Nuwara Eliya': { lat: 6.9497, lon: 80.7891 },
  Jaffna: { lat: 9.6615, lon: 80.0255 },
  Trincomalee: { lat: 8.5922, lon: 81.2357 },
  Matale: { lat: 7.4675, lon: 80.6234 }
};

const WeatherAlert = ({ location, travelDate }) => {
  const [weatherForecast, setWeatherForecast] = useState(null);
  const [weatherStatus, setWeatherStatus] = useState({ 
    type: null, // 'good', 'warning', 'severe'
    message: '',
    icon: null,
    badWeatherDays: 0,
    totalDays: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!location || !locations[location]) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { lat, lon } = locations[location];
        
        // Get 5-day forecast
        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        );
        
        // Process forecast data to analyze weather conditions
        analyzeWeatherForecast(forecastResponse.data);
      } catch (error) {
        console.error('Error fetching weather data for alert:', error);
        setLoading(false);
      }
    };
    
    fetchWeatherData();
  }, [location]);

  const analyzeWeatherForecast = (data) => {
    // Group by day to count unique days
    const dailyForecasts = {};
    let badWeatherDays = 0;
    
    data.list.forEach(item => {
      const date = moment.unix(item.dt).format('YYYY-MM-DD');
      
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          conditions: [],
          temps: []
        };
      }
      
      dailyForecasts[date].conditions.push(item.weather[0].main);
      dailyForecasts[date].temps.push(item.main.temp);
    });
    
    // Get unique days and analyze if any have bad weather
    const days = Object.keys(dailyForecasts);
    const totalDays = days.length;
    
    // Check for bad weather conditions in each day
    days.forEach(day => {
      const conditions = dailyForecasts[day].conditions;
      const hasBadWeather = conditions.some(condition => 
        ['Rain', 'Thunderstorm', 'Snow', 'Drizzle', 'Storm'].includes(condition)
      );
      
      if (hasBadWeather) {
        badWeatherDays++;
      }
    });
    
    // Generate status based on weather conditions
    generateWeatherStatus(badWeatherDays, totalDays, dailyForecasts, location);
    setLoading(false);
  };

  const generateWeatherStatus = (badDays, totalDays, forecasts, location) => {
    // Determine most common weather type
    const allConditions = Object.values(forecasts).flatMap(day => day.conditions);
    const conditionCount = {};
    
    allConditions.forEach(condition => {
      conditionCount[condition] = (conditionCount[condition] || 0) + 1;
    });
    
    // Find the most frequent condition
    let mostCommonCondition = Object.keys(conditionCount).reduce(
      (a, b) => conditionCount[a] > conditionCount[b] ? a : b, 
      Object.keys(conditionCount)[0]
    );
    
    // Calculate average temperature
    const allTemps = Object.values(forecasts).flatMap(day => day.temps);
    const avgTemp = allTemps.reduce((sum, temp) => sum + temp, 0) / allTemps.length;
    
    // Set status based on weather forecast
    if (badDays === 0) {
      // Good weather
      setWeatherStatus({
        type: 'good',
        message: `☀️ Perfect weather expected in ${location}! Sunny skies and average temperature of ${Math.round(avgTemp)}°C. Enjoy your trip!`,
        icon: <WiDaySunny className="text-yellow-400 w-6 h-6" />,
        badWeatherDays: badDays,
        totalDays: totalDays
      });
    } else if (badDays / totalDays < 0.5) {
      // Some bad weather
      setWeatherStatus({
        type: 'warning',
        message: `⚠️ Note: Some ${mostCommonCondition.toLowerCase()} expected in ${location} (${badDays} of ${totalDays} days). Consider packing appropriate gear.`,
        icon: getWeatherIcon(mostCommonCondition),
        badWeatherDays: badDays,
        totalDays: totalDays
      });
    } else {
      // Mostly bad weather
      setWeatherStatus({
        type: 'severe',
        message: `⚠️ Warning: ${mostCommonCondition} is expected in ${location} for most of the forecast period (${badDays} of ${totalDays} days). Please consider alternative locations or carry appropriate gear.`,
        icon: getWeatherIcon(mostCommonCondition),
        badWeatherDays: badDays,
        totalDays: totalDays
      });
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Clear': return <WiDaySunny className="text-yellow-400 w-6 h-6" />;
      case 'Rain': 
      case 'Drizzle': return <WiRain className="text-blue-400 w-6 h-6" />;
      case 'Clouds': return <WiCloudy className="text-gray-300 w-6 h-6" />;
      case 'Snow': return <WiSnow className="text-blue-100 w-6 h-6" />;
      case 'Thunderstorm': return <WiThunderstorm className="text-purple-400 w-6 h-6" />;
      default: return <FaExclamationTriangle className="text-yellow-500 w-5 h-5" />;
    }
  };

  // Don't render anything during loading or if no status
  if (loading || !weatherStatus.type) return null;

  const getAlertStyles = () => {
    switch (weatherStatus.type) {
      case 'good':
        return "bg-green-100/90 border-l-4 border-green-500 text-green-800";
      case 'warning':
        return "bg-yellow-100/90 border-l-4 border-yellow-500 text-yellow-800";
      case 'severe':
        return "bg-red-100/90 border-l-4 border-red-500 text-red-800";
      default:
        return "bg-blue-100/90 border-l-4 border-blue-500 text-blue-800";
    }
  };

  return (
    <div className={`mt-4 p-4 rounded-lg ${getAlertStyles()}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {weatherStatus.icon}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{weatherStatus.message}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherAlert;
