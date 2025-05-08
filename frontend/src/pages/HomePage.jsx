import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import VideoBackground from '../components/Shared/VideoBackground';
import WeatherAlert from '../components/Weather/WeatherAlert';


import { FiSearch, FiMapPin, FiClock, FiDollarSign, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
 
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await api.getPackages();
        setPackages(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching packages:', error);
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(search.toLowerCase()) ||
    pkg.location.toLowerCase().includes(search.toLowerCase())
  );

  // Categories for filtering
  const categories = ['all', 'beach', 'mountain', 'cultural', 'adventure'];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background with overlay */}
      <div className="absolute inset-0 z-0">
        <VideoBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-32">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-center text-white mb-6">
              Discover Your <span className="text-primary-400">Next Adventure</span>
            </h1>
            <p className="text-center text-gray-200 mb-12 max-w-2xl mx-auto text-lg md:text-xl">
              Explore breathtaking destinations and create unforgettable memories with our exclusive travel experiences
            </p>
          </motion.div>

          {/* Search and CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col md:flex-row justify-center gap-4 mb-16"
          >
            <div className="relative max-w-xl w-full">
              <FiSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 text-xl" />
              <input
                type="text"
                placeholder="Search destinations, activities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-full border-2 border-white/20 bg-black/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent shadow-lg backdrop-blur-sm transition-all duration-300"
              />
            </div>
            <Link
              to="/custom-package"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg backdrop-blur-sm flex items-center justify-center font-medium whitespace-nowrap"
            >
              Design Your Trip
            </Link>
          </motion.div>

          {/* Category Filters */}
          <motion.div 
            className="flex justify-center gap-3 mb-12 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full capitalize transition-all duration-300 ${
                  activeCategory === category 
                    ? 'bg-primary-500 text-white shadow-lg' 
                    : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Featured Packages */}
        <div className="container mx-auto px-4 pb-20">
          {loading ? (
            <div className="text-center text-white animate-pulse py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-400 border-t-transparent"></div>
              <p className="mt-4">Discovering amazing destinations...</p>
            </div>
          ) : (
            <>
              {/* Featured Section */}
              <motion.section 
                className="mb-20"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.h2 
                  className="text-3xl font-semibold text-white mb-8 text-center"
                  variants={itemVariants}
                >
                  <span className="border-b-2 border-primary-500 pb-2">Featured</span> Packages
                </motion.h2>
                
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                >
                  {filteredPackages.slice(0, 3).map(pkg => (
                    <motion.div 
                      key={pkg._id} 
                      className="group relative bg-white/5 backdrop-blur-md rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-white/10"
                      whileHover={{ y: -10 }}
                      variants={itemVariants}
                    >
                      {pkg.imageUrl && (
                        <div className="w-full h-60 overflow-hidden">
                          <img 
                            src={`http://localhost:5000${pkg.imageUrl}`}
                            alt={pkg.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-semibold text-white">{pkg.name}</h3>
                          {pkg.isFeatured && (
                            <span className="flex items-center bg-primary-500/20 text-primary-300 px-2 py-1 rounded text-sm">
                              <FiStar className="mr-1" /> Featured
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-3 mb-6 text-gray-300">
                          <div className="flex items-center">
                            <FiMapPin className="mr-2 text-primary-400" />
                            <span>{pkg.location}</span>
                          </div>
                          <div className="flex items-center">
                            <FiDollarSign className="mr-2 text-primary-400" />
                            <span className="font-medium text-white">From ${pkg.price.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <FiClock className="mr-2 text-primary-400" />
                            <span>{pkg.duration} days</span>
                          </div>
                        </div>

                                                {/* Weather Alert */}
                                                {pkg.location && (
                          <div className="mb-4">
                            <WeatherAlert location={pkg.location} travelDate={new Date()} />
                          </div>
                        )}


                        
                        <Link
                          to={`/package/${pkg._id}`}
                          className="block w-full text-center bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-3 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300"
                        >
                          Explore Package
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>

              {/* All Packages Section */}
              <motion.section 
                className="mb-16"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.h2 
                  className="text-3xl font-semibold text-white mb-8 text-center"
                  variants={itemVariants}
                >
                  <span className="border-b-2 border-primary-500 pb-2">Explore</span> All Destinations
                </motion.h2>
                
                {filteredPackages.length === 0 ? (
                  <motion.div 
                    className="text-center text-gray-300 py-12"
                    variants={itemVariants}
                  >
                    <p className="text-xl">No packages found matching your search.</p>
                    <p>Try a different search term or browse our featured packages.</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    variants={containerVariants}
                  >
                    {filteredPackages.map(pkg => (
                      <motion.div 
                        key={pkg._id} 
                        className="group relative bg-white/5 backdrop-blur-md rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-white/10"
                        whileHover={{ y: -5 }}
                        variants={itemVariants}
                      >
                        {pkg.imageUrl && (
                          <div className="w-full h-52 overflow-hidden relative">
                            <img 
                              src={`http://localhost:5000${pkg.imageUrl}`}
                              alt={pkg.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                          </div>
                        )}
                        <div className="p-5">
                          <h3 className="text-lg font-semibold text-white mb-2">{pkg.name}</h3>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="flex items-center text-xs bg-white/10 text-gray-200 px-2 py-1 rounded">
                              <FiMapPin className="mr-1" /> {pkg.location}
                            </span>
                            <span className="flex items-center text-xs bg-white/10 text-gray-200 px-2 py-1 rounded">
                              <FiClock className="mr-1" /> {pkg.duration} days
                            </span>
                          </div>

                                                  {/* Weather Alert */}
                        {pkg.location && (
                          <div className="mb-4">
                            <WeatherAlert location={pkg.location} travelDate={new Date()} />
                          </div>
                        )}
            
                          <div className="flex justify-between items-center">
                            <span className="text-primary-400 font-bold">${pkg.price.toLocaleString()}</span>
                            <Link
                              to={`/package/${pkg._id}`}
                              className="text-sm text-white hover:text-primary-300 transition-colors flex items-center"
                            >
                              Details <span className="ml-1">→</span>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;