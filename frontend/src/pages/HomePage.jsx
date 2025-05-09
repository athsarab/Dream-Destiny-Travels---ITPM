import React, { useState, useEffect } from 'react';
import PackageCard from '../components/Client/PackageCard';
import VideoBackground from '../components/Shared/VideoBackground';
import { Link } from 'react-router-dom';
import api from '../services/api';  // Import api service

const HomePage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Initiating package fetch...');
      
      // Try to get server health first
      const isServerHealthy = await api.checkHealth();
      if (!isServerHealthy) {
        console.warn('Server health check failed - attempting to fetch packages anyway');
      }
      
      const response = await api.getPackages();
      console.log('Package fetch successful from ' + response.source);
      
      if (response.data && Array.isArray(response.data)) {
        setPackages(response.data);
      } else {
        console.warn('Received unexpected data format:', response.data);
        setPackages([]);
        setError('Received invalid data from server');
      }
    } catch (error) {
      console.error('Package fetch error:', {
        message: error.message,
        stack: error.stack
      });
      setError(error.message || 'Failed to load packages. Please try again later.');
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    
    // Add recovery mechanism - if failed, try again in 5 seconds (but only once)
    const retryTimeout = setTimeout(() => {
      if (error) {
        console.log('Attempting automatic retry after error...');
        fetchPackages();
      }
    }, 5000);
    
    return () => clearTimeout(retryTimeout);
  }, [error]);

  // Add more robust filtering with null checks
  const filteredPackages = packages && packages.filter ? 
    packages.filter(pkg => 
      pkg && 
      pkg.name && 
      pkg.location &&
      (pkg.name.toLowerCase().includes(search.toLowerCase()) || 
       pkg.location.toLowerCase().includes(search.toLowerCase()))
    ) : [];

  // Show empty state when no packages or error
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-red-500 text-center">
        <p className="text-xl font-semibold mb-2">Error Loading Packages</p>
        <p>{error}</p>
        <button 
          onClick={fetchPackages}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <VideoBackground />
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-32">
          <h1 className="text-6xl font-bold text-center text-white mb-6 animate-fade-in-down">
            Discover Your Next Adventure !
          </h1>
          <p className="text-center text-gray-200 mb-12 animate-fade-in-up max-w-2xl mx-auto text-lg">
            Explore amazing destinations and create unforgettable memories with our carefully curated travel packages
          </p> 
          
          <div className="flex justify-center space-x-4 mb-12">
            <input
              type="text"
              placeholder="Search your dream destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xl w-full px-6 py-4 rounded-full border-2 border-white/20 bg-black/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent shadow-lg backdrop-blur-sm transition-all duration-300"
            />
            <Link
              to="/custom-package"
              className="px-6 py-4 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-all duration-300 shadow-lg backdrop-blur-sm flex items-center"
            >
              Create Custom Package
            </Link>
          </div>

          {loading ? (
            <div className="text-center text-white animate-pulse">
              Loading amazing destinations...
            </div>
          ) : (
            <>
              {filteredPackages.length === 0 ? (
                <div className="text-center text-white bg-black/30 rounded-lg p-8 backdrop-blur-sm">
                  <h2 className="text-2xl font-semibold mb-4">No packages found</h2>
                  <p>Try adjusting your search or come back later for new destinations.</p>
                </div>
              ) : (
                <>
                  <section className="mb-16">
                    <h2 className="text-3xl font-semibold text-white mb-8 text-center">
                      Featured Packages
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredPackages.slice(0, 3).map(pkg => (
                        <div key={pkg._id} className="bg-white backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                          {pkg.imageUrl && (
                            <div className="w-full h-48 overflow-hidden">
                              <img 
                                src={pkg.imageUrl}
                                alt={pkg.name || 'Package image'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/images/placeholder.jpg';
                                }}
                              />
                            </div>
                          )}
                          <div className="p-6">
                            <h3 className="text-xl font-semibold text-black mb-4">{pkg.name || 'Unnamed Package'}</h3>
                            <div className="space-y-2 mb-6">
                              <p className="text-gray-800">Location: {pkg.location || 'N/A'}</p>
                              <p className="text-primary-800 font-bold">Price: ${pkg.price || '0'}</p>
                              <p className="text-gray-800">Duration: {pkg.duration || 'N/A'}</p>
                            </div>
                            <button 
                              className="w-full bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition-colors"
                              onClick={() => window.location.href = `/package/${pkg._id}`}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="mb-16">
                    <h2 className="text-3xl font-semibold text-white mb-8 text-center">
                      All Destinations
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredPackages.map(pkg => (
                        <div key={pkg._id} className="bg-white backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                          {pkg.imageUrl && (
                            <div className="w-full h-48 overflow-hidden">
                              <img 
                                src={pkg.imageUrl}
                                alt={pkg.name || 'Package image'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/images/placeholder.jpg';
                                }}
                              />
                            </div>
                          )}
                          <div className="p-6">
                            <h3 className="text-xl font-semibold text-black mb-4">{pkg.name || 'Unnamed Package'}</h3>
                            <div className="space-y-2 mb-6">
                              <p className="text-gray-800">Location: {pkg.location || 'N/A'}</p>
                              <p className="text-primary-800 font-bold">Price: ${pkg.price || '0'}</p>
                              <p className="text-gray-800">Duration: {pkg.duration || 'N/A'}</p>
                            </div>
                            <button 
                              className="w-full bg-primary-400 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition-colors"
                              onClick={() => window.location.href = `/package/${pkg._id}`}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
