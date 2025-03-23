import React, { useState } from 'react';
import MapComponent from '../components/MapComponent';
import blogData from '../data/blogData';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaHeart, FaShare } from 'react-icons/fa';
import WeatherWidget from '../components/Weather/WeatherWidget';

const Blog = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const renderBlogPost = () => {
    if (!selectedLocation || !blogData[selectedLocation]) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 shadow-2xl"
        >
          <div className="text-center space-y-4">
            <FaMapMarkerAlt className="w-16 h-16 text-blue-400 mx-auto" />
            <h3 className="text-2xl font-bold text-white">Discover Amazing Places</h3>
            <p className="text-lg text-gray-400">Select a location on the map to read travel stories and insights.</p>
          </div>
        </motion.div>
      );
    }

    const { title, content, images, author, date, readTime } = blogData[selectedLocation];
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-2xl"
      >
        {/* Hero Image */}
        <div className="relative h-96">
          <img src={images[0]} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
            <div className="flex items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <FaClock className="w-4 h-4" />
                <span>{readTime} read</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="w-4 h-4" />
                <span>{selectedLocation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={author.avatar} alt={author.name} className="w-12 h-12 rounded-full" />
              <div>
                <h4 className="font-semibold text-white">{author.name}</h4>
                <p className="text-gray-400">{date}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                <FaHeart className="text-red-400" />
                <span>{author.likes}</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                <FaShare className="text-blue-400" />
                Share
              </button>
            </div>
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed">{content}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            {images.slice(1).map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`${title} ${index + 2}`} 
                className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          Travel Stories & Insights
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weather Widget */}
          <div className="lg:col-span-3 mb-8">
            <WeatherWidget />
          </div>

          {/* Map Section */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl sticky top-24"
            >
              <h2 className="text-xl font-bold text-white mb-4">Explore Destinations</h2>
              <MapComponent onLocationSelect={handleLocationSelect} />
            </motion.div>
          </div>

          {/* Blog Content Section */}
          <div className="lg:col-span-2">
            {renderBlogPost()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;