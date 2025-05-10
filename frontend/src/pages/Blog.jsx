import React, { useState } from 'react';
import MapComponent from '../components/MapComponent';
import blogData from '../data/blogData';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaHeart, FaShare, FaSearch } from 'react-icons/fa';
import WeatherWidget from '../components/Weather/WeatherWidget';
import ChatBot from '../components/ChatBot/ChatBot';

const Blog = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredLocations = Object.keys(blogData).filter(location => 
    location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderLocationCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map(location => (
          <motion.div
            key={location}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl"
            onClick={() => handleLocationSelect(location)}
          >
            <div className="relative h-48">
              <img 
                src={blogData[location].images[0]} 
                alt={location} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold text-white">{location}</h3>
                <p className="text-gray-300 text-sm line-clamp-1">{blogData[location].shortDescription}</p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <FaClock className="w-3 h-3" />
                  {blogData[location].readTime}
                </span>
                <span className="flex items-center gap-1">
                  <FaHeart className="w-3 h-3 text-red-400" />
                  {blogData[location].author.likes}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderBlogPost = () => {
    if (!selectedLocation || !blogData[selectedLocation]) {
      return (
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 shadow-2xl"
          >
            <div className="text-center space-y-4">
              <FaMapMarkerAlt className="w-16 h-16 text-blue-400 mx-auto" />
              <h3 className="text-2xl font-bold text-white">Discover Sri Lanka's Treasures</h3>
              <p className="text-lg text-gray-400">Select a location to explore travel stories and insights about these amazing destinations.</p>
            </div>
          </motion.div>
          
          {/* Location Cards */}
          <div className="space-y-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {renderLocationCards()}
          </div>
        </div>
      );
    }

    const { title, content, images, author, date, readTime, attractions } = blogData[selectedLocation];
    
    return (
      <div className="space-y-8">
        <motion.button
          whileHover={{ x: -2 }}
          onClick={() => setSelectedLocation(null)}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to all destinations
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Hero Image */}
          <div className="relative h-96">
            <img 
              src={images[0]} 
              alt={title} 
              className="w-full h-full object-cover" 
              loading="eager"
            />
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src={author.avatar} 
                  alt={author.name} 
                  className="w-12 h-12 rounded-full" 
                  loading="lazy"
                />
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

            <div className="prose prose-lg prose-invert max-w-none text-gray-300 leading-relaxed space-y-6">
              <p>{content}</p>
              
              {attractions && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Must-Visit Attractions</h3>
                  <ul className="space-y-3">
                    {attractions.map((attraction, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{attraction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {images.slice(1).map((image, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="overflow-hidden rounded-lg shadow-lg"
                >
                  <img 
                    src={image} 
                    alt={`${title} ${index + 2}`} 
                    className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
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
          Sri Lanka Travel Stories
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
              <h2 className="text-xl font-bold text-white mb-4">Explore Sri Lanka</h2>
              <MapComponent onLocationSelect={handleLocationSelect} />
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white mb-2">Popular Destinations</h3>
                <div className="flex flex-wrap gap-2">
                  {['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Anuradhapura'].map(location => (
                    <button
                      key={location}
                      onClick={() => handleLocationSelect(location)}
                      className={`px-3 py-1 rounded-full text-sm ${selectedLocation === location ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Blog Content Section */}
          <div className="lg:col-span-2">
            {renderBlogPost()}
          </div>
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default Blog;