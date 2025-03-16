import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PackageCard from '../components/Client/PackageCard';
import VideoBackground from '../components/Shared/VideoBackground';

const HomePage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/packages');
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

  return (
    <div className="min-h-screen relative">
      <VideoBackground />
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-32">
          <h1 className="text-6xl font-bold text-center text-white mb-6 animate-fade-in-down">
            Discover Your Next Adventure
          </h1>
          <p className="text-center text-gray-200 mb-12 animate-fade-in-up max-w-2xl mx-auto text-lg">
            Explore amazing destinations and create unforgettable memories with our carefully curated travel packages
          </p>
          
          <div className="max-w-xl mx-auto w-full mb-12 transform hover:scale-105 transition-transform duration-300">
            <input
              type="text"
              placeholder="Search your dream destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-4 rounded-full border-2 border-white/20 bg-black/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-primary-400 focus:border-transparent shadow-lg backdrop-blur-sm transition-all duration-300"
            />
          </div>

          {loading ? (
            <div className="text-center text-white animate-pulse">
              Loading amazing destinations...
            </div>
          ) : (
            <>
              <section className="mb-16">
                <h2 className="text-3xl font-semibold text-white mb-8 text-center">
                  Featured Packages
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPackages.slice(0, 3).map(pkg => (
                    <div key={pkg._id} className="bg-dark-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                      {pkg.imageUrl && (
                        <div className="w-full h-48 overflow-hidden">
                          <img 
                            src={`http://localhost:5000${pkg.imageUrl}`}
                            alt={pkg.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">{pkg.name}</h3>
                        <div className="space-y-2 mb-6">
                          <p className="text-gray-400">Location: {pkg.location}</p>
                          <p className="text-primary-400 font-bold">Price: ${pkg.price}</p>
                          <p className="text-gray-400">Duration: {pkg.duration}</p>
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
                    <div key={pkg._id} className="bg-dark-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                      {pkg.imageUrl && (
                        <div className="w-full h-48 overflow-hidden">
                          <img 
                            src={`http://localhost:5000${pkg.imageUrl}`}
                            alt={pkg.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">{pkg.name}</h3>
                        <div className="space-y-2 mb-6">
                          <p className="text-gray-400">Location: {pkg.location}</p>
                          <p className="text-primary-400 font-bold">Price: ${pkg.price}</p>
                          <p className="text-gray-400">Duration: {pkg.duration}</p>
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
        </div>
      </div>
    </div>
  );
};

export default HomePage;
